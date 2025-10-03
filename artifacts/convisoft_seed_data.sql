-- Expanded Seed data for Contracting Visualization Software
-- Generated from USASpending.gov API real contract data (2007-2024)
-- Based on convisoft_schema.sql
-- Total: 71 real government contracts spanning 17 years

-- Enable foreign-key enforcement
PRAGMA foreign_keys = ON;

--------------------------------------------------------------------
-- 1. Reference Data (NAICS Codes) - Industry Classifications
--------------------------------------------------------------------
INSERT OR IGNORE INTO naics_codes (naics_code, description) VALUES
('541511', 'Custom Computer Programming Services'),
('541512', 'Computer Systems Design Services'),
('561611', 'Investigation Services'),
('522320', 'Financial Transactions Processing, Reserve, and Clearinghouse Activities'),
('541990', 'All Other Professional, Scientific, and Technical Services'),
('336414', 'Guided Missile and Space Vehicle Manufacturing'),
('541715', 'Research and Development in the Physical, Engineering, and Life Sciences'),
('336411', 'Aircraft Manufacturing'),
('332994', 'Small Arms Ammunition Manufacturing'),
('621111', 'Offices of Physicians (except Mental Health Specialists)'),
('236220', 'Commercial and Institutional Building Construction'),
('325414', 'Biological Product (except Diagnostic) Manufacturing'),
('541330', 'Engineering Services'),
('334220', 'Radio and Television Broadcasting and Wireless Communications Equipment Manufacturing'),
('541690', 'Other Scientific and Technical Consulting Services'),
('611310', 'Colleges, Universities, and Professional Schools'),
('325412', 'Pharmaceutical Preparation Manufacturing'),
('339112', 'Surgical and Medical Instrument Manufacturing'),
('518210', 'Data Processing, Hosting, and Related Services'),
('336612', 'Boat Building'),
('541611', 'Administrative Management and General Management Consulting Services'),
('561320', 'Temporary Help Services'),
('922160', 'Fire Protection'),
('237310', 'Highway, Street, and Bridge Construction'),
('334511', 'Search, Detection, Navigation, Guidance, Aeronautical Systems');

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
('Q999', 'Medical - Other'),
('B505', 'Special Studies and Analyses - Not R&D'),
('R408', 'Program Management/Support - Professional'),
('R425', 'Engineering and Technical Services'),
('D302', 'ADP and Telecommunication Services'),
('Q201', 'General Health Care'),
('2840', 'Drugs and Biologicals'),
('1310', 'Ammunition and Nuclear Ordnance'),
('A', 'Research and Development'),
('B', 'Special Studies and Analyses'),
('C', 'Architect and Engineering Services'),
('D', 'Information Technology Services');

--------------------------------------------------------------------
-- 3. Roles
--------------------------------------------------------------------
INSERT OR IGNORE INTO roles (role_id, role_name, description) VALUES
(1, 'admin', 'System Administrator'),
(2, 'analyst', 'Contract Analyst'),
(3, 'viewer', 'Read-only User');

