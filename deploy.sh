#!/bin/bash
echo "=== Starting Deployment $(date) ===" >> /var/log/deploy.log

  cd /var/www/tenten

  # Fix ownership first
  chown -R www-data:www-data /var/www/tenten

  # Pull latest changes
  git pull origin main >> /var/log/deploy.log 2>&1

  # Install PHP dependencies
  composer install --no-dev --optimize-autoloader >> /var/log/deploy.log 2>&1

  # Install Node dependencies with proper permissions
  npm install --unsafe-perm=true --allow-root >> /var/log/deploy.log 2>&1

  # Build assets (skip if TypeScript fails)
  npm run build >> /var/log/deploy.log 2>&1 || echo "Build failed, skipping..." >> /var/log/deploy.log

  # Run Laravel commands
  php artisan migrate --force >> /var/log/deploy.log 2>&1
  php artisan config:clear >> /var/log/deploy.log 2>&1
  php artisan cache:clear >> /var/log/deploy.log 2>&1
  php artisan route:clear >> /var/log/deploy.log 2>&1
  php artisan view:clear >> /var/log/deploy.log 2>&1

  # Fix permissions again after build
  chown -R www-data:www-data /var/www/tenten
  chmod -R 755 /var/www/tenten/storage
  chmod -R 755 /var/www/tenten/bootstrap/cache

  echo "=== Deployment Completed $(date) ===" >> /var/log/deploy.log
