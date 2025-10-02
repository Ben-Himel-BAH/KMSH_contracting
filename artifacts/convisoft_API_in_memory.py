# main.py
import uvicorn
from fastapi import FastAPI, HTTPException, Query, status, Body
from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Annotated
from datetime import date, datetime
from decimal import Decimal
import random

# --------------------------------------------------------------------------- #
# 1. Application Setup
# --------------------------------------------------------------------------- #
app = FastAPI(
    title="Contracting Visualization API",
    description="An API for exploring and analyzing US government contract data.",
    version="1.0.0",
)

# --------------------------------------------------------------------------- #
# 2. In-Memory Data Storage (Fake Database)
# --------------------------------------------------------------------------- #
# Using dictionaries for easy ID-based lookups
db = {
    "locations": {},
    "companies": {},
    "contracts": {},
    "naics_codes": {},
    "psc_codes": {},
    "users": {},
    "roles": {},
    "user_roles": [], # List of tuples (user_id, role_id)
}

# Auto-incrementing ID counters
next_id = {
    "locations": 1,
    "companies": 1,
    "contracts": 1,
    "users": 1,
    "roles": 1,
}

def seed_data():
    """Pre-populates the in-memory database with sample data."""
    global db, next_id

    # Reference Data
    db["naics_codes"] = {
        "541511": {"naics_code": "541511", "description": "Custom Computer Programming Services"},
        "541512": {"naics_code": "541512", "description": "Computer Systems Design Services"},
        "561110": {"naics_code": "561110", "description": "Office Administrative Services"},
    }
    db["psc_codes"] = {
        "D302": {"psc_code": "D302", "description": "IT and Telecom-Systems Development"},
        "R499": {"psc_code": "R499", "description": "Support- Professional: Other"},
    }
    db["roles"] = {
        1: {"role_id": 1, "role_name": "admin", "description": "System Administrator"},
        2: {"role_id": 2, "role_name": "analyst", "description": "Contract Analyst"},
    }
    next_id["roles"] = 3

    # Locations
    db["locations"] = {
        1: {"location_id": 1, "address_line1": "123 Innovation Dr", "city": "Reston", "state_province": "VA", "postal_code": "20190", "country_code": "US", "latitude": 38.95, "longitude": -77.35},
        2: {"location_id": 2, "address_line1": "456 Tech Park", "city": "Huntsville", "state_province": "AL", "postal_code": "35806", "country_code": "US", "latitude": 34.73, "longitude": -86.58},
        3: {"location_id": 3, "address_line1": "789 Government Way", "city": "Washington", "state_province": "DC", "postal_code": "20001", "country_code": "US", "latitude": 38.90, "longitude": -77.03},
    }
    next_id["locations"] = 4

    # Companies
    db["companies"] = {
        1: {"company_id": 1, "legal_name": "Tech Solutions LLC", "duns_number": "123456789", "cage_code": "1A2B3", "primary_location_id": 1, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
        2: {"company_id": 2, "legal_name": "Defense Innovators Inc.", "duns_number": "987654321", "cage_code": "CAGE4", "primary_location_id": 2, "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
    }
    next_id["companies"] = 3

    # Contracts
    db["contracts"] = {
        1: {"contract_id": 1, "contract_number": "W9113M-23-C-0001", "title": "Cybersecurity Platform Upgrade", "company_id": 1, "place_of_performance_location_id": 3, "date_awarded": date(2023, 5, 15), "start_date": date(2023, 6, 1), "end_date": date(2025, 5, 31), "total_value": Decimal("12500000.00"), "total_obligated": Decimal("5000000.00"), "naics_codes": ["541511", "541512"], "psc_codes": ["D302"], "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
        2: {"contract_id": 2, "contract_number": "N00019-22-D-0005", "title": "Logistics Support Services", "company_id": 2, "place_of_performance_location_id": 2, "date_awarded": date(2022, 11, 1), "start_date": date(2022, 11, 1), "end_date": date(2027, 10, 31), "total_value": Decimal("75000000.00"), "total_obligated": Decimal("15000000.00"), "naics_codes": ["561110"], "psc_codes": ["R499"], "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
        3: {"contract_id": 3, "contract_number": "GS-35F-0123Y", "title": "Cloud Migration Services", "company_id": 1, "place_of_performance_location_id": 1, "date_awarded": date(2023, 1, 20), "start_date": date(2023, 2, 1), "end_date": date(2024, 1, 31), "total_value": Decimal("4800000.00"), "total_obligated": Decimal("4800000.00"), "naics_codes": ["541512"], "psc_codes": ["D302"], "created_at": datetime.utcnow(), "updated_at": datetime.utcnow()},
    }
    next_id["contracts"] = 4

seed_data()

# --------------------------------------------------------------------------- #
# 3. Pydantic Models (API Schemas)
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
# 4. Helper Functions
# --------------------------------------------------------------------------- #

def get_full_contract_details(contract_data: dict) -> Contract:
    """Helper to enrich a contract dictionary with related objects."""
    company_data = db["companies"].get(contract_data["company_id"])
    if not company_data:
        # This would be a data integrity error in a real DB
        raise HTTPException(status_code=500, detail=f"Data integrity error: Company {contract_data['company_id']} not found for contract {contract_data['contract_id']}")
    
    company_location_data = db["locations"].get(company_data.get("primary_location_id"))
    
    return Contract(
        **contract_data,
        company=Company(
            **company_data,
            primary_location=Location(**company_location_data) if company_location_data else None
        ),
        place_of_performance=db["locations"].get(contract_data.get("place_of_performance_location_id")),
        naics_codes=[db["naics_codes"][code] for code in contract_data.get("naics_codes", []) if code in db["naics_codes"]],
        psc_codes=[db["psc_codes"][code] for code in contract_data.get("psc_codes", []) if code in db["psc_codes"]],
    )

# --------------------------------------------------------------------------- #
# 5. API Endpoints
# --------------------------------------------------------------------------- #

@app.get("/", tags=["Root"])
def read_root():
    """Root endpoint providing a welcome message."""
    return {"message": "Welcome to the Contracting Visualization API"}

# Debug endpoint to check database
@app.get("/debug", tags=["Debug"])
def debug_db():
    """Debug endpoint to check database contents."""
    return {
        "contracts_count": len(db["contracts"]),
        "companies_count": len(db["companies"]),
        "locations_count": len(db["locations"]),
        "contracts_keys": list(db["contracts"].keys()),
        "sample_contract": list(db["contracts"].values())[0] if db["contracts"] else None
    }

# --- Contracts Endpoints ---
@app.get("/contracts", response_model=List[Contract], tags=["Contracts"])
def list_contracts(
    min_date: Annotated[Optional[date], Query(description="Filter by minimum award date (YYYY-MM-DD)")] = None,
    max_date: Annotated[Optional[date], Query(description="Filter by maximum award date (YYYY-MM-DD)")] = None,
    min_value: Annotated[Optional[Decimal], Query(description="Filter by minimum total contract value", gt=0)] = None,
    max_value: Annotated[Optional[Decimal], Query(description="Filter by maximum total contract value", gt=0)] = None,
    naics_code: Annotated[Optional[str], Query(description="Filter by a specific NAICS code")] = None,
    company_id: Annotated[Optional[int], Query(description="Filter by a specific company ID")] = None
):
    """
    (User Story 1) List and filter contracts by date, value, NAICS code, and more.
    """
    results = list(db["contracts"].values())

    if min_date:
        results = [c for c in results if c['date_awarded'] >= min_date]
    if max_date:
        results = [c for c in results if c['date_awarded'] <= max_date]
    if min_value:
        results = [c for c in results if c['total_value'] >= min_value]
    if max_value:
        results = [c for c in results if c['total_value'] <= max_value]
    if naics_code:
        results = [c for c in results if naics_code in c.get('naics_codes', [])]
    if company_id:
        results = [c for c in results if c['company_id'] == company_id]
        
    if not results:
        # (User Story 6) Notify user if filter returns no results
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No contracts found matching the specified criteria.")
    
    # Enrich results with full details
    return [get_full_contract_details(c) for c in results]


@app.post("/contracts", response_model=Contract, status_code=status.HTTP_201_CREATED, tags=["Contracts"])
def create_contract(contract: ContractCreate):
    """Create a new contract award."""
    if contract.company_id not in db["companies"]:
        raise HTTPException(status_code=400, detail=f"Company with ID {contract.company_id} does not exist.")
    if contract.place_of_performance_location_id and contract.place_of_performance_location_id not in db["locations"]:
         raise HTTPException(status_code=400, detail=f"Location with ID {contract.place_of_performance_location_id} does not exist.")
    
    for code in contract.naics_codes:
        if code not in db["naics_codes"]:
            raise HTTPException(status_code=400, detail=f"NAICS code '{code}' not found.")

    new_id = next_id["contracts"]
    new_contract_data = contract.model_dump()
    new_contract_data.update({
        "contract_id": new_id,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    })
    db["contracts"][new_id] = new_contract_data
    next_id["contracts"] += 1
    
    return get_full_contract_details(new_contract_data)

@app.get("/contracts/{contract_id}", response_model=Contract, tags=["Contracts"])
def get_contract(contract_id: int):
    """
    (User Story 5) Retrieve detailed information for a single contract by its ID.
    This endpoint also provides the data needed for User Story 2 (map view) by including location details.
    """
    contract_data = db["contracts"].get(contract_id)
    if not contract_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Contract with ID {contract_id} not found.")
    return get_full_contract_details(contract_data)


# --- Companies Endpoints ---
@app.get("/companies", response_model=List[Company], tags=["Companies"])
def list_companies():
    """List all companies in the system."""
    enriched_companies = []
    for company_data in db["companies"].values():
        location_data = db["locations"].get(company_data.get("primary_location_id"))
        enriched_companies.append(
            Company(
                **company_data,
                primary_location=Location(**location_data) if location_data else None
            )
        )
    return enriched_companies

@app.get("/companies/{company_id}", response_model=Company, tags=["Companies"])
def get_company(company_id: int):
    """Retrieve a single company by its ID."""
    company_data = db["companies"].get(company_id)
    if not company_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Company with ID {company_id} not found.")
    
    location_data = db["locations"].get(company_data.get("primary_location_id"))
    return Company(
        **company_data,
        primary_location=Location(**location_data) if location_data else None
    )

# --- Locations Endpoints (for map data / User Story 2) ---
@app.get("/locations", response_model=List[Location], tags=["Locations"])
def list_locations():
    """List all locations."""
    return list(db["locations"].values())

# --- Dashboard & Stats Endpoints ---
@app.get("/stats/top-companies", response_model=List[TopCompanyStat], tags=["Dashboard & Stats"])
def get_top_companies(limit: int = 5):
    """
    (User Story 3) Get a list of top companies by total contract value.
    """
    company_stats = {}
    for contract in db["contracts"].values():
        company_id = contract["company_id"]
        if company_id not in company_stats:
            company_stats[company_id] = {"total_value": Decimal(0), "count": 0}
        company_stats[company_id]["total_value"] += contract["total_value"]
        company_stats[company_id]["count"] += 1

    # Sort companies by total value
    sorted_company_ids = sorted(company_stats, key=lambda cid: company_stats[cid]["total_value"], reverse=True)
    
    top_companies = []
    for company_id in sorted_company_ids[:limit]:
        company_data = db["companies"].get(company_id)
        if company_data:
            top_companies.append(
                TopCompanyStat(
                    company=get_company(company_id), # Reuse existing function
                    total_contract_value=company_stats[company_id]["total_value"],
                    contract_count=company_stats[company_id]["count"]
                )
            )
    return top_companies

@app.get("/stats/value-by-year", response_model=List[ValueByYearStat], tags=["Dashboard & Stats"])
def get_value_by_year():
    """
    (User Story 3) Get total contract value and count grouped by award year.
    """
    year_stats = {}
    for contract in db["contracts"].values():
        year = contract["date_awarded"].year
        if year not in year_stats:
            year_stats[year] = {"total_value": Decimal(0), "count": 0}
        year_stats[year]["total_value"] += contract["total_value"]
        year_stats[year]["count"] += 1
    
    # Format for response
    results = [
        ValueByYearStat(
            year=year,
            total_value=stats["total_value"],
            contract_count=stats["count"]
        ) for year, stats in year_stats.items()
    ]
    
    return sorted(results, key=lambda x: x.year, reverse=True)


# --------------------------------------------------------------------------- #
# 6. Main execution
# --------------------------------------------------------------------------- #
if __name__ == "__main__":
    # To run this application:
    # 1. Save the code as `main.py`.
    # 2. Make sure you have the necessary libraries:
    #    pip install fastapi "uvicorn[standard]"
    # 3. Run from your terminal:
    #    uvicorn main:app --reload
    # 4. Open your browser and go to http://127.0.0.1:8000/docs for the interactive API documentation.
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)