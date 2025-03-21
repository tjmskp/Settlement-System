#!/bin/bash

# Ensure all dependencies are installed
echo "Installing dependencies..."
npm install

# Run tests
echo "Running tests..."
npm test

# Run linting
echo "Running linter..."
npm run lint

# Build the application
echo "Building the application..."
npm run build

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

# Set environment variables
echo "Setting environment variables..."
vercel env add NEXTAUTH_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXT_PUBLIC_API_URL production

echo "Deployment complete!" 