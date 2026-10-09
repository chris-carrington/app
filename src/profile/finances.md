<!--{"accordionStart":true}-->
## What are our fundamental finance principles?
<!--{"accordionBody":true}-->
- Transactions describe **movement** (cash in, cash out)
- Agreements describe **intent** (Donation, Pledge, Grant)
- Funds describe **destination** (which bucket based on legal/accounting restrictions)
- Receipts describe **paperwork** (tax docs)
<!--{"accordionEnd":true}-->


---


<!--{"accordionStart":true}-->
## What is a transaction?
<!--{"accordionBody":true}-->
- Transactions describe movement (cash in, cash out)
- Helps answer the question: Where is the money right now?
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## What are the transaction statuses?
<!--{"accordionBody":true}-->
| Status | Meaning | Cash in bank? | Revenue real? | Spendable? |
|---|---|---|---|---|
| `expected` | Known to be incoming or outgoing but not initiated | No | No | No |
| `in_flight` | Payment sent, waiting to settle | No | No | No |
| `received` | Cash arrived @ bank but not booked yet | Yes | No | No |
| `recognized` | Booked to general ledger, the moment money becomes real, all before is a promise | Yes | Yes | Yes, per fund |
| `reconciled` | Matched to statement, locked,  we proved the money is real by matching it to our bank statement | Yes | Yes | Yes |
| `reversed` | Refunded or charged back, a new row, not an existing row status edit | Reversed | Reversed | No |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## What does locked mean from a transaction perspective?
<!--{"accordionBody":true}-->
- Locked = a row in the `transactions` table can no longer be changed
- Locked is not a status we manually set. Locked is an automatic consequence of reconciliation.
- Once a transaction is locked, all rows are immutable (not allowed to be changed) & enforced via database triggers
- If something changes, we add a new row instead
    | Event | What Happens |
    |---|---|
    | Transaction status reaches `reconciled` | The row is matched to the bank statement & the row becomes locked |
    | The accounting period is **permanently closed** | All transactions in that period become locked |
    | A **trigger** fires on UPDATE or DELETE | Database rejects any attempt to modify the row |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## What are the transaction types?
<!--{"accordionBody":true}-->
| Type | Direction | Example |
|---|---|---|
| `donation` | in | Supporter gives $500 to Community Repair |
| `pledge_payment` | in | Monthly installment against a $10k pledge |
| `grant_disbursement` | in | COYA sends $250,000 tranche |
| `service_fee` | in | Betty pays $21/hr for her sink repair |
| `disbursement` | out | Apprentice wage / Mentor wage |
| `refund` | out | Donor asks for money back |
| `chargeback` | out | Bank reverses a card donation |
- Notes:
    - Tranche comes from the French word for "slice." A $1,000,000 grant paid in four tranches is just that grant cut into four slices.
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## What is a functional class?
<!--{"accordionBody":true}-->
- A functional class is a column on the transaction's table that answers "Was this spending for our mission, for admin, or for fundraising?"
- Required by the IRS on **Form 990 Part IX** (Statement of Functional Expenses)
- Every transaction gets exactly one functional class
- Helps us tell the IRS (and our board) whether each dollar we spent was on the `mission`, on `admin`, or on `fundraising`
    | Class | Meaning | Examples |
    |---|---|---|
    | `mission` | Directly advances the mission | Apprentice wages, mentor wages, tools & materials |
    | `admin` | Keeps the lights on | Rent, insurance, accounting software, CTO salary, board meetings |
    | `fundraising` | Raises money | Donor emails, grant writing, event costs, thank-you cards |
<!--{"accordionEnd":true}-->


---


<!--{"accordionStart":true}-->
## What is a donation?
<!--{"accordionBody":true}-->
- A donation is a gift of cash or cash-equivalent from a donor to Shasta Trades
- **Donation statuses:**
    | Status | Meaning | Revenue recognized? | Spendable? | Receipt issued? |
    |---|---|---|---|---|
    | `draft` | Created internally, not submitted. Editable. | No | No | No |
    | `pending` | Submitted, awaiting payment, verification, or review. | No | No | No |
    | `posted` | Finalized. Money recognized and fund allocated. | Yes | Yes | Yes |
    | `failed` | Rejected, declined, or verification failed. | No | No | No |
    | `canceled` | Withdrawn before completion. | No | No | No |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## What is a pledge?
