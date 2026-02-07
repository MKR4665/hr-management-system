const app = require('./app/server');
const { env } = require('./config/env');

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
