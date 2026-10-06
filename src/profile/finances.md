<!--{"accordionStart":true}-->
## What is a donation?
<!--{"accordionBody":true}-->
- A donation is a gift of cash or cash-equivalent from a donor to Shasta Trades
- Donation statuses:
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
- Pledge statuses:
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
- Institutional funding (e.g., COYA, Home Depot, foundations, government)
- Separate lifecycle from Donation because grants have reporting and compliance
- Grant statuses:
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
    - **Safeguarding a Reserve:** To prevent the board from accidentally spending our 6-month operating cushion, it can be in a separate savings or investment account
    - **Maximizing Earning:** Long-term or endowed funds can be in investment accounts, not a checking account, to generate returns
    - **Funder Mandate:** A rare grant might explicitly require a dedicated account. If so, we must weigh the administrative burden against the value of the grant
<!--{"accordionEnd":true}-->
