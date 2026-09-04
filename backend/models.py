from sqlalchemy import Column, Integer, String
from sqlalchemy.sql import func
from database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    due_time = Column(String, nullable=False)
    status = Column(String, default="pending")
    created_at = Column(String, server_default=func.now())