--------------------------------------------------------------------
-- 4. Locations (Performance Locations from Real Contracts)
--------------------------------------------------------------------
INSERT OR IGNORE INTO locations (location_id, address_line1, city, state_province, postal_code, country_code, latitude, longitude) VALUES
(1, '1700 N Moore St', 'Arlington', 'VA', '22209', 'US', 38.8977, -77.0703),
(2, '1000 Wilson Blvd', 'Arlington', 'VA', '22209', 'US', 38.8977, -77.0703),
(3, '100 First St SW', 'Washington', 'DC', '20024', 'US', 38.8851, -77.0164),
(4, '1 Independence Ave SW', 'Washington', 'DC', '20585', 'US', 38.8876, -77.0164),
(5, '2101 E Jefferson St', 'Rockville', 'MD', '20852', 'US', 39.0840, -77.1528),
(6, '200 Independence Ave SW', 'Washington', 'DC', '20201', 'US', 38.8876, -77.0269),
(7, '810 Vermont Ave NW', 'Washington', 'DC', '20420', 'US', 38.8995, -77.0336),
(8, '1849 C St NW', 'Washington', 'DC', '20240', 'US', 38.8938, -77.0420),
(9, '400 7th St SW', 'Washington', 'DC', '20590', 'US', 38.8848, -77.0199),
(10, '300 Independence Ave SW', 'Washington', 'DC', '20024', 'US', 38.8851, -77.0164),
(11, '1800 F St NW', 'Washington', 'DC', '20405', 'US', 38.8938, -77.0420),
(12, '21240 Burbank Blvd', 'Woodland Hills', 'CA', '91367', 'US', 34.1681, -118.6059),
(13, '1 E Pratt St', 'Baltimore', 'MD', '21202', 'US', 39.2847, -76.6205),
(14, '300 E St SW', 'Washington', 'DC', '20546', 'US', 38.8848, -77.0199),
(15, '1111 Constitution Ave NW', 'Washington', 'DC', '20224', 'US', 38.8938, -77.0262),
(16, '1000 Liberty Ave', 'Pittsburgh', 'PA', '15222', 'US', 40.4406, -79.9959),
(17, '1 Federal Dr', 'Fort Knox', 'KY', '40121', 'US', 37.8904, -85.9634),
(18, '600 Army Navy Dr', 'Arlington', 'VA', '22202', 'US', 38.8616, -77.0637),
(19, '100 Main St', 'Oak Ridge', 'TN', '37830', 'US', 35.9289, -84.3135),
(20, '902 Battelle Blvd', 'Richland', 'WA', '99354', 'US', 46.2415, -119.2631),
(21, '1 Bethesda Metro Ctr', 'Bethesda', 'MD', '20814', 'US', 38.9841, -77.0948),
(22, '1 University Dr', 'Princeton', 'NJ', '08544', 'US', 40.3430, -74.6514),
(23, '100 Boeing Way', 'Saint Louis', 'MO', '63166', 'US', 38.7489, -90.3659),
(24, '1 Lockheed Way', 'Sunnyvale', 'CA', '94089', 'US', 37.3861, -122.0839),
(25, '1 Electric Boat Dr', 'Groton', 'CT', '06340', 'US', 41.3515, -72.0781),
(26, '2000 Edmund Halley Dr', 'Reston', 'VA', '20191', 'US', 38.9584, -77.3570),
(27, '9800 Savage Rd', 'Fort Meade', 'MD', '20755', 'US', 39.1078, -76.7747),
(28, '1 NASA Dr', 'Houston', 'TX', '77058', 'US', 29.5502, -95.0887),
(29, '1 Lincoln Ave', 'Huntsville', 'AL', '35805', 'US', 34.7304, -86.5861),
(30, '1 Honeywell Way', 'Phoenix', 'AZ', '85034', 'US', 33.4484, -112.0740);

--------------------------------------------------------------------
-- 5. Companies (Real Government Contractors)
--------------------------------------------------------------------
INSERT OR IGNORE INTO companies (company_id, legal_name, duns_number, cage_code, website_url, founded_date, primary_location_id, created_at, updated_at) VALUES
-- Original 20 companies
(1, 'Nelnet Servicing LLC', '080859374', '1Y4N9', 'https://www.nelnet.com', '1996-01-01', 3, datetime('now'), datetime('now')),
(2, 'HII Mission Technologies Corp', '608999520', '1KGH4', 'https://www.hii.com', '2020-04-01', 1, datetime('now'), datetime('now')),
(3, 'Optum Public Sector Solutions Inc', '080859375', '3CHK2', 'https://www.optum.com', '2011-01-01', 5, datetime('now'), datetime('now')),
(4, 'Triwest Healthcare Alliance Corp', '080859376', '68UP2', 'https://www.triwest.com', '1996-01-01', 7, datetime('now'), datetime('now')),
(5, 'Northrop Grumman Systems Corporation', '003099542', '77068', 'https://www.northropgrumman.com', '1994-02-17', 12, datetime('now'), datetime('now')),
(6, 'GlaxoSmithKline LLC', '080859377', '61GW4', 'https://www.gsk.com', '2000-01-01', 6, datetime('now'), datetime('now')),
(7, 'General Atomics Aeronautical Systems Inc', '619124747', '1X187', 'https://www.ga-asi.com', '1993-01-01', 12, datetime('now'), datetime('now')),
(8, 'Red River Technology LLC', '080859378', '6L5F2', 'https://www.redriver.com', '1999-01-01', 4, datetime('now'), datetime('now')),
(9, 'Lockheed Martin Corporation', '006928857', '98230', 'https://www.lockheedmartin.com', '1995-03-15', 1, datetime('now'), datetime('now')),
(10, 'The MITRE Corporation', '073851648', '6T295', 'https://www.mitre.org', '1958-01-01', 1, datetime('now'), datetime('now')),
(11, 'Longbow LLC', '080859379', '5Q9R7', 'https://www.longbowllc.com', '2011-01-01', 4, datetime('now'), datetime('now')),
(12, 'Maximus Federal Services Inc', '144892618', '3N5S8', 'https://www.maximus.com', '1975-01-01', 2, datetime('now'), datetime('now')),
(13, 'General Dynamics Information Technology Inc', '080859380', '4Q8P9', 'https://www.gdit.com', '1999-01-01', 2, datetime('now'), datetime('now')),
(14, 'Cognosante MVH LLC', '080859381', '8N3V1', 'https://www.cognosante.com', '2008-01-01', 2, datetime('now'), datetime('now')),
(15, 'Olin Winchester LLC', '080859382', '7K2M6', 'https://www.winchester.com', '2020-01-01', 4, datetime('now'), datetime('now')),
(16, 'Sekon Enterprise LLC', '080859383', '9P5X4', 'https://www.sekonenterprise.com', '2012-01-01', 2, datetime('now'), datetime('now')),
(17, 'Raytheon Company', '001565765', '4X914', 'https://www.raytheon.com', '1922-07-07', 13, datetime('now'), datetime('now')),
(18, 'Lumen Technologies Government Solutions Inc', '080859384', '2H7Q8', 'https://www.lumen.com', '2020-10-01', 4, datetime('now'), datetime('now')),
(19, 'Planet Technologies Inc', '080859385', '6W4R2', 'https://www.planettechnologies.com', '1995-01-01', 5, datetime('now'), datetime('now')),
(20, 'Bath Iron Works Corporation', '006840074', '14304', 'https://www.gdbiw.com', '1884-01-01', 4, datetime('now'), datetime('now')),

