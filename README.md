# PrepRoute — Admin Panel

Test creation and management panel for the PrepRoute platform.

## Prerequisites

- Node.js 20+ (or 22+)
- yarn

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd preproute
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
VITE_API_BASE_URL=/api
VITE_API_TARGET=https://admin-moderator-backend-staging.up.railway.app
```

`VITE_API_TARGET` is the backend URL. The Vite dev server proxies all `/api/*` requests to this target, so no CORS issues locally.

### 4. Run the development server

```bash
yarn dev
```

App runs at [http://localhost:5173](http://localhost:5173)

### 5. Login credentials

```
Username: vedant-admin
Password: vedant123
```

## Build for Production

```bash
yarn build
```

Output goes to the `dist/` folder.

## Deployment

The app is deployed on **Vercel**. The `vercel.json` at the project root handles:
- Proxying `/api/*` requests to the Railway backend (avoids CORS)
- Catch-all rewrite to `index.html` for client-side routing

No environment variables need to be set in the Vercel dashboard — the proxy rewrite handles the backend URL directly.

## Architecture — Data Flow

```mermaid
flowchart TD
    User([User])

    User -->|credentials| Login
    Login -->|POST /auth/login| API
    API -->|token + user info| Redux[(Redux Store\nauth · sidebar · theme)]
    Redux -->|persisted| LS[(localStorage)]

    Redux -->|auth guard| Layout[App Layout\nHeader + Sidebar + Outlet]

    Layout --> Dashboard
    Layout --> CreateTest

    Dashboard -->|GET /tests| API
    API -->|test list| DataGrid[MUI DataGrid\nsearch · sort · paginate]
    DataGrid -->|delete action| API2[DELETE /tests/:id]

    CreateTest -->|initialises| Context[(Wizard Context\ntestId · activeStep\ndisabled · type\nquestions · testDetails)]

    Context --> BasicDetails[Step 1 · Basic Details\nFormik form]
    BasicDetails -->|POST /tests| API
    BasicDetails -->|PUT /tests/:id| API
    API -->|testId| Context

    Context --> Questions[Step 2 · Questions\nFormik FieldArray]
    Questions -->|+MCQ button| NewQ[Empty question injected]
    Questions -->|CSV Upload| XLSX[xlsx parser\nreads XLS·XLSX·CSV]
    XLSX -->|parsed rows| Questions
    NewQ --> Questions
    Questions -->|POST /questions per row| API

    Context --> Publish[Step 3 · Publish\npreview test details]
    Publish -->|PUT /tests/:id\nstatus=live| API
    Publish -->|Edit Questions| Context
```

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + Vite 8 |
| UI | MUI v9, SCSS |
| State | Redux Toolkit + redux-persist |
| Forms | Formik + Yup |
| HTTP | Axios |
| Table | MUI X DataGrid |
| Rich text | React Quill |
| File parsing | xlsx |
