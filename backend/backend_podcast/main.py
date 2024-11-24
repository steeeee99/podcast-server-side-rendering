#!/usr/bin/env python
from fastapi import FastAPI
import uvicorn
from backend_podcast.database.models import create_tables
from backend_podcast.routes.auth import auth_router
from dotenv import load_dotenv


create_tables()
load_dotenv(verbose=True)

app = FastAPI()

@app.get("/healthcheck")
def home():
    return {"Ok"}

app.include_router(auth_router)

def start():
    """Launched with `poetry run start` at root level"""
    uvicorn.run("backend_podcast.main:app", host="0.0.0.0", port=8000, reload=True)
