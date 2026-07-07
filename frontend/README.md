# HireBridge - Job Scraper Platform

Frontend for the HireBridge assignment: role-based job search, application history, manager job posting, applicant tracking, and profile management.

## Run Locally

Backend:

```bash
cd ../backend
npm install prisma @prisma/client
npx prisma migrate deploy
npm run dev
```

Frontend:

```bash
cd ../frontend
npm install
npm run dev
```

Set `VITE_API_URL` if the backend is not available at `http://localhost:5000/api`.
