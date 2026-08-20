from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# What data is needed to REGISTER a new user
class UserCreate(BaseModel):
    email: str
    username: str
    full_name: str
    password: str

# What data is needed to LOGIN
class UserLogin(BaseModel):
    email: str
    password: str

# What we SEND BACK to the frontend (never send password!)
class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True  # Lets Pydantic read SQLAlchemy models