<!--{"accordionBody":true}-->
- A pledge is a promise to give, so it's never cash
- **Pledge statuses:**
    | Status | Meaning | Revenue recognized? | Cash received? | Notes |
    |---|---|---|---|---|
    | `pledged` | Donor promised a gift. No cash yet. | Only if unconditional | No | GAAP: unconditional = revenue now |
    | `partially_fulfilled` | Some of the pledge has been paid. | Proportional | Partial | Track remaining balance |
    | `fulfilled` | Pledge paid in full. | Yes | Yes | Convert to Donation |
    | `overdue` | Past due date. | Yes (if unconditional) | No | Follow-up required |
    | `written_off` | Deemed uncollectible. | Reversed | No | Board approval recommended |
    | `canceled` | Donor withdrew the promise. | Reversed | No | Log reason |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## What is a grant?
<!--{"accordionBody":true}-->
- Institutional funding (e.g., Government, Foundations, Home Depot)
- Separate lifecycle from Donation b/c grants have reporting and compliance
- **Grant statuses:**
    | Status | Meaning | Funds received? | Spendable? | Reporting due? |
    |---|---|---|---|---|
    | `prospect` | Identified, not yet applied. | No | No | No |
    | `applied` | Application submitted. | No | No | No |
    | `declined` | Application rejected. | No | No | No |
    | `awarded` | Approved, award letter signed. | No | No | Soon |
    | `pending_funds` | Waiting for disbursement. | No | No | Soon |
    | `active` | Funds received and spendable per grant terms. | Yes | Yes | Yes |
    | `reporting` | Spending underway or complete; reports due. | Yes | Yes | Yes |
    | `closed` | All reports accepted. Funds fully spent or returned. | Yes | No | No |
    | `terminated` | Ended early by grantor or grantee. | Partial | No | Final report |
- Notes:
    - `terminated` is when the grant ended early, before it was supposed to (e.g., we missed a milestone, they ran out of money)
<!--{"accordionEnd":true}-->


---


<!--{"accordionStart":true}-->
## What is a fund?
<!--{"accordionBody":true}-->
- A pool of money or resources set aside for a specific purpose, restriction, or accounting track
- A way for a nonprofit to track and prove that money is being used according to:
    - Donor intent
    - Legal restrictions
    - Board designations
    - The organization's mission/programs
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## What is an unrestricted fund?
<!--{"accordionBody":true}-->
- Fund money is available for general mission use
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## What is an restricted fund?
<!--{"accordionBody":true}-->
- Donor or law limits how the fund's money can be used
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## Is it optimal for each fund to be its own bank account?
<!--{"accordionBody":true}-->
- It is almost never required or advisable to have a separate bank account for every fund
- Our accounting system is where we achieve the strict fund separation required by us, donors and grants
- Our bank accounts is for managing cash flow
- Open additional bank accounts only when it serves a practical purpose, such as:
    - **Safeguarding a Reserve:** To prevent the Board from accidentally spending our 6-month operating cushion, it can be in a separate savings or investment account
    - **Maximizing Earning:** Long-term or endowed funds can be in investment accounts, not a checking account, to generate returns
    - **Funder Mandate:** A rare grant might explicitly require a dedicated account. If so, we must weigh the administrative burden against the value of the grant
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## What are our funds?
<!--{"accordionBody":true}-->
| Fund | Type | Why does this fund exist? |
|---|---|---|
| General Operating | Unrestricted | **General Operating** pays the bills that no grant will cover (e.g., rent, insurance, software) and the staff time that holds everything together |
| Operating Reserve | Board-Designated | **Operating Reserve** holds 3 months of operating expenses so a lost grant or a slow quarter never forces us to lay off apprentices mid-cohort. It is the same cash as General Operating, but with a governance lock the board cannot casually undo. |
| Capital & Equipment | Board-Designated | **Capital & Equipment** buys and replaces the trucks, tools, laptops, and training-space buildout that outlive a single year. It turns a broken truck from a crisis into a scheduled line item the board already planned for. |
| Workforce Development | Restricted | **Workforce Development** lets us recruit, train, and pay skilled tradespeople. Foundations focused on **optimal community employment** love this fund. |
| Opportunity Youth | Restricted | **Opportunity Youth** are young adults (age 16-24) who are not in school and not working. Foundations focused on **opportunity youth** love this fund. |
| Apprenticeship Training | Restricted | **Apprenticeship Training** lets us cover the structured training costs that sit outside or inside wages (e.g., study guide creation, safety certifications, exam prep). Foundations focused on **apprenticeship programs** love this fund. |
| Mentor Development | Restricted | **Mentor Development** lets us recruit, train, and compensate the experienced tradespeople who make apprenticeships work. Foundations focused on **mentorship** and **teacher quality** love this fund. |
| Low & Moderate Income | Restricted | **Low & Moderate Income** lets us subsidize repair and renovation work for households that cannot afford market rates. Foundations focused on **economic mobility** and **housing equity** love this fund. |
| Elderly Assistance | Restricted | **Elderly Assistance** lets us serve seniors on fixed incomes who need help before their home repairs become hazards. Foundations focused on **aging gracefully** and **senior safety** love this fund. |
| Community Repair | Restricted | **Community Repair** lets us deliver affordable, high-quality trade services across Siskiyou County. Foundations focused on **community revitalization** love this fund. |
| Wildfire Repair | Restricted | **Wildfire Repair** lets us harden homes against wildfire (e.g., replacing dry wood roofs, bad siding, other hazards that put our neighborhoods at risk). Foundations focused on **wildfire resilience** love this fund. |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## Why not only have a General Operating fund, why have "Board-Designated" funds?
<!--{"accordionBody":true}-->
- The **General Operating** fund is for **spending**:
    - General Operating is the source. Reserve and Capital are destinations the Board funds when there is surplus
    - Answers "can we pay this month's bills"?
