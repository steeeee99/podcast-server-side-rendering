#!/usr/bin/env python
from peewee import PostgresqlDatabase
from backend_podcast.database.models import *

db = PostgresqlDatabase(
    'db', 
    user='user', 
    password='password', 
    host='db'
)