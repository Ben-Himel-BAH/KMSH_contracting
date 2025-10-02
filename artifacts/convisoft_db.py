"""
SQLAlchemy ORM models that mirror the schema supplied in the prompt.

• Compatible with SQLAlchemy ≥ 2.0 (works in 1.4 with future-style engine as well)
• All FK “ON UPDATE / ON DELETE” rules present
• Default / on-update timestamps handled with func.now()
• Helpful indexes & CHECK constraints preserved
"""

from __future__ import annotations

from datetime import date, datetime

from sqlalchemy import (
    CheckConstraint,
    Column,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    Table,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


# --------------------------------------------------------------------------- #
#  Base class
# --------------------------------------------------------------------------- #
class Base(DeclarativeBase):
    """Declarative base for all ORM models."""


# --------------------------------------------------------------------------- #
#  1. Reference / Lookup Tables
# --------------------------------------------------------------------------- #
class NaicsCode(Base):
    __tablename__ = "naics_codes"

    naics_code: Mapped[str] = mapped_column(String(6), primary_key=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    # Back-ref from Contract through M:N table “contract_naics”
    contracts: Mapped[list["Contract"]] = relationship(
        secondary="contract_naics",
        back_populates="naics_codes",
        lazy="dynamic",
    )

    __table_args__ = (
        # Extra index also defined at bottom (mirrors original DDL)
        Index("idx_naics_description", "description"),
    )


class PscCode(Base):
    __tablename__ = "psc_codes"

    psc_code: Mapped[str] = mapped_column(String(4), primary_key=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)

    contracts: Mapped[list["Contract"]] = relationship(
        secondary="contract_psc",
        back_populates="psc_codes",
        lazy="dynamic",
    )

    __table_args__ = (
        Index("idx_psc_description", "description"),
    )


class Role(Base):
    __tablename__ = "roles"

    role_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    role_name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text)

    users: Mapped[list["User"]] = relationship(
        secondary="user_roles", back_populates="roles", lazy="dynamic"
    )


# --------------------------------------------------------------------------- #
#  2. Core Master Tables
# --------------------------------------------------------------------------- #
class Location(Base):
    __tablename__ = "locations"

    location_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    address_line1: Mapped[str] = mapped_column(Text, nullable=False)
    address_line2: Mapped[str | None] = mapped_column(Text)
    city: Mapped[str] = mapped_column(Text, nullable=False)
    state_province: Mapped[str] = mapped_column(Text, nullable=False)
    postal_code: Mapped[str] = mapped_column(Text, nullable=False)
    country_code: Mapped[str] = mapped_column(String(2), nullable=False)
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)

    companies_as_hq: Mapped[list["Company"]] = relationship(
        back_populates="primary_location"
    )
    contracts_perf: Mapped[list["Contract"]] = relationship(
        back_populates="place_of_performance"
    )

    __table_args__ = (
        CheckConstraint("length(country_code) = 2", name="ck_country_code_len"),
        Index("idx_locations_state_province", "state_province"),
        Index("idx_locations_country_code", "country_code"),
    )


class Company(Base):
    __tablename__ = "companies"

    company_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    legal_name: Mapped[str] = mapped_column(Text, nullable=False)
    duns_number: Mapped[str | None] = mapped_column(String(9), unique=True)
    cage_code: Mapped[str | None] = mapped_column(String(5), unique=True)
    website_url: Mapped[str | None] = mapped_column(Text)
    founded_date: Mapped[date | None] = mapped_column(Date)

    primary_location_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "locations.location_id",
            onupdate="CASCADE",
            ondelete="SET NULL",
        )
    )
    primary_location: Mapped["Location" | None] = relationship(
        "Location", back_populates="companies_as_hq"
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    contracts: Mapped[list["Contract"]] = relationship(
        back_populates="company", cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index("idx_companies_duns_number", "duns_number", unique=True),
    )


# --------------------------------------------------------------------------- #
#  3. User / Auth Tables
# --------------------------------------------------------------------------- #
class User(Base):
    __tablename__ = "users"

    user_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Integer, default=1, nullable=False
    )  # 0 / 1 in SQLite

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    roles: Mapped[list["Role"]] = relationship(
        secondary="user_roles", back_populates="users", lazy="dynamic"
    )

    __table_args__ = (
        CheckConstraint("is_active IN (0,1)", name="ck_users_is_active_bool"),
    )


