module.exports = {
  apps: [{
    name: 'onewheel-pinger',
    script: './index.ts',
    instances: 0,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      DEBUG: 'onewheel-pinger*',
      watch: ['./index.ts', './src']
    },
    env_production: {
      NODE_ENV: 'production',
      DEBUG: '',
      watch: false
    }
  }]
}
