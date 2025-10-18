import express from "express";

import chatRoute from "./routes/chat.js";
import createDocWithSwagger from "./config/swagger.js";

const app = express();

app.disable("x-powered-by");

app.use(express.json());

app.get("/", (req, res) => {
  res.redirect("/docs");
});

app.use("/chat", chatRoute);
createDocWithSwagger(app);

export default app;