# Association (junction) table for user ⇄ roles
user_roles = Table(
    "user_roles",
    Base.metadata,
    Column(
        "user_id",
        Integer,
        ForeignKey("users.user_id", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    ),
    Column(
        "role_id",
        Integer,
        ForeignKey("roles.role_id", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    ),
    Column(
        "assigned_at",
        DateTime,
        nullable=False,
        server_default=func.now(),
    ),
)


# --------------------------------------------------------------------------- #
#  4. Contract Tables
# --------------------------------------------------------------------------- #
class Contract(Base):
    __tablename__ = "contracts"

    contract_id: Mapped[int] = mapped_column(Integer, primary_key=True)
    contract_number: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    title: Mapped[str | None] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text)

    company_id: Mapped[int] = mapped_column(
        ForeignKey("companies.company_id", onupdate="CASCADE", ondelete="RESTRICT"),
        nullable=False,
    )
    company: Mapped["Company"] = relationship("Company", back_populates="contracts")

    place_of_performance_location_id: Mapped[int | None] = mapped_column(
        ForeignKey(
            "locations.location_id",
            onupdate="CASCADE",
            ondelete="SET NULL",
        )
    )
    place_of_performance: Mapped["Location" | None] = relationship(
        "Location", back_populates="contracts_perf"
    )

    date_awarded: Mapped[date] = mapped_column(Date, nullable=False)
    start_date: Mapped[date | None] = mapped_column(Date)
    end_date: Mapped[date | None] = mapped_column(Date)

    total_value: Mapped[Numeric] = mapped_column(Numeric, nullable=False)
    total_obligated: Mapped[Numeric | None] = mapped_column(Numeric)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=func.now(), onupdate=func.now(), nullable=False
    )

    # M:N relationships
    naics_codes: Mapped[list["NaicsCode"]] = relationship(
        secondary="contract_naics", back_populates="contracts", lazy="dynamic"
    )
    psc_codes: Mapped[list["PscCode"]] = relationship(
        secondary="contract_psc", back_populates="contracts", lazy="dynamic"
    )

    __table_args__ = (
        CheckConstraint("total_value >= 0", name="ck_contracts_total_value_nonneg"),
        CheckConstraint(
            "total_obligated IS NULL OR total_obligated >= 0",
            name="ck_contracts_total_obligated_nonneg",
        ),
        Index("idx_contracts_date_awarded", "date_awarded"),
        Index("idx_contracts_total_value", "total_value"),
        Index("idx_contracts_company_id", "company_id"),
    )


# --------------------------------------------------------------------------- #
#  5. Association Tables for M:N Relationships
# --------------------------------------------------------------------------- #
contract_naics = Table(
    "contract_naics",
    Base.metadata,
    Column(
        "contract_id",
        Integer,
        ForeignKey("contracts.contract_id", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    ),
    Column(
        "naics_code",
        String(6),
        ForeignKey("naics_codes.naics_code", ondelete="RESTRICT", onupdate="CASCADE"),
        primary_key=True,
    ),
)

contract_psc = Table(
    "contract_psc",
    Base.metadata,
    Column(
        "contract_id",
        Integer,
        ForeignKey("contracts.contract_id", ondelete="CASCADE", onupdate="CASCADE"),
        primary_key=True,
    ),
    Column(
        "psc_code",
        String(4),
        ForeignKey("psc_codes.psc_code", ondelete="RESTRICT", onupdate="CASCADE"),
        primary_key=True,
    ),
)