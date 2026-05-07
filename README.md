# EcoSpark Backend

A TypeScript + Express backend for the EcoSpark platform with authentication, ideas, feedback, voting, purchase/payment flows, and admin APIs.

## Tech Stack

- Runtime: Node.js, Express
- Language: TypeScript
- ORM/DB: Prisma, PostgreSQL (`pg`)
- Auth: `better-auth`, JWT
- Validation: Zod
- File Upload: Multer, Cloudinary
- Email: Nodemailer
- Payment: Stripe
- Scheduling: node-cron
- Deployment: Vercel (Serverless)

## Main Features

- Email/password registration and login
- Email OTP verification and password reset flow
- Token refresh and protected profile endpoint
- Category management
- Idea management
- Feedback module
- Vote module
- Purchase module
- Admin module
- Stripe webhook handling

## API Base URL

- Local: `http://localhost:5000`
- Prefix: `/api/v1`

Example:

- Auth register: `POST /api/v1/auth/register`
- Auth login: `POST /api/v1/auth/login`

## Available API Modules

From [src/app/routes/index.ts](src/app/routes/index.ts):

- `/auth`
- `/category`
- `/idea`
- `/feedback`
- `/vote`
- `/purchase`
- `/admin`

## Scripts

From [package.json](package.json):

- `npm run dev` -> Run in watch mode with `tsx`
- `npm run build` -> Prisma generate + TypeScript build + import fix script
- `npm start` -> Run compiled server from `dist/server.js`
- `npm run stripe:webhook` -> Forward Stripe webhook to local server

## Environment Variables

Required keys are defined in [src/app/config/env.ts](src/app/config/env.ts):

- `NODE_ENV`
- `PORT` (optional fallback to `5000` in code)
- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `FRONTEND_URL`
- `ACCESS_TOKEN_SECRET`
- `ACCESS_TOKEN_EXPIRES_IN`
- `REFRESH_TOKEN_SECRET`
- `REFRESH_TOKEN_EXPIRES_IN`
- `EMAIL_SENDER_SMTP_USER`
- `EMAIL_SENDER_SMTP_PASS`
- `EMAIL_SENDER_SMTP_HOST`
- `EMAIL_SENDER_SMTP_PORT`
- `EMAIL_SENDER_SMTP_FROM`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Create `.env` in the project root and set all required values.

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Configure `.env`.

3. Build project:

```bash
npm run build
```

4. Run development server:

```bash
npm run dev
```

5. For production-like local run:

```bash
npm run build
npm start
```

## Webhook Endpoint

Defined in [src/app.ts](src/app.ts):

- `POST /webhook` (Stripe raw body endpoint)

## Deployment (Vercel)

This project is configured for Vercel serverless using:

- [vercel.json](vercel.json)
- [api/index.js](api/index.js)

Deploy:

```bash
vercel --prod
```

## Project Structure (High-Level)

- `src/app/module/*` -> business modules
- `src/app/lib/*` -> shared libs (auth, prisma)
- `src/app/config/*` -> env, cloudinary, stripe, multer
- `prisma/*` -> schema and migrations
- `api/index.js` -> Vercel serverless entry

## Notes

- Use `https://ecospark-backend.vercel.app` as the stable production backend URL.
- Use that backend domain (not Vercel dashboard URL) in `BETTER_AUTH_URL`.
