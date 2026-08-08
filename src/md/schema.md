## What is a database schema?
- The blueprint for our entire nonprofits memory
- All our data goes into encrypted SQL tables (using industry-standard AEAD algorithms). The architecture for these tables is our Schema.

---

## Why do we need this detailed of a schema?
- We are running a nonprofit, a trades school, a construction company, and a grant-funded entity all at once
- Grantors don't just give us money and walk away, they love financial reports and we this schema provides the data organization to provide reports
- Instead of using QuickBooks for money, Airtable for clients, and Google Sheets for hours, everything lives in one encrypted SQL database
- This data lets us run a query to:
    - Identify our monthly burn rate to know exactly where our money is going
    - Tell an apprentice how many hours they have left until they reach their 4-year CSLB requirement
    - Identify how many low-income households we've helped this quarter, for grants that want us helping this cohort of our community
    - Identify our remaining mentor grant budget before we say yes to a homeowner, so we never bankrupt ourself by being too ambitious

---

## Person
Store all people in our system (students, mentors, customers, trustees, board members, employees, vendors, etc.,)

| Field     | Type    | Constraints               |
|-----------|---------|---------------------------|
| id        | INTEGER | PK, AI                    |
| firstName | TEXT    | NOT NULL                  |
| lastName  | TEXT    | NOT NULL                  |
| contactId | INTEGER | FK &rarr; **Contact(id)** |

---

## Contact
Store contact details for each **Person**

| Field                    | Type    | Constraints |
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

| Field    | Type    | Constraints              |
|----------|---------|--------------------------|
| id       | INTEGER | PK, AI                   |
| message  | TEXT    | NOT NULL                 |
| personId | INTEGER | FK &rarr; **Person(id)** |