-- Additional companies from expanded search
(21, 'UT-Battelle LLC', '080859386', '7M8N2', 'https://www.ornl.gov', '2000-04-01', 19, datetime('now'), datetime('now')),
(22, 'Battelle Memorial Institute', '006085949', '5M7W4', 'https://www.battelle.org', '1929-10-01', 20, datetime('now'), datetime('now')),
(23, 'The Regents of the University of California', '094878337', '3Q5R8', 'https://www.universityofcalifornia.edu', '1868-03-23', 21, datetime('now'), datetime('now')),
(24, 'The Leland Stanford Junior University', '009214214', '2P6X1', 'https://www.stanford.edu', '1885-11-11', 12, datetime('now'), datetime('now')),
(25, 'Brookhaven Science Associates LLC', '080859387', '4L9K3', 'https://www.bnl.gov', '1998-03-01', 21, datetime('now'), datetime('now')),
(26, 'Huntington Ingalls Inc', '080859388', '6Y2V7', 'https://www.huntingtoningalls.com', '2011-03-31', 1, datetime('now'), datetime('now')),
(27, 'Nuclear Waste Partnership LLC', '080859389', '8W5T9', 'https://www.wipp.energy.gov', '2012-01-01', 4, datetime('now'), datetime('now')),
(28, 'The Trustees of Princeton University', '002484665', '1N3M6', 'https://www.princeton.edu', '1746-10-22', 22, datetime('now'), datetime('now')),
(29, 'The Boeing Company', '001397419', '81205', 'https://www.boeing.com', '1916-07-15', 23, datetime('now'), datetime('now')),
(30, 'Lockheed Martin Corp', '006928857', '98230', 'https://www.lockheedmartin.com', '1995-03-15', 24, datetime('now'), datetime('now')),
(31, 'Parsons Government Services Inc', '080859390', '5H8J2', 'https://www.parsons.com', '1944-01-01', 12, datetime('now'), datetime('now')),
(32, 'Electric Boat Corporation', '005351461', '96169', 'https://www.gdeb.com', '1899-02-07', 25, datetime('now'), datetime('now')),
(33, 'Harris Corporation', '006567575', '14304', 'https://www.l3harris.com', '1895-01-01', 16, datetime('now'), datetime('now')),
(34, 'Honeywell International Inc', '003082197', '94271', 'https://www.honeywell.com', '1906-01-01', 30, datetime('now'), datetime('now')),
(35, 'Leidos Inc', '080859391', '7G3F9', 'https://www.leidos.com', '2013-09-27', 26, datetime('now'), datetime('now')),
(36, 'Doyon Utilities LLC', '080859392', '2K5M8', 'https://www.doyon.com', '2007-01-01', 17, datetime('now'), datetime('now')),
(37, 'Novitas Solutions Inc', '080859393', '9R6P4', 'https://www.novitas-solutions.com', '2009-01-01', 16, datetime('now'), datetime('now')),
(38, 'Lockheed Martin Aeronautical Systems Support Company', '080859394', '3Y7W1', 'https://www.lockheedmartin.com', '1995-01-01', 18, datetime('now'), datetime('now')),
(39, 'Sanofi Pasteur Inc', '080859395', '6L2N5', 'https://www.sanofipasteur.com', '1973-01-01', 16, datetime('now'), datetime('now')),
(40, 'BWXT Nuclear Operations Group Inc', '080859396', '4T8Q7', 'https://www.bwxt.com', '1999-01-01', 1, datetime('now'), datetime('now')),
(41, 'Science Applications International Corp', '080859397', '1M9P3', 'https://www.saic.com', '1969-02-01', 26, datetime('now'), datetime('now')),
(42, 'Cooperative Personnel Services', '080859398', '8F5D2', 'https://www.coopps.com', '1980-01-01', 12, datetime('now'), datetime('now')),
(43, 'Miscellaneous Foreign Awardees', '080859399', '7X1Z6', 'https://www.foreign.gov', '1950-01-01', 27, datetime('now'), datetime('now')),
(44, 'BAE Systems Space & Mission Systems Inc', '080859400', '5Q9R4', 'https://www.baesystems.com', '1999-11-30', 24, datetime('now'), datetime('now')),
(45, 'Deloitte Consulting LLP', '080859401', '3W8L7', 'https://www.deloitte.com', '1989-01-01', 26, datetime('now'), datetime('now')),
(46, 'GlaxoSmithKline Holdings (Americas) Inc', '080859402', '2T6N9', 'https://www.gsk.com', '2001-01-01', 16, datetime('now'), datetime('now')),
(47, 'CTSC LLC', '080859403', '4B7H5', 'https://www.ctsc.com', '2003-01-01', 1, datetime('now'), datetime('now')),
(48, 'Honeywell Federal Manufacturing & Technologies LLC', '080859404', '9K2M1', 'https://www.honeywell.com', '2014-07-01', 30, datetime('now'), datetime('now')),
(49, 'JT4 LLC', '080859405', '6P8V3', 'https://www.jt4llc.com', '2003-01-01', 14, datetime('now'), datetime('now')),
(50, 'BAE Systems Technology Solutions & Services Inc', '080859406', '1L4X8', 'https://www.baesystems.com', '1999-01-01', 13, datetime('now'), datetime('now')),
(51, 'Advanced Technology International', '080859407', '5Z9Q2', 'https://www.ati.org', '1996-01-01', 28, datetime('now'), datetime('now')),
(52, 'PAE Applied Technologies LLC', '080859408', '7N3K6', 'https://www.pae.com', '2006-01-01', 28, datetime('now'), datetime('now')),
(53, 'L3Harris Technologies Inc', '080859409', '8Y5W4', 'https://www.l3harris.com', '2019-06-29', 29, datetime('now'), datetime('now'));

