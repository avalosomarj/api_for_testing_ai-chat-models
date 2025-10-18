const validateReqBody = (req, res, next) => {
  const { systemPrompt, userMessage } = req.body;

  if (typeof systemPrompt !== "string" || typeof userMessage !== "string") {
    return res
      .status(400)
      .json({ error: "'systemPrompt' y 'userMessage' deben existir y ser strings." });
  }

  if (!systemPrompt.trim() || !userMessage.trim()) {
    return res
      .status(400)
      .json({ error: "'systemPrompt' y 'userMessage' no pueden estar vacíos o contener solo espacios." });
  }

  next();
};

export default validateReqBody;