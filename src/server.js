import app from "./app.js";
import { envs } from "./config/env.js";

const { BASE_URL, PORT } = envs;

const server = app.listen(PORT, (err) => {
  if (err) {
    console.error("Error al iniciar el servidor:", err);
    return;
  }

  console.log(`Servidor corriendo en ${BASE_URL}:${PORT}`);
  console.log(`Documentación de la API disponible en ${BASE_URL}:${PORT}/docs`);
});

process.on("SIGINT", () => {
  console.log("Servidor apagándose...");
  server.close(() => {
    console.log("Servidor detenido.");
    process.exit(130); // Terminado con Ctrl+C
  });
});