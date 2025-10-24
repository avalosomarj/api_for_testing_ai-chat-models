const validateReqBody = (req, res, next) => {
  const { systemPrompt, userMessage } = req.body;

  if (typeof systemPrompt !== "string" || !systemPrompt.trim()) {
    return res
      .status(400)
      .json({ error: "'systemPrompt' debe existir, ser de tipo string y no puede estar vacío o contener solo espacios." });
  }

  if (typeof userMessage !== "string" || !userMessage.trim()) {
    return res
      .status(400)
      .json({ error: "'userMessage' debe existir, ser de tipo string y no puede estar vacío o contener solo espacios." });
  }

  next();
};

export default validateReqBody;