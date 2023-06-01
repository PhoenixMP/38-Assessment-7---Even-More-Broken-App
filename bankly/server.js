/** Server for bank.ly. */
const { PORT } = require('./config');

const app = require("./app");

app.listen(PORT, () => {
  console.log(`Started on http://localhost:${PORT}`);
});
