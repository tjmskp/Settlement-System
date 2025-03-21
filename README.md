# Settlemates - Settlement Automation System

Settlemates is a comprehensive settlement automation platform designed for the Australian market. It streamlines the settlement process through a microservices architecture, providing secure document management, real-time communication, and automated workflows.

## System Architecture

- **Backend**: PHP (Laravel) microservices
- **Frontend**: React with TypeScript
- **Database**: MySQL
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **Search**: Elasticsearch
- **Storage**: AWS S3

## Core Microservices

1. **User Service**: Authentication and authorization
2. **Document Service**: Document management and e-signatures
3. **Communication Service**: Real-time messaging and notifications
4. **Appointment Service**: Calendar and scheduling
5. **Billing Service**: Financial transactions and time tracking
6. **Analytics Service**: Reporting and insights

## Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+
- Docker & Docker Compose
- MySQL 8.0+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/settlemates.git
cd settlemates
```

2. Install backend dependencies:
```bash
composer install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Start the development environment:
```bash
docker-compose up -d
```

5. Run migrations:
```bash
php artisan migrate
```

## Development

- Backend API documentation is available at `/api/documentation`
- Frontend development server runs on `http://localhost:3000`
- API server runs on `http://localhost:8000`

## Security

- All data is encrypted at rest and in transit
- Role-based access control (RBAC)
- Regular security audits
- Compliance with Australian data protection regulations

## License

Proprietary - All rights reserved 