# Development Environment Setup

## System Requirements

- **OS**: Windows 11
- **PHP**: Version 8.3 or higher
- **Database**: MySQL 8.0+ or MariaDB 10.5+
- **Web Server**: Laravel artisan 
- **IDE**: Visual Studio Code

## Local Environment Setup

   ```bash
   composer install
   php artisan serve
   php artisan storage:link
   npm install 
   npm run dev
   ```

## Command Line Preference

PowerShell

## Development Workflow

1. Pull latest changes from main branch
2. Create feature branch (`feature/feature-name`)
3. Implement changes following PSR-12 coding standards
4. Write tests for new functionality
5. Run tests and static analysis
6. Create pull request
