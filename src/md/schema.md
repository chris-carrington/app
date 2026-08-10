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

| Field     | Type    | Notes                               |
|-----------|---------|-------------------------------------|
| id        | INTEGER | PK, AI                              |
| contactId | INTEGER | NOT NULL, FK &rarr; **Contact(id)** |
| firstName | TEXT    | NOT NULL                            |
| lastName  | TEXT    | NOT NULL                            |

---

## Contact
Store contact details for each **Person**

| Field                    | Type    | Notes                  |
|--------------------------|---------|------------------------|
| id                       | INTEGER | PK, AI                 |
| email                    | TEXT    | NOT NULL, UNIQUE INDEX |
| sendNewsletter           | BOOLEAN | DEFAULT = 1            |
| sendJobOpportunityEmails | BOOLEAN | DEFAULT = 0            |
| phoneNumber              | TEXT    | NULLABLE               |
| sendJobOpportunityTexts  | BOOLEAN | DEFAULT = 0            |
| sendServiceEmails        | BOOLEAN | DEFAULT = 0            |
| -                        | -       | INDEX(email)           |

---

## ContactUsMessage
Store messages that are filled out with our Contact Us website form

| Field     | Type     | Notes                              |
|-----------|----------|------------------------------------|
| id        | INTEGER  | PK, AI                             |
| personId  | INTEGER  | NOT NULL, FK &rarr; **Person(id)** |
| message   | TEXT     | NOT NULL                           |
| createdAt | DATETIME | NOT NULL, DEFAULT = NOW            |

---

## Trade
Trades lookup table

| Field    | Type    | Notes       |
|----------|---------|-------------|
| id       | INTEGER | PK, AI      |
| value    | TEXT    | NOT NULL    |
| isActive | BOOLEAN | DEFAULT = 1 |

---

## Job
Store all work projects

| Field       | Type     | Notes                                 |
|-------------|----------|---------------------------------------|
| id          | INTEGER  | PK, AI                                |
| statusId    | INTEGER  | NOT NULL, FK &rarr; **JobStatus(id)** |
| description | TEXT     | NULLABLE                              |
| address     | TEXT     | NOT NULL                              |
| createdAt   | DATETIME | NOT NULL, DEFAULT = NOW               |

---

## Job__Client
Junction table between **Job** & **Person** (Client)

| Field    | Type    | Notes                                     |
|----------|---------|-------------------------------------------|
| id       | INTEGER | PK, AI                                    |
| jobId    | INTEGER | INDEX, NOT NULL, FK &rarr; **Job(id)**    |
| clientId | INTEGER | INDEX, NOT NULL, FK &rarr; **Person(id)** |
| -        | -       | UNIQUE(jobId, clientId)                   |

---

## JobStatus
Job status lookup table

| Field    | Type    | Notes       |
|----------|---------|-------------|
| id       | INTEGER | PK, AI      |
| value    | TEXT    | NOT NULL    |
| isActive | BOOLEAN | DEFAULT = 1 |

---

## ServiceLead
Store entries from our service request form

| Field       | Type     | Notes                                  |
|-------------|----------|----------------------------------------|
| id          | INTEGER  | PK, AI                                 |
| personId    | INTEGER  | NOT NULL, FK &rarr; **Person(id)**     |
| statusId    | INTEGER  | NOT NULL, FK &rarr; **LeadStatus(id)** |
| jobId       | INTEGER  | NULLABLE, FK &rarr; **Job(id)**        |
| description | TEXT     | NOT NULL                               |
| createdAt   | DATETIME | NOT NULL, DEFAULT = NOW                |

---

## LeadStatus
Lead status lookup table

| Field    | Type    | Notes       |
|----------|---------|-------------|
| id       | INTEGER | PK, AI      |
| value    | TEXT    | NOT NULL    |
| isActive | BOOLEAN | DEFAULT = 1 |

---

## Trade__ServiceLead
Junction table between **Trade** & **ServiceLead**

| Field         | Type    | Notes                                          |
|---------------|---------|------------------------------------------------|
| id            | INTEGER | PK, AI                                         |
| tradeId       | INTEGER | INDEX, NOT NULL, FK &rarr; **Trade(id)**       |
| serviceLeadId | INTEGER | INDEX, NOT NULL, FK &rarr; **ServiceLead(id)** |
| -             | -       | UNIQUE(tradeId, serviceLeadId)                 |

---

## StaffLead
Store entries from our staff interest form

| Field           | Type     | Notes                                     |
|-----------------|----------|-------------------------------------------|
| id              | INTEGER  | PK, AI                                    |
| personId        | INTEGER  | NOT NULL, FK &rarr; **Person(id)**        |
| statusId        | INTEGER  | NOT NULL, FK &rarr; **LeadStatus(id)**    |
| positionId      | INTEGER  | NOT NULL, FK &rarr; **StaffPosition(id)** |
| createdAt       | DATETIME | NOT NULL, DEFAULT = NOW                   |

---

## StaffPosition
Staff position lookup table

| Field    | Type    | Notes       |
|----------|---------|-------------|
| id       | INTEGER | PK, AI      |
| value    | TEXT    | NOT NULL    |
| isActive | BOOLEAN | DEFAULT = 1 |
| isHiring | BOOLEAN | DEFAULT = 1 |

---

## StaffTemporal
Store people's employment periods

| Field       | Type     | Notes                                      |
|-------------|----------|--------------------------------------------|
| id          | INTEGER  | PK, AI                                     |
| personId    | INTEGER  | NOT NULL, FK &rarr; **Person(id)**         |
| positionId  | INTEGER  | NOT NULL, FK &rarr; **StaffPosition(id)**  |
| endReasonId | INTEGER  | NULLABLE, FK &rarr; **StaffEndReason(id)** |
| startDate   | DATETIME | NOT NULL                                   |
| endDate     | DATETIME | NULLABLE                                   |

---

## StaffEndReason
Staff end reason lookup table

| Field    | Type    | Notes       |
|----------|---------|-------------|
| id       | INTEGER | PK, AI      |
| value    | TEXT    | NOT NULL    |
| isActive | BOOLEAN | DEFAULT = 1 |
