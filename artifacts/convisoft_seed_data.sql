-- Seed data for Contracting Visualization Software
-- Generated from contract_search_cleaned.json
-- Based on convisoft_schema.sql

-- Enable foreign-key enforcement
PRAGMA foreign_keys = ON;

--------------------------------------------------------------------
-- 1. Reference Data (NAICS Codes)
--------------------------------------------------------------------
INSERT OR IGNORE INTO naics_codes (naics_code, description) VALUES
('336414', 'Guided Missile and Space Vehicle Manufacturing'),
('541715', 'Research and Development in the Physical, Engineering, and Life Sciences (except Nanotechnology and Biotechnology)'),
('541512', 'Computer Systems Design Services'),
('336411', 'Aircraft Manufacturing'),
('236220', 'Commercial and Institutional Building Construction'),
('334220', 'Radio and Television Broadcasting and Wireless Communications Equipment Manufacturing'),
('424210', 'Drugs and Druggists'' Sundries Merchant Wholesalers');

--------------------------------------------------------------------
-- 2. Reference Data (PSC Codes)
--------------------------------------------------------------------
INSERT OR IGNORE INTO psc_codes (psc_code, description) VALUES
('AC13', 'Aircraft Components and Accessories'),
('AR15', 'Aircraft and Airframe Structural Components'),
('D399', 'IT and Telecom- Other IT and Telecommunications'),
('D307', 'IT and Telecom- Telecommunications and Transmission'),
('1410', 'Guided Missiles'),
('1680', 'Miscellaneous Aircraft Accessories and Components'),
('Y1CZ', 'Construction of Structures and Facilities'),
('5820', 'Radio and Television Communication Equipment, Except Airborne'),
('Q999', 'Medical - Other');

--------------------------------------------------------------------
-- 3. Roles
--------------------------------------------------------------------
INSERT OR IGNORE INTO roles (role_id, role_name, description) VALUES
(1, 'admin', 'System Administrator'),
(2, 'analyst', 'Contract Analyst'),
(3, 'viewer', 'Read-only User');

--------------------------------------------------------------------
-- 4. Locations
--------------------------------------------------------------------
INSERT OR IGNORE INTO locations (location_id, address_line1, city, state_province, postal_code, country_code, latitude, longitude) VALUES
(1, '6801 Rockledge Dr', 'Bethesda', 'MD', '20817', 'US', 38.9807, -77.1203),
(2, '1 Rocket Rd', 'Hawthorne', 'CA', '90250', 'US', 33.9192, -118.3275),
(3, '2980 Fairview Park Dr', 'Falls Church', 'VA', '22042', 'US', 38.8732, -77.2289),
(4, '11011 Sunset Hills Rd', 'Reston', 'VA', '20190', 'US', 38.9586, -77.3570),
(5, '870 Winter St', 'Waltham', 'MA', '02451', 'US', 42.3751, -71.2356),
(6, '100 N Riverside Plaza', 'Chicago', 'IL', '60606', 'US', 41.8781, -87.6298),
(7, '12001 Sunrise Valley Dr', 'Reston', 'VA', '20191', 'US', 38.9517, -77.3411),
(8, '1025 W NASA Blvd', 'Melbourne', 'FL', '32919', 'US', 28.0836, -80.6081),
(9, '6555 State Hwy 161', 'Irving', 'TX', '75039', 'US', 32.8668, -96.9706),
(10, '1911 N Fort Myer Dr', 'Arlington', 'VA', '22209', 'US', 38.8977, -77.0703);

--------------------------------------------------------------------
-- 5. Companies
--------------------------------------------------------------------
INSERT OR IGNORE INTO companies (company_id, legal_name, duns_number, cage_code, website_url, founded_date, primary_location_id, created_at, updated_at) VALUES
(1, 'Lockheed Martin Corporation', '006928857', '98230', 'https://www.lockheedmartin.com', '1995-03-15', 1, datetime('now'), datetime('now')),
(2, 'Space Exploration Technologies Corp.', '080859373', '69LC2', 'https://www.spacex.com', '2002-05-06', 2, datetime('now'), datetime('now')),
(3, 'Northrop Grumman Corporation', '003099542', '77068', 'https://www.northropgrumman.com', '1994-02-17', 3, datetime('now'), datetime('now')),
(4, 'General Dynamics Corporation', '003395813', '0YFP5', 'https://www.generaldynamics.com', '1952-02-21', 4, datetime('now'), datetime('now')),
(5, 'Raytheon Technologies Corporation', '001565765', '4X914', 'https://www.rtx.com', '1922-07-07', 5, datetime('now'), datetime('now')),
(6, 'The Boeing Company', '001025987', '81205', 'https://www.boeing.com', '1916-07-15', 6, datetime('now'), datetime('now')),
(7, 'Bechtel Group Inc.', '006573914', '62470', 'https://www.bechtel.com', '1898-09-17', 7, datetime('now'), datetime('now')),
(8, 'L3Harris Technologies Inc.', '006840074', '14304', 'https://www.l3harris.com', '2019-06-29', 8, datetime('now'), datetime('now')),
(9, 'McKesson Corporation', '005987725', '61995', 'https://www.mckesson.com', '1833-01-01', 9, datetime('now'), datetime('now')),
(10, 'Accenture plc', '607471613', '61434', 'https://www.accenture.com', '1989-01-01', 10, datetime('now'), datetime('now'));

