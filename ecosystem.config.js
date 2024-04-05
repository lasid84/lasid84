module.exports = {
  apps : [
    {
      name: 'api_xxxx',
      script: 'node index.js',
      cwd: "./apps/kwe-api/dist",
      // instances: 4,
      // exec_mode: 'cluster',
      autorestart: true,
      watch: '.',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'api',
      cwd: "/home/sdd_it/KREAM_Web/source/apps/batch/dist",
      script: 'node index.js',
      // instances: 4,
      // exec_mode: 'cluster',
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
      watch: '.',
      env: {
        NODE_ENV: 'production'
      }
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
      'post-deploy' : 'pnpm install && pnpm build --filter kwe-api && pm2 reload ecosystem.config.js --only kwe-api',
    },
    api_prod : {
      name: 'api',
      key : './id_rsa-api-prod', 
      user : 'sdd_it',
      host : ['10.33.63.171'],
      ref  : 'origin/main',
      repo : 'git@gitlab.kwe.co.kr:sdd_it/kream_web.git',
      path : '/home/sdd_it/KREAM_Web',
      ssh_options: ['StrictHostKeyChecking=no'],
      'post-deploy' : 'pnpm install && pnpm build --filter api && pm2 reload ecosystem.config.js --only api',
    },
    // batch_prod : {
    //   key : './id_rsa-batch-prod', 
    //   user : 'sdd_it',
    //   host : ['10.33.63.172'],
    //   ref  : 'origin/main',
    //   repo : 'git@gitlab.kwe.co.kr:sdd_it/kream_web.git',
    //   path : '/home/sdd_it/KREAM_Web',
    //   ssh_options: ['StrictHostKeyChecking=no'],
    //   'post-deploy' : 'pnpm install && pnpm build --filter kwe-api && pm2 reload ecosystem.config.js --only kwe-api',
    // },
    web_prod : {
      key : './id_rsa-api-prod', 
      user : 'sdd_it',
      host : ['10.33.63.171'],
      ref  : 'origin/main',
      repo : 'git@gitlab.kwe.co.kr:sdd_it/kream_web.git',
      path : '/home/sdd_it/KREAM_Web',
      ssh_options: ['StrictHostKeyChecking=no'],
      'post-deploy' : 'pnpm install && pnpm build --filter web && pm2 reload ecosystem.config.js --only web',
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
