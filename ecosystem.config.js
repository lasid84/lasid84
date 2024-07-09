module.exports = {
  apps : [{
      name: 'api',
      script: './dist/index.js',
      cwd: "./apps/api",
      out_file: '/dev/null',
      autorestart: true,
      watch: '.',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'batch',
      script: './dist/index.js',
      cwd: "./apps/batch",
      out_file: '/dev/null',
      // instances: 4,
      // exec_mode: 'cluster',
      autorestart: true,
      watch: '.',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'kream',
      script: 'pnpm start',
      cwd: './apps/kream',
      out_file: '/dev/null',
      autorestart: true,
      watch: '.',
      env: {
        NODE_ENV: 'production'
      }
    }
  ],

  deploy : {
    api_prod : {
      key : './id_rsa-api-prod', 
      user : 'sdd_it',
      host : ['10.33.63.177'],
      ref  : 'origin/main',
      repo : 'git@gitlab.kwe.co.kr:sdd_it/kream_web.git',
      path : '/home/sdd_it/KREAM_Web',
      ssh_options: ['StrictHostKeyChecking=no'],
      'post-deploy' : 'pnpm install && pnpm build --filter api && pm2 reload ecosystem.config.js --only api',
    },
    api_test : {
      name: 'api',
      key : './id_rsa-api-test', 
      user : 'sdd_it',
      host : ['10.33.63.171'],
      ref  : 'origin/main',
      repo : 'git@gitlab.kwe.co.kr:sdd_it/kream_web.git',
      path : '/home/sdd_it/KREAM_Web',
      ssh_options: ['StrictHostKeyChecking=no'],
      'post-deploy' : 'pnpm install && pnpm build --filter api && pm2 reload ecosystem.config.js --only api',
    },
    batch_prod : {
      key : './id_rsa-batch-prod', 
      user : 'sdd_it',
      host : ['10.33.63.175'],
      ref  : 'origin/main',
      repo : 'git@gitlab.kwe.co.kr:sdd_it/kream_web.git',
      path : '/home/sdd_it/KREAM_Web',
      ssh_options: ['StrictHostKeyChecking=no'],
      'post-deploy' : 'pnpm install && pnpm build --filter batch && pm2 reload ecosystem.config.js --only batch',
    },
    batch_test : {
      key : './id_rsa-batch-test', 
      user : 'sdd_it',
      host : ['10.33.63.172'],
      ref  : 'origin/main',
      repo : 'git@gitlab.kwe.co.kr:sdd_it/kream_web.git',
      path : '/home/sdd_it/KREAM_Web',
      ssh_options: ['StrictHostKeyChecking=no'],
      'post-deploy' : 'pnpm install && pnpm build --filter batch && pm2 reload ecosystem.config.js --only batch',
    },
    kream_prod : {
      key : './id_rsa-kream-prod', 
      user : 'sdd_it',
      host : ['10.33.63.176'],
      ref  : 'origin/main',
      repo : 'git@gitlab.kwe.co.kr:sdd_it/kream_web.git',
      path : '/home/sdd_it/KREAM_Web',
      ssh_options: ['StrictHostKeyChecking=no'],
      'post-deploy' : 'pnpm install && pnpm build --filter kream && pm2 reload ecosystem.config.js --only kream',
    },
    kream_test : {
      key : './id_rsa-kream-test', 
      user : 'sdd_it',
      host : ['10.33.63.174'],
      ref  : 'origin/main',
      repo : 'git@gitlab.kwe.co.kr:sdd_it/kream_web.git',
      path : '/home/sdd_it/KREAM_Web',
      ssh_options: ['StrictHostKeyChecking=no'],
      'post-deploy' : 'pnpm install && pnpm build --filter kream && pm2 reload ecosystem.config.js --only kream',
    },
  }
};
