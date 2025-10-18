const { BASE_URL, PORT, AI_API_KEY, AI_CHAT_MODEL, AI_ENDPOINT } = process.env;

const envs = {
  BASE_URL,
  PORT,
  AI_API_KEY,
  AI_CHAT_MODEL,
  AI_ENDPOINT,
};

for (const [key, value] of Object.entries(envs)) {
  if (!value?.trim()) {
    console.error(`ERROR: Variable de entorno ${key} no definida o vacía, revisar .env`);
    process.exit(1); //Error genérico
  }
}

export default envs;