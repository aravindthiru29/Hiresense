from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, field_validator


class RegisterSchema(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)
    college: Optional[str] = Field(None, max_length=150)
    degree: Optional[str] = Field(None, max_length=50)
    branch: Optional[str] = Field(None, max_length=100)
    graduation_year: Optional[int] = Field(None, ge=2000, le=2040)
    target_role: Optional[str] = Field("Software Developer", max_length=100)


class LoginSchema(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1)


class ProfileUpdateSchema(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=120)
    college: Optional[str] = Field(None, max_length=150)
    degree: Optional[str] = Field(None, max_length=50)
    branch: Optional[str] = Field(None, max_length=100)
    graduation_year: Optional[int] = Field(None, ge=2000, le=2040)
    target_role: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = Field(None, max_length=1000)
    github_handle: Optional[str] = Field(None, max_length=120)
    linkedin_url: Optional[str] = Field(None, max_length=255)
    skills: Optional[List[str]] = None


class AssessmentAnswerSchema(BaseModel):
    question_id: int
    answer_text: str = Field(..., min_length=1)


class InterviewAnswerSchema(BaseModel):
    question_index: int
    answer_text: str = Field(..., min_length=1)
    round_type: Optional[str] = "behavioral"


class RoadmapTaskUpdateSchema(BaseModel):
    task_id: int
    is_completed: bool


class GitHubAnalyzeSchema(BaseModel):
    username: str = Field(..., min_length=1, max_length=100)
