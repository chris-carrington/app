<!--{"accordionStart":true}-->
## What is a database, what is SQL and what is a database schema?
<!--{"accordionBody":true}-->
- A database is an organized collection of information
- SQL is the most popular database programming language
- A database schema defines how database information is organized (tables, rows, indexes, etc.)
    - All our data goes into an encrypted SQL database
    - The **architecture** of this database is a schema
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## Why do we need this detailed of a schema?
<!--{"accordionBody":true}-->
- We are running a trades school, a construction company and a grant-funded nonprofit all at once
- Grantors don't just give money and walk away
    - They love financial reports and this schema helps us organize our data so we may provide these reports
- Instead of using QuickBooks for money, Airtable for clients, and Google Sheets for hours, everything lives in one encrypted SQL database
- Example queries we may run thanks to this schema:
    - Identify and restrict specific grant funds to specific liabilities
    - Tell an apprentice how many hours they have left until they reach their 4-year CSLB requirement
    - Identify how many low-income, medium-income and/or senior citizen households we've helped this quarter, for grants that love helping specific cohorts of our community
<!--{"accordionEnd":true}-->


---

# Database Schema 

<!--{"accordionStart":true}-->
## Person
<!--{"accordionBody":true}-->
Store all people in our system (students, mentors, customers, Trustees, Board members, employees, vendors, etc.)

| Field     | Type    | Notes                 |
|-----------|---------|-----------------------|
| id        | INTEGER | PK, AI                |
| firstName | TEXT    | NOT NULL              |
| lastName  | TEXT    | NOT NULL              |
| isActive  | BOOLEAN | NOT NULL, DEFAULT = 1 |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## Contact
<!--{"accordionBody":true}-->
Store contact details for each **Person**

| Field                    | Type    | Notes                                                            |
|--------------------------|---------|------------------------------------------------------------------|
| id                       | INTEGER | PK, AI                                                           |
| personId                 | INTEGER | UNIQUE INDEX, NOT NULL, FK &rarr; **Person(id)**, CASCADE DELETE |
| email                    | TEXT    | UNIQUE INDEX, NOT NULL                                           |
| emailVerified            | BOOLEAN | DEFAULT = 0                                                      |
| sendNewsletter           | BOOLEAN | DEFAULT = 1                                                      |
| sendJobOpportunityEmails | BOOLEAN | DEFAULT = 0                                                      |
| phoneNumber              | TEXT    | NULLABLE                                                         |
| phoneNumberVerified      | BOOLEAN | DEFAULT = 0                                                      |
| sendJobOpportunityTexts  | BOOLEAN | DEFAULT = 0                                                      |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## Session
<!--{"accordionBody":true}-->
Stores authentication details between a **Person** and our application

| Field           | Type     | Notes                                                     |
|-----------------|----------|-----------------------------------------------------------|
| id              | INTEGER  | PK, AI                                                    |
| personId        | INTEGER  | INDEX, NOT NULL, FK &rarr; **Person(id)**, CASCADE DELETE |
| expiresAt       | DATETIME | NOT NULL                                                  |
| createdAt       | DATETIME | NOT NULL                                                  |
| ipAddress       | TEXT     | NOT NULL                                                  |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## MagicToken
<!--{"accordionBody":true}-->
Before a **Session** is created we send a **Person** an email w/ a **MagicToken** (*passwordless / magic link authentication*)

| Field     | Type     | Notes                                                     |
|-----------|----------|-----------------------------------------------------------|
| id        | INTEGER  | PK, AI                                                    |
| personId  | INTEGER  | INDEX, NOT NULL, FK &rarr; **Person(id)**, CASCADE DELETE |
| tokenHash | TEXT     | INDEX, NOT NULL                                           |
| expiresAt | DATETIME | NOT NULL                                                  |
| used      | BOOLEAN  | NOT NULL, DEFAULT = 0                                     |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## ContactUsMessage
<!--{"accordionBody":true}-->
Store messages that are filled out with our Contact Us website form

