# PrepRoute — Project Briefing for Claude Code

## Project Overview

Admin panel for test creation called **PrepRoute**.
Build a clean, production-grade React + MUI web app for teachers/admins to create tests and add questions.

---

## Tech Stack

- **Framework:** Vite + React
- **UI Library:** MUI (Material UI) v5
- **Routing:** React Router DOM v6
- **HTTP:** Axios
- **Package Manager:** Yarn
- **Auth:** JWT stored in localStorage

---

## Design System

- **Primary color:** `#2255FF` (blue — buttons, active states, links)
- **Background:** `#FFFFFF`
- **Border color:** `#e5e7eb`
- **Muted text:** `#6b7280`
- **Secondary text:** `#9ca3af`
- **Primary text:** `#111827`
- **Success/green:** `#22c55e`
- **Danger/red:** `#f87171`
- **Border radius:** `8px` globally (set in MUI theme `shape.borderRadius: 8`)
- **Input labels:** Always ABOVE the field (use `InputLabelProps={{ shrink: true }}` or plain `<Typography>` label — NO floating labels)
- **Font:** System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`)

### MUI Theme overrides required

```js
createTheme({
  palette: {
    primary: { main: "#2255FF" },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiTextField: {
      defaultProps: { variant: "outlined", size: "small" },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
    },
  },
});
```

---

## App Structure

```
src/
├── api/           # axios instance + all API calls
├── components/    # shared components (Sidebar, Topbar, etc.)
├── pages/
│   ├── Login/
│   ├── Dashboard/
│   ├── CreateTest/
│   └── AddQuestions/
├── routes/        # protected route wrapper
├── theme/         # MUI theme config
├── utils/         # helpers (auth, formatting)
└── App.jsx        # router setup
```

---

## Pages

### Page 1 — Login

- Fields: `userId`, `password`
- Validation: both required
- On success: store JWT in `localStorage`, redirect to `/dashboard`
- On error: show inline error message
- API: `POST /login` → returns `{ token, user }`

### Page 2 — Dashboard

- Table/card list of all tests
- Columns: Test Name, Subject, Status, Created Date, Actions (Edit, View, Delete)
- "Create New Test" button → navigates to `/create-test`
- Edit → navigates to `/create-test/:id`
- Delete → confirmation dialog then API call
- Search/filter bar (bonus)
- API: `GET /tests`, `DELETE /tests/:id`

### Page 3 — Create / Edit Test

**Layout:** Two-column form, white card, breadcrumb at top

**Fields:**
| Field | Type | Notes |
|---|---|---|
| Test Name | Text input | Required |
| Subject | Dropdown | Fetched from API |
| Test Type | Tabs (Chapter Wise / PYQ / Mock Test) | Stored as string |
| Topics | Multi-select chips | Fetched based on selected subject |
| Sub-topics | Multi-select chips | Fetched based on selected topics |
| Difficulty Level | Radio (Easy / Medium / Difficult) | Default: Easy |
| Wrong Answer marks | Spinner input | Default: -1 |
| Unattempted marks | Spinner input | Default: 0 |
| Correct Answer marks | Spinner input | Default: +5 |
| No of Questions | Number input | |
| Total Marks | Auto-calculated (No of Questions × correct_marks) | Disabled/read-only |
| Duration (Minutes) | Number input | |

**Buttons:**

- `Cancel` → back to dashboard
- `Save as Draft` → `PATCH /tests/:id` with `status: 'draft'`
- `Next: Add Questions` → `POST /tests` then navigate to `/add-questions/:testId`

**API:**

- `GET /subjects`
- `GET /topics?subjectId=`
- `GET /subtopics?topicId=`
- `POST /tests` (create)
- `PUT /tests/:id` (edit)

### Page 4 — Add Questions

**Layout:** Three-panel layout

- Left: narrow icon sidebar (decorative/nav)
- Left-center: question list panel (Q1, Q2... with green check when saved)
- Right: main editor area

**Chapter summary card at top** — shows test details from Page 3 (read-only)

**Question editor fields:**
| Field | Type | Notes |
|---|---|---|
| Question text | Rich text editor (toolbar: Bold, Italic, Underline, Align, Image, Math) | Required |
| Option 1–4 | Text inputs with radio on left | Required |
| Correct answer | Clicking radio on an option marks it correct | Required |
| Explanation/Solution | Text area | Optional |
| Difficulty | Dropdown (per-question override) | Optional |
| Topic | Dropdown (per-question override) | Optional |
| Sub-topic | Dropdown (per-question override) | Optional |
| Media URL | Text input or image upload button in toolbar | Optional |

**Navigation:**

- `‹ ›` arrows below solution box → navigate between existing questions
- Question list sidebar → click any Q to jump to it, green dot = saved
- `+ MCQ` button → saves current and adds new blank question
- Minimum 1 question required before Save & Continue

**Buttons:**

- `Exit Test Creation` (red) → confirm dialog → save draft → back to dashboard
- `Next / Save & Continue` (blue) → validate min 1 question → navigate to dashboard or publish confirmation
- `Publish` (top right) → publish test immediately

**API:**

- `GET /questions?testId=`
- `POST /questions`
- `PUT /questions/:id`
- `DELETE /questions/:id`

---

## Smart Assumptions (gaps filled)

1. **Topics & Sub-topics** = MUI multi-select with chips, not single dropdown
2. **Total Marks** = auto-calculated, disabled field
3. **Save as Draft** = separate button on Page 3 alongside Next
4. **Correct answer** = clicking the radio button on an option row marks it as correct answer
5. **Question type** = MCQ only for now (4 options always shown)
6. **Test Type tabs** = acts as the test type selector, value stored in form state
7. **Edit/Delete on question list** = shown on hover in sidebar
8. **Next on Page 4** = goes to dashboard after saving (no separate review page)
9. **‹ › arrows** = navigate between already-added questions only
10. **Delete All Edits** = clears current unsaved question form, not all questions

---

## Key Design Patterns

- All form labels are **above** the field, never floating
- Dropdowns use MUI `Select` with `displayEmpty` for placeholder text
- Multi-selects use MUI `Autocomplete` with `multiple` prop and chip rendering
- Buttons: primary actions use `variant="contained"`, secondary use `variant="text"`
- All inputs `size="small"` with `fullWidth`
- Sidebar active item: left blue border + light blue background
- Breadcrumb at top of every page after login

---

## Auth Flow

```js
// On login success
localStorage.setItem("token", response.data.token);

// Axios interceptor — attach to every request
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

// Protected route — redirect to /login if no token
```

---

## API Base URL

> **[REPLACE WITH ACTUAL BASE URL]**

---

## Notes for Development

- Use `react-router-dom` v6 with `<BrowserRouter>` and `<Routes>`
- Wrap protected pages in a `<PrivateRoute>` component that checks localStorage for token
- Use `useNavigate()` for programmatic navigation
- Keep API calls in `src/api/` folder, not inside components
- Use MUI `<Snackbar>` + `<Alert>` for success/error toasts
- Use MUI `<Dialog>` for confirmation modals (delete, exit)
