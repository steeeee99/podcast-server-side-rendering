import re
from typing import Annotated
from backend_podcast.libs.auth import create_jwt
from fastapi.responses import JSONResponse
import jwt
from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    TypeAdapter,
    field_validator,
)
from backend_podcast.database.models import User
from backend_podcast.libs.crypto import hash, verify_hash
from fastapi import APIRouter, status
from fastapi.encoders import jsonable_encoder

auth_router = APIRouter()


class AuthBody(BaseModel):
    username: str
    password: str

    @field_validator("password")
    @classmethod
    def check_password_regex(cls, v: str):
        password_regex = re.compile(
            r"^(?=(.*[a-z]){3,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){2,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$"
        )
        ConfigStr = Annotated[str, Field(pattern=password_regex)]
        ConfigStrTA = TypeAdapter(
            ConfigStr, config=ConfigDict(regex_engine="python-re")
        )
        ConfigStrTA.validate_python(v)
        return v


class UserResponse(BaseModel):
    jwt: str
    id: int
    username: str
    creator: bool


class MessageResponse(BaseModel):
    message: str


@auth_router.post("/register", responses={500: {"model": MessageResponse}})
def register(body: AuthBody) -> UserResponse:
    existing_user = list(User.select().where(User.username == body.username).limit(1))

    if len(existing_user) > 0:
        return JSONResponse(
            jsonable_encoder(MessageResponse(message="Internal server error")),
            status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    password_hash = hash(body.password)

    user = User.create(username=body.username, password=password_hash)

    jwt = create_jwt(user)

    return UserResponse(
        jwt=jwt, id=user.id, username=body.username, creator=user.creator
    )


@auth_router.post("/login", responses={500: {"model": MessageResponse}})
def login(body: AuthBody) -> UserResponse:
    existing_user = list(
        User.select(User.password, User.id, User.creator)
        .where(User.username == body.username)
        .limit(1)
    )

    if len(existing_user) == 0:
        return JSONResponse(
            jsonable_encoder(MessageResponse(message="Internal server error")),
            status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    existing_user = existing_user[0]

    is_correct_password = verify_hash(body.password, existing_user.password)
    if not is_correct_password:
        return JSONResponse(
            jsonable_encoder(MessageResponse(message="Internal server error")),
            status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    jwt = create_jwt(existing_user)
    return UserResponse(
        jwt=jwt,
        id=existing_user.id,
        username=body.username,
        creator=existing_user.creator,
    )