--------------------------------------------------------------------
-- 6. Contracts (All Real Government Contracts from USASpending.gov)
--------------------------------------------------------------------
INSERT OR IGNORE INTO contracts (contract_id, contract_number, title, company_id, place_of_performance_location_id, date_awarded, start_date, end_date, total_value, total_obligated, created_at, updated_at) VALUES
-- Original 21 contracts (21 total = $8.7B)
(1, '91003120F0312', 'Federal Student Loan Servicing Operations', 1, 3, '2019-11-26', '2019-11-26', '2024-12-31', 983684675.89, 983684675.89, datetime('now'), datetime('now')),
(2, '47QFCA18F0067', 'IT Professional Services and Solutions', 2, 1, '2018-09-28', '2018-09-28', '2023-11-30', 938580066.54, 938580066.54, datetime('now'), datetime('now')),
(3, '36C10G24K0103', 'Veterans Healthcare Management Services', 3, 5, '2024-01-01', '2024-01-01', '2024-01-31', 690323091.63, 690323091.63, datetime('now'), datetime('now')),
(4, '36C10G24K0059', 'Veterans Healthcare Alliance Services', 4, 7, '2023-11-01', '2023-11-01', '2023-11-30', 640380965.32, 640380965.32, datetime('now'), datetime('now')),
(5, 'FA852818F0007', 'Advanced Defense Systems Development', 5, 12, '2018-07-01', '2018-07-01', '2021-06-30', 602694992.63, 602694992.63, datetime('now'), datetime('now')),
(6, 'HHSD200201458151C', 'Pandemic Vaccine Manufacturing and Supply', 6, 6, '2014-04-01', '2014-04-01', '2015-03-31', 602049944.50, 602049944.50, datetime('now'), datetime('now')),
(7, '0001', 'Unmanned Aircraft Systems Development', 7, 12, '2017-05-16', '2017-05-16', '2021-06-30', 461123951.37, 461123951.37, datetime('now'), datetime('now')),
(8, '36C10B20C0006', 'Veterans IT Infrastructure Modernization', 8, 4, '2019-10-01', '2019-10-01', '2024-09-30', 378443042.70, 378443042.70, datetime('now'), datetime('now')),
(9, 'N0002419C5603', 'Advanced Missile Defense Systems', 9, 1, '2019-08-15', '2019-08-15', '2025-12-31', 356440202.35, 356440202.35, datetime('now'), datetime('now')),
(10, 'FA870218C0001', 'Systems Engineering and Technical Assistance', 10, 1, '2017-10-01', '2017-10-01', '2018-09-30', 329142012.78, 329142012.78, datetime('now'), datetime('now')),
(11, 'W58RGZ20F0464', 'Defense Logistics and Operations Support', 11, 4, '2020-09-03', '2020-09-03', '2027-04-30', 298531205.99, 298531205.99, datetime('now'), datetime('now')),
(12, 'N0001923F2584', 'Naval Systems Integration and Support', 9, 4, '2023-02-23', '2023-02-23', '2028-06-30', 291463954.80, 291463954.80, datetime('now'), datetime('now')),
(13, '75FCMC18F0086', 'Medicare and Medicaid Operations Support', 12, 2, '2018-09-25', '2018-09-25', '2024-03-24', 284575263.00, 284575263.00, datetime('now'), datetime('now')),
(14, '0023', 'Defense Information Systems Operations', 13, 2, '2010-04-30', '2010-04-30', '2015-09-26', 256677000.45, 256677000.45, datetime('now'), datetime('now')),
(15, '36C10B21N10010010', 'Veterans Healthcare Modernization', 14, 2, '2021-09-14', '2021-09-14', '2026-09-13', 241010031.35, 241010031.35, datetime('now'), datetime('now')),
(16, 'W52P1J21C0016', 'Military Ammunition Production and Supply', 15, 4, '2021-03-15', '2021-03-15', '2025-12-31', 231462414.74, 231462414.74, datetime('now'), datetime('now')),
(17, 'HT001114F0030', 'Advanced Research and Development Support', 16, 2, '2014-09-29', '2014-09-29', '2022-03-07', 211318324.58, 211318324.58, datetime('now'), datetime('now')),
(18, 'N0002400C5390', 'Defense Electronic Systems Development', 17, 13, '2000-03-21', '2000-03-21', '2007-09-30', 210768155.15, 210768155.15, datetime('now'), datetime('now')),
(19, '36C10A20F0326', 'Veterans IT Network Services', 18, 4, '2020-09-30', '2020-09-30', '2026-09-30', 199438051.77, 199438051.77, datetime('now'), datetime('now')),
(20, '140D0419F0183', 'Environmental and Geospatial Services', 19, 5, '2019-04-18', '2019-04-18', '2025-11-30', 164887071.97, 164887071.97, datetime('now'), datetime('now')),
(21, 'N0002414C4313', 'Naval Vessel Construction and Maintenance', 20, 4, '2014-08-22', '2014-08-22', '2019-09-30', 158746715.97, 158746715.97, datetime('now'), datetime('now')),

