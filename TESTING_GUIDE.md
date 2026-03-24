# Testing Guide

Comprehensive guide for testing the AS³ Platform backend and frontend.

## 🧪 Overview

| Component | Framework | Command | Coverage |
|-----------|-----------|---------|----------|
| **Backend** | pytest | `pytest tests/ -v` | >80% |
| **Frontend** | Vitest | `npm test` | >70% |
| **Integration** | pytest + Vitest | Both frameworks | >75% |
| **E2E** | Manual / Playwright | `npm run test:e2e` | Project-wide |

## 🔧 Backend Testing (pytest)

### Setup

```bash
# Dependencies already in requirements.txt:
# pytest, pytest-cov, pytest-asyncio, httpx

# Install if needed
pip install pytest pytest-cov pytest-asyncio httpx
```

### File Structure

```
backend/
└── tests/
    ├── __init__.py
    ├── conftest.py              # Fixtures (db, client, etc.)
    ├── test_auth.py             # Authentication tests
    ├── test_health.py           # Health check tests
    ├── test_services.py         # Service layer tests
    ├── test_integration.py      # Full workflow tests
    └── test_anomaly.py          # ML service tests
```

### Running Tests

```bash
# Run all tests
pytest tests/ -v

# Run specific test file
pytest tests/test_auth.py -v

# Run specific test
pytest tests/test_auth.py::test_user_registration -v

# With coverage
pytest tests/ -v --cov=backend --cov-report=html

# Watch mode (requires pytest-watch)
pip install pytest-watch
ptw tests/

# Parallel execution (requires pytest-xdist)
pip install pytest-xdist
pytest tests/ -n auto
```

### Test Structure Example

```python
import pytest
from httpx import AsyncClient
from backend.main import app
from backend.database.models import User

@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

@pytest.mark.asyncio
async def test_user_registration(client):
    """Test user registration endpoint"""
    response = await client.post(
        "/api/auth/register",
        json={
            "email": "test@example.com",
            "password": "SecurePass123!",
            "full_name": "Test User"
        }
    )
    assert response.status_code == 201
    assert response.json()["email"] == "test@example.com"

@pytest.mark.asyncio
async def test_duplicate_user(client):
    """Test duplicate user prevention"""
    # Register first user
    await client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "SecurePass123!",
        "full_name": "Test User"
    })

    # Try registering again
    response = await client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "SecurePass123!",
        "full_name": "Test User"
    })
    assert response.status_code == 400
    assert "already exists" in response.json()["detail"]
```

### TestClient Fixture

From `tests/conftest.py`:

```python
@pytest.fixture
def db():
    """Database fixture"""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client():
    """Test client fixture"""
    return TestClient(app)
```

### Coverage Reports

```bash
# Generate HTML coverage report
pytest tests/ --cov=backend --cov-report=html
# Open: htmlcov/index.html

# Coverage by file
pytest tests/ --cov=backend --cov-report=term-missing

# Only show uncovered lines
pytest tests/ --cov=backend --cov-report=term-missing --cov-fail-under=80
```

## ⚛️ Frontend Testing (Vitest)

### Setup

```bash
cd frontend

# Dependencies already in package.json:
# vitest, @vitest/ui, @testing-library/react, happy-dom

npm install
```

### File Structure

```
frontend/src/
├── __tests__/
│   ├── Dashboard.test.jsx
│   ├── Header.test.jsx
│   ├── TelemetryPanel.test.jsx
│   └── components/
│       └── Visualization3D.test.jsx
└── components/
    ├── Dashboard.jsx
    ├── Header.jsx
    └── ...
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific file
npm test Dashboard

# Interactive UI
npm run test:ui

# Coverage report
npm run test:coverage

# Watch specific file
npm test -- Dashboard --watch

# Debug mode
npm test -- --inspect-brk
```

### Test Structure Example

```jsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Dashboard from '../components/Dashboard'
import { ThemeProvider } from '../context/ThemeContext'

// Wrap with providers if needed
const renderWithProviders = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  )
}

describe('Dashboard', () => {
  beforeEach(() => {
    // Setup before each test
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('displays all tabs', () => {
    renderWithProviders(<Dashboard />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('ISS Tracking')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })

  it('switches tabs on click', async () => {
    renderWithProviders(<Dashboard />)

    const analyticsTab = screen.getByText('Analytics')
    fireEvent.click(analyticsTab)

    await waitFor(() => {
      expect(analyticsTab.closest('button')).toHaveClass('bg-gradient-to-r')
    })
  })

  it('handles API errors gracefully', async () => {
    // Mock API error
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('API Error'))
    )

    renderWithProviders(<Dashboard />)

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })
})
```

### Common Test Patterns

**Async Operations:**
```jsx
import { waitFor } from '@testing-library/react'

it('loads data async', async () => {
  render(<Component />)

  await waitFor(() => {
    expect(screen.getByText('Data Loaded')).toBeInTheDocument()
  })
})
```

**User Events:**
```jsx
import userEvent from '@testing-library/user-event'

it('handles user input', async () => {
  const user = userEvent.setup()
  render(<Form />)

  const input = screen.getByRole('textbox')
  await user.type(input, 'test value')

  expect(input.value).toBe('test value')
})
```

