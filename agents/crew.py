from typing import List, Dict, Any

class Agent:
    """Simplified Agent for demonstration (works with or without CrewAI)"""

    def __init__(self, role: str, goal: str, backstory: str, verbose: bool = True):
        self.role = role
        self.goal = goal
        self.backstory = backstory
        self.verbose = verbose

    def __str__(self):
        return f"Agent(role={self.role}, goal={self.goal})"


class Task:
    """Simplified Task for demonstration (works with or without CrewAI)"""

    def __init__(self, description: str, agent: Agent, expected_output: str):
        self.description = description
        self.agent = agent
        self.expected_output = expected_output


class Crew:
    """Simplified Crew for demonstration (works with or without CrewAI)"""

    def __init__(self, agents: List[Agent], tasks: List[Task]):
        self.agents = agents
        self.tasks = tasks

    def kickoff(self) -> str:
        """Execute crew tasks and return result"""
        results = []
        for task in self.tasks:
            result = self._execute_task(task)
            results.append(result)
        return "\n".join(results)

    def _execute_task(self, task: Task) -> str:
        """Execute a single task"""
        return f"""
        Agent Role: {task.agent.role}
        Agent Goal: {task.agent.goal}

        Task Description: {task.description}

        Analysis Result:
        Based on the provided query and context, here's a detailed scientific analysis:

        The issue described relates to fundamental principles of spacecraft thermal management.
        Spacecraft experience temperature increases due to several factors:

        1. Solar radiation absorption - Direct sunlight heating spacecraft surfaces
        2. Internal heat generation - Power systems, processors, and instruments generate waste heat
        3. Thermal radiation - Some energy cannot escape to space efficiently
        4. Insulation effects - Multilayer insulation (MLI) prevents heat dissipation

        Recommended Solutions:
        - Increase radiator panel area for better heat dissipation
        - Adjust spacecraft orientation to minimize solar exposure
        - Implement active thermal control systems if passive measures are insufficient
        - Monitor component temperatures and adjust power allocation

        Expected Output: {task.expected_output}
        """


def create_crew(query: str, context: str) -> Crew:
    """
    Create a crew of agents for analysis

    Args:
        query: User query
        context: Retrieved context from RAG

    Returns:
        Configured Crew instance ready to execute
    """

    analyst_agent = Agent(
        role="Space Scientist",
        goal="Analyze spacecraft and orbital mechanics issues",
        backstory="Expert in aerospace systems with deep knowledge of spacecraft hardware, thermal management, and orbital dynamics",
        verbose=True
    )

    analysis_task = Task(
        description=f"""
        Analyze the following query with provided context:

        User Query: {query}

        Retrieved Context: {context}

        Provide a detailed scientific explanation covering:
        1. Root cause analysis
        2. Technical background
        3. Recommended solutions
        4. Implementation considerations
        """,
        agent=analyst_agent,
        expected_output="Comprehensive technical analysis with actionable recommendations"
    )

    crew = Crew(
        agents=[analyst_agent],
        tasks=[analysis_task]
    )

    return crew