| Field     | Type     | Notes                                              |
|-----------|----------|----------------------------------------------------|
| id        | INTEGER  | PK, AI                                             |
| personId  | INTEGER  | NOT NULL, FK &rarr; **Person(id)**, CASCADE DELETE |
| message   | TEXT     | NOT NULL                                           |
| createdAt | DATETIME | NOT NULL, DEFAULT = NOW                            |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## Trade
<!--{"accordionBody":true}-->
Trades lookup table

| Field    | Type    | Notes                 |
|----------|---------|-----------------------|
| id       | INTEGER | PK, AI                |
| value    | TEXT    | NOT NULL              |
| isActive | BOOLEAN | NOT NULL, DEFAULT = 1 |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## Job
<!--{"accordionBody":true}-->
Store all work projects

| Field       | Type     | Notes                                        |
|-------------|----------|----------------------------------------------|
| id          | INTEGER  | PK, AI                                       |
| statusId    | INTEGER  | INDEX, NOT NULL, FK &rarr; **JobStatus(id)** |
| description | TEXT     | NULLABLE                                     |
| address     | TEXT     | NOT NULL                                     |
| createdAt   | DATETIME | NOT NULL, DEFAULT = NOW                      |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## Job__Trade
<!--{"accordionBody":true}-->
Junction table between **Job** & **Trade**

| Field         | Type    | Notes                                           |
|---------------|---------|-------------------------------------------------|
| id            | INTEGER | PK, AI                                          |
| jobId         | INTEGER | NOT NULL, FK &rarr; **Job(id)**, CASCADE DELETE |
| tradeId       | INTEGER | INDEX, NOT NULL, FK &rarr; **Trade(id)**        |
| -             | -       | UNIQUE(jobId, tradeId)                          |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## Job__Client
<!--{"accordionBody":true}-->
Junction table between **Job** & **Person** (Client)

| Field    | Type    | Notes                                                     |
|----------|---------|-----------------------------------------------------------|
| id       | INTEGER | PK, AI                                                    |
| jobId    | INTEGER | NOT NULL, FK &rarr; **Job(id)**, CASCADE DELETE           |
| clientId | INTEGER | INDEX, NOT NULL, FK &rarr; **Person(id)**, CASCADE DELETE |
| -        | -       | UNIQUE(jobId, clientId)                                   |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## JobStatus
<!--{"accordionBody":true}-->
Job status lookup table

| Field       | Type    | Notes                 |
|-------------|---------|-----------------------|
| id          | INTEGER | PK, AI                |
| value       | TEXT    | NOT NULL              |
| description | TEXT    | NOT NULL              |
| isActive    | BOOLEAN | NOT NULL, DEFAULT = 1 |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## JobLead
<!--{"accordionBody":true}-->
Store entries from our service request (job lead) form

| Field       | Type     | Notes                                                         |
|-------------|----------|---------------------------------------------------------------|
| id          | INTEGER  | PK, AI                                                        |
| personId    | INTEGER  | NOT NULL, FK &rarr; **Person(id)**, CASCADE DELETE            |
| jobId       | INTEGER  | UNIQUE INDEX, NULLABLE, FK &rarr; **Job(id)**, CASCADE DELETE |
| statusId    | INTEGER  | INDEX, NOT NULL, FK &rarr; **LeadStatus(id)**                 |
| description | TEXT     | NOT NULL                                                      |
| createdAt   | DATETIME | NOT NULL, DEFAULT = NOW                                       |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## LeadStatus
<!--{"accordionBody":true}-->
Lead status lookup table

| Field    | Type    | Notes                 |
|----------|---------|-----------------------|
| id       | INTEGER | PK, AI                |
| value    | TEXT    | NOT NULL              |
| isActive | BOOLEAN | NOT NULL, DEFAULT = 1 |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## Trade__JobLead
<!--{"accordionBody":true}-->
Junction table between **Trade** & **JobLead**

| Field     | Type    | Notes                                               |
|-----------|---------|-----------------------------------------------------|
| id        | INTEGER | PK, AI                                              |
| jobLeadId | INTEGER | NOT NULL, FK &rarr; **JobLead(id)**, CASCADE DELETE |
| tradeId   | INTEGER | INDEX, NOT NULL, FK &rarr; **Trade(id)**            |
| -         | -       | UNIQUE(tradeId, jobLeadId)                          |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## StaffLead
<!--{"accordionBody":true}-->
Store entries from our staff interest form

