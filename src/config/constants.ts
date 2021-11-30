import { config } from "dotenv";
config();

export const PORT = parseInt(process.env.PORT!) || 8080;
