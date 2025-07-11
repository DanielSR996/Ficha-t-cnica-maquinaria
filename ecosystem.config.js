module.exports = {
  apps: [
    {
      name: 'maquinarias-backend',
      script: 'backend/server.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ],

  deploy: {
    production: {
      user: 'root',
      host: 'TU_IP_VPS',
      ref: 'origin/main',
      repo: 'TU_REPOSITORIO_GIT',
      path: '/var/www/maquinarias',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && cd backend && npm install && cd ../frontend && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}; 