| Field      | Type     | Notes                                              |
|------------|----------|----------------------------------------------------|
| id         | INTEGER  | PK, AI                                             |
| personId   | INTEGER  | NOT NULL, FK &rarr; **Person(id)**, CASCADE DELETE |
| statusId   | INTEGER  | NOT NULL, FK &rarr; **LeadStatus(id)**             |
| positionId | INTEGER  | NOT NULL, FK &rarr; **StaffPosition(id)**          |
| createdAt  | DATETIME | NOT NULL, DEFAULT = NOW                            |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## StaffPosition
<!--{"accordionBody":true}-->
Staff position lookup table

| Field    | Type    | Notes                 |
|----------|---------|-----------------------|
| id       | INTEGER | PK, AI                |
| value    | TEXT    | NOT NULL              |
| isActive | BOOLEAN | NOT NULL, DEFAULT = 1 |
| isHiring | BOOLEAN | NOT NULL, DEFAULT = 1 |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## Person__StaffPosition
<!--{"accordionBody":true}-->
Junction table between **Person** & **StaffPosition** that also tracks the employment time and potential reason for ending the position

| Field       | Type     | Notes                                              |
|-------------|----------|----------------------------------------------------|
| id          | INTEGER  | PK, AI                                             |
| personId    | INTEGER  | NOT NULL, FK &rarr; **Person(id)**, CASCADE DELETE |
| positionId  | INTEGER  | INDEX, NOT NULL, FK &rarr; **StaffPosition(id)**   |
| endReasonId | INTEGER  | NULLABLE, FK &rarr; **StaffEndReason(id)**         |
| startDate   | DATETIME | NOT NULL                                           |
| endDate     | DATETIME | NULLABLE                                           |
| -           | -        | UNIQUE(personId, positionId)                       |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## StaffEndReason
<!--{"accordionBody":true}-->
Staff end reason lookup table

| Field    | Type    | Notes                 |
|----------|---------|-----------------------|
| id       | INTEGER | PK, AI                |
| value    | TEXT    | NOT NULL              |
| isActive | BOOLEAN | NOT NULL, DEFAULT = 1 |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## Objective
<!--{"accordionBody":true}-->
Stores objectives on our Kanban

| Field       | Type     | Notes                                             |
|-------------|----------|---------------------------------------------------|
| id          | INTEGER  | PK, AI                                            |
| columnId    | INTEGER  | INDEX, NOT NULL, FK &rarr; **ObjectiveColumn(id)** |
| createdBy   | INTEGER  | NOT NULL, FK &rarr; **Person(id)**, CASCADE DELETE |
| title       | TEXT     | UNQUE INDEX, NOT NULL                             |
| description | TEXT     |                                                   |
| order       | DECIMAL  | INDEX, NOT NULL                                   |
| createdAt   | DATETIME | NOT NULL, DEFAULT = NOW                           |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## ObjectiveActivity
<!--{"accordionBody":true}-->
Stores activity/events for an **Objective**

| Field        | Type     | Notes                                                     |
|--------------|----------|-----------------------------------------------------------|
| id           | INTEGER  | PK, AI                                                    |
| objectiveId  | INTEGER  | NOT NULL, FK &rarr; **Objective(id)**, CASCADE DELETE     |
| typeId       | INTEGER  | INDEX, NOT NULL, FK &rarr; **ObjectiveActivityType(id)**  |
| actorId      | INTEGER  | INDEX, FK &rarr; **Person(id)**                           |
| assigneeId   | INTEGER  | INDEX, FK &rarr; **Person(id)**,                          |
| fromColumnId | INTEGER  | FK &rarr; **ObjectiveColumn(id)**                         |
| toColumnId   | INTEGER  | FK &rarr; **ObjectiveColumn(id)**,                        |
| tagId        | INTEGER  | INDEX, FK &rarr; **ObjectiveTag(id)**,                    |
| commentId    | INTEGER  | INDEX, FK &rarr; **ObjectiveComment(id)**,                |
| createdAt    | DATETIME | INDEX, NOT NULL, DEFAULT = NOW                            |
| -            | -        | INDEX(objectiveId, createdAt)                             |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## ObjectiveActivityType
<!--{"accordionBody":true}-->
Objective activity types lookup table

