from pydantic import BaseModel, Field
from typing import Optional, List

class AnalysisRequest(BaseModel):
    query: str = Field(..., description="User query for analysis")
    context: Optional[str] = Field(None, description="Optional context for the query")

class RAGContext(BaseModel):
    content: str
    source: str
    relevance_score: Optional[float] = None

class AnalysisResponse(BaseModel):
    query: str
    context: List[RAGContext]
    response: str
    status: str = "success"

class ErrorResponse(BaseModel):
    status: str = "error"
    message: str
    detail: Optional[str] = None
