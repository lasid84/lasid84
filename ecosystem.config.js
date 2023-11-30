module.exports = {
  apps : [
    {
    name: 'api',
    script: 'dist/index.js',
    autorestart: true,    
    watch: '.'
  }, {
    script: './service-worker/',
    watch: ['./service-worker']
  }],

  deploy : {
    production : {
      user : 'sdd_it',
      host : '10.33.63.171',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : '/home/sdd_it/KREAM_Web/api',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
