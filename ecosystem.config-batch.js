module.exports = {
  apps : [
    {
      name: 'batch',
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
    batch_staging : {
      key : './id_rsa', 
      user : 'sdd_it',
      host : ['10.33.63.172'],
      ref  : 'origin/main',
      repo : 'git@gitlab.kwe.co.kr:sdd_it/kream_web.git',
      path : '/home/sdd_it/KREAM_Web',
      ssh_options: ['StrictHostKeyChecking=no'],
      'post-deploy' : 'pnpm install && pnpm build && pm2 reload ecosystem.config-batch.js --env production',
    },
    batch_prod : {
      key : './id_rsa', 
      user : 'sdd_it',
      host : ['10.33.63.172'],
      ref  : 'origin/main',
      repo : 'git@gitlab.kwe.co.kr:sdd_it/kream_web.git',
      path : '/home/sdd_it/KREAM_Web',
      ssh_options: ['StrictHostKeyChecking=no'],
      'post-deploy' : 'pnpm install && pnpm build && pm2 reload ecosystem.config-batch.js --env production',
    }
  }
};
