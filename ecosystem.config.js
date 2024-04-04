module.exports = {
  apps : [
    {
      name: 'api',
      script: 'node index.js',
      cwd: "./apps/api/dist",
      autorestart: true,    
      watch: '.',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'batch',
      script: 'node index.js',
      cwd: "./apps/batch/dist",
      // instances: 4,
      // exec_mode: 'cluster',
      autorestart: true,    
      watch: '.',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'web',
      script: 'npm start',
      cwd: './apps/web',
      autorestart: true,    
      watch: '.'
    }
  ],

  deploy : {
    api_staging : {
      key : './id_rsa', 
      user : 'sdd_it',
      host : ['10.33.63.171'],
      ref  : 'origin/main',
      repo : 'git@gitlab.kwe.co.kr:sdd_it/kream_web.git',
      path : '/home/sdd_it/KREAM_Web',
      ssh_options: ['StrictHostKeyChecking=no'],
      'post-deploy' : 'pnpm install && pnpm build --filter api && pm2 reload ecosystem.config.js --env development',
    },
    api_prod : {
      name: 'api',
      key : './id_rsa-api-prod', 
      user : 'sdd_it',
      host : ['10.33.63.171'],
      ref  : 'origin/main',
      repo : 'git@gitlab.kwe.co.kr:sdd_it/kream_web.git',
      path : '/home/sdd_it/KREAM_Web',
      version: '0.1.2',
      ssh_options: ['StrictHostKeyChecking=no'],
      'post-deploy' : 'pnpm install && pnpm build --filter api && pm2 reload ecosystem.config.js --env production --only api',
    },
    web_prod : {
      key : './id_rsa-api-prod', 
      user : 'sdd_it',
      host : ['10.33.63.171'],
      ref  : 'origin/main',
      repo : 'git@gitlab.kwe.co.kr:sdd_it/kream_web.git',
      path : '/home/sdd_it/KREAM_Web',
      ssh_options: ['StrictHostKeyChecking=no'],
      'post-deploy' : 'pnpm install && pnpm build --filter web && pm2 reload ecosystem.config.js --env production --only web',
    },
    batch_prod : {
      key : './id_rsa-batch-prod', 
      user : 'sdd_it',
      host : ['10.33.63.172'],
      ref  : 'origin/main',
      repo : 'git@gitlab.kwe.co.kr:sdd_it/kream_web.git',
      path : '/home/sdd_it/KREAM_Web',
      ssh_options: ['StrictHostKeyChecking=no'],
      'post-deploy' : 'pnpm install && pnpm build --filter batch && pm2 reload ecosystem.config.js --only batch',
    }
  }
};