--------------------------------------------------------------------
-- 6. Contracts
--------------------------------------------------------------------
INSERT OR IGNORE INTO contracts (contract_id, contract_number, title, company_id, place_of_performance_location_id, date_awarded, start_date, end_date, total_value, total_obligated, created_at, updated_at) VALUES
(1, 'DEF-2022-001', 'Defense Contract 1', 1, 1, '2022-03-01', '2022-03-01', '2029-03-01', 3200000000.00, 3200000000.00, datetime('now'), datetime('now')),
(2, 'NASA-2021-001', 'Space Exploration Program', 2, 2, '2021-04-16', '2021-04-16', '2026-04-16', 2900000000.00, 2900000000.00, datetime('now'), datetime('now')),
(3, 'CYB-2022-001', 'Cybersecurity Enhancement', 3, 3, '2022-07-22', '2022-07-22', '2025-07-22', 1000000000.00, 1000000000.00, datetime('now'), datetime('now')),
(4, 'HHS-2023-001', 'Healthcare System Update', 4, 4, '2023-01-15', '2023-01-15', '2027-01-15', 800000000.00, 800000000.00, datetime('now'), datetime('now')),
(5, 'MIS-2022-001', 'Advanced Missile Systems', 5, 5, '2022-05-10', '2022-05-10', '2028-05-10', 2400000000.00, 2400000000.00, datetime('now'), datetime('now')),
(6, 'NAV-2023-001', 'Naval Warfare Components', 6, 6, '2023-03-10', '2023-03-10', '2028-03-10', 1500000000.00, 1500000000.00, datetime('now'), datetime('now')),
(7, 'INF-2021-001', 'Infrastructure Development', 7, 7, '2021-11-08', '2021-11-08', '2029-11-08', 900000000.00, 900000000.00, datetime('now'), datetime('now')),
(8, 'SAT-2022-001', 'Defense Satellite Services', 8, 8, '2022-09-25', '2022-09-25', '2026-09-25', 1100000000.00, 1100000000.00, datetime('now'), datetime('now')),
(9, 'PUB-2023-001', 'Public Health Disaster Relief', 9, 9, '2023-06-15', '2023-06-15', '2025-06-15', 500000000.00, 500000000.00, datetime('now'), datetime('now')),
(10, 'FED-2021-001', 'Federal IT Modernization', 10, 10, '2021-08-30', '2021-08-30', '2026-08-30', 1300000000.00, 1300000000.00, datetime('now'), datetime('now'));

--------------------------------------------------------------------
-- 7. Contract NAICS Associations
--------------------------------------------------------------------
INSERT OR IGNORE INTO contract_naics (contract_id, naics_code) VALUES
(1, '336414'),  -- Defense Contract 1 -> Guided Missile Manufacturing
(2, '541715'),  -- Space Exploration Program -> R&D Physical Sciences
(3, '541512'),  -- Cybersecurity Enhancement -> Computer Systems Design
(4, '541512'),  -- Healthcare System Update -> Computer Systems Design
(5, '336414'),  -- Advanced Missile Systems -> Guided Missile Manufacturing
(6, '336411'),  -- Naval Warfare Components -> Aircraft Manufacturing
(7, '236220'),  -- Infrastructure Development -> Commercial Construction
(8, '334220'),  -- Defense Satellite Services -> Radio/TV Broadcasting Equipment
(9, '424210'),  -- Public Health Disaster Relief -> Drugs Merchant Wholesalers
(10, '541512'); -- Federal IT Modernization -> Computer Systems Design

--------------------------------------------------------------------
-- 8. Contract PSC Associations
--------------------------------------------------------------------
INSERT OR IGNORE INTO contract_psc (contract_id, psc_code) VALUES
(1, 'AC13'),    -- Defense Contract 1 -> Aircraft Components
(2, 'AR15'),    -- Space Exploration Program -> Aircraft Structural Components
(3, 'D399'),    -- Cybersecurity Enhancement -> Other IT and Telecommunications
(4, 'D307'),    -- Healthcare System Update -> Telecommunications and Transmission
(5, '1410'),    -- Advanced Missile Systems -> Guided Missiles
(6, '1680'),    -- Naval Warfare Components -> Aircraft Accessories
(7, 'Y1CZ'),    -- Infrastructure Development -> Construction of Structures
(8, '5820'),    -- Defense Satellite Services -> Radio/TV Communication Equipment
(9, 'Q999'),    -- Public Health Disaster Relief -> Medical Other
(10, 'D399');   -- Federal IT Modernization -> Other IT and Telecommunications

--------------------------------------------------------------------
-- 9. Sample Users (for testing)
--------------------------------------------------------------------
INSERT OR IGNORE INTO users (user_id, username, password_hash, email, is_active, created_at, updated_at) VALUES
(1, 'admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewePTmWWK7c0PrWO', 'admin@convisoft.com', 1, datetime('now'), datetime('now')),
(2, 'analyst1', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewePTmWWK7c0PrWO', 'analyst@convisoft.com', 1, datetime('now'), datetime('now')),
(3, 'viewer1', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewePTmWWK7c0PrWO', 'viewer@convisoft.com', 1, datetime('now'), datetime('now'));

--------------------------------------------------------------------
-- 10. User Role Assignments
--------------------------------------------------------------------
INSERT OR IGNORE INTO user_roles (user_id, role_id, assigned_at) VALUES
(1, 1, datetime('now')),  -- admin -> admin role
(2, 2, datetime('now')),  -- analyst1 -> analyst role
(3, 3, datetime('now'));  -- viewer1 -> viewer role

-- Verify data integrity
SELECT 'NAICS Codes Count: ' || COUNT(*) FROM naics_codes;
SELECT 'PSC Codes Count: ' || COUNT(*) FROM psc_codes;
SELECT 'Companies Count: ' || COUNT(*) FROM companies;
SELECT 'Contracts Count: ' || COUNT(*) FROM contracts;
SELECT 'Locations Count: ' || COUNT(*) FROM locations;
SELECT 'Users Count: ' || COUNT(*) FROM users;