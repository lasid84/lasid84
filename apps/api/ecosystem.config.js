module.exports = {
  apps : [
    {
      name: 'api',
      script: 'dist/index.js',
      cwd: "./apps/api",
      autorestart: true,    
      watch: '.',
      env: {
        NODE_ENV: 'production'
      }
    }
  ],

  deploy : {
    production : {
      user : 'sdd_it',
      host : ['10.33.63.171'],
      ref  : 'origin/main',
      repo : 'git@gitlab.kwe.co.kr:sdd_it/kream_web.git/tree/main/apps/api',
      path : '~/KREAM_Web/api',
      ssh_options: ["StrictHostKeyChecking=no"],
      'post-deploy' : 'pnpm install && pm2 reload ecosystem.config.js --env production',
    }
  }
};
