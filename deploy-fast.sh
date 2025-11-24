  #!/bin/bash
  echo "=== Fast Deployment Started $(date) ===" >> /var/log/deploy-fast.log

  cd /var/www/tenten

  # Reset any local changes and force pull from origin
  git fetch origin >> /var/log/deploy-fast.log 2>&1
  git reset --hard origin/main >> /var/log/deploy-fast.log 2>&1

  # Only rebuild assets
  npm run build >> /var/log/deploy-fast.log 2>&1

  # Clear essential caches
  php artisan view:clear >> /var/log/deploy-fast.log 2>&1
  php artisan route:clear >> /var/log/deploy-fast.log 2>&1

  echo "=== Fast Deployment Completed $(date) ===" >> /var/log/deploy-fast.log
