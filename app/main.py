# main.py
import uvicorn
from fastapi import FastAPI, HTTPException, Query, status, Body, Depends
from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Annotated
from datetime import date, datetime
from decimal import Decimal
import random
from sqlalchemy.orm import Session

# --------------------------------------------------------------------------- #
# Application Setup
# --------------------------------------------------------------------------- #
app = FastAPI(
    title="Contracting Visualization API",
    description="An API for exploring and analyzing US government contract data.",
    version="1.0.0",
)

# Create database tables on startup
@app.on_event("startup")
def startup_event():
    create_database_tables()

# --------------------------------------------------------------------------- #
# Pydantic Models (API Schemas)
# --------------------------------------------------------------------------- #

# --- Reference Models ---
class NaicsCode(BaseModel):
    naics_code: str = Field(..., max_length=6)
    description: str

class PscCode(BaseModel):
    psc_code: str = Field(..., max_length=4)
    description: str

# --- Location Models ---
class LocationBase(BaseModel):
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state_province: str
    postal_code: str
    country_code: str = Field(..., min_length=2, max_length=2)
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class LocationCreate(LocationBase):
    pass

class Location(LocationBase):
    location_id: int

# --- Company Models ---
class CompanyBase(BaseModel):
    legal_name: str
    duns_number: Optional[str] = Field(None, max_length=9)
    cage_code: Optional[str] = Field(None, max_length=5)
    website_url: Optional[HttpUrl] = None
    founded_date: Optional[date] = None
    primary_location_id: Optional[int] = None

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    company_id: int
    primary_location: Optional[Location] = None
    created_at: datetime
    updated_at: datetime

# --- Contract Models ---
class ContractBase(BaseModel):
    contract_number: str
    title: Optional[str] = None
    description: Optional[str] = None
    company_id: int
    place_of_performance_location_id: Optional[int] = None
    date_awarded: date
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    total_value: Decimal = Field(..., gt=0)
    total_obligated: Optional[Decimal] = Field(None, gt=0)
    
class ContractCreate(ContractBase):
    naics_codes: List[str] = []
    psc_codes: List[str] = []

class Contract(ContractBase):
    contract_id: int
    company: Company
    place_of_performance: Optional[Location] = None
    naics_codes: List[NaicsCode] = []
    psc_codes: List[PscCode] = []
    created_at: datetime
    updated_at: datetime
    
# --- Dashboard Stats Models ---
class TopCompanyStat(BaseModel):
    company: Company
    total_contract_value: Decimal
    contract_count: int

class ValueByYearStat(BaseModel):
    year: int
    total_value: Decimal
    contract_count: int

# --------------------------------------------------------------------------- #
# SQLAlchemy model classes and the `get_db` 
# dependency function / database session/dependency boilerplate code.
# --------------------------------------------------------------------------- #

### 1. SQLAlchemy Models

## This code block defines Python classes that map to your SQL schema using SQLAlchemy's ORM.

# models.py

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Numeric,
    ForeignKey,
    Table,
    func
)
from sqlalchemy.orm import relationship, declarative_base

# Define the base class for declarative models
Base = declarative_base()

# --------------------------------------------------------------------
# 5. Junction Tables for M:N Relationships (as SQLAlchemy Table objects)
# --------------------------------------------------------------------

# Association table for Contracts and NAICS Codes
contract_naics_association = Table(
    'contract_naics',
    Base.metadata,
    Column('contract_id', Integer, ForeignKey('contracts.contract_id', onupdate="CASCADE", ondelete="CASCADE"), primary_key=True),
    Column('naics_code', String, ForeignKey('naics_codes.naics_code', onupdate="CASCADE", ondelete="RESTRICT"), primary_key=True)
)

# Association table for Contracts and PSC Codes
contract_psc_association = Table(
    'contract_psc',
    Base.metadata,
    Column('contract_id', Integer, ForeignKey('contracts.contract_id', onupdate="CASCADE", ondelete="CASCADE"), primary_key=True),
    Column('psc_code', String, ForeignKey('psc_codes.psc_code', onupdate="CASCADE", ondelete="RESTRICT"), primary_key=True)
)


