## What is a database?
- Organized collection of information

---

## What is SQL?
- The most popular database programming language

---

## What is a database schema?
- All our data goes into an encrypted SQL database. The **architecture** for this database is our schema.

---

## Why do we need this detailed of a schema?
- We are running a trades school, a construction company and a grant-funded nonprofit all at once
- Grantors don't just give money and walk away
    - They love financial reports and this schema helps us organize our data so we may provide these reports
- Instead of using QuickBooks for money, Airtable for clients, and Google Sheets for hours, everything lives in one encrypted SQL database
- Example queries we may run thanks to this schema:
    - Identify our remaining budget before we say yes to any job
    - Identify and restrict specific grant funds to specific liabilities
    - Tell an apprentice how many hours they have left until they reach their 4-year CSLB requirement
    - Identify how many low-income, medium-income and/or senior citizen households we've helped this quarter, for grants that want us helping this cohort of our community

---

## Person
Store all people in our system (students, mentors, customers, trustees, board members, employees, vendors, etc.,)

| Field     | Type    | Notes                     |
|-----------|---------|---------------------------|
| id        | INTEGER | PK, AI                    |
| firstName | TEXT    | NOT NULL                  |
| lastName  | TEXT    | NOT NULL                  |
| contactId | INTEGER | FK &rarr; **Contact(id)** |

---

## Contact
Store contact details for each **Person**

| Field                    | Type    | Notes       |
|--------------------------|---------|-------------|
| id                       | INTEGER | PK, AI      |
| email                    | TEXT    | UNIQUE      |
| sendNewsletter           | BOOLEAN | DEFAULT = 1 |
| sendJobOpportunityEmails | BOOLEAN | DEFAULT = 0 |
| phoneNumber              | TEXT    |             |
| sendJobOpportunityTexts  | BOOLEAN | DEFAULT = 0 |

---

## ContactUsMessage
Store messages that are filled out with our Contact Us website form

| Field    | Type    | Notes                    |
|----------|---------|--------------------------|
| id       | INTEGER | PK, AI                   |
| message  | TEXT    | NOT NULL                 |
| personId | INTEGER | FK &rarr; **Person(id)** |
