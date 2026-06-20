module.exports = {
  apps: [
    {
      name: "comprometia",
      script: "node_modules/vite/bin/vite.js",
      args: "dev --host 0.0.0.0 --port 3000",
      cwd: __dirname,
      env: { NODE_ENV: "production" },
      autorestart: true,
      watch: false,
    },
  ],
};
