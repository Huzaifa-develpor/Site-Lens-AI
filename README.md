# SiteLens AI

> AI-powered website auditing SaaS built with Next.js, Google Gemini,
> Firecrawl, MongoDB, and Safepay.

SiteLens AI is a full-stack AI SaaS application that analyzes a public
website and generates an actionable audit across **SEO, UX,
Accessibility, Content, and Conversion**.

The project combines AI analysis, web crawling, authentication, database
persistence, recurring subscriptions, checkout, webhooks, and production
deployment into one complete SaaS workflow.

## 🚀 Live Demo

**Live Application:**\
https://site-lens-ai-woad.vercel.app/

**GitHub Repository:**\
https://github.com/Huzaifa-develpor/Site-Lens-AI

------------------------------------------------------------------------

## ✨ Features

### 🤖 AI Website Audit

-   Accepts a public website URL from the user.
-   Validates the submitted URL before processing.
-   Uses **Firecrawl** to crawl and extract website content and
    metadata.
-   Uses **Google Gemini** to analyze the extracted website data.
-   Generates structured AI audit results.
-   Produces scores for:
    -   Overall
    -   SEO
    -   UX
    -   Accessibility
    -   Content
    -   Conversion

### 📊 Free & Pro Audit Reports

The audit is divided into two levels.

**Free report includes:** - Issue ID - Category - Issue title -
Severity - Problem description

**Pro report includes:** - Why the issue matters - How to fix it -
Recommended solution - Optional code examples

This creates a practical SaaS feature-gating model where the free report
identifies problems while the Pro experience provides detailed
implementation guidance.

### 💳 Safepay Subscription System

-   Safepay checkout integration.
-   Recurring subscription payments.
-   Monthly and yearly Pro plans.
-   Subscription creation through backend API routes.
-   Payment and subscription status handling.
-   Webhook-based payment processing.
-   Pro access controlled using backend subscription/payment state.
-   MongoDB persistence for payment/subscription information.

### 🔐 OTP Authentication

-   OTP-based authentication flow.
-   Verification handled through backend API routes.
-   Resend integration for email delivery.
-   Authentication state used for protected application flows.

### ⚡ Next.js Full-Stack Architecture

-   Next.js App Router.
-   Server-side API routes.
-   Dynamic API endpoints.
-   Client and server component usage.
-   MongoDB/Mongoose integration.
-   Backend logic implemented inside the Next.js application.
-   Production deployment on Vercel.

### 🎨 Modern UI

-   Tailwind CSS.
-   Framer Motion animations.
-   Lucide React icons.
-   Responsive SaaS interface.
-   Animated interactions and transitions.
-   Audit score and issue presentation.
-   Free/Pro feature separation.
-   Loading and error states.

------------------------------------------------------------------------

## 🧠 How SiteLens AI Works

``` text
User enters website URL
        ↓
Next.js frontend
        ↓
/api/audit
        ↓
URL validation
        ↓
Firecrawl
        ↓
Website content + metadata
        ↓
Google Gemini
        ↓
Structured AI audit
        ↓
Free / Pro issue separation
        ↓
MongoDB
        ↓
Free audit report
        ↓
User chooses Pro
        ↓
Safepay Checkout
        ↓
Recurring Subscription
        ↓
Safepay Webhook
        ↓
Subscription / Payment Status
        ↓
Pro Access
```

------------------------------------------------------------------------

## 🏗️ Application Architecture

### Audit Pipeline

1.  User submits a website URL.
2.  The Next.js audit API validates the URL.
3.  Private/internal URLs are rejected.
4.  Firecrawl crawls the public website.
5.  Website metadata and content are extracted.
6.  The extracted data is sent to Google Gemini.
7.  Gemini returns structured JSON containing scores and issues.
8.  The generated issues are separated into Free and Pro data.
9.  The audit is stored in MongoDB.
10. The Free report is returned to the user.
11. Pro users can access the detailed resolution information.

### Payment Pipeline

1.  User selects a Pro subscription.
2.  The frontend requests the checkout API.
3.  The backend creates the Safepay subscription checkout.
4.  The customer completes payment through Safepay.
5.  Safepay sends payment/subscription events to the webhook endpoint.
6.  The backend processes the webhook.
7.  MongoDB is updated with the relevant payment/subscription state.
8.  The application uses that backend state to control Pro access.

The application does not rely only on a frontend redirect to determine
whether a payment succeeded.

------------------------------------------------------------------------

## 📁 Project Structure

The project uses a `src`-based Next.js structure:

``` text
Site-Lens-AI/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── audit/
│   │   │   ├── audit-status/
│   │   │   ├── auth/
│   │   │   ├── checkout/
│   │   │   ├── subscription/
│   │   │   └── webhook/
│   │   │
│   │   ├── globals.css
│   │   ├── layout.jsx
│   │   └── page.jsx
│   │
│   ├── components/
│   │
│   ├── lib/
│   │
│   └── models/
│
├── .env.local
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
└── postcss.config.mjs
```

### Important API Routes

  Route                 Responsibility
  --------------------- --------------------------------------------
  `/api/audit`          Starts the website audit
  `/api/audit-status`   Handles/retrieves audit processing status
  `/api/auth`           OTP authentication flow
  `/api/checkout`       Creates Safepay checkout/subscription flow
  `/api/subscription`   Handles subscription-related operations
  `/api/webhook`        Processes Safepay webhook events

