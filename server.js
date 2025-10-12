const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/price", async (req, res) => {
  const coin = req.body.coin.toLowerCase();
  const currency = "usd";
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=${currency}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (!data[coin]) {
      return res.render("result", { error: "Invalid coin name or data not found", data: null });
    }

    const price = data[coin][currency];
    res.render("result", { error: null, data: { coin, price, currency } });
  } catch (err) {
    console.error(err.message);
    res.render("result", { error: "Failed to fetch data from API", data: null });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