- The **Operating Reserve** fund is for **surviving**:
    - Cash set aside by the **Board** (not a donor) to cover 3 months of operating expenses if revenue drops or a crisis hits
    - This fund is not a different pile of cash, it's the same cash with a governance label that the Board cannot casually undo.
    - Answers "can we survive a crisis"?
- The **Capital & Equipment** fund is for **replacing**:
    - Money set aside to **buy or replace things that last more than a year** (e.g., trucks, tools, computers, a training facility)
    - This fund is not a different pile of cash, it's the same cash with a governance label that the Board cannot casually undo.
    - Answers "can we replace the truck before it dies"?

| Only General Operating Fund | With Board-Designated funds |
|---|---|
| One number hides everything | Three numbers tell the real story |
| Crisis forces layoffs | Reserve absorbs the shock |
| Truck breaks, work stops | Capital fund already has the cash |
| Board can't govern what it can't see | Board votes on release, not vibes |
| Funders see a fragile org | Funders see a resilient org |
| Audit = stress | Audit = routine |
<!--{"accordionEnd":true}-->


---


<!--{"accordionStart":true}-->
## What are receipts?
<!--{"accordionBody":true}-->
- A receipt is the legal document that proves a donation happened
- Without it, our donor cannot claim a tax deduction and we expose the organization to compliance risk
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## When is a receipt required?
<!--{"accordionBody":true}-->
- When a donation is for $250 or more
- When a donor receives goods or services worth more than $75
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## What must a receipt include?
<!--{"accordionBody":true}-->
- Name of our organization
- Date of the contribution
- Amount of the contribution (cash) or description of property (noncash)
- Whether any goods or services were provided in exchange
- If goods/services were provided, a description and good-faith estimate of their value
<!--{"accordionEnd":true}-->


---


<!--{"accordionStart":true}-->
## What is Federal IRS Form 990?
<!--{"accordionBody":true}-->
-  A public disclosure document that tells the IRS (and the public) how we earn and spend money
- Due the 15th day of the 5th month after our tax year ends (May 15 for calendar-year filers)
- Failure to file for 3 consecutive years = automatic loss of tax-exempt status
    | Form | Gross receipts | Total assets |
    |---| --- | --- |
    | 990-N | ≤ $50,000 | N/A |
    | 990-EZ | < $200,000 | < $500,000 |
    | 990 (full) | ≥ $200,000 | ≥ $500,000 |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## What is the California Form 199?
<!--{"accordionBody":true}-->
- California's version of Form 990
- Due the 15th day of the 5th month after our tax year ends (May 15 for calendar-year filers)
    | Form | Gross receipts |
    |---| --- |
    | FTB 199N  | Normally ≤ $50,000 |
    | Form 199 | > $50,000, or private foundations / trusts regardless of size |
<!--{"accordionEnd":true}-->


---


<!--{"accordionStart":true}-->
## What is our investment strategy?
<!--{"accordionBody":true}-->
| Level | What it is | Example | Effort |
|---|---|---|---|
| **Don't invest yet** | Keep money in a savings account | Operating Reserve in a high-yield savings account | None |
| **Negative screening** | Just avoid bad stuff | "We won't invest in fossil fuels or predatory lenders" | Low |
| **Positive screening** | Prefer good stuff | "We'll look for affordable housing bonds" | Low |
| **Mission-related investments** | Investments that also help the mission | Loan to a nonprofit that builds affordable homes | Medium |
<!--{"accordionEnd":true}-->
