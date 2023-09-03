module.exports = {
    apps: [
      {
        name: 'nestjs-app',
        script: 'dist/main.js', // Path to your compiled Nest.js entry file
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: '1G',
        env: {
          NODE_ENV: 'production',
          PORT: 3002,
        },
      },
    ],
  };