# BloodLine

A modern blood donation management system built with Laravel and React. BloodLine connects blood donors with hospitals to streamline the blood donation process and save lives.

## Features

- **User Roles**: Separate dashboards and functionality for donors, hospitals, and administrators
- **Blood Request Management**: Hospitals can create urgent blood requests with priority levels
- **Donor Registration**: Donors can register for scheduled donations with date and session selection
- **Eligibility Tracking**: Automatic 56-day cooldown tracking between donations
- **Calendar View**: Visual calendar for hospitals to manage scheduled donations
- **Real-time Updates**: Status updates for donations (scheduled, in-progress, completed)
- **Inventory Management**: Blood stock tracking for hospitals
- **Mobile Responsive**: Full mobile navigation and responsive design

## Tech Stack

- **Backend**: Laravel 12.x, PHP 8.2
- **Frontend**: React 19, Inertia.js, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Database**: MySQL
- **Build Tool**: Vite

## Installation Guide

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js 18+ and npm
- MySQL 5.7+ or MariaDB
- XAMPP (for local development on Windows)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd BloodLine
```

### Step 2: Install PHP Dependencies

```bash
composer install
```

### Step 3: Install Node.js Dependencies

```bash
npm install
```

### Step 4: Environment Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bloodline
DB_USERNAME=root
DB_PASSWORD=your_password
```

### Step 5: Generate Application Key

```bash
php artisan key:generate
```

### Step 6: Create Database

Create a MySQL database named `bloodline` (or your preferred name matching the `.env` file).

### Step 7: Run Migrations

```bash
php artisan migrate
```

### Step 8: Build Frontend Assets

```bash
npm run build
```

Or for development with hot reload:
```bash
npm run dev
```

### Step 9: Start the Development Server

```bash
php artisan serve
```

The application will be available at `http://localhost:8000`

## Development Setup

### Running Development Servers

In separate terminal windows:

```bash
# Terminal 1 - Laravel backend
php artisan serve

# Terminal 2 - Vite frontend dev server
npm run dev
```

### Code Quality

```bash
# Run Laravel Pint for PHP code styling
./vendor/bin/pint

# Run ESLint for JavaScript
npm run lint
```

## Project Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Auth/           # Authentication controllers
│   │   ├── AdminController.php
│   │   └── ClientController.php
│   ├── Requests/           # Form request validation
│   └── Services/           # Business logic services
├── Models/                 # Eloquent models
resources/
├── js/
│   ├── Pages/              # React page components
│   │   ├── Admin/
│   │   ├── Auth/
│   │   ├── Client/
│   │   └── Donor/
│   ├── Components/         # Reusable UI components
│   └── Layouts/            # Page layouts
└── css/
routes/
    └── web.php             # Application routes
database/
    └── migrations/          # Database migrations
```

## Key Features Implementation

### Donor Eligibility System

Donors must wait 56 days between donations. This is enforced in:
- `app/Models/User.php` - `canDonate()` method
- `app/Services/DonationService.php` - Registration validation

### Calendar System

Hospitals can view scheduled donations on a calendar:
- Calendar grid generated server-side in `ClientController::calendar()`
- Interactive day cells show donation counts
- Click donations to view details in modal

### Status Workflow

Donations flow through statuses:
1. `scheduled` - Initial registration
2. `in_progress` - Donor at facility
3. `completed` - Donation finished
4. `cancelled` - Appointment cancelled

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## Security

- Authentication via Laravel Breeze with Inertia
- CSRF protection enabled
- Password hashing with bcrypt
- Role-based access control

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
