# Family Calendar & Planning Tool

A comprehensive family calendar and planning application built with Next.js, React, and PostgreSQL. This application allows families to manage their schedules, grocery lists, and chores in one centralized location.

## Features

- **Multi-Calendar View**: Display multiple Google Calendars in a single, color-coded grid
- **Family Management**: Multi-tenant system supporting multiple families
- **Grocery Lists**: Create and manage shared grocery lists with family members
- **Chore Management**: Assign and track chores with due dates and completion status
- **Responsive Design**: Fully responsive interface that works on all devices
- **Google Calendar Integration**: Sync with Google Calendar for seamless scheduling

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon)
- **Authentication**: NextAuth.js with Google OAuth
- **Calendar Integration**: Google Calendar API
- **UI Components**: Radix UI, Lucide React icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- Google Cloud Console project with Calendar API enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd family-calendar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.sample .env.local
   ```
   
   Update `.env.local` with your actual values:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/family_calendar"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Google Calendar API
   GOOGLE_CALENDAR_API_KEY="your-google-calendar-api-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Google Calendar Setup

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google Calendar API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Calendar API" and enable it

3. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Set application type to "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://yourdomain.com/api/auth/callback/google` (production)

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" > "OAuth consent screen"
   - Fill in the required information
   - Add your email to test users

## Database Schema

The application uses the following main entities:

- **Family**: Multi-tenant container for users
- **User**: Family members with authentication
- **Calendar**: Google Calendar integrations per family
- **GroceryList**: Shared shopping lists
- **GroceryItem**: Individual items in lists
- **Chore**: Family tasks with assignments

## API Endpoints

### Authentication
- `GET /api/auth/[...nextauth]` - NextAuth.js authentication

### Calendars
- `GET /api/calendars` - Get family calendars
- `POST /api/calendars` - Add new calendar
- `PUT /api/calendars/[id]` - Update calendar
- `DELETE /api/calendars/[id]` - Remove calendar
- `GET /api/calendars/events` - Get calendar events

### Grocery Lists
- `GET /api/grocery-lists` - Get family grocery lists
- `POST /api/grocery-lists` - Create new list
- `POST /api/grocery-items` - Add item to list
- `PUT /api/grocery-items` - Update item
- `DELETE /api/grocery-items` - Remove item

### Chores
- `GET /api/chores` - Get family chores
- `POST /api/chores` - Create new chore
- `PUT /api/chores` - Update chore
- `DELETE /api/chores` - Remove chore

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy

3. **Set up database**
   - Use Neon or another PostgreSQL provider
   - Run migrations in production

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@example.com or create an issue in the GitHub repository.