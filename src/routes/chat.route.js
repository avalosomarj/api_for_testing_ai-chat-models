import { Router } from "express";

import validateChatBody from "../middlewares/chat.middleware.js";
import handleChatRequest from "../controllers/chat.controller.js";
import fetchToAI from "../services/chat.service.js";

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
chatRoute.post("/", validateChatBody, handleChatRequest(fetchToAI));

export default chatRoute;