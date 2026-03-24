import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
from typing import List, Dict, Tuple
import pandas as pd
from datetime import datetime, timedelta

class AnomalyDetectionService:
    """
    Advanced anomaly detection using ML
    Combines Isolation Forest + Statistical methods
    """

    def __init__(self, contamination=0.1):
        self.contamination = contamination
        self.scaler = StandardScaler()
        self.isolation_forest = IsolationForest(
            contamination=contamination,
            random_state=42,
            n_estimators=100
        )
        self.is_fitted = False

    def fit_model(self, telemetry_data: List[Dict]) -> bool:
        """
        Train anomaly detection model on historical telemetry

        Args:
            telemetry_data: List of telemetry records

        Returns:
            Success status
        """
        try:
            # Extract features
            features = self._extract_features(telemetry_data)

            if len(features) < 10:
                return False

            # Scale features
            features_scaled = self.scaler.fit_transform(features)

            # Fit Isolation Forest
            self.isolation_forest.fit(features_scaled)
            self.is_fitted = True

            return True

        except Exception as e:
            print(f"Error fitting model: {e}")
            return False

    def detect_anomalies(self, telemetry_data: List[Dict]) -> Dict:
        """
        Detect anomalies in real-time telemetry

        Args:
            telemetry_data: Current telemetry snapshot

        Returns:
            Anomaly detection results
        """
        if not self.is_fitted:
            return self._statistical_anomaly_detection(telemetry_data)

        try:
            features = self._extract_features(telemetry_data)
            features_scaled = self.scaler.transform(features)

            # Predict anomalies (-1 = anomaly, 1 = normal)
            predictions = self.isolation_forest.predict(features_scaled)
            anomaly_scores = self.isolation_forest.score_samples(features_scaled)

            # Detect anomalies
            anomalies = []
            for idx, (pred, score) in enumerate(zip(predictions, anomaly_scores)):
                if pred == -1:
                    severity = self._calculate_severity(score, anomaly_scores)
                    anomalies.append({
                        "index": idx,
                        "anomaly_score": float(score),
                        "severity": severity,
                        "type": self._classify_anomaly_type(telemetry_data[idx])
                    })

            return {
                "status": "success",
                "anomalies_detected": len(anomalies),
                "anomalies": anomalies,
                "overall_health": "critical" if len(anomalies) > 3 else "warning" if len(anomalies) > 1 else "normal",
                "timestamp": datetime.utcnow().isoformat()
            }

        except Exception as e:
            return {"status": "error", "message": str(e)}

    def _statistical_anomaly_detection(self, telemetry_data: List[Dict]) -> Dict:
        """
        Fallback: Statistical anomaly detection using Z-score

        Args:
            telemetry_data: Telemetry data

        Returns:
            Statistical anomalies
        """
        anomalies = []

        # Check temperature
        temps = [t.get("temperature", 0) for t in telemetry_data if "temperature" in t]
        if temps:
            mean_temp = np.mean(temps)
            std_temp = np.std(temps)
            for temp in temps:
                z_score = abs((temp - mean_temp) / std_temp) if std_temp > 0 else 0
                if z_score > 3:  # 3-sigma anomaly
                    anomalies.append({
                        "parameter": "temperature",
                        "value": temp,
                        "z_score": z_score,
                        "severity": "critical" if z_score > 5 else "warning"
                    })

        # Check power level
        powers = [t.get("power_level", 0) for t in telemetry_data if "power_level" in t]
        if powers:
            if any(p < 10 for p in powers):
                anomalies.append({
                    "parameter": "power_level",
                    "value": min(powers),
                    "severity": "critical" if min(powers) < 5 else "warning"
                })

        # Check signal strength
        signals = [t.get("signal_strength", 0) for t in telemetry_data if "signal_strength" in t]
        if signals and min(signals) < 30:
            anomalies.append({
                "parameter": "signal_strength",
                "value": min(signals),
                "severity": "warning"
            })

        return {
            "status": "success",
            "anomalies_detected": len(anomalies),
            "anomalies": anomalies,
            "method": "statistical",
            "overall_health": "critical" if len(anomalies) > 3 else "normal"
        }

    def _extract_features(self, telemetry_data: List[Dict]) -> np.ndarray:
        """Extract numerical features from telemetry"""
        features = []

        for telemetry in telemetry_data:
            feature_vector = [
                telemetry.get("temperature", 0),
                telemetry.get("power_level", 50),
                telemetry.get("cpu_usage", 0),
                telemetry.get("memory_usage", 0),
                telemetry.get("signal_strength", 100),
                telemetry.get("altitude", 0),
                telemetry.get("speed", 0),
                telemetry.get("battery_voltage", 28.5),
            ]
            features.append(feature_vector)

        return np.array(features)

    def _calculate_severity(self, score: float, all_scores: np.ndarray) -> str:
        """Calculate anomaly severity relative to other scores"""
        percentile = np.percentile(-all_scores, 90)  # Flip for interpretation

        if score < -percentile * 2:
            return "critical"
        elif score < -percentile:
            return "high"
        else:
            return "medium"

    def _classify_anomaly_type(self, telemetry: Dict) -> str:
        """Classify the type of anomaly detected"""
        if telemetry.get("temperature", 0) > 40:
            return "thermal"
        elif telemetry.get("power_level", 50) < 20:
            return "power"
        elif telemetry.get("signal_strength", 100) < 40:
            return "communication"
        elif telemetry.get("cpu_usage", 0) > 90:
            return "processing"
        else:
            return "unknown"

    def get_model_stats(self) -> Dict:
        """Get model statistics"""
        return {
            "is_fitted": self.is_fitted,
            "contamination": self.contamination,
            "n_estimators": 100,
            "status": "ready" if self.is_fitted else "not_trained"
        }


# Global instance
anomaly_detector = AnomalyDetectionService()