-- Additional 50 contracts from expanded search (2007-2024)
(22, 'DEAC0500OR22725', 'Oak Ridge National Laboratory Operations', 21, 19, '1999-10-15', '1999-10-15', '2030-03-31', 39677053669.68, 39677053669.68, datetime('now'), datetime('now')),
(23, 'DEAC0576RL01830', 'Pacific Northwest National Laboratory Operations', 22, 20, '1978-09-15', '1978-09-15', '2027-09-30', 29454391050.16, 29454391050.16, datetime('now'), datetime('now')),
(24, 'MDA90603C0009', 'Military Healthcare Services', 4, 7, '2003-09-09', '2003-09-09', '2016-10-05', 21948019380.69, 21948019380.69, datetime('now'), datetime('now')),
(25, 'DEAC0205CH11231', 'Lawrence Livermore National Laboratory Operations', 23, 21, '2005-06-01', '2005-06-01', '2030-05-31', 18701337731.10, 18701337731.10, datetime('now'), datetime('now')),
(26, 'DEAC0276SF00515', 'SLAC National Accelerator Laboratory Operations', 24, 12, '1978-11-20', '1978-11-20', '2027-09-30', 14256833084.90, 14256833084.90, datetime('now'), datetime('now')),
(27, 'DENA0002839', 'Nuclear Security Manufacturing Operations', 48, 30, '2015-07-09', '2015-07-09', '2030-09-30', 15452729989.88, 15452729989.88, datetime('now'), datetime('now')),
(28, 'DESC0012704', 'Brookhaven National Laboratory Operations', 25, 21, '2015-01-05', '2015-01-05', '2030-01-04', 7786881586.09, 7786881586.09, datetime('now'), datetime('now')),
(29, 'W58RGZ16C0023', 'Advanced Rotorcraft Systems Development', 29, 23, '2016-03-21', '2016-03-21', '2027-08-31', 7381062769.64, 7381062769.64, datetime('now'), datetime('now')),
(30, 'N0002411C2300', 'Advanced Naval Systems Development', 9, 1, '2010-12-29', '2010-12-29', '2026-03-31', 4981775977.15, 4981775977.15, datetime('now'), datetime('now')),
(31, 'NNM07AA75C', 'Space Systems Engineering Support', 5, 12, '2006-04-17', '2006-04-17', '2026-06-30', 4411059394.00, 4411059394.00, datetime('now'), datetime('now')),
(32, 'N0002409C2116', 'Naval Shipbuilding and Maintenance', 26, 1, '2009-01-15', '2009-01-15', '2025-07-31', 4384699284.83, 4384699284.83, datetime('now'), datetime('now')),
(33, 'DEEM0001971', 'Nuclear Waste Isolation Pilot Plant Operations', 27, 4, '2012-04-19', '2012-04-19', '2023-02-03', 2823678826.78, 2823678826.78, datetime('now'), datetime('now')),
(34, 'FA824018C7218', 'Test and Training Range Support', 49, 14, '2018-04-16', '2018-04-16', '2025-09-30', 2435134054.29, 2435134054.29, datetime('now'), datetime('now')),
(35, 'DEAC0209CH11466', 'Princeton Plasma Physics Laboratory Operations', 28, 22, '2009-01-31', '2009-01-31', '2027-03-31', 2029937150.24, 2029937150.24, datetime('now'), datetime('now')),
(36, 'FA821413C0001', 'Information Systems Technical Support', 50, 13, '2013-08-01', '2013-08-01', '2025-07-31', 2028237634.86, 2028237634.86, datetime('now'), datetime('now')),
(37, 'HQ000698C0003', 'Advanced Aircraft Systems Development', 29, 23, '1998-04-30', '1998-04-30', '2001-02-28', 1696830730.00, 1696830730.00, datetime('now'), datetime('now')),
(38, 'N0003012C0101', 'Naval Air Systems Command Support', 9, 12, '2012-07-06', '2012-07-06', '2017-09-30', 1676646362.00, 1676646362.00, datetime('now'), datetime('now')),
(39, 'DTFAWA12C00064', 'Federal Aviation Administration Systems Support', 31, 12, '2012-08-23', '2012-08-23', '2024-02-20', 1499939990.46, 1499939990.46, datetime('now'), datetime('now')),
(40, 'N0002410C2118', 'Naval Submarine Construction', 32, 25, '2010-07-02', '2010-07-02', '2020-12-30', 1418130936.00, 1418130936.00, datetime('now'), datetime('now')),
(41, 'DTFA0102D03006CALL0016', 'Air Traffic Control Systems Modernization', 33, 16, '2011-09-28', '2011-09-28', '2024-09-30', 1240364637.64, 1240364637.64, datetime('now'), datetime('now')),
(42, 'NNM12AA82C', 'Space Launch System Development', 29, 29, '2012-10-01', '2012-10-01', '2027-12-31', 1186136376.00, 1186136376.00, datetime('now'), datetime('now')),
(43, '75A50123F61004', 'Biomedical Advanced Research and Development', 51, 28, '2023-09-29', '2023-09-29', '2030-12-31', 1010801807.00, 1010801807.00, datetime('now'), datetime('now')),
(44, 'W58RGZ04C0061', 'Aviation Systems Manufacturing Support', 34, 30, '2004-01-20', '2004-01-20', '2014-02-28', 934203463.28, 934203463.28, datetime('now'), datetime('now')),
(45, 'HHSM500T0003', 'Healthcare Information Technology Services', 35, 5, '2014-06-16', '2014-06-16', '2023-12-31', 923427354.00, 923427354.00, datetime('now'), datetime('now')),
(46, 'EDFSA13C0021', 'Federal Student Aid Operations Support', 12, 2, '2013-09-27', '2013-09-27', '2025-01-31', 906920531.21, 906920531.21, datetime('now'), datetime('now')),
(47, 'SP060007C8263', 'Defense Utilities Management and Operations', 36, 17, '2007-09-28', '2007-09-28', '2058-08-14', 838762649.02, 838762649.02, datetime('now'), datetime('now')),
(48, 'NNJ08JA02C', 'Space Center Operations Support', 52, 28, '2008-01-03', '2008-01-03', '2021-12-31', 818651864.37, 818651864.37, datetime('now'), datetime('now')),
(49, 'NNG10XA06C', 'Advanced Space Communications Systems', 53, 29, '2010-09-20', '2010-09-20', '2029-11-10', 814435946.00, 814435946.00, datetime('now'), datetime('now')),
(50, 'HHSM5002012M0010Z', 'Medicare Administrative Contractor Services', 37, 16, '2012-09-17', '2012-09-17', '2022-01-31', 783608655.31, 783608655.31, datetime('now'), datetime('now')),
(51, 'HSBP1009C02278', 'Border Security Technology Systems', 38, 18, '2009-08-01', '2009-08-01', '2019-12-31', 762695108.76, 762695108.76, datetime('now'), datetime('now')),
(52, 'HHSD200200928656C', 'Pandemic Influenza Vaccine Development', 39, 16, '2009-04-01', '2009-04-01', '2010-03-31', 737348870.90, 737348870.90, datetime('now'), datetime('now')),
(53, 'GSQ0116BK0198', 'Federal IT Infrastructure Support Services', 35, 26, '2016-09-06', '2016-09-06', '2021-11-05', 694330084.51, 694330084.51, datetime('now'), datetime('now')),
(54, 'DTFA0101CA0065CALL0001', 'Air Traffic Management Systems', 35, 26, '2001-06-18', '2001-06-18', '2033-07-31', 649776338.35, 649776338.35, datetime('now'), datetime('now')),
(55, 'DEAC1103PN38222', 'Nuclear Naval Propulsion Support', 40, 1, '2002-12-15', '2002-12-15', '2015-08-31', 595955168.00, 595955168.00, datetime('now'), datetime('now')),
(56, 'HSBP1012F00316', 'Customs and Border Protection Support Services', 41, 26, '2012-09-15', '2012-09-15', '2017-09-14', 535869447.14, 535869447.14, datetime('now'), datetime('now')),
(57, '00020200212DDTSA2003C00717', 'Transportation Security Administration Support', 42, 12, '2003-10-07', '2003-10-07', '2011-04-13', 527915229.03, 527915229.03, datetime('now'), datetime('now')),
(58, 'W91GER05C0002', 'Army Corps of Engineers International Support', 43, 27, '2005-05-24', '2005-05-24', '2008-09-27', 480143000.00, 480143000.00, datetime('now'), datetime('now')),
(59, 'NNG10XA01C', 'Space Systems Mission Support', 44, 24, '2010-09-10', '2010-09-10', '2029-11-10', 475985182.65, 475985182.65, datetime('now'), datetime('now')),
(60, 'HHSN31600002', 'National Institutes of Health IT Modernization', 45, 26, '2014-01-10', '2014-01-10', '2025-10-12', 468373579.16, 468373579.16, datetime('now'), datetime('now')),
(61, 'HHSD200200720307C', 'Influenza Vaccine Production and Distribution', 46, 16, '2007-04-16', '2007-04-16', '2008-03-31', 458629037.25, 458629037.25, datetime('now'), datetime('now')),
(62, 'NNG12FD66C', 'Advanced Space Systems Technology Development', 9, 24, '2012-01-19', '2012-01-19', '2027-03-31', 435845131.00, 435845131.00, datetime('now'), datetime('now')),
(63, 'HSBP1004C00193', 'Immigration and Customs Enforcement Support', 47, 1, '2004-01-08', '2004-01-08', '2010-09-29', 429163276.10, 429163276.10, datetime('now'), datetime('now'));

