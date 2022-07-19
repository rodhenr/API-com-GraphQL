const express = require("express");
const { mongoose } = require("mongoose");
const porta = 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/gqldb");

app.listen(porta, () => {
  console.log(`Servidor iniciado na porta ${porta}`);
});

module.exports = app;
