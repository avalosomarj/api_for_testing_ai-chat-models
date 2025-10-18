import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Chat con IA",
      version: "1.0.0",
      description:
        "Esta API permite enviar un prompt y un mensaje del usuario a un modelo de IA y recibir la respuesta."
    },
  },
  apis: ["./src/routes/chat.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

const createDocWithSwagger = (app) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default createDocWithSwagger;