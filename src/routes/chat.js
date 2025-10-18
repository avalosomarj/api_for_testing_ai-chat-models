import { Router } from "express";

import envs from "../config/env.js";
import validateChatBody from "../middlewares/validateReqBody.js";

const { AI_CHAT_MODEL, AI_API_KEY, AI_ENDPOINT } = envs;

const chatRoute = Router();

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
 *         description: Error en validación (systemPrompt o userMessage no existen, no son tipo string o están vacías).
 *       500:
 *         description: Error interno del servidor al procesar la solicitud.
 */
chatRoute.post("/", validateChatBody, async (req, res) => {
  const { systemPrompt, userMessage } = req.body;

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
      throw new Error(`${fetchData.statusText} | StatusCode: ${fetchData.status}`);
    }

    const response = await fetchData.json();

    if (
      !response.choices ||
      !response.choices.length ||
      !response.choices[0].message ||
      !response.choices[0].message.content ||
      !response.choices[0].message.content.trim()
    ) {
      throw new Error("Respuesta inesperada o vacía del modelo");
    }

    console.log("Respuesta del modelo recibida con éxito");
    res
      .status(200)
      .json({ aiResponse: response.choices[0].message.content.trim() }); // Devuelve respuesta del modelo
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al procesar la solicitud." });
  }
});

export default chatRoute;