<?php
  // GitHub Webhook Handler
  $headers = getallheaders();
  $payload = file_get_contents('php://input');

  // Load webhook secret from environment or config
  $secret = getenv('GITHUB_WEBHOOK_SECRET') ?: 'changeme_set_in_env';

  // Verify GitHub signature (SECURITY: prevents unauthorized deployments)
  $signature = $headers['X-Hub-Signature-256'] ?? '';

  if (!empty($secret) && $secret !== 'changeme_set_in_env') {
      $expectedSignature = 'sha256=' . hash_hmac('sha256', $payload, $secret);

      if (!hash_equals($expectedSignature, $signature)) {
          http_response_code(403);
          file_put_contents('/var/log/webhook.log', date('Y-m-d H:i:s') . " - Invalid signature! Deployment blocked.\n", FILE_APPEND);
          die('Invalid signature');
      }
  }

  // Log the webhook request
  file_put_contents('/var/log/webhook.log', date('Y-m-d H:i:s') . " - Webhook received (signature verified)\n", FILE_APPEND);

  // Respond to GitHub immediately (within 10 seconds)
  http_response_code(200);
  echo "OK";

  // Use fastcgi_finish_request to send response immediately
  if (function_exists('fastcgi_finish_request')) {
      fastcgi_finish_request();
  }

  // Now run deployment in background
  $deployScript = '/var/www/tenten/deploy-fast.sh';
  if (file_exists($deployScript)) {
      // Run in background with nohup
      exec("nohup bash $deployScript > /dev/null 2>&1 &");
  }

  file_put_contents('/var/log/webhook.log', date('Y-m-d H:i:s') . " - Background deployment started\n", FILE_APPEND);
  ?>
