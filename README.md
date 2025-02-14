# TimeSheet Project

A full-stack timesheet application with separate frontend and backend directories.

## Installation Instructions

Follow these steps to set up the project locally:

### 1. Clone the Repository

```bash
git clone [https://github.com/kizido/TimeSheet.git](https://github.com/kizido/TimeSheet.git)
cd TimeSheet
```

### 2. Setup the Frontend
Move to the frontend directory
```bash
cd frontend
```
Install Dependencies
```bash
npm install
```
Run the Client
```bash
npm run dev

### 3. Setup the Backend
Move to the backend directory
```bash
cd backend
Install Dependencies
```bash
npm install
Run the Client
```bash
npm run dev

### 4. Create API URL variable in frontend .env
Create a .env file in the frontend root repository called
```bash
VITE_API_URL=yourServerApiUrl

### 5. Create Backend variables in backend .env
Create a .env file in the backend root repository with the following variables:
```git bash
MONGODB_URI=yourMongodbConnectionString
```git bash
JWT_SECRET=your64ByteHexSecret
```git bash
CORS_ORIGIN_DEV=yourFrontendClientUrl
