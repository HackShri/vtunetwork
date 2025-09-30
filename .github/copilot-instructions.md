## Quick context for AI coding agents — vtunetwork repo

This repo is a two-part fullstack app: a React + Vite frontend (`/my-app`) and an Express/Mongo backend (`/server`). The UI is a study-notes sharing app (VTU oriented). Use the notes below to be immediately productive when changing code.

- Big picture
  - Frontend: `/my-app` (Vite + React). Entry: `src/main.jsx`. UI components under `src/components` and pages under `src/pages`. Routing uses `react-router-dom`.
  - Backend: `/server` (Express). Entry: `server.js`. Routes mounted under `/api/user` via files in `/server/routes` (notable: `authRoute.js`, `fileUpload.js`, `reviewRoute.js`). DB connections in `/server/database/db.js` using Mongoose.
  - Data flow: frontend calls backend endpoints under `/api/user/*`. File uploads are handled with Cloudinary (server uses `cloudinary` helper in `/server/helpers/cloudinary-helpers.js`). Sessions use `express-session` + `connect-mongo`.

- Key commands
  - Frontend dev: `cd my-app; npm install; npm run dev` (Vite serves at default 5173). Build: `npm run build`. Preview: `npm run preview`.
  - Backend dev: `cd server; npm install; npm run dev` (uses `nodemon server.js`). Server default port: 8080. Ensure `.env` contains `MONGO_URL`, `SESSION_SECRET`, `CLOUDINARY_*` and `CORS_ORIGINS` if needed.
  - Monorepo / Docker: `docker-compose.yml` exists for integrated runs — inspect service names before changing ports.

- Important files to inspect before edits
  - Frontend: `my-app/src/common/data.js` (central subject/semester mappings and helper functions like `getSubjects`), `src/pages/userProfile/FileUpload.jsx` (upload UI), `src/pages/Notesgallery/*` (filters & viewers). UI primitives live under `src/components/ui/` (Select, Input, etc.).
  - Backend: `server/server.js` (CORS, sessions), `server/controllers/fileupload-controller.js` (handles metadata save), `server/routes/fileUpload.js` (upload endpoints), `server/config/cloudinary.js` (cloud settings).

- Project-specific conventions
  - Semester values sometimes appear as numeric strings (`"1"`, `"2"`) or full labels (`"Sem 1"`). Use the helper functions in `my-app/src/common/data.js` (`getSubjects`, `getSubjectCode`) to normalize branch+semester lookups.
  - Subject lists are stored in three related structures: `subjects` (friendly names), `semSubjects` (codes per branch+"Sem X"), and `subjectCodeMap` (maps friendly names to codes). When adding subjects, update all three where appropriate.
  - Frontend components expect semester values from `semesters` export; prefer using that array instead of hardcoding values.

- Integration & external dependencies
  - Cloudinary: used for file storage. Server helpers in `/server/helpers/cloudinary-helpers.js` and `/server/config/cloudinary.js`. Upload preset and cloud name come from env variables on frontend and server.
  - Authentication: Passport + Google OAuth configured under `/server/auth` and `/server/routes/googleStrategy.js`. Sessions are stored in MongoDB via `connect-mongo`.
  - Database: MongoDB with Mongoose; models under `/server/models` (User, pdf, reviews). `server/database/db.js` reads `MONGO_URL` from env.

- Debugging & tests
  - There are no unit tests in the repo. Use the dev servers for integration testing: run backend (`npm run dev`) and frontend (`npm run dev`) concurrently and exercise the UI.
  - For quick log traces, add console.debug/console.log in controllers (backend) or effect hooks (frontend) and reproduce API calls from the UI. Backend logs appear in the terminal running `nodemon`.

- PR/Formatting rules
  - Linting/format: `npm run lint` and `npm run format` exist in both `my-app` and `server`. Frontend uses ESLint + Prettier. Keep changes consistent with existing style (Tailwind + shadcn UI patterns).
  - CI: `.github/workflows/ci.yaml` runs basic checks — avoid breaking lint/build in your edits.

- Examples of small, safe edits
  - To restrict Subject dropdown to match a selected branch+semester, update components to use `getSubjects(branch, semester)` (see `my-app/src/pages/Notesgallery/NotesPdfviewer.jsx` and `my-app/src/pages/userProfile/FileUpload.jsx`).
  - When adding a new branch or subject, add entries to `my-app/src/common/data.js` in `semSubjects`, `subjects`, and `subjectCodeMap` to keep UI and code lookup stable.

If any section here is unclear or you'd like me to include more examples (e.g., example API payloads, env vars file template, or Docker usage notes), tell me what to expand and I'll iterate. 
