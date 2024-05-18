const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { postGames } = require("../../postGames");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("free")
    .setDescription("Get current free games"),
  async execute(interaction) {
    interaction.reply("Games this week:");
    postGames(interaction);
  },
};
