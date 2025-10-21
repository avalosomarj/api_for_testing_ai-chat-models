import express from "express";

const app = express();

app.disable("x-powered-by");

app.use(express.json());

app.get("/", (req, res) => {
  res.redirect("/docs");
});

export default app;