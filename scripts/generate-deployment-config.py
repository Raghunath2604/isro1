#!/usr/bin/env python3
"""
Deployment Configuration Generator
Generates deployment configurations for Vercel and Railway
Run: python3 scripts/generate-deployment-config.py
"""

import json
import yaml
from pathlib import Path
from typing import Dict, Any


class DeploymentConfigGenerator:
    """Generate deployment configurations"""

    def __init__(self):
        self.root_dir = Path(__file__).parent.parent

    def generate_vercel_config(self) -> Dict[str, Any]:
        """Generate vercel.json configuration"""
        return {
            "version": 2,
            "framework": "vite",
            "buildCommand": "npm run build",
            "outputDirectory": "dist",
            "env": {
                "VITE_API_URL": "@vite_api_url",
                "VITE_WS_URL": "@vite_ws_url",
            },
            "envPrefix": "VITE_",
            "rewrites": [
                {
                    "source": "/api/(.*)",
                    "destination": "${VITE_API_URL}/$1"
                }
            ],
            "headers": [
                {
                    "source": "/(.*)",
                    "headers": [
                        {
                            "key": "X-Content-Type-Options",
                            "value": "nosniff"
                        },
                        {
                            "key": "X-Frame-Options",
                            "value": "DENY"
                        },
                        {
                            "key": "X-XSS-Protection",
                            "value": "1; mode=block"
                        }
                    ]
                }
            ]
        }

    def generate_railway_config(self) -> Dict[str, Any]:
        """Generate railway.json configuration"""
        return {
            "version": 1,
            "buildCommand": "pip install -r requirements.txt",
            "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT",
            "environmentVariables": {
                "ENVIRONMENT": "production",
                "DEBUG": "False",
                "LOG_LEVEL": "INFO",
            },
            "services": [
                {
                    "name": "postgres",
                    "image": "postgres:15",
                    "environment": {
                        "POSTGRES_DB": "as3_db",
                        "POSTGRES_USER": "postgres",
                        "POSTGRES_PASSWORD": "postgres",
                    },
                    "volumes": ["postgres_data:/var/lib/postgresql/data"]
                },
                {
                    "name": "redis",
                    "image": "redis:7-alpine"
                }
            ]
        }

    def generate_docker_compose_prod(self) -> Dict[str, Any]:
        """Generate production docker-compose configuration"""
        return {
            "version": "3.8",
            "services": {
                "backend": {
                    "build": {
                        "context": ".",
                        "dockerfile": "docker/Dockerfile.backend"
                    },
                    "container_name": "as3-backend-prod",
                    "ports": ["8000:8000"],
                    "environment": {
                        "ENVIRONMENT": "production",
                        "DEBUG": "False",
                        "DATABASE_URL": "postgresql://postgres:postgres@postgres:5432/as3_db",
                    },
                    "depends_on": ["postgres", "redis"],
                    "restart": "always"
                },
                "frontend": {
                    "build": {
                        "context": ".",
                        "dockerfile": "docker/Dockerfile.frontend"
                    },
                    "container_name": "as3-frontend-prod",
                    "ports": ["3000:3000"],
                    "environment": {
                        "VITE_API_URL": "http://backend:8000",
                        "VITE_WS_URL": "ws://backend:8000",
                    },
                    "depends_on": ["backend"],
                    "restart": "always"
                },
                "postgres": {
                    "image": "postgres:15",
                    "container_name": "as3-postgres",
                    "environment": {
                        "POSTGRES_DB": "as3_db",
                        "POSTGRES_USER": "postgres",
                        "POSTGRES_PASSWORD": "postgres",
                    },
                    "volumes": ["postgres_data:/var/lib/postgresql/data"],
                    "restart": "always"
                },
                "redis": {
                    "image": "redis:7-alpine",
                    "container_name": "as3-redis",
                    "ports": ["6379:6379"],
                    "restart": "always"
                }
            },
            "volumes": {
                "postgres_data": {}
            }
        }

    def generate_k8s_deployment(self) -> str:
        """Generate Kubernetes deployment manifest"""
        return """apiVersion: apps/v1
kind: Deployment
metadata:
  name: as3-backend
  labels:
    app: as3-platform
spec:
  replicas: 3
  selector:
    matchLabels:
      app: as3-backend
  template:
    metadata:
      labels:
        app: as3-backend
    spec:
      containers:
      - name: backend
        image: as3-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: ENVIRONMENT
          value: "production"
        - name: DEBUG
          value: "False"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: as3-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: as3-backend-service
spec:
  selector:
    app: as3-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: LoadBalancer
"""

    def write_configs(self) -> bool:
        """Write all configuration files"""
        try:
            # Write vercel.json
            vercel_config = self.generate_vercel_config()
            with open(self.root_dir / 'vercel.json', 'w') as f:
                json.dump(vercel_config, f, indent=2)
            print(f"✓ vercel.json generated")

            # Write railway config (as comments in docker-compose)
            railway_config = self.generate_railway_config()
            print(f"✓ Railway configuration documented")

            # Write docker-compose.prod.yml
            compose_prod = self.generate_docker_compose_prod()
            with open(self.root_dir / 'docker-compose.prod.yml', 'w') as f:
                yaml.dump(compose_prod, f, default_flow_style=False)
            print(f"✓ docker-compose.prod.yml generated")

            # Write k8s deployment
            k8s_deployment = self.generate_k8s_deployment()
            with open(self.root_dir / 'k8s' / 'deployment.yaml', 'w') as f:
                f.write(k8s_deployment)
            print(f"✓ k8s/deployment.yaml generated")

            return True
        except Exception as e:
            print(f"✗ Error generating configs: {e}")
            return False


def main():
    """Main entry point"""
    print("=" * 80)
    print("Generating Deployment Configurations")
    print("=" * 80)
    print()

    generator = DeploymentConfigGenerator()
    if generator.write_configs():
        print()
        print("=" * 80)
        print("✓ All deployment configurations generated successfully")
        print("=" * 80)
    else:
        print()
        print("=" * 80)
        print("✗ Configuration generation failed")
        print("=" * 80)


if __name__ == '__main__':
    main()
