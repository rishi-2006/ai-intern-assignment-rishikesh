# HSA AI Intern Assignment

**Name: RISHIKESH PENDYALA
**Email: rishi18102006@gmail.com
**Date:  06-JUNE-2026

---

## Repository Structure

```
ai-intern-assignment/
├── part-a/
│   └── index.html               ← Student Lead Capture Form
├── part-b/
│   ├── workflow-b1-lead-notification.json
│   ├── workflow-b2-scheduled-fetch.json
│   ├── screenshot-b1.png        ← N8N canvas screenshot (add manually)
│   └── screenshot-b2.png        ← N8N canvas screenshot (add manually)
├── part-c/
│   └── index.html               ← Form with fetch() webhook integration
└── README.md
```

---

## Part A — Student Lead Capture Form

**File:** `part-a/index.html`

A pure HTML/CSS/Vanilla JS form with zero dependencies. To test:

1. Open `part-a/index.html` in any browser — no server required.
2. Try submitting with empty fields to see inline validation errors.
3. Fill all fields and submit; a thank-you message appears without page reload.
4. Open DevTools → Console to see the JSON payload logged on submission.

**Features:**
- Full name, email (regex validated), country dropdown, course level radio buttons (UG/PG/PhD), preferred university, message textarea with live 300-character counter
- All fields validated with inline error messages
- Mobile-responsive layout using CSS Grid
- Loading state on submit button, animated thank-you screen

---

## Part B — N8N Automation Workflows

**Files:** `part-b/workflow-b1-lead-notification.json`, `part-b/workflow-b2-scheduled-fetch.json`

### How to import into N8N

1. Open your N8N instance.
2. Click **+ New Workflow** → three-dot menu → **Import from file**.
3. Select the relevant `.json` file.
4. Replace placeholder credential IDs with your real credentials (see below).

---

### B1 — Lead Notification Workflow

**Flow:** Webhook → Set (extract fields) → IF (PG/PhD?) → Email **or** Google Sheets

| Node | Purpose |
|---|---|
| Webhook — Receive Lead | Listens for POST to `/webhook/lead-capture` |
| Set — Extract & Rename Fields | Pulls `name`, `email`, `courseLevel`, `message`, `country`, `university` from `body` |
| IF — PG or PhD? | Regex match on `^(PG\|PhD)$` |
| Email — Notify Admissions | Sends formatted email for postgrad/PhD leads |
| Google Sheets — Log UG Lead | Appends undergraduate leads to a spreadsheet |

**Credentials needed:**
- `SMTP_CREDENTIAL_ID` → replace with your SMTP credentials in N8N
- `GOOGLE_SHEETS_CREDENTIAL_ID` → replace with your Google Sheets OAuth2 credentials
- `YOUR_GOOGLE_SHEET_ID` → replace with the ID from your sheet URL

---

### B2 — Scheduled University Data Fetch

**Flow:** Cron (daily 9AM) → HTTP Request → Code (filter/transform) → Set (clean output)

**API Used:** [Hipolabs Universities API](http://universities.hipolabs.com)
- **URL:** `http://universities.hipolabs.com/search?country=United+Kingdom`
- **Why this API:** It's completely free, requires no API key or authentication, returns structured JSON, and is directly relevant to HSA's university counselling business. It provides real university names, domains, and websites — data an admissions team would genuinely use.

| Node | Purpose |
|---|---|
| Cron — Daily at 9AM | `0 9 * * *` schedule trigger |
| HTTP Request | Fetches UK university list from Hipolabs |
| Code — Filter & Transform | Filters to entries containing "university", maps to clean objects, limits to 20 results |
| Set — Clean Labelled Output | Exposes `university_name`, `country`, `alpha_code`, `website`, `domain`, `fetched_at` |

**No credentials required** — the Hipolabs API is public and unauthenticated.

---

## Part C — Webhook Integration (Bonus)

**File:** `part-c/index.html`

The Part A form extended to POST data via `fetch()` to the B1 webhook.

**To test end-to-end:**

1. Import `workflow-b1-lead-notification.json` into N8N and **activate** it.
2. Copy the webhook URL from the Webhook node (e.g. `https://your-n8n.com/webhook/lead-capture`).
3. Open `part-c/index.html` in a browser.
4. Paste your webhook URL into the **Webhook URL** field at the top.
5. Fill and submit the form — watch the N8N execution log for the triggered run.

**Implementation details:**
- Uses `fetch()` with `Content-Type: application/json`
- Submit button shows a loading spinner during the request
- Success → animated thank-you screen; Error → inline error banner with the HTTP status message
- Console logs the outgoing payload and response status for debugging

**Demo:** [Add your Loom link here]

---

## Environment Variables / Credentials Placeholders

| Placeholder | What to replace with |
|---|---|
| `SMTP_CREDENTIAL_ID` | ID of your SMTP credential in N8N |
| `GOOGLE_SHEETS_CREDENTIAL_ID` | ID of your Google Sheets OAuth2 credential in N8N |
| `YOUR_GOOGLE_SHEET_ID` | The long ID string from your Google Sheet URL |
| `https://your-n8n-instance.com/webhook/lead-capture` | Your actual N8N webhook URL |

---

## Challenges & How I Resolved Them

1. **N8N Webhook CORS for browser fetch():** By default N8N webhook responses don't include CORS headers, which blocks browser-based `fetch()` calls. I resolved this by configuring the Webhook node's response headers or using N8N Cloud which handles CORS, and documented the issue in the Part C error handling so testers understand the error message.

2. **Radio button styling with pure CSS:** Achieving a custom styled radio button group without JavaScript was tricky. I used the `:has(input:checked)` CSS selector on the parent label to change the border and background — a modern CSS-only technique that avoids extra JS listeners.

3. **N8N Code node vs Function node API:** Older N8N versions use `Function` nodes (accessing `items`), while newer versions use `Code` nodes (same `items` API but different UI). The workflow JSON uses the `code` node type for compatibility with N8N v1+.