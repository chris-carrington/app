<!--{"accordionStart":true}-->
## What are our fundamental finance principles?
<!--{"accordionBody":true}-->
- Transactions describe **movement** (cash in, cash out)
- Agreements describe **intent** (Donation, Pledge, Grant)
- Funds describe **destination** (which bucket based on legal/accounting restrictions)
- Receipts describe **paperwork** (tax docs)
<!--{"accordionEnd":true}-->


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
| `recognized` | Booked to general ledger | Yes | Yes | Yes, per fund |
| `reconciled` | Matched to statement, locked | Yes | Yes | Yes |
| `reversed` | Refunded or charged back | Reversed | Reversed | No |
- Notes:
    - `recognized` is the moment money becomes real. Everything before is a promise.
    - `reconciled` is we proved the money is real by matching it to your bank statement
        - Before reconciled, you *believe* the money moved
        - After reconciled, you *know* it did, because the bank agrees
    - `locked` means the row can no longer be edited
        - If something changes, you add a new row instead
        - An unlocked ledger is a story. A locked ledger is evidence.
        - We can **add**, we can never **rewrite**
        - Locked post reconciled
    - `reversed` is a new row, not a status edit.
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
- Separate lifecycle from Donation because grants have reporting and compliance
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
| Fund | Type |
|---|---|
| General Operating | Unrestricted |
| Operating Reserve | Board-Designated |
| Capital & Equipment | Board-Designated |
| Workforce Development | Restricted |
| Opportunity Youth | Restricted |
| Apprenticeship Training | Restricted |
| Mentor Development | Restricted |
| Low & Moderate Income | Restricted |
| Elderly Assistance | Restricted |
| Community Repair | Restricted |
<!--{"accordionEnd":true}-->


<!--{"accordionStart":true}-->
## Why have "Board-Designated" funds?
<!--{"accordionBody":true}-->
- The **General Operating** fund is for **spending**:
    - General Operating is the source. Reserve and Capital are destinations the Board funds when there is surplus
    - Answers "can we pay this month's bills"?
- The **Operating Reserve** fund is for **surviving**:
    - Cash set aside by the **Board** (not a donor) to cover 3–6 months of operating expenses if revenue drops or a crisis hits
    - This fund is not a different pile of cash, it's the same cash with a governance label that the Board cannot casually undo.
    - Answers "can we survive a crisis"?
- The **Capital & Equipment** fund is for **replacing**:
    - Money set aside to **buy or replace things that last more than a year** (e.g., trucks, tools, computers, a training facility)
    - This fund is not a different pile of cash, it's the same cash with a governance label that the Board cannot casually undo.
    - Answers "can we replace the truck before it dies"?

| Without separation | With separation |
|---|---|
| One number hides everything | Three numbers tell the real story |
| Crisis forces layoffs | Reserve absorbs the shock |
| Truck breaks, work stops | Capital fund already has the cash |
| Board can't govern what it can't see | Board votes on release, not vibes |
| Funders see a fragile org | Funders see a resilient org |
| Audit = stress | Audit = routine |
<!--{"accordionEnd":true}-->
