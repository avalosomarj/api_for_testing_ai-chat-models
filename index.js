import express from "express";

const { BASE_URL, PORT } = process.env;

const app = express();

app.use(express.json());

const server = app.listen(PORT, (err) => {
  if (err) {
    console.error("Error al iniciar el servidor:", err);
    return;
  }

  console.log(`Servidor corriendo en ${BASE_URL}:${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Servidor apagándose...");
  server.close(() => {
    console.log("Servidor detenido.");
    process.exit(0);
  });
});