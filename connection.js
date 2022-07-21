import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/gqldb");

const conn = mongoose.connection;

conn.on("error", () => console.error.bind(console, "Erro de conexão"));

conn.once("open", () => console.info("Conectado a database com sucesso"));

export default conn;
