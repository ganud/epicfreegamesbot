const { SlashCommandBuilder } = require("discord.js");
const { getFreeGames } = require("../../getFreeGames");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("free")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    fetchGames().then((games) => interaction.reply(games));
  },
};

async function fetchGames() {
  const freeGames = await getFreeGames();
  const url = freeGames[0].url;
  return url;
}

fetchGames().then((walter) => console.log(walter));