# --------------------------------------------------------------------
# 1. Reference / Lookup Tables (SQLAlchemy Models)
# --------------------------------------------------------------------

class NaicsCodeModel(Base):
    __tablename__ = 'naics_codes'
    naics_code = Column(String, primary_key=True)
    description = Column(String, nullable=False)
    
    # Relationship to Contracts (M:N)
    contracts = relationship("ContractModel", secondary=contract_naics_association, back_populates="naics_codes")

    def __repr__(self):
        return f"<NaicsCodeModel(naics_code='{self.naics_code}', description='{self.description[:30]}...')>"


class PscCodeModel(Base):
    __tablename__ = 'psc_codes'
    psc_code = Column(String, primary_key=True)
    description = Column(String, nullable=False)

    # Relationship to Contracts (M:N)
    contracts = relationship("ContractModel", secondary=contract_psc_association, back_populates="psc_codes")

    def __repr__(self):
        return f"<PscCodeModel(psc_code='{self.psc_code}', description='{self.description[:30]}...')>"


class RoleModel(Base):
    __tablename__ = 'roles'
    role_id = Column(Integer, primary_key=True)
    role_name = Column(String, nullable=False, unique=True)
    description = Column(String)

    # Relationship to UserRoles (1:N)
    user_roles = relationship("UserRoleModel", back_populates="role")

    def __repr__(self):
        return f"<RoleModel(role_name='{self.role_name}')>"


# --------------------------------------------------------------------
# 2. Core Master Tables (SQLAlchemy Models)
# --------------------------------------------------------------------

class LocationModel(Base):
    __tablename__ = 'locations'
    location_id = Column(Integer, primary_key=True)
    address_line1 = Column(String, nullable=False)
    address_line2 = Column(String)
    city = Column(String, nullable=False)
    state_province = Column(String, nullable=False)
    postal_code = Column(String, nullable=False)
    country_code = Column(String(2), nullable=False)
    latitude = Column(Float)
    longitude = Column(Float)
    
    # Relationship to Companies where this is the primary location (1:N)
    companies_hq = relationship("CompanyModel", back_populates="primary_location")
    
    # Relationship to Contracts where this is the place of performance (1:N)
    performance_contracts = relationship("ContractModel", back_populates="place_of_performance")

    def __repr__(self):
        return f"<LocationModel(city='{self.city}', state_province='{self.state_province}')>"


