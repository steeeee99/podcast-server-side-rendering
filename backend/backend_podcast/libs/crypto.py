from argon2 import PasswordHasher

hasher = PasswordHasher()

def hash(input: str | bytes):
    return hasher.hash(input)

def verify_hash(data: str | bytes,hash: str) -> bool:
    try:
        return hasher.verify(hash,data)
    except:
        return False