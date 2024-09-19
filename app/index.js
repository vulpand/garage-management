const express = require('express');
const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the main application!');
});

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});
