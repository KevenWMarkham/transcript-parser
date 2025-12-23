/**
 * PM2 ecosystem configuration for production deployment
 * Used to manage the Node.js process on Hostinger VPS
 */

module.exports = {
  apps: [{
    name: 'transcript-parser',
    script: 'serve',
    args: '-s dist -l 3000',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/pm2/transcript-parser-error.log',
    out_file: '/var/log/pm2/transcript-parser-out.log',
    log_file: '/var/log/pm2/transcript-parser-combined.log',
    time: true,
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
}
