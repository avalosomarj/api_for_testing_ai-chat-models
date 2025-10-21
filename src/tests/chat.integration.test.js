import { describe, it, before, after } from "node:test";
import assert from "node:assert";

import app from "../app.js";
import validateChatBody from "../middlewares/chat.middleware.js";
import handleChatRequest from "../controllers/chat.controller.js";

let server, port;

const mockFetchToAI = async (instruction, input) => { // Mock para simular respuesta del modelo de IA
  if (instruction === "error")
    throw new Error("Respuesta con falla simulada");

  return `Respuesta simulada`;
};

before(() => {
  app.post("/chat", validateChatBody, handleChatRequest(mockFetchToAI)); // Endpoint con mock de fetch al modelo de IA

  server = app.listen(0); // Se asigna automáticamente un puerto disponible
  port = server.address().port;

  console.log(`Servidor de testing escuchando en puerto ${port}`);
});

after(() => server.close());

const mockChatEndpoint = async (body) => { // Mock de fetch a modelo de IA
  const res = await fetch(`http://localhost:${port}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  return { status: res.status, body: await res.json() };
};

describe("Pruebas de integración del endpoint /chat", () => {
  it("Test 1: debería devolver 200 si la solicitud es válida", async () => {
    const res = await mockChatEndpoint({
      systemPrompt: "Test 1",
      userMessage: "Test 1"
    });

    assert.strictEqual(res.status, 200);
    assert.equal(res.body.aiResponse, "Respuesta simulada");
  });

  it("Test 2: debería devolver 400 si falta 'systemPrompt'", async () => {
    const res = await mockChatEndpoint({
      userMessage: "Test 2"
    });

    assert.strictEqual(res.status, 400);
    assert.ok(
      res.body.error.includes("systemPrompt"),
      `Se esperaba que la respuesta contenga 'systemPrompt', pero se recibió: ${res.body.error}`
    );
  });

  it("Test 3: debería devolver 400 si falta 'userMessage'", async () => {
    const res = await mockChatEndpoint({
      systemPrompt: "Test 3"
    });

    assert.strictEqual(res.status, 400);
    assert.ok(
      res.body.error.includes("userMessage"),
      `Se esperaba que la respuesta contenga 'userMessage', pero se recibió: ${res.body.error}`
    );
  });

  it("Test 4: debería devolver 400 si 'systemPrompt' no es string", async () => {
    const res = await mockChatEndpoint({
      systemPrompt: 123,
      userMessage: "Test 4"
    });

    assert.strictEqual(res.status, 400);
    assert.ok(
      res.body.error.includes("systemPrompt"),
      `Se esperaba que la respuesta contenga 'systemPrompt', pero se recibió: ${res.body.error}`
    );
  });

  it("Test 5: debería devolver 400 si 'userMessage' no es string", async () => {
    const res = await mockChatEndpoint({
      systemPrompt: "Test 5",
      userMessage: 123
    });

    assert.strictEqual(res.status, 400);
    assert.ok(
      res.body.error.includes("userMessage"),
      `Se esperaba que la respuesta contenga 'userMessage', pero se recibió: ${res.body.error}`
    );
  });

  it("Test 6: debería devolver 500 si el servicio externo lanza un error", async () => {
    const res = await mockChatEndpoint({
      systemPrompt: "error",
      userMessage: "Test 6"
    });

    assert.strictEqual(res.status, 500);
    assert.ok(
      res.body.error.includes("error"),
      `Se esperaba que la respuesta contenga "error", pero se recibió: ${res.body.error}`
    );
  });
});