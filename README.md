# AI Mock Interview Platform

## Table of Contents

1.  [Introduction](#introduction)
2.  [Features](#features)
3.  [Architecture Overview](#architecture-overview)
    *   [High-Level Design](#high-level-design)
    *   [Frontend Architecture](#frontend-architecture)
    *   [Backend (Assumed)](#backend-assumed)
    *   [Data Flow & Authentication](#data-flow-authentication)
4.  [Technology Stack](#technology-stack)
5.  [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Configuration](#configuration)
    *   [Running the Application](#running-the-application)
6.  [Usage](#usage)

---

## 1. Introduction

The AI Mock Interview Platform is a cutting-edge web application designed to help users prepare for job interviews through AI-powered mock interview simulations. It provides an interactive experience, offering various role-specific interview scenarios and, implicitly, future feedback and performance insights to enhance interview skills.

This repository contains the frontend application, built with Next.js, React, and TypeScript, focusing on a dynamic and responsive user interface for an engaging preparation experience.

## 2. Features

*   **Dynamic Interview Scenarios:** Simulates various interview rounds and roles (e.g., Product Manager, Software Engineer).
*   **Interactive User Interface:** A modern and responsive design, enhanced with animations for a fluid user experience.
*   **Authentication:** User login/logout and session management to personalize the experience.
*   **Role Selection:** Allows users to select specific job roles to tailor the mock interview experience.
*   **Real-time Interaction (Planned):** A dedicated chat interface for AI-driven interview questions and user responses.
*   **Performance Feedback (Planned):** Display of scores and insights into interview performance.

## 3. Architecture Overview

### High-Level Design

The application follows a standard client-server architecture. The frontend, built with Next.js, serves as the user interface and interacts with a separate backend API for core functionalities like user authentication, interview logic, question generation, and performance evaluation.

```
+------------------+     HTTP API      +------------------+
|    Frontend      |<----------------->|      Backend     |
| (Next.js App)    |                   | (e.g., FastAPI,  |
|  - User Interface|                   |    Node.js, etc.)|
|  - API Calls     |                   |  - Authentication|
|  - State Mgmt.   |                   |  - Interview Logic|
|                  |                   |  - AI Models     |
+------------------+                   +------------------+
       |                                       |
       |                                       |
       |                                       |
+------------------------------------------------------------+
|                       User Browser / Device                |
+------------------------------------------------------------+
```

### Frontend Architecture

The frontend is a Next.js application leveraging the App Router.

*   **Framework:** [Next.js](https://nextjs.org) (version 16.1.6) for server-side rendering, static site generation, and API routes (though primarily acting as a client in this setup).
*   **Language:** [TypeScript](https://www.typescriptlang.org/) for type safety and improved developer experience.
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS, enabling rapid UI development and consistent design.
*   **UI Components:** [React](https://react.dev/) (version 19.2.3) for building modular and reusable UI components.
    *   **Animations:** [Framer Motion](https://www.framer.com/motion/) (version 12.34.3) for declarative and performant animations, enhancing user engagement (e.g., in the `Hero` component).
    *   **Icons:** [Lucide React](https://lucide.dev/) (version 0.575.0) for a consistent and accessible icon set.
*   **Core Components:**
    *   `Navbar`: Handles global navigation and displays user authentication status (e.g., user email initials). Manages logout functionality.
    *   `Hero`: The landing page's main component, featuring dynamic text animations and showcasing sample interview scenarios and potential feedback.
    *   `RoleCard`: Represents selectable job roles, leading users to the interview simulation.
    *   `InterviewChat` (planned): The central component for the actual mock interview interaction, likely managing conversation flow and AI responses.
*   **State Management:** Primarily utilizes React's built-in state management (`useState`, `useEffect`, `useContext` where applicable). Authentication tokens and user details are persisted in `localStorage`.
*   **API Interaction:** Uses the native `fetch` API for making HTTP requests to the backend. A dedicated `lib/auth.ts` module handles authentication-related API calls and token management.
*   **Routing:** Leverages Next.js App Router for client-side navigation and URL management.

### Backend (Assumed)

While no backend code is provided in this repository, the frontend's interactions imply the existence of a backend service that provides the following:

*   **Authentication Endpoints:** `/auth/me` to retrieve user information based on an `access_token`. Likely `/auth/login`, `/auth/register` etc., are also present.
*   **Interview Logic:** Endpoints for initiating interviews, submitting user responses, receiving AI-generated questions, and processing interview data.
*   **AI Integration:** Presumably integrates with AI/ML models to power the interview questions, evaluate responses, and generate feedback.
*   **Data Persistence:** Manages user accounts, interview history, feedback, and other application data.
*   **API Base:** Configurable via `NEXT_PUBLIC_API_BASE`, defaulting to `http://127.0.0.1:8000`. This suggests a standard web API (e.g., built with Python/FastAPI, Node.js/Express, Go, etc.).

### Data Flow & Authentication

1.  **Login (Implicit):** A user would log in (e.g., via a dedicated login page, not shown in provided files), receiving an `access_token` from the backend.
2.  **Token Storage:** The `access_token` is stored securely in the browser's `localStorage` (`lib/auth.ts`).
3.  **User Session:** On subsequent page loads or component mounts, the `Navbar` (via `lib/auth.ts`) attempts to retrieve the token and `fetchMe()` from the backend.
4.  **Profile Display:** If a valid token is present and the `fetchMe` call succeeds, the user's email (or initials) is displayed in the `Navbar`.
5.  **Logout:** Calling `clearAuth()` removes the tokens and user data from `localStorage`, effectively logging out the user.
6.  **Protected Routes:** (Implicit) Further API calls to protected resources would include the `Authorization: Bearer <token>` header.

## 4. Technology Stack

*   **Frontend Framework:** Next.js (16.1.6)
*   **Programming Language:** TypeScript (5.x)
*   **UI Library:** React (19.2.3)
*   **Styling:** Tailwind CSS (4.x), PostCSS
*   **Animations:** Framer Motion (12.34.3)
*   **Icons:** Lucide React (0.575.0)
*   **Code Quality:** ESLint
*   **Package Manager:** npm (or yarn/pnpm/bun)

## 5. Getting Started

Follow these instructions to set up and run the frontend application locally.

### Prerequisites

*   Node.js (v18.x or higher recommended)
*   npm (v8.x or higher), yarn, pnpm, or bun
*   Access to the corresponding backend service (running locally or deployed).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/bilalsadiq03/agentic-ai-mock-interview-platform
    cd ai-mock-interview/frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    # or pnpm install
    # or bun install
    ```

### Configuration

The frontend needs to know where your backend API is located.

1.  **Create a `.env.local` file** in the `frontend` directory:
    ```
    NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000
    ```
    Replace `http://127.0.0.1:8000` with the actual URL of your backend API if it's different.

### Running the Application

1.  **Start the development server:**
    ```bash
    npm run dev
    # or yarn dev
    # or pnpm dev
    # or bun dev
    ```
    This will start the Next.js development server.

2.  **Open in browser:**
    Open [http://localhost:3000](http://localhost:3000) in your web browser to see the application.

## 6. Usage

Once the application is running:

1.  **Navigate to the home page:** The `Hero` component will be displayed, showcasing the platform's capabilities.
2.  **Explore roles:** Click on the `RoleCard` components (if rendered on the home page or a dedicated roles page) to initiate a mock interview.
3.  **Authentication:** Use the `Navbar` to check your login status or log out. (Login functionality is currently assumed to be handled by the backend and not fully exposed in the provided frontend components).
