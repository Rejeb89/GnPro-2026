# Deployment on Vercel

This project is configured to be deployed on Vercel as a single project containing both the React frontend and the Express backend.

## Instructions

1.  **Push to GitHub/GitLab/Bitbucket**: Ensure your code is pushed to a repository.
2.  **Import to Vercel**:
    *   Create a new project on Vercel.
    *   Select your repository.
    *   **Root Directory**: Set this to `gn-mangment--main`.
3.  **Environment Variables**:
    *   `DATABASE_URL`: Your PostgreSQL connection string (e.g., from Supabase or Neon).
    *   `JWT_SECRET`: A secure random string for authentication.
    *   `VITE_API_URL`: (Optional) Leave empty to use the default `/api` relative path.
4.  **Build Settings**:
    *   Vercel should automatically detect the settings from `vercel.json`.

## Notes

- The backend is served via serverless functions under the `/api` prefix.
- Prisma client is generated during the build process.
- Frontend is built using Vite and served as static files.
