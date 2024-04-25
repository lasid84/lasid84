module.exports = {
  apps : [{
      name: 'api',
      script: './dist/index.js',
      cwd: "./apps/api",
      out_file: "NUll",
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
      out_file: "NUll",
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
      out_file: "NUll",
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
      'post-deploy' : 'pnpm install && pnpm build --filter api && pm2 reload ecosystem.config.js --only api',
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
      'post-deploy' : 'pnpm install && pnpm build --filter api && pm2 reload ecosystem.config.js --only api -o NULL',
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
    kream_prod : {
      key : './id_rsa-kream-prod', 
      user : 'sdd_it',
      host : ['10.33.63.174'],
      ref  : 'origin/main',
      repo : 'git@gitlab.kwe.co.kr:sdd_it/kream_web.git',
      path : '/home/sdd_it/KREAM_Web',
      ssh_options: ['StrictHostKeyChecking=no'],
      'post-deploy' : 'pnpm install && pnpm build --filter kream && pm2 reload ecosystem.config.js --only kream',
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
    },
    // batch_prod : {
    //   key : './id_rsa-api-prod', 
    //   user : 'sdd_it',
    //   host : ['10.33.63.171'],
    //   ref  : 'origin/main',
    //   repo : 'git@gitlab.kwe.co.kr:sdd_it/kream_web.git',
    //   path : '/home/sdd_it/KREAM_Web',
    //   ssh_options: ['StrictHostKeyChecking=no'],
    //   'post-deploy' : 'pnpm install && pnpm build --filter batch && pm2 reload ecosystem.config.js --only batch',
    // }
  }
};