**Mocking:**
```jsx
import { vi } from 'vitest'

vi.mock('../services/api', () => ({
  fetchData: vi.fn(() => Promise.resolve({ data: [] }))
}))
```

### Coverage Requirements

```bash
# View coverage report
npm run test:coverage

# Coverage must meet these thresholds:
# - Statements: >70%
# - Branches: >65%
# - Functions: >70%
# - Lines: >70%
```

## 🔀 Integration Testing

### API + Frontend Integration

```bash
# Start backend in one terminal
uvicorn backend.main:app --reload

# Start frontend in another
cd frontend && npm run dev

# Run integration tests
pytest tests/test_integration.py -v
```

### Example Integration Test

```python
@pytest.mark.asyncio
async def test_full_auth_flow(client):
    """Test complete authentication flow"""
    # Register user
    register = await client.post("/api/auth/register", json={
        "email": "test@example.com",
        "password": "SecurePass123!",
        "full_name": "Test User"
    })
    assert register.status_code == 201

    # Login
    login = await client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "SecurePass123!"
    })
    assert login.status_code == 200
    assert "access_token" in login.json()

    # Use token
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    profile = await client.get("/api/auth/me", headers=headers)
    assert profile.status_code == 200
    assert profile.json()["email"] == "test@example.com"
```

## 🔄 CI/CD Testing

### GitHub Actions Pipeline

Tests run automatically on:
- Push to any branch
- Pull requests
- Scheduled (optional)

**Pipeline steps:**
1. ✅ Checkout code
2. ✅ Setup Python 3.11 + Node 18
3. ✅ Install dependencies
4. ✅ Run backend tests (`pytest`)
5. ✅ Run frontend tests (`npm test`)
6. ✅ Upload coverage to Codecov
7. ✅ Run linter, security scan
8. ✅ Build Docker images
9. ✅ Deploy (if main branch)

**View results:**
```bash
# GitHub Actions tab
https://github.com/your-org/as3-platform/actions

# Or via CLI
gh run list
gh run view <run-id>
```

## 📊 Coverage Targets

| Component | Target | Current | Status |
|-----------|--------|---------|--------|
| Backend Services | >85% | 82% | 🟡 |
| API Routes | 100% | 95% | 🟡 |
| Frontend Components | >70% | 68% | 🟡 |
| Database Models | 100% | 100% | ✅ |
| **Overall** | **>80%** | **78%** | 🟡 |

**Improve coverage:**

```bash
# Find untested code
pytest tests/ --cov=backend --cov-report=term-missing

# Write tests for missing lines shown in output
```

## 🚀 Best Practices

### ✅ DO

- ✅ Write tests as you write features
- ✅ Use descriptive test names
- ✅ Test happy path and error cases
- ✅ Mock external dependencies
- ✅ Keep tests independent (no order dependency)
- ✅ Use fixtures for setup/teardown
- ✅ Test edge cases and boundaries
- ✅ Keep tests fast (<100ms per test)

### ❌ DON'T

- ❌ Skip writing tests
- ❌ Test implementation details (test behavior)
- ❌ Share state between tests
- ❌ Use `sleep()` for waiting (use `waitFor()`)
- ❌ Make unnecessary API calls (mock them)
- ❌ Test third-party libraries
- ❌ Have long setup/teardown
- ❌ Hard-code test data

## 🐛 Debugging Tests

### Backend Debug

```bash
# Print during test (shows in verbose output)
pytest tests/test_auth.py -v -s

# Drop into debugger
import pdb; pdb.set_trace()

# Or use breakpoint()
breakpoint()
```

### Frontend Debug

```bash
# Print during test
console.log('value:', value)

# Watch mode
npm test Dashboard --watch

# UI mode with debug info
npm run test:ui
```

## 📈 Test Metrics

Track these metrics to maintain quality:

- **Coverage Trend**: Target 85%+
- **Test Count**: Growing with features
- **Pass Rate**: 100% (flaky = fix immediately)
- **Test Duration**: <5 seconds total
- **Failure Rate**: <1%

## 📚 References

- [pytest Documentation](https://docs.pytest.org/)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Python unittest](https://docs.python.org/3/library/unittest.html)

## 🆘 Troubleshooting

### Test Fails Locally But Passes in CI

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json .pytest_cache
npm install
pip install --force-reinstall -r requirements.txt

# Run tests again
npm test
pytest tests/ -v
```

### Database Connection Error

```bash
# Start PostgreSQL
docker-compose up -d postgres

# Wait for connection
sleep 10

# Run tests
pytest tests/ -v
```

### Tests Hanging

```bash
# Kill hanging process
pkill -f pytest
# or
lsof -i :8000  # find and kill backend process
```

## ✨ Examples

**Complete test file** - See `backend/tests/test_auth.py`

**Component test** - See `frontend/src/__tests__/Dashboard.test.jsx`

---

**Status**: ✅ Testing Framework Complete
**Last Updated**: 2026-03-24