| Field    | Type    | Notes                 |
|----------|---------|-----------------------|
| id       | INTEGER | PK, AI                |
| value    | TEXT    | NOT NULL              |
| isActive | BOOLEAN | NOT NULL, DEFAULT = 1 |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## Objective__Assignee
<!--{"accordionBody":true}-->
Junction table between **Objective** & **Person**

| Field       | Type    | Notes                                                     |
|-------------|---------|-----------------------------------------------------------|
| id          | INTEGER | PK, AI                                                    |
| objectiveId | INTEGER | NOT NULL, FK &rarr; **Objective(id)**, CASCADE DELETE     |
| personId    | INTEGER | INDEX, NOT NULL, FK &rarr; **Person(id)**, CASCADE DELETE |
| -           | -       | UNIQUE(objectiveId, personId)                             |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## ObjectiveColumn
<!--{"accordionBody":true}-->
Objective column (on Kanban) lookup table

| Field    | Type    | Notes                 |
|----------|---------|-----------------------|
| id       | INTEGER | PK, AI                |
| value    | TEXT    | NOT NULL              |
| isActive | BOOLEAN | NOT NULL, DEFAULT = 1 |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## ObjectiveTag
<!--{"accordionBody":true}-->
Objective tag lookup table (more specific then **ObjectiveColumn**)

| Field    | Type    | Notes                 |
|----------|---------|-----------------------|
| id       | INTEGER | PK, AI                |
| value    | TEXT    | NOT NULL              |
| isActive | BOOLEAN | NOT NULL, DEFAULT = 1 |
| order    | INTEGER | NOT NULL              |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## Objective__Tag
<!--{"accordionBody":true}-->
Junction table between **Objective** & **ObjectiveTag**

| Field       | Type    | Notes                                                 |
|-------------|---------|-------------------------------------------------------|
| id          | INTEGER | PK, AI                                                |
| objectiveId | INTEGER | NOT NULL, FK &rarr; **Objective(id)**, CASCADE DELETE |
| tagId       | INTEGER | INDEX, NOT NULL, FK &rarr; **ObjectiveTag(id)**       |
| -           | -       | UNIQUE(objectiveId, tagId)                            |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## ObjectiveComment
<!--{"accordionBody":true}-->
Store **Objective** comments

| Field       | Type     | Notes                                                        |
|-------------|----------|--------------------------------------------------------------|
| id          | INTEGER  | PK, AI                                                       |
| objectiveId | INTEGER  | INDEX, NOT NULL, FK &rarr; **Objective(id)**, CASCADE DELETE |
| createdBy   | INTEGER  | NOT NULL, FK &rarr; **Person(id)**, CASCADE DELETE            |
| value       | TEXT     | NOT NULL                                                     |
| createdAt   | DATETIME | NOT NULL, DEFAULT = NOW                                      |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## ObjectiveComment__Assignee
<!--{"accordionBody":true}-->
Junction table between **ObjectiveComment** & **Person**. If someone is assigned to an **Objective** then **DO NOT** store an entry for them here. **ObjectiveComment__Assignee** is for notifying people about an **ObjectiveComment** that are **NOT** assigned to an **Objective** when we'd love for them to know about a comment.

| Field       | Type    | Notes                                                        |
|-------------|---------|--------------------------------------------------------------|
| id          | INTEGER | PK, AI                                                       |
| commentId   | INTEGER | NOT NULL, FK &rarr; **ObjectiveComment(id)**, CASCADE DELETE |
| personId    | INTEGER | INDEX, NOT NULL, FK &rarr; **Person(id)**, CASCADE DELETE    |
| -           | -       | UNIQUE(commentId, personId)                                  |
<!--{"accordionEnd":true}-->

