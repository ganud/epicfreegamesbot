import "dotenv/config";
import { Client } from "discord.js";
import getFreeGames from "./getFreeGames";
const client = new Client({
  intents: [],
});

console.log(getFreeGames());
