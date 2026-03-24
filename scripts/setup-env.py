#!/usr/bin/env python3
"""
Environment Setup Automation
Automatically configures all environment variables for development and production
Run: python3 scripts/setup-env.py [--environment dev|prod|staging]
"""

import os
import sys
import argparse
from pathlib import Path
import json
from typing import Dict, Any

# Colors for terminal output
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
BLUE = '\033[0;34m'
RED = '\033[0;31m'
NC = '\033[0m'  # No Color


class EnvironmentSetup:
    """Setup environment variables for AS³ Platform"""

    def __init__(self, environment: str = 'dev'):
        self.environment = environment
        self.root_dir = Path(__file__).parent.parent
        self.backend_dir = self.root_dir / 'backend'
        self.frontend_dir = self.root_dir / 'frontend'

    def print_header(self, title: str):
        """Print a formatted header"""
        print(f"\n{BLUE}{'='*80}{NC}")
        print(f"{BLUE}{title:^80}{NC}")
        print(f"{BLUE}{'='*80}{NC}\n")

    def print_section(self, title: str):
        """Print a formatted section"""
        print(f"{YELLOW}→ {title}{NC}")

    def print_success(self, message: str):
        """Print success message"""
        print(f"  {GREEN}✓{NC} {message}")

    def print_info(self, message: str):
        """Print info message"""
        print(f"  {BLUE}ℹ{NC} {message}")

    def print_warning(self, message: str):
        """Print warning message"""
        print(f"  {YELLOW}⚠{NC} {message}")

    def print_error(self, message: str):
        """Print error message"""
        print(f"  {RED}✗{NC} {message}")

    def get_backend_env(self) -> Dict[str, str]:
        """Get backend environment variables"""
        if self.environment == 'prod':
            return {
                'DEBUG': 'False',
                'ENVIRONMENT': 'production',
                'DATABASE_URL': os.getenv('DATABASE_URL', 'postgresql://user:password@prod-db:5432/as3_db'),
                'API_HOST': '0.0.0.0',
                'API_PORT': '8000',
                'FRONTEND_URL': os.getenv('FRONTEND_URL', 'https://as3-platform.vercel.app'),
                'JWT_SECRET_KEY': os.getenv('JWT_SECRET_KEY', 'change-this-in-production'),
                'SECRET_KEY': os.getenv('SECRET_KEY', 'change-this-in-production'),
                'OPENAI_API_KEY': os.getenv('OPENAI_API_KEY', ''),
                'NASA_API_KEY': os.getenv('NASA_API_KEY', ''),
                'SPACETRACK_USERNAME': os.getenv('SPACETRACK_USERNAME', ''),
                'SPACETRACK_PASSWORD': os.getenv('SPACETRACK_PASSWORD', ''),
                'CORS_ORIGINS': '["https://as3-platform.vercel.app"]',
                'LOG_LEVEL': 'INFO',
                'REDIS_URL': os.getenv('REDIS_URL', 'redis://redis:6379'),
            }
        elif self.environment == 'staging':
            return {
                'DEBUG': 'False',
                'ENVIRONMENT': 'staging',
                'DATABASE_URL': os.getenv('DATABASE_URL', 'postgresql://user:password@staging-db:5432/as3_db'),
                'API_HOST': '0.0.0.0',
                'API_PORT': '8000',
                'FRONTEND_URL': os.getenv('FRONTEND_URL', 'https://as3-staging.vercel.app'),
                'JWT_SECRET_KEY': os.getenv('JWT_SECRET_KEY', 'staging-secret-key'),
                'SECRET_KEY': os.getenv('SECRET_KEY', 'staging-secret-key'),
                'OPENAI_API_KEY': os.getenv('OPENAI_API_KEY', ''),
                'NASA_API_KEY': os.getenv('NASA_API_KEY', ''),
                'SPACETRACK_USERNAME': os.getenv('SPACETRACK_USERNAME', ''),
                'SPACETRACK_PASSWORD': os.getenv('SPACETRACK_PASSWORD', ''),
                'CORS_ORIGINS': '["https://as3-staging.vercel.app", "http://localhost:3000"]',
                'LOG_LEVEL': 'DEBUG',
                'REDIS_URL': os.getenv('REDIS_URL', 'redis://redis:6379'),
            }
        else:  # dev
            return {
                'DEBUG': 'True',
                'ENVIRONMENT': 'development',
                'DATABASE_URL': 'postgresql://postgres:postgres@localhost:5432/as3_db',
                'API_HOST': 'localhost',
                'API_PORT': '8000',
                'FRONTEND_URL': 'http://localhost:3000',
                'JWT_SECRET_KEY': 'dev-secret-key-change-in-production',
                'SECRET_KEY': 'dev-secret-key-change-in-production',
                'OPENAI_API_KEY': 'sk-proj-demo-key',
                'NASA_API_KEY': 'DEMO_API_KEY',
                'SPACETRACK_USERNAME': 'demo_user',
                'SPACETRACK_PASSWORD': 'demo_pass',
                'CORS_ORIGINS': '["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"]',
                'LOG_LEVEL': 'DEBUG',
                'REDIS_URL': 'redis://localhost:6379',
            }

    def get_frontend_env(self) -> Dict[str, str]:
        """Get frontend environment variables"""
        if self.environment == 'prod':
            return {
                'VITE_API_URL': os.getenv('VITE_API_URL', 'https://as3-backend-prod.railway.app'),
                'VITE_WS_URL': os.getenv('VITE_WS_URL', 'wss://as3-backend-prod.railway.app'),
                'VITE_LOG_LEVEL': 'error',
                'VITE_ENVIRONMENT': 'production',
            }
        elif self.environment == 'staging':
            return {
                'VITE_API_URL': os.getenv('VITE_API_URL', 'https://as3-backend-staging.railway.app'),
                'VITE_WS_URL': os.getenv('VITE_WS_URL', 'wss://as3-backend-staging.railway.app'),
                'VITE_LOG_LEVEL': 'warn',
                'VITE_ENVIRONMENT': 'staging',
            }
        else:  # dev
            return {
                'VITE_API_URL': 'http://localhost:8000',
                'VITE_WS_URL': 'ws://localhost:8000',
                'VITE_LOG_LEVEL': 'debug',
                'VITE_ENVIRONMENT': 'development',
            }

    def write_env_file(self, filepath: Path, env_vars: Dict[str, str]) -> bool:
        """Write environment variables to .env file"""
        try:
            with open(filepath, 'w') as f:
                f.write('# Auto-generated by setup-env.py\n')
                f.write(f'# Environment: {self.environment}\n')
                f.write(f'# Generated: {os.popen("date").read().strip()}\n')
                f.write('\n')
                for key, value in sorted(env_vars.items()):
                    f.write(f'{key}={value}\n')
            return True
        except Exception as e:
            self.print_error(f"Failed to write {filepath}: {e}")
            return False

    def setup_backend(self) -> bool:
        """Setup backend environment"""
        self.print_section(f"Setting up backend ({self.environment})")

        env_vars = self.get_backend_env()
        env_file = self.backend_dir / '.env'

        if self.write_env_file(env_file, env_vars):
            self.print_success(f"Backend .env created: {env_file}")
            self.print_info(f"Variables: {len(env_vars)} configured")
            return True
        return False

    def setup_frontend(self) -> bool:
        """Setup frontend environment"""
        self.print_section(f"Setting up frontend ({self.environment})")

        env_vars = self.get_frontend_env()
        env_file = self.frontend_dir / '.env.local'

        if self.write_env_file(env_file, env_vars):
            self.print_success(f"Frontend .env.local created: {env_file}")
            self.print_info(f"Variables: {len(env_vars)} configured")
            return True
        return False

    def setup_docker(self) -> bool:
        """Setup Docker environment"""
        self.print_section("Setting up Docker")

        try:
            # Create .dockerignore if not exists
            dockerignore = self.root_dir / '.dockerignore'
            if not dockerignore.exists():
                with open(dockerignore, 'w') as f:
                    f.write('node_modules\n')
                    f.write('.pytest_cache\n')
                    f.write('__pycache__\n')
                    f.write('.venv\n')
                    f.write('venv\n')
                    f.write('.git\n')
                    f.write('.gitignore\n')
                self.print_success(".dockerignore created")
            else:
                self.print_info(".dockerignore already exists")

            return True
        except Exception as e:
            self.print_error(f"Docker setup failed: {e}")
            return False

    def run(self) -> bool:
        """Run complete environment setup"""
        self.print_header(f"AS³ Platform - Environment Setup ({self.environment.upper()})")

        results = {
            'backend': self.setup_backend(),
            'frontend': self.setup_frontend(),
            'docker': self.setup_docker(),
        }

        print(f"\n{BLUE}{'='*80}{NC}")
        print(f"{BLUE}Setup Summary{NC}")
        print(f"{BLUE}{'='*80}{NC}\n")

        for component, success in results.items():
            status = f"{GREEN}✓ Complete{NC}" if success else f"{RED}✗ Failed{NC}"
            print(f"  {component.capitalize()}: {status}")

        if all(results.values()):
            print(f"\n{GREEN}✓ All environments configured successfully!{NC}\n")
            print("Next steps:")
            print(f"  1. Verify environment files")
            print(f"  2. Run: {BLUE}bash scripts/start-dev.sh{NC}")
            print(f"  3. Check: {BLUE}docker-compose ps{NC}")
            print(f"  4. Test: {BLUE}curl http://localhost:8000/health{NC}\n")
            return True
        else:
            print(f"\n{RED}✗ Some setup steps failed. Check above for details.{NC}\n")
            return False


def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description='Setup environment variables for AS³ Platform'
    )
    parser.add_argument(
        '--environment',
        choices=['dev', 'staging', 'prod'],
        default='dev',
        help='Environment to setup (default: dev)'
    )

    args = parser.parse_args()

    setup = EnvironmentSetup(environment=args.environment)
    success = setup.run()

    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
