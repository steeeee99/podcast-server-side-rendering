import os
from backend_podcast.database.models import User
import jwt

jwt_secret = os.getenv("jwt_secret") 
algorithm = "HS256" 

def create_jwt(user: User) -> str:
    return jwt.encode(
        payload={"id": user.id, "creator": user.creator},
        key=jwt_secret,
        algorithm=algorithm,
    )
    
def verify_jwt(_jwt: str) -> User:
    return jwt.decode(_jwt,jwt_secret,algorithms=[algorithm])