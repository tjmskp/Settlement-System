# Deployment script for Settlemates

Write-Host "Starting Settlemates deployment process..." -ForegroundColor Green

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check for required tools
if (!(Test-Command "vercel")) {
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

if (!(Test-Command "docker")) {
    Write-Host "Error: Docker is required for deployment" -ForegroundColor Red
    exit 1
}

# Deploy Frontend to Vercel
Write-Host "Deploying frontend to Vercel..." -ForegroundColor Yellow
Set-Location frontend
vercel --prod

# Build and push Docker images for backend services
Write-Host "Building and pushing backend services..." -ForegroundColor Yellow
Set-Location ..

$services = @(
    "user",
    "document",
    "communication",
    "appointment",
    "billing",
    "analytics"
)

foreach ($service in $services) {
    Write-Host "Building $service service..." -ForegroundColor Cyan
    docker build -t "settlemates/$service-service" "./services/$service"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Successfully built $service service" -ForegroundColor Green
        
        # Push to container registry (uncomment and modify as needed)
        # docker push "settlemates/$service-service"
    } else {
        Write-Host "Failed to build $service service" -ForegroundColor Red
    }
}

# Deploy backend services (modify these commands based on your cloud provider)
Write-Host @"

Deployment Steps:
1. Frontend has been deployed to Vercel
2. Backend services have been built as Docker images
3. Next steps for backend deployment:
   - Push Docker images to your container registry
   - Deploy services to your cloud provider (AWS, Azure, etc.)
   - Update DNS settings
   - Configure SSL certificates

Remember to:
1. Set up environment variables in Vercel dashboard
2. Configure your domain in Vercel
3. Set up SSL certificates for your API domain
4. Configure CORS settings in your backend services

"@ -ForegroundColor Cyan

Write-Host "Deployment process completed!" -ForegroundColor Green 