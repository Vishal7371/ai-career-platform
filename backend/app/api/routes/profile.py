from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.models.user import User
from app.core.security import hash_password, verify_password

router = APIRouter(prefix="/profile", tags=["Profile"])

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    username:  Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password:     str

@router.get("/{user_id}")
def get_profile(user_id: int, db: Session = Depends(get_db)):
    """Get user profile info"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id":        user.id,
        "email":     user.email,
        "username":  user.username,
        "full_name": user.full_name,
        "is_active": user.is_active,
    }

@router.put("/{user_id}")
def update_profile(user_id: int, data: ProfileUpdate, db: Session = Depends(get_db)):
    """Update user profile"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if data.full_name: user.full_name = data.full_name
    if data.username:  user.username  = data.username

    db.commit()
    db.refresh(user)
    return {
        "message":   "Profile updated successfully! ✅",
        "id":        user.id,
        "email":     user.email,
        "username":  user.username,
        "full_name": user.full_name,
    }

@router.put("/{user_id}/password")
def change_password(user_id: int, data: PasswordChange, db: Session = Depends(get_db)):
    """Change user password"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(data.current_password, user.password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    user.password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password changed successfully! ✅"}
