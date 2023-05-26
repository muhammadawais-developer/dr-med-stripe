const express = require("express");
const payment = require("./routes/payment");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = 5000;

app.get("/", async (req, res) => {
  res.send("Hellow");
});

app.use(express.json());
app.use("/payment", payment);

app.listen(PORT, () => {
  console.log(`Listening on PORT : ${PORT}`);
});
