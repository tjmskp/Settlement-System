# Setup script for Settlemates development environment

Write-Host "Setting up Settlemates development environment..." -ForegroundColor Green

# Check if Chocolatey is installed
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Chocolatey..." -ForegroundColor Yellow
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
}

# Install PHP
if (!(Get-Command php -ErrorAction SilentlyContinue)) {
    Write-Host "Installing PHP..." -ForegroundColor Yellow
    choco install php -y
    refreshenv
}

# Install Composer
if (!(Get-Command composer -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Composer..." -ForegroundColor Yellow
    choco install composer -y
    refreshenv
}

# Install Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Node.js..." -ForegroundColor Yellow
    choco install nodejs-lts -y
    refreshenv
}

# Install Docker Desktop if not installed
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Docker Desktop..." -ForegroundColor Yellow
    choco install docker-desktop -y
    refreshenv
}

# Create necessary directories
Write-Host "Creating project directories..." -ForegroundColor Yellow
$directories = @(
    "services/user",
    "services/document",
    "services/communication",
    "services/appointment",
    "services/billing",
    "services/analytics",
    "frontend",
    "nginx/conf.d"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force
    }
}

Write-Host "Development environment setup complete!" -ForegroundColor Green
Write-Host @"

Next steps:
1. Start Docker Desktop
2. Run 'docker-compose up -d' to start the development environment
3. Follow the README.md for further instructions

"@ -ForegroundColor Cyan 