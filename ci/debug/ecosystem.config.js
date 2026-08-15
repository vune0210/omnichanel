module.exports = {
  apps: [
    {
      name: 'zma-sample',
      script: './main.js',
      cwd: '/app',
      // interpreter: '/home/uni/.bun/bin/bun',
      max_memory_restart: '6G',
      args: ['--max-old-space-size=6144'],
      node_args: ['--max-old-space-size=6144'],
      env: {},
    },
  ],
};
