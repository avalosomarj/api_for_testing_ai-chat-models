import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";

import validateChatBody from "../middlewares/chat.middleware.js";
import handleChatRequest from "../controllers/chat.controller.js";

describe("Tests unitarios de middleware y controller de /chat", () => {
  let mockFetchToAI;

  beforeEach(() => {
    mockFetchToAI = async (instruction, input) => {
      if (instruction === "error")
        throw new Error("Error simulado de fetch al modelo de IA"); // Mock para simular falla durante fetch al modelo de IA

      return "Respuesta simulada"; // Mock para simular respuesta correcta de modelo de IA
    };
  });

  const mockCreateReqRes = async (body) => { // Mock para simular req y res en cada petición
    return new Promise((resolve) => {
      const req = { body };
      const res = {
        statusCode: null,
        body: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(data) {
          this.body = data;
          resolve({ statusCode: this.statusCode, body: this.body });
        },
      };

      validateChatBody(req, res, async () => { // Validación de middleware
        const mockController = handleChatRequest(mockFetchToAI);

        await mockController(req, res);
      });
    });
  };

  it("Test 1: debería devolver 400 si falta 'systemPrompt'", async () => {
    const res = await mockCreateReqRes({ userMessage: "Test 1" });

    assert.strictEqual(res.statusCode, 400);
    assert.ok(
      res.body.error.includes("systemPrompt"),
      `Se esperaba que la respuesta contenga 'systemPrompt', pero se recibió: ${res.body.error}`
    );
  });

  it("Test 2: debería devolver 400 si falta 'userMessage'", async () => {
    const res = await mockCreateReqRes({ systemPrompt: "Test 2" });

    assert.strictEqual(res.statusCode, 400);
    assert.ok(
      res.body.error.includes("userMessage"),
      `Se esperaba que la respuesta contenga 'userMessage', pero se recibió: ${res.body.error}`
    );
  });

  it("Test 3: debería devolver 400 si 'systemPrompt' no es string", async () => {
    const res = await mockCreateReqRes({
      systemPrompt: 123,
      userMessage: "Test 3"
    });

    assert.strictEqual(res.statusCode, 400);
    assert.ok(
      res.body.error.includes("systemPrompt"),
      `Se esperaba que la respuesta contenga 'systemPrompt', pero se recibió: ${res.body.error}`
    );
  });

  it("Test 4: debería devolver 400 si 'userMessage' no es string", async () => {
    const res = await mockCreateReqRes({
      systemPrompt: "Test 4",
      userMessage: 123
    });

    assert.strictEqual(res.statusCode, 400);
    assert.ok(
      res.body.error.includes("userMessage"),
      `Se esperaba que la respuesta contenga 'userMessage', pero se recibió: ${res.body.error}`
    );
  });

  it("Test 5: debería devolver 200 con respuesta simulada", async () => {
    const res = await mockCreateReqRes({
      systemPrompt: "Test 5",
      userMessage: "Test 5"
    });

    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.aiResponse, "Respuesta simulada");
  });

  it("Test 6: debería devolver 500 si el servicio externo lanza un error", async () => {
    const res = await mockCreateReqRes({
      systemPrompt: "error",
      userMessage: "Test 6"
    });

    assert.strictEqual(res.statusCode, 500);
    assert.ok(
      res.body.error.includes("error"),
      `Se esperaba que la respuesta contenga "error", pero se recibió: ${res.body.error}`
    );
  });
});