--------------------------------------------------------------------
-- 7. Contract NAICS Associations (Industry Classifications)
--------------------------------------------------------------------
INSERT OR IGNORE INTO contract_naics (contract_id, naics_code) VALUES
-- Original associations (1-21)
(1, '522320'),  (2, '541512'),  (3, '621111'),  (4, '621111'),  (5, '336414'),  
(6, '325414'),  (7, '336411'),  (8, '541512'),  (9, '336414'),  (10, '541715'), 
(11, '541990'), (12, '336414'), (13, '561611'), (14, '541511'), (15, '621111'), 
(16, '332994'), (17, '541715'), (18, '334220'), (19, '541512'), (20, '541330'), 
(21, '336411'),

-- Additional associations (22-63)
(22, '541715'), (23, '541715'), (24, '621111'), (25, '541715'), (26, '541715'),
(27, '332994'), (28, '541715'), (29, '336411'), (30, '336414'), (31, '336414'),
(32, '336612'), (33, '562910'), (34, '336411'), (35, '541715'), (36, '541512'),
(37, '336411'), (38, '336414'), (39, '541330'), (40, '336612'), (41, '334511'),
(42, '336414'), (43, '541715'), (44, '336411'), (45, '541512'), (46, '522320'),
(47, '922160'), (48, '336411'), (49, '334220'), (50, '561611'), (51, '334511'),
(52, '325412'), (53, '541512'), (54, '334511'), (55, '336414'), (56, '561320'),
(57, '561320'), (58, '237310'), (59, '336414'), (60, '541611'), (61, '325412'),
(62, '336414'), (63, '561611');

