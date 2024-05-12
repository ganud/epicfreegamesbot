const { SlashCommandBuilder } = require("discord.js");
const { getFreeGames } = require("../../getFreeGames");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("free")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
