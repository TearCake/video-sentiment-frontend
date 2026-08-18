# 🎥 Video Sentiment Frontend

<div align="center">
  <h3>A modern web application for analyzing emotions in videos using AI.</h3>
</div>

<br />

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/AWS_S3-569A31?style=for-the-badge&logo=amazon-s3" alt="AWS S3" />
  <img src="https://img.shields.io/badge/AWS_SageMaker-569A31?style=for-the-badge&logo=amazon-aws" alt="AWS SageMaker" />
</div>

## 🌟 Overview

The **Video Sentiment Frontend** is a sleek, responsive interface that allows users to upload videos and receive real-time sentiment and emotional analysis. Built on top of the robust **T3 Stack**, this application integrates seamlessly with AWS services for secure storage and powerful AI inference.

## ✨ Features

- **Secure Video Uploads**: Direct-to-S3 uploads using pre-signed URLs for maximum security and performance.
- **AI-Powered Inference**: Connects to AWS SageMaker endpoints to analyze video content and extract emotional insights.
- **Modern UI/UX**: Beautifully designed with Tailwind CSS for a fluid and responsive experience.
- **Type-Safe**: Full TypeScript coverage from database to frontend components.
- **Authentication**: Powered by NextAuth.js for secure user sessions and data isolation.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Database ORM**: [Prisma](https://prisma.io) with SQLite
- **Authentication**: [NextAuth.js v5](https://next-auth.js.org)
- **Cloud Infrastructure**:
  - AWS S3 (Video Storage)
  - AWS SageMaker (AI Inference)
- **Validation**: [Zod](https://zod.dev) & React Hook Form

## 🚀 Getting Started

Follow these steps to get the project running locally.

### Prerequisites

- Node.js (v20+)
- npm
- AWS Account with S3 and SageMaker configured

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TearCake/video-sentiment-frontend.git
   cd video-sentiment-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory and add the necessary variables (use `.env.example` if available):
   ```env
   # Database
   DATABASE_URL="file:./db.sqlite"

   # Next Auth
   AUTH_SECRET="your-super-secret"

   # AWS Credentials
   AWS_ACCESS_KEY_ID="your-access-key"
   AWS_SECRET_ACCESS_KEY="your-secret-key"
   AWS_REGION="your-aws-region"
   AWS_S3_BUCKET_NAME="your-bucket-name"
   AWS_SAGEMAKER_ENDPOINT="your-sagemaker-endpoint"
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to view the application.

## 📁 Project Structure

- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - Reusable React components
- `/src/server` - Backend logic, database config, and authentication
- `/prisma` - Database schema and migrations

## 📝 License

This project is licensed under the MIT License.
