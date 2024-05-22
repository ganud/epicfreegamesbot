const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { postGames } = require("../../postGames");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("free")
    .setDescription("Get current free games"),
  async execute(interaction) {
    await interaction.deferReply();
    await postGames(interaction);
    await interaction.editReply("Games this week:");
    await interaction.deleteReply();
  },
};
