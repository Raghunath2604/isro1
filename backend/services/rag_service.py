from rag.rag_engine import RAGEngine
from backend.models.analysis_model import RAGContext
from typing import List

rag_engine = RAGEngine()

def get_context(query: str) -> List[RAGContext]:
    """
    Retrieve context from RAG engine for a given query

    Args:
        query: User query string

    Returns:
        List of RAGContext objects with relevant documents
    """
    try:
        search_results = rag_engine.search(query)

        contexts = [
            RAGContext(
                content=result["content"],
                source=result["source"],
                relevance_score=result.get("relevance_score", 0.0)
            )
            for result in search_results
        ]

        return contexts
    except Exception as e:
        print(f"Error retrieving context: {str(e)}")
        return []

def add_knowledge(source: str, content: str) -> bool:
    """Add new knowledge to the RAG system"""
    return rag_engine.add_document(source, content)

def clear_knowledge() -> bool:
    """Clear all knowledge from RAG system"""
    return rag_engine.clear_knowledge_base()
