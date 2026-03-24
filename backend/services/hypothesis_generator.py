from typing import List, Dict, Tuple
from datetime import datetime
from enum import Enum
import json

class HypothesisSeverity(str, Enum):
    """Hypothesis severity levels"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class HypothesisType(str, Enum):
    """Types of hypotheses"""
    THERMAL = "thermal"
    POWER = "power"
    COMMUNICATION = "communication"
    STRUCTURAL = "structural"
    OPERATIONAL = "operational"
    ENVIRONMENTAL = "environmental"

class Hypothesis:
    """Scientific hypothesis model"""

    def __init__(
        self,
        title: str,
        description: str,
        hypothesis_type: HypothesisType,
        probability: float,
        evidence: List[str],
        severity: HypothesisSeverity,
        suggested_action: str
    ):
        self.id = hash(title + str(datetime.utcnow()))
        self.title = title
        self.description = description
        self.type = hypothesis_type
        self.probability = min(1.0, max(0.0, probability))  # Clamp 0-1
        self.evidence = evidence
        self.severity = severity
        self.suggested_action = suggested_action
        self.created_at = datetime.utcnow()
        self.tested = False
        self.confidence_score = probability * 100

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "type": self.type.value,
            "probability": self.probability,
            "confidence_score": self.confidence_score,
            "evidence": self.evidence,
            "severity": self.severity.value,
            "suggested_action": self.suggested_action,
            "tested": self.tested,
            "created_at": self.created_at.isoformat()
        }


class HypothesisGenerator:
    """
    Generates scientific hypotheses based on anomalies
    Uses pattern analysis and domain knowledge
    """

    # Knowledge base of common spacecraft issues
    ISSUE_PATTERNS = {
        "thermal": {
            "high_temperature": [
                {
                    "hypothesis": "Solar panel malfunction or misalignment",
                    "probability": 0.8,
                    "evidence_indicators": ["power_increase", "temperature_rise"],
                    "action": "Reorient solar panels or check for obstructions"
                },
                {
                    "hypothesis": "Radiator efficiency degradation",
                    "probability": 0.7,
                    "evidence_indicators": ["gradual_temp_rise", "steady_power"],
                    "action": "Perform thermal radiator maintenance"
                },
                {
                    "hypothesis": "Internal heat dissipation failure",
                    "probability": 0.6,
                    "evidence_indicators": ["cpu_high", "temperature_high"],
                    "action": "Check internal cooling systems"
                }
            ],
            "low_temperature": [
                {
                    "hypothesis": "Solar panel degradation",
                    "probability": 0.75,
                    "evidence_indicators": ["power_drop", "temperature_drop"],
                    "action": "Verify solar panel output"
                },
                {
                    "hypothesis": "Heater malfunction",
                    "probability": 0.65,
                    "evidence_indicators": ["steady_low_temp"],
                    "action": "Check heater circuits"
                }
            ]
        },
        "power": {
            "low_power": [
                {
                    "hypothesis": "Battery degradation due to age/cycles",
                    "probability": 0.8,
                    "evidence_indicators": ["gradual_drop", "mission_age"],
                    "action": "Schedule battery replacement"
                },
                {
                    "hypothesis": "Solar panel damage or dust",
                    "probability": 0.75,
                    "evidence_indicators": ["power_drop_during_sun"],
                    "action": "Inspect and clean solar panels"
                },
                {
                    "hypothesis": "Power regulation circuit failure",
                    "probability": 0.5,
                    "evidence_indicators": ["sudden_drop"],
                    "action": "Test power regulation circuitry"
                }
            ],
            "power_surge": [
                {
                    "hypothesis": "Solar flare impact",
                    "probability": 0.7,
                    "evidence_indicators": ["sudden_spike", "space_weather_alert"],
                    "action": "Activate surge protection and wait"
                },
                {
                    "hypothesis": "Power converter malfunction",
                    "probability": 0.6,
                    "evidence_indicators": ["sustained_high"],
                    "action": "Check power converter circuits"
                }
            ]
        },
        "communication": {
            "weak_signal": [
                {
                    "hypothesis": "Antenna misalignment",
                    "probability": 0.8,
                    "evidence_indicators": ["signal_drop", "position_change"],
                    "action": "Realign antenna to ground station"
                },
                {
                    "hypothesis": "Ionospheric interference",
                    "probability": 0.6,
                    "evidence_indicators": ["intermittent_signal", "time_of_day_pattern"],
                    "action": "Switch frequency bands or wait for ionosphere to settle"
                },
                {
                    "hypothesis": "Transmitter power degradation",
                    "probability": 0.5,
                    "evidence_indicators": ["gradual_signal_drop"],
                    "action": "Increase transmitter power or increase ground gain"
                }
            ],
            "signal_loss": [
                {
                    "hypothesis": "Receiver/transmitter failure",
                    "probability": 0.7,
                    "evidence_indicators": ["complete_loss"],
                    "action": "Activate backup communication system"
                },
                {
                    "hypothesis": "Antenna connector corrosion",
                    "probability": 0.65,
                    "evidence_indicators": ["gradual_loss"],
                    "action": "Schedule antenna connector inspection"
                }
            ]
        },
        "structural": {
            "vibration": [
                {
                    "hypothesis": "Thruster misfiring or imbalance",
                    "probability": 0.75,
                    "evidence_indicators": ["vibration_pattern", "attitude_change"],
                    "action": "Test thrusters individually"
                },
                {
                    "hypothesis": "Mechanical component loosening",
                    "probability": 0.6,
                    "evidence_indicators": ["increasing_vibration"],
                    "action": "Perform structural inspection"
                }
            ]
        }
    }

    def __init__(self):
        self.generated_hypotheses: List[Hypothesis] = []
        self.tested_hypotheses: List[Hypothesis] = []

    def generate_hypotheses(
        self,
        anomaly_type: str,
        anomaly_data: Dict,
        telemetry_history: List[Dict] = None
    ) -> List[Hypothesis]:
        """
        Generate hypotheses for detected anomalies

        Args:
            anomaly_type: Type of anomaly (thermal, power, etc)
            anomaly_data: Details of the anomaly
            telemetry_history: Previous telemetry for context

        Returns:
            Ranked list of hypotheses
        """
        hypotheses = []

        # Get patterns for this anomaly type
        patterns = self._get_patterns_for_anomaly(anomaly_type, anomaly_data)

        for pattern in patterns:
            # Create hypothesis
            severity = self._calculate_severity(
                pattern["probability"],
                anomaly_data
            )

            hypothesis = Hypothesis(
                title=pattern["hypothesis"],
                description=self._generate_description(
                    pattern["hypothesis"],
                    anomaly_data
                ),
                hypothesis_type=self._get_type(anomaly_type),
                probability=pattern["probability"],
                evidence=self._gather_evidence(pattern, telemetry_history or []),
                severity=severity,
                suggested_action=pattern["action"]
            )

            hypotheses.append(hypothesis)

        # Sort by probability
        hypotheses.sort(key=lambda h: h.probability, reverse=True)

        self.generated_hypotheses.extend(hypotheses)

        return hypotheses

    def _get_patterns_for_anomaly(self, anomaly_type: str, anomaly_data: Dict) -> List[Dict]:
        """Get applicable patterns from knowledge base"""
        if anomaly_type not in self.ISSUE_PATTERNS:
            return []

        patterns_dict = self.ISSUE_PATTERNS[anomaly_type]

        # Determine specific issue
        if anomaly_type == "thermal":
            if anomaly_data.get("temperature", 0) > 35:
                issue_key = "high_temperature"
            else:
                issue_key = "low_temperature"
        elif anomaly_type == "power":
            if anomaly_data.get("power_level", 50) < 30:
                issue_key = "low_power"
            else:
                issue_key = "power_surge"
        elif anomaly_type == "communication":
            if anomaly_data.get("signal_strength", 100) < 20:
                issue_key = "signal_loss"
            else:
                issue_key = "weak_signal"
        else:
            return list(patterns_dict.values())[0] if patterns_dict else []

        return patterns_dict.get(issue_key, [])

    def _calculate_severity(self, probability: float, anomaly_data: Dict) -> HypothesisSeverity:
        """Calculate severity based on probability and impact"""
        if probability > 0.8:
            return HypothesisSeverity.CRITICAL
        elif probability > 0.6:
            return HypothesisSeverity.HIGH
        elif probability > 0.4:
            return HypothesisSeverity.MEDIUM
        else:
            return HypothesisSeverity.LOW

    def _get_type(self, anomaly_type: str) -> HypothesisType:
        """Map anomaly type to hypothesis type"""
        type_map = {
            "thermal": HypothesisType.THERMAL,
            "power": HypothesisType.POWER,
            "communication": HypothesisType.COMMUNICATION,
            "processing": HypothesisType.OPERATIONAL,
        }
        return type_map.get(anomaly_type, HypothesisType.OPERATIONAL)

    def _generate_description(self, title: str, anomaly_data: Dict) -> str:
        """Generate detailed description of hypothesis"""
        description = f"Based on the detected anomaly, hypothesis suggests: {title}\n"
        description += f"Current Parameter Values:\n"

        for key, value in anomaly_data.items():
            description += f"  - {key}: {value}\n"

        description += "This hypothesis is derived from spacecraft failure patterns and domain expertise."

        return description

    def _gather_evidence(self, pattern: Dict, telemetry_history: List[Dict]) -> List[str]:
        """Gather evidence supporting this hypothesis"""
        evidence = []

        # Base evidence
        evidence.append(f"Matches known failure pattern: {pattern['hypothesis']}")

        # Context evidence from history
        if len(telemetry_history) > 0:
            # Trend analysis
            if len(telemetry_history) > 5:
                evidence.append(
                    f"Anomaly detected after {len(telemetry_history)} observations"
                )

        return evidence

    def rank_hypotheses(self, hypotheses: List[Hypothesis]) -> List[Hypothesis]:
        """Rank hypotheses by confidence and testability"""
        # Simple ranking: by probability
        return sorted(hypotheses, key=lambda h: h.probability, reverse=True)

    def test_hypothesis(
        self,
        hypothesis: Hypothesis,
        test_result: Dict
    ) -> Hypothesis:
        """
        Mark hypothesis as tested with results

        Args:
            hypothesis: Hypothesis to test
            test_result: Results from testing

        Returns:
            Updated hypothesis
        """
        hypothesis.tested = True
        hypothesis.confidence_score = test_result.get("confidence", hypothesis.probability * 100)

        self.tested_hypotheses.append(hypothesis)

        return hypothesis

    def get_generated_hypotheses(self) -> List[Dict]:
        """Get all generated hypotheses"""
        return [h.to_dict() for h in self.generated_hypotheses]

    def get_tested_hypotheses(self) -> List[Dict]:
        """Get all tested hypotheses"""
        return [h.to_dict() for h in self.tested_hypotheses]


# Global instance
hypothesis_generator = HypothesisGenerator()
