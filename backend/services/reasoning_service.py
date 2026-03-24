from agents.crew import create_crew
from typing import List
from backend.models.analysis_model import RAGContext

def run_analysis(query: str, context: List[RAGContext]) -> str:
    """
    Run analysis using CrewAI agents

    Args:
        query: User query string
        context: List of RAGContext objects with retrieved information

    Returns:
        Analysis result from the AI agent
    """
    try:
        # Format context for the agent
        context_text = "\n---\n".join([
            f"Source: {ctx.source}\nRelevance: {ctx.relevance_score}\n{ctx.content}"
            for ctx in context
        ]) if context else "No specific context found."

        # Create and execute crew
        crew = create_crew(query, context_text)
        result = crew.kickoff()

        return result

    except Exception as e:
        error_message = f"Error during analysis: {str(e)}"
        print(error_message)
        return error_message

def format_context_for_agent(contexts: List[RAGContext]) -> str:
    """Format context objects into readable text for agents"""
    if not contexts:
        return "No context available"

    formatted = []
    for ctx in contexts:
        formatted.append(f"[{ctx.source}] {ctx.content}")

    return "\n\n".join(formatted)