class CompanyModel(Base):
    __tablename__ = 'companies'
    company_id = Column(Integer, primary_key=True)
    legal_name = Column(String, nullable=False)
    duns_number = Column(String, unique=True)
    cage_code = Column(String, unique=True)
    website_url = Column(String)
    founded_date = Column(String)
    primary_location_id = Column(Integer, ForeignKey('locations.location_id', onupdate="CASCADE", ondelete="SET NULL"))
    created_at = Column(String, nullable=False, server_default=func.now())
    updated_at = Column(String, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationship to its primary Location (N:1)
    primary_location = relationship("LocationModel", back_populates="companies_hq")
    
    # Relationship to its Contracts (1:N)
    contracts = relationship("ContractModel", back_populates="company")

    def __repr__(self):
        return f"<CompanyModel(legal_name='{self.legal_name}')>"


# --------------------------------------------------------------------
# 3. User / Auth Tables (SQLAlchemy Models)
# --------------------------------------------------------------------

class UserModel(Base):
    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False, unique=True)
    password_hash = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    is_active = Column(Integer, nullable=False, server_default='1')
    created_at = Column(String, nullable=False, server_default=func.now())
    updated_at = Column(String, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationship to UserRoles (1:N)
    user_roles = relationship("UserRoleModel", back_populates="user")

    def __repr__(self):
        return f"<UserModel(username='{self.username}')>"


class UserRoleModel(Base):
    __tablename__ = 'user_roles'
    user_id = Column(Integer, ForeignKey('users.user_id', onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
    role_id = Column(Integer, ForeignKey('roles.role_id', onupdate="CASCADE", ondelete="CASCADE"), primary_key=True)
    assigned_at = Column(String, nullable=False, server_default=func.now())

    # Relationships to User and Role (N:1)
    user = relationship("UserModel", back_populates="user_roles")
    role = relationship("RoleModel", back_populates="user_roles")

    def __repr__(self):
        return f"<UserRoleModel(user_id={self.user_id}, role_id={self.role_id})>"


# --------------------------------------------------------------------
# 4. Contract Tables (SQLAlchemy Models)
# --------------------------------------------------------------------

class ContractModel(Base):
    __tablename__ = 'contracts'
    contract_id = Column(Integer, primary_key=True)
    contract_number = Column(String, nullable=False, unique=True)
    title = Column(String)
    description = Column(String)
    company_id = Column(Integer, ForeignKey('companies.company_id', onupdate="CASCADE", ondelete="RESTRICT"), nullable=False)
    place_of_performance_location_id = Column(Integer, ForeignKey('locations.location_id', onupdate="CASCADE", ondelete="SET NULL"))
    date_awarded = Column(String, nullable=False)
    start_date = Column(String)
    end_date = Column(String)
    total_value = Column(Numeric, nullable=False)
    total_obligated = Column(Numeric)
    created_at = Column(String, nullable=False, server_default=func.now())
    updated_at = Column(String, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationship to the awardee Company (N:1)
    company = relationship("CompanyModel", back_populates="contracts")
    
    # Relationship to the place of performance Location (N:1)
    place_of_performance = relationship("LocationModel", back_populates="performance_contracts")

    # Relationship to NAICS Codes (M:N)
    naics_codes = relationship("NaicsCodeModel", secondary=contract_naics_association, back_populates="contracts")
    
    # Relationship to PSC Codes (M:N)
    psc_codes = relationship("PscCodeModel", secondary=contract_psc_association, back_populates="contracts")

    def __repr__(self):
        return f"<ContractModel(contract_number='{self.contract_number}')>"


### 2. Database Session/Dependency

###This code block provides the necessary boilerplate for connecting to the database and managing sessions within a FastAPI application.

# database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# 1. Define the database connection URL.
#    For SQLite, it's "sqlite:///./your_database_name.db".
#    The "./" means the file will be created in the current directory.
SQLALCHEMY_DATABASE_URL = "sqlite:///./contracts.db"

# 2. Create the SQLAlchemy engine.
#    The `connect_args` is needed only for SQLite to allow multithreading.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

# 3. Create a SessionLocal class.
#    Each instance of a SessionLocal will be a database session.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Create a Base class for our models to inherit from.
#    This is the same Base imported and used in the models.py file.
# remove duplicate Base declaration
## Base = declarative_base()


# 5. Define a FastAPI dependency to get a database session.
#    This function will be used in API endpoints to get a db session.
#    It ensures that the database session is always closed after the request.
def get_db():
    """
    FastAPI dependency that provides a database session for a request.
    Yields:
        Session: The SQLAlchemy database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Optional: A function to create all tables in the database.
# You would call this once when your application starts up.
def create_database_tables():
    """Creates all tables defined in the Base metadata."""
    Base.metadata.create_all(bind=engine)



# --------------------------------------------------------------------------- #
# 5. API Endpoints
# --------------------------------------------------------------------------- #

@app.get("/", tags=["Root"])
def read_root():
    """Root endpoint providing a welcome message."""
    return {"message": "Welcome to the Contracting Visualization API"}

# --- User Endpoints (SQLAlchemy) ---
@app.post("/users/", response_model=dict, status_code=status.HTTP_201_CREATED, tags=["Users"])
def create_user(username: str, email: str, password: str, db_session: Session = Depends(get_db)):
    """Create a new user using SQLAlchemy."""
    # Check if user already exists
    existing_user = db_session.query(UserModel).filter(
        (UserModel.username == username) | (UserModel.email == email)
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already exists")
    
    # Create new user
    db_user = UserModel(
        username=username,
        email=email,
        password_hash=f"{password}_hashed",  # In production, use proper hashing
        is_active=1
    )
    
    db_session.add(db_user)
    db_session.commit()
    db_session.refresh(db_user)
    
    return {"user_id": db_user.user_id, "username": db_user.username, "email": db_user.email}

@app.get("/users/", response_model=List[dict], tags=["Users"])
def get_users(db_session: Session = Depends(get_db)):
    """Get all users using SQLAlchemy."""
    users = db_session.query(UserModel).all()
    return [{"user_id": u.user_id, "username": u.username, "email": u.email, "is_active": u.is_active} for u in users]

@app.get("/users/{user_id}", response_model=dict, tags=["Users"])
def get_user(user_id: int, db_session: Session = Depends(get_db)):
    """Get a single user by ID using SQLAlchemy."""
    user = db_session.query(UserModel).filter(UserModel.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"user_id": user.user_id, "username": user.username, "email": user.email, "is_active": user.is_active}

@app.put("/users/{user_id}", response_model=dict, tags=["Users"])
def update_user(user_id: int, username: Optional[str] = None, email: Optional[str] = None, db_session: Session = Depends(get_db)):
    """Update a user using SQLAlchemy."""
    user = db_session.query(UserModel).filter(UserModel.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if username:
        user.username = username
    if email:
        user.email = email
    
    db_session.commit()
    db_session.refresh(user)
    
    return {"user_id": user.user_id, "username": user.username, "email": user.email, "is_active": user.is_active}

@app.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Users"])
def delete_user(user_id: int, db_session: Session = Depends(get_db)):
    """Delete a user using SQLAlchemy."""
    user = db_session.query(UserModel).filter(UserModel.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_session.delete(user)
    db_session.commit()
    
    return None

# --- Simple Contract Endpoints (SQLAlchemy Ready) ---
@app.get("/contracts/", response_model=List[dict], tags=["Contracts"])
def list_contracts(db_session: Session = Depends(get_db)):
    """List all contracts using SQLAlchemy."""
    contracts = db_session.query(ContractModel).all()
    return [{"contract_id": c.contract_id, "contract_number": c.contract_number, "title": c.title} for c in contracts]

@app.post("/contracts/", response_model=dict, status_code=status.HTTP_201_CREATED, tags=["Contracts"])
def create_contract(
    contract_number: str, 
    title: str, 
    company_id: int, 
    total_value: float,
    date_awarded: str,
    db_session: Session = Depends(get_db)
):
    """Create a new contract using SQLAlchemy."""
    # Check if company exists
    company = db_session.query(CompanyModel).filter(CompanyModel.company_id == company_id).first()
    if not company:
        raise HTTPException(status_code=400, detail="Company not found")
    
    # Create new contract
    db_contract = ContractModel(
        contract_number=contract_number,
        title=title,
        company_id=company_id,
        total_value=total_value,
        date_awarded=date_awarded
    )
    
    db_session.add(db_contract)
    db_session.commit()
    db_session.refresh(db_contract)
    
    return {"contract_id": db_contract.contract_id, "contract_number": db_contract.contract_number, "title": db_contract.title}

# --- Simple Company Endpoints (SQLAlchemy Ready) ---
@app.get("/companies/", response_model=List[dict], tags=["Companies"])
def list_companies(db_session: Session = Depends(get_db)):
    """List all companies using SQLAlchemy."""
    companies = db_session.query(CompanyModel).all()
    return [{"company_id": c.company_id, "legal_name": c.legal_name} for c in companies]

@app.post("/companies/", response_model=dict, status_code=status.HTTP_201_CREATED, tags=["Companies"])
def create_company(legal_name: str, db_session: Session = Depends(get_db)):
    """Create a new company using SQLAlchemy."""
    db_company = CompanyModel(legal_name=legal_name)
    
    db_session.add(db_company)
    db_session.commit()
    db_session.refresh(db_company)
    
    return {"company_id": db_company.company_id, "legal_name": db_company.legal_name}

# --- Simple Location Endpoints (SQLAlchemy Ready) ---
@app.get("/locations/", response_model=List[dict], tags=["Locations"])
def list_locations(db_session: Session = Depends(get_db)):
    """List all locations using SQLAlchemy."""
    locations = db_session.query(LocationModel).all()
    return [{"location_id": l.location_id, "city": l.city, "state_province": l.state_province} for l in locations]
