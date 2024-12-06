-- Fetch All Club Officers
SELECT 
    s.student_id,
    s.first_name,
    s.last_name,
    s.email,
    s.phone_number,
    r.role_id,
    r.role_name,
    r.role_description
FROM
    STUDENTS S
JOIN
    CLUBROLES CR ON CR.student_id = S.student_id
JOIN
    ROLES R ON CR.role_id = r.role_id
WHERE
    CR.club_id = 1;

-- -- Add a Sponsor with Contribution
BEGIN TRANSACTION;
INSERT INTO Sponsors (sponsor_name, contact_person, contact_email, phone_number, address)
VALUES 
    ('Canes', 'Canes Dog', 'canes.dog@canes.com', '337-342-1231', '123 Canes Road, Fried Chicken City');
INSERT INTO SponsorshipContribution (sponsor_id, club_id, contribution_amount, contribution_date)
VALUES 
    (LAST_INSERT_ROWID(), 1, 5000, '2024-12-01');

COMMIT;

-- Fetch Expenses Within a Fiscal Year
SELECT 
    expense_id,
    expense_name,
    expense_amount,
    expense_date,
    description,
    category
FROM 
    Expenses
WHERE 
    club_id = 1
    AND expense_date BETWEEN '2026-01-01' AND '2026-12-31';

-- Add a New Member and Assign a Role
BEGIN TRANSACTION;
INSERT INTO Students (student_id, first_name, last_name, email, phone_number, major, graduation_year)
VALUES 
    ('S12345', 'Carl', 'Jacobs', 'carl.jacobs@university.edu', '987-444-3232', 'Computer Science', 2025);
INSERT INTO Membership (club_id, student_id, active_status)
VALUES 
    (1, 'S12345', 'Active');
INSERT INTO ClubRoles (club_id, student_id, role_id)
VALUES 
    (1, 'S12345', 2);

COMMIT;

-- Search Sponsors by Contribution Date
SELECT 
    S.sponsor_id,
    S.sponsor_name,
    S.contact_person,
    S.contact_email,
    S.phone_number,
    S.address,
    SC.contribution_amount,
    SC.contribution_date
FROM 
    Sponsors S
JOIN 
    SponsorshipContribution SC ON S.sponsor_id = SC.sponsor_id
WHERE 
    SC.club_id = 1
    AND SC.contribution_date BETWEEN '2024-01-01' AND '2024-12-31';