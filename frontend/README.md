# SettleMates Frontend

A modern legal case management system built with Next.js 14, React, TypeScript, and Tailwind CSS.

## Features

- 📝 Case Management
- 📅 Appointment Scheduling
- 💬 Real-time Messaging
- 📄 Document Management
- 💰 Billing and Payments
- 📊 Analytics Dashboard
- 👤 User Profiles
- 🔔 Real-time Notifications
- ⚙️ User Settings

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Authentication**: NextAuth.js
- **Forms**: React Hook Form
- **Validation**: Zod
- **UI Components**: Headless UI
- **Icons**: Heroicons
- **Testing**: Jest & React Testing Library

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/settlemates-frontend.git
   cd settlemates-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Update the environment variables in `.env.local` with your values

5. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment on Vercel

1. Create a new project on [Vercel](https://vercel.com)

2. Connect your GitHub repository

3. Configure the following environment variables in Vercel:
   - `NEXT_PUBLIC_API_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`

4. Deploy:
   ```bash
   vercel
   ```

   Or configure automatic deployments through Vercel's GitHub integration.

## Project Structure

```
src/
├── app/                # Next.js 14 app directory
│   ├── api/           # API routes
│   ├── auth/          # Authentication pages
│   ├── cases/         # Case management pages
│   ├── appointments/  # Appointment pages
│   ├── documents/     # Document management pages
│   ├── messages/      # Messaging pages
│   ├── billing/       # Billing pages
│   └── analytics/     # Analytics pages
├── components/        # Reusable components
├── hooks/            # Custom React hooks
├── lib/             # Utility functions and API client
├── store/           # Zustand store
└── types/           # TypeScript types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
