import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import { CanvaMCPServer } from "@canva/mcp-server"; // Ajuste de importación estándar

const app = express();
const port = process.env.PORT || 3000;

// Inicializar el servidor interno de Canva
const canvaServer = new CanvaMCPServer();
let transport = null;

app.get("/sse", async (req, res) => {
  transport = new SSEServerTransport("/messages", res);
  await canvaServer.connect(transport);
});

app.post("/messages", async (req, res) => {
  if (transport) {
    await transport.handleMessage(req, res);
  } else {
    res.status(400).send("No active SSE session");
  }
});

app.listen(port, () => {
  console.log(`Canva MCP Server running on port ${port}`);
});
