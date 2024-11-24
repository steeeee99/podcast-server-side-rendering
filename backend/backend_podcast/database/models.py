import datetime
from peewee import *
from backend_podcast.database.conn import db

class BaseModel(Model):
    class Meta:
        database = db
        

class User(BaseModel):
    id = PrimaryKeyField(BigAutoField())
    username = CharField(max_length=256,null=False)
    password = CharField(max_length=256,null=False)
    creator = BooleanField(null=False,default=False)
    profile_img = CharField(max_length=256, null=True)


class Category(BaseModel):
    id = PrimaryKeyField(BigAutoField())
    name = CharField(50, null=False)


class Serie(BaseModel):
    id = PrimaryKeyField(BigAutoField())
    author = ForeignKeyField(User,field='id',null=False)
    title = CharField(max_length=256,null=False)
    description = CharField(max_length=256,null=False)
    img = CharField(max_length=256)
    category = ForeignKeyField(Category,field="id",null=False)
    timestamp = DateTimeField(default=datetime.datetime.now)
    
def create_tables():    
    db.create_tables([User,Serie,Category])