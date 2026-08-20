from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Create connection to PostgreSQL
engine = create_engine(settings.DATABASE_URL)

# Each request gets its own session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all our database models
Base = declarative_base()

# Dependency — gives a DB session to each API route
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
