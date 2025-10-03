# tests/test_main.py

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from main import app, get_db, Base  # Ensure 'app' and 'get_db' are imported correctly

# In-memory SQLite database URL
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

# Setting up a SQLAlchemy testing engine
test_engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create a sessionmaker bound to the test engine
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

@pytest.fixture(scope="function")
def db_session():
    # Create a new database session for a test.
    connection = test_engine.connect()
    transaction = connection.begin()
    session = TestSessionLocal(bind=connection)
    
    # Create the database schema
    Base.metadata.create_all(bind=test_engine)
    
    try:
        yield session
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.rollback()
        session.close()
        transaction.rollback()
        connection.close()
    
    # Drop the database schema (cleanup)
    Base.metadata.drop_all(bind=test_engine)

# Fixture to override the get_db dependency
@pytest.fixture(scope="function")
def client(db_session: Session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    # Override the dependency
    app.dependency_overrides[get_db] = override_get_db
    
    # Create a TestClient that uses this app
    with TestClient(app) as test_client:
        yield test_client
    
    # Clear the dependency override
    app.dependency_overrides.clear()

# Sample data for tests
new_user_data = {
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "testpassword"
}

new_company_data = {
    "legal_name": "Test Company"
}

new_contract_data = {
    "contract_number": "CN123456",
    "title": "Test Contract",
    "company_id": 1,
    "total_value": 10000,
    "date_awarded": "2023-10-01"
}

# Test Functions

def test_create_user(client):
    response = client.post("/users/", json=new_user_data)
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == new_user_data["username"]
    assert data["email"] == new_user_data["email"]

def test_get_users(client):
    response = client.get("/users/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_company(client):
    response = client.post("/companies/", json=new_company_data)
    assert response.status_code == 201
    data = response.json()
    assert data["legal_name"] == new_company_data["legal_name"]

def test_list_companies(client):
    response = client.get("/companies/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_contract(client):
    # Ensure company exists
    company_resp = client.post("/companies/", json=new_company_data)
    company_id = company_resp.json()["company_id"]

    contract_data = new_contract_data.copy()
    contract_data["company_id"] = company_id
    response = client.post("/contracts/", json=contract_data)
    assert response.status_code == 201
    data = response.json()
    assert data["contract_number"] == new_contract_data["contract_number"]

def test_list_contracts(client):
    response = client.get("/contracts/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

# Edge Case Tests

def test_create_user_missing_fields(client):
    response = client.post("/users/", json={"username": "useronly"})
    assert response.status_code == 422  # Unprocessable Entity

def test_create_user_invalid_email_format(client):
    response = client.post("/users/", json={"username": "user", "email": "not-an-email", "password": "password"})
    assert response.status_code == 422  # Unprocessable Entity

def test_get_non_existent_user(client):
    response = client.get("/users/999999999")  # Assuming this user doesn't exist
    assert response.status_code == 404

def test_create_contract_invalid_date(client):
    contract_data_invalid_date = new_contract_data.copy()
    contract_data_invalid_date["date_awarded"] = "not-a-date"
    response = client.post("/contracts/", json=contract_data_invalid_date)
    assert response.status_code == 422  # Unprocessable Entity

def test_create_contract_zero_total_value(client):
    contract_data_zero_value = new_contract_data.copy()
    contract_data_zero_value["total_value"] = 0
    response = client.post("/contracts/", json=contract_data_zero_value)
    assert response.status_code == 422  # Unprocessable Entity

def test_get_non_existent_contract(client):
    response = client.get("/contracts/999999999")  # Assuming this contract doesn't exist
    assert response.status_code == 404