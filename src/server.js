import app from "./app.js";
import envs from "./config/env.js";

const { BASE_URL, PORT } = envs;

app.listen(PORT, (err) => {
  if (err) {
    console.error("Error al iniciar el servidor:", err);
    return;
  }

  console.log(`Servidor escuchando en puerto ${PORT}`);
  console.log(`Documentación de la API disponible en ${BASE_URL}:${PORT}/docs`);
});