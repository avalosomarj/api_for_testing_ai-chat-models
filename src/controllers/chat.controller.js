const handleChatRequest = (fetchFn) => async (req, res) => {
  const { systemPrompt, userMessage } = req.body;

  try {
    const aiResponse = await fetchFn(systemPrompt, userMessage);

    console.log("Respuesta del modelo recibida con éxito");
    res.status(200).json({ aiResponse }); // Devuelve respuesta del modelo
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al procesar la solicitud." });
  }
};

export default handleChatRequest;