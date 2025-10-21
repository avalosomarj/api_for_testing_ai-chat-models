import envs from "../config/env.js";

const { AI_CHAT_MODEL, AI_API_KEY, AI_ENDPOINT } = envs;

const fetchToAI = async (instruction, input) => {
  const requestBody = {
    model: AI_CHAT_MODEL, // Setear variable de modelo en el .env
    messages: [
      {
        role: "system",
        content: instruction.trim(),
      },
      {
        role: "user",
        content: input.trim(),
      }
    ]
  };

  const fetchData = await fetch(
    AI_ENDPOINT, // Setear variable de endpoint en el .env
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`, // Setear variable de API KEY en el .env
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody)
    }
  );

  if (!fetchData.ok)
    throw new Error(`${fetchData.statusText} | statusCode: ${fetchData.status}`);

  const response = await fetchData.json();

  const content = response.choices?.[0]?.message?.content?.trim();

  if (!content)
    throw new Error("Respuesta inesperada o vacía del modelo");

  console.log("Respuesta del modelo recibida con éxito");

  return content;
};

export default fetchToAI;