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
      key  : '/home/sdd_it/.ssh/id_rsa.pub', 
      user : 'sdd_it',
      host : ['10.33.63.171'],
      ref  : 'origin/main',
      repo : 'git@gitlab.kwe.co.kr:sdd_it/kream_web.git',
      path : '~/KREAM_Web/api',
      ssh_options: ["StrictHostKeyChecking=no"],
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
    }
  }
};
