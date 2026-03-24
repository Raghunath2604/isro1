from fastapi import APIRouter, HTTPException
from backend.models.analysis_model import (
    AnalysisRequest,
    AnalysisResponse,
    ErrorResponse
)
from backend.services.rag_service import get_context
from backend.services.reasoning_service import run_analysis

router = APIRouter()

@router.post("/", response_model=AnalysisResponse)
async def analyze(data: AnalysisRequest):
    """
    Main analysis endpoint

    Flow:
    1. Extract query from request
    2. Retrieve context from RAG system
    3. Run analysis through CrewAI agents
    4. Return comprehensive response

    Args:
        data: AnalysisRequest containing the query

    Returns:
        AnalysisResponse with query, context, and AI response
    """
    try:
        query = data.query

        if not query or len(query.strip()) == 0:
            raise HTTPException(
                status_code=400,
                detail="Query cannot be empty"
            )

        # Step 1: Get context from RAG
        context = get_context(query)

        # Step 2: Run analysis through agents
        response = run_analysis(query, context)

        # Step 3: Return structured response
        return AnalysisResponse(
            query=query,
            context=context,
            response=response,
            status="success"
        )

    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "analysis"}