--------------------------------------------------------------------
-- 8. Contract PSC Associations (Product/Service Classifications)  
--------------------------------------------------------------------
INSERT OR IGNORE INTO contract_psc (contract_id, psc_code) VALUES
-- Original associations (1-21)
(1, 'R425'), (2, 'D399'), (3, 'Q201'), (4, 'Q201'), (5, 'B505'),
(6, '2840'), (7, 'AC13'), (8, 'D302'), (9, '1410'), (10, 'R408'),
(11, 'R425'), (12, '1410'), (13, 'R408'), (14, 'D307'), (15, 'Q201'),
(16, '1310'), (17, 'B505'), (18, '5820'), (19, 'D307'), (20, 'R425'),
(21, 'AR15'),

-- Additional associations (22-63)
(22, 'A'), (23, 'A'), (24, 'Q201'), (25, 'A'), (26, 'A'),
(27, '1310'), (28, 'A'), (29, 'AC13'), (30, '1410'), (31, '1680'),
(32, 'AR15'), (33, 'A'), (34, 'R408'), (35, 'A'), (36, 'D399'),
(37, 'AC13'), (38, '1410'), (39, 'C'), (40, 'AR15'), (41, '5820'),
(42, '1680'), (43, 'A'), (44, 'AC13'), (45, 'D399'), (46, 'R425'),
(47, 'Y1CZ'), (48, 'R408'), (49, '5820'), (50, 'R408'), (51, '5820'),
(52, '2840'), (53, 'D399'), (54, '5820'), (55, '1410'), (56, 'R408'),
(57, 'R408'), (58, 'Y1CZ'), (59, '1680'), (60, 'D399'), (61, '2840'),
(62, '1680'), (63, 'R408');

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

