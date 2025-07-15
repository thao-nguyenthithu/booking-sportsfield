# Running EasyField

## Database Setup
- Create the database: `CREATE DATABASE easyfield;`
- Import schema: `mysql -u root -p easyfield < backend/src/main/resources/database.sql`

## Backend
- Start with: `cd backend && ./mvnw spring-boot:run`

## Frontend
- Start with: `cd frontend && npm install && npm run dev`

## Features
- Venue/field management
- Booking and payment
- Owner dashboard
- Financial reporting

See `README.md` for more. 