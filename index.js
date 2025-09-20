import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const { BASE_URL, PORT, AI_API_KEY, AI_CHAT_MODEL, AI_ENDPOINT } = process.env;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.redirect("/docs");
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Chat con IA",
      version: "1.0.0",
      description:
        "Esta API permite enviar un prompt y un mensaje del usuario a un modelo de IA y recibir la respuesta.",
    },
  },
  apis: ["./index.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /chat:
 *   post:
 *     description: Enviar un prompt y el texto del usuario para obtener una respuesta del modelo de IA.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - systemPrompt
 *               - userMessage
 *             properties:
 *               systemPrompt:
 *                 type: string
 *                 description: Instrucción o contexto para el modelo de IA.
 *               userMessage:
 *                 type: string
 *                 description: El mensaje que el usuario quiere enviar al modelo de IA.
 *     responses:
 *       200:
 *         description: Respuesta generada por el modelo de IA.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 aiResponse:
 *                   type: string
 *                   description: Respuesta generada por el modelo de IA.
 *       400:
 *         description: Error si faltan variables obligatorias (systemPrompt o userMessage).
 *       500:
 *         description: Error interno del servidor al procesar la solicitud.
 */
app.post("/chat", async (req, res) => {
  const { systemPrompt, userMessage } = req.body;

  if (!systemPrompt || !userMessage) {
    return res
      .status(400)
      .send("Falta 'systemPrompt' y/o 'userMessage' en la solicitud.");
  }

  const requestBody = {
    model: AI_CHAT_MODEL, // Setear variable de modelo en el .env
    messages: [
      {
        role: "system",
        content: systemPrompt.trim(),
      },
      {
        role: "user",
        content: userMessage.trim(),
      },
    ],
  };

  try {
    const fetchData = await fetch(
      AI_ENDPOINT, // Setear variable de endpoint en el .env
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AI_API_KEY}`, // Setear variable de API KEY en el .env
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!fetchData.ok) {
      throw new Error(`Error: ${fetchData.statusText}`);
    }

    const response = await fetchData.json();

    res
      .status(200)
      .json({ aiResponse: response.choices[0].message.content.trim() }); // Devuelve respuesta del modelo
  } catch (error) {
    console.error("Error en la solicitud:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al procesar la solicitud." });
  }
});

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
    process.exit(0);
  });
});