------------------------------------------------------------------------

## 🧰 Tech Stack

  Technology           Purpose
  -------------------- -------------------------------------------
  **Next.js 16**       Full-stack React framework and App Router
  **React 19**         User interface
  **JavaScript**       Application development
  **Tailwind CSS 4**   Styling and responsive UI
  **Framer Motion**    Animations and transitions
  **Lucide React**     UI icons
  **MongoDB**          Persistent application data
  **Mongoose**         MongoDB object modeling
  **Google Gemini**    AI-powered website analysis
  **Firecrawl**        Website crawling and content extraction
  **Safepay**          Checkout and recurring subscriptions
  **Resend**           Email delivery for OTP authentication
  **Vercel**           Production deployment

------------------------------------------------------------------------

## 🔑 Environment Variables

Create a `.env.local` file in the project root and configure the
required credentials.

``` env
GEMINI_API_KEY=your_gemini_api_key
FIRECRAWL_API_KEY=your_firecrawl_api_key

MONGODB_URI=your_mongodb_connection_string

# Safepay
SAFE_PAY_API_KEY=your_safepay_api_key
SAFE_PAY_SECRET_KEY=your_safepay_secret_key
SAFE_PAY_WEBHOOK_SECRET=your_safepay_webhook_secret

SAFE_PAY_MONTHLY_PLAN_ID=your_monthly_plan_id
SAFE_PAY_YEARLY_PLAN_ID=your_yearly_plan_id

# OTP / Email
RESEND_API_KEY=your_resend_api_key
```

Use the exact environment variable names required by your local
deployment configuration.

**Never commit `.env.local` or any production secrets to GitHub.**

------------------------------------------------------------------------

## 🛠️ Getting Started

### 1. Clone the repository

``` bash
git clone https://github.com/Huzaifa-develpor/Site-Lens-AI.git
cd Site-Lens-AI
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create:

``` text
.env.local
```

Add the required:

-   Gemini API key
-   Firecrawl API key
-   MongoDB connection string
-   Safepay credentials
-   Safepay plan IDs
-   Resend API key
-   Other project-specific secrets

### 4. Run the development server

``` bash
npm run dev
```

Open the local URL provided by Next.js, normally:

``` text
http://localhost:3000
```

### 5. Build for production

``` bash
npm run build
```

### 6. Start the production server

``` bash
npm start
```

------------------------------------------------------------------------

## 🔒 Security Considerations

-   API keys and payment secrets are kept server-side.
-   Environment variables are used for sensitive credentials.
-   `.env.local` is excluded from source control.
-   User-submitted URLs are validated before crawling.
-   Local/internal hostnames are rejected by the audit API.
-   Payment state is processed through backend webhook handling.
-   Pro access is based on backend application state rather than only
    client-side UI state.
-   OTP verification is handled through the authentication API.

------------------------------------------------------------------------

## 🧪 What This Project Demonstrates

SiteLens AI was built as a practical AI SaaS project rather than a
simple CRUD application.

### Frontend Engineering

-   Next.js App Router
-   React
-   Client/server component architecture
-   Tailwind CSS
-   Responsive UI
-   Framer Motion
-   Loading and error states
-   API integration

### Backend Engineering

-   Next.js API routes
-   Request validation
-   Dynamic API routes
-   MongoDB and Mongoose
-   Server-side business logic
-   Structured JSON processing
-   Error handling
-   External service integrations

### AI Engineering

-   Google Gemini API
-   Prompt engineering
-   Structured AI output
-   AI-generated website scores
-   AI-generated issue detection
-   AI-generated recommendations
-   Code-example generation
-   Free/Pro AI result separation

### Web Crawling

-   Firecrawl integration
-   Website metadata extraction
-   Main-content extraction
-   Public URL validation
-   Passing crawled data into an AI analysis pipeline

### Authentication

-   OTP-based authentication
-   Email OTP delivery
-   Authentication API routes
-   Protected application flows

### Payments & SaaS

-   Safepay integration
-   Hosted checkout
-   Recurring subscriptions
-   Monthly/yearly plans
-   Webhooks
-   Payment status processing
-   Subscription state management
-   Pro feature gating

### Deployment

-   Vercel deployment
-   Production environment variables
-   Production API configuration
-   Production webhook configuration

------------------------------------------------------------------------

## 🎯 Core Engineering Flow

The main value of the project is the integration of several
production-style systems:

``` text
Next.js
   │
   ├── React UI
   │
   ├── API Routes
   │
   ├── MongoDB / Mongoose
   │
   ├── OTP Authentication
   │
   ├── Firecrawl
   │       ↓
   │   Website Data
   │       ↓
   │   Gemini AI
   │       ↓
   │   Audit Results
   │
   └── Safepay
           ↓
       Checkout
           ↓
     Subscription
           ↓
        Webhook
           ↓
     Pro Access
```

------------------------------------------------------------------------

## 📌 Project Status

**Status: Completed and Deployed**

Live production application:

https://site-lens-ai-woad.vercel.app/

Repository:

https://github.com/Huzaifa-develpor/Site-Lens-AI

------------------------------------------------------------------------

## 👨‍💻 Author

**Muhammad Huzaifa Anwar**

BS Computer Science Student\
Full-Stack / MERN / Next.js Developer

GitHub: https://github.com/Huzaifa-develpor