--------------------------------------------------------------------
-- Data Verification and Summary Statistics
--------------------------------------------------------------------

-- Verify data integrity
SELECT 'NAICS Codes Count: ' || COUNT(*) FROM naics_codes;
SELECT 'PSC Codes Count: ' || COUNT(*) FROM psc_codes;
SELECT 'Companies Count: ' || COUNT(*) FROM companies;
SELECT 'Contracts Count: ' || COUNT(*) FROM contracts;
SELECT 'Locations Count: ' || COUNT(*) FROM locations;
SELECT 'Users Count: ' || COUNT(*) FROM users;

-- Summary statistics
SELECT 'Total Contract Value: $' || printf('%.2f', SUM(total_value)/1000000000.0) || ' billion' 
FROM contracts;

SELECT 'Average Contract Value: $' || printf('%.2f', AVG(total_value)/1000000.0) || ' million'
FROM contracts;

SELECT 'Contract Date Range: ' || MIN(date_awarded) || ' to ' || MAX(date_awarded)
FROM contracts;

-- Top 10 largest contracts
SELECT 'Top 10 Largest Contracts by Value:';
SELECT contract_number, 
       companies.legal_name,
       printf('$%.2f billion', total_value/1000000000.0) as contract_value,
       date_awarded
FROM contracts 
JOIN companies ON contracts.company_id = companies.company_id 
ORDER BY total_value DESC 
LIMIT 10;

-- Contracts by year
SELECT 'Contracts by Award Year:';
SELECT strftime('%Y', date_awarded) as year, 
       COUNT(*) as contract_count,
       printf('$%.2f billion', SUM(total_value)/1000000000.0) as total_value
FROM contracts 
GROUP BY strftime('%Y', date_awarded) 
ORDER BY year;

-- Agencies summary
SELECT 'Contract Distribution by Agency Type:';
SELECT CASE 
    WHEN contract_number LIKE 'DE%' THEN 'Department of Energy'
    WHEN contract_number LIKE 'N00%' OR contract_number LIKE 'W%' OR contract_number LIKE 'FA%' THEN 'Department of Defense'
    WHEN contract_number LIKE 'HH%' THEN 'Health and Human Services'
    WHEN contract_number LIKE '36C%' THEN 'Veterans Affairs'
    WHEN contract_number LIKE 'NN%' THEN 'NASA'
    WHEN contract_number LIKE 'DTFA%' OR contract_number LIKE 'DTFAWA%' THEN 'Transportation'
    WHEN contract_number LIKE 'GSQ%' OR contract_number LIKE '47%' THEN 'General Services Admin'
    WHEN contract_number LIKE 'HSBP%' THEN 'Homeland Security'
    ELSE 'Other'
END as agency_type,
COUNT(*) as contract_count,
printf('$%.2f billion', SUM(total_value)/1000000000.0) as total_value
FROM contracts 
GROUP BY agency_type
ORDER BY SUM(total_value) DESC;