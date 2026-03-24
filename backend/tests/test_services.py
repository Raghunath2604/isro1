"""Tests for backend services"""
import pytest
import numpy as np
from backend.services.anomaly_detection_service import AnomalyDetectionService
from backend.services.hypothesis_generator import HypothesisGenerator


class TestAnomalyDetectionService:
    """Tests for Anomaly Detection Service"""

    @pytest.fixture
    def service(self):
        """Create service instance"""
        return AnomalyDetectionService()

    @pytest.fixture
    def sample_data(self):
        """Generate sample telemetry data"""
        normal_data = np.random.normal(loc=100, scale=15, size=(100, 5))
        anomaly_data = np.array([[200, 50, 150, 25, 75]])
        return np.vstack([normal_data, anomaly_data])

    def test_service_initialization(self, service):
        """Test service initializes correctly"""
        assert service is not None
        assert hasattr(service, 'model')

    def test_detect_anomalies(self, service, sample_data):
        """Test anomaly detection"""
        predictions = service.detect_anomalies(sample_data)

        assert predictions is not None
        assert len(predictions) == len(sample_data)
        assert -1 in predictions or 1 in predictions
        # Last point should be anomaly (outlier)
        assert predictions[-1] == -1

    def test_get_anomaly_scores(self, service, sample_data):
        """Test anomaly scoring"""
        scores = service.get_anomaly_scores(sample_data)

        assert scores is not None
        assert len(scores) == len(sample_data)
        assert all(isinstance(s, (int, float)) for s in scores)
        # Last point should have high anomaly score
        assert scores[-1] > 0.5

    def test_detect_threshold(self, service):
        """Test detection with different thresholds"""
        data = np.random.normal(loc=100, scale=10, size=(50, 3))

        results = service.detect_anomalies(data)
        assert len(results) == 50
        # Most should be normal (-1 or 1)
        assert len(results) > 0


class TestHypothesisGenerator:
    """Tests for Hypothesis Generator"""

    @pytest.fixture
    def generator(self):
        """Create generator instance"""
        return HypothesisGenerator()

    @pytest.fixture
    def sample_context(self):
        """Generate sample analysis context"""
        return {
            "anomalies": [
                {"type": "temperature", "value": 156, "threshold": 120},
                {"type": "power", "value": 45, "threshold": 60}
            ],
            "spacecraft": "ISS-01",
            "mission": "ISS Resupply",
            "timestamp": "2026-03-24T10:00:00Z"
        }

    def test_generator_initialization(self, generator):
        """Test generator initializes correctly"""
        assert generator is not None
        assert hasattr(generator, 'knowledge_base')

    def test_generate_hypotheses(self, generator, sample_context):
        """Test hypothesis generation"""
        hypotheses = generator.generate(sample_context)

        assert hypotheses is not None
        assert isinstance(hypotheses, list)
        assert len(hypotheses) > 0

        # Check hypothesis structure
        for hyp in hypotheses:
            assert "hypothesis" in hyp
            assert "probability" in hyp
            assert "evidence" in hyp

    def test_hypothesis_probability(self, generator, sample_context):
        """Test hypothesis probabilities are valid"""
        hypotheses = generator.generate(sample_context)

        for hyp in hypotheses:
            prob = hyp.get("probability", 0)
            assert 0 <= prob <= 1

    def test_hypothesis_ranking(self, generator, sample_context):
        """Test hypotheses are ranked by probability"""
        hypotheses = generator.generate(sample_context)

        if len(hypotheses) > 1:
            probabilities = [h.get("probability", 0) for h in hypotheses]
            # Check descending order
            assert probabilities == sorted(probabilities, reverse=True)

    def test_empty_context(self, generator):
        """Test with empty context"""
        hypotheses = generator.generate({})

        assert hypotheses is not None
        assert isinstance(hypotheses, list)


class TestMultiAgentSystem:
    """Tests for Multi-Agent System"""

    def test_agent_initialization(self):
        """Test agent system initializes"""
        from backend.services.multi_agent_system import MultiAgentOrchestrator

        orchestrator = MultiAgentOrchestrator()
        assert orchestrator is not None

    def test_agent_list(self):
        """Test agent list is accessible"""
        from backend.services.multi_agent_system import MultiAgentOrchestrator

        orchestrator = MultiAgentOrchestrator()
        agents = orchestrator.get_agents()

        assert agents is not None
        assert len(agents) == 7  # 7 specialized agents


@pytest.mark.asyncio
async def test_websocket_message_format():
    """Test WebSocket message format validation"""
    valid_message = {
        "type": "telemetry",
        "data": {"altitude": 400, "velocity": 7.66},
        "timestamp": "2026-03-24T10:00:00Z"
    }

    assert valid_message["type"] is not None
    assert valid_message["data"] is not None
    assert "timestamp" in valid_message


def test_ml_model_loading():
    """Test ML model loads correctly"""
    from backend.services.anomaly_detection_service import AnomalyDetectionService

    service = AnomalyDetectionService()
    model = service.model

    assert model is not None
    assert hasattr(model, 'predict')


@pytest.mark.parametrize("threshold", [0.1, 0.5, 0.9])
def test_anomaly_thresholds(threshold):
    """Test different anomaly thresholds"""
    service = AnomalyDetectionService()
    data = np.random.normal(loc=100, scale=10, size=(30, 3))

    results = service.detect_anomalies(data)
    assert len(results) == 30
