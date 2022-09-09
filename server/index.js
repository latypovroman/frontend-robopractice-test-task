const express = require("express");
const app = express();
const port = 8080;
const cors = require("cors");
const React = require("@types/react");

app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:3000"],
  })
);
app.get("/api/users", (req, res) => {
  res.send(require("./data.json"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
