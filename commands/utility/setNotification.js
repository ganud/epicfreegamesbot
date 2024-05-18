const { SlashCommandBuilder } = require("discord.js");
const schedule = require("node-schedule");
const { postGames } = require("../../postGames");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setnotification")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    interaction.reply(`Now posting games in ${interaction.channel.name}`);
    schedule.scheduleJob("10 15 * * 4", function () {
      // Post games every Thursday, 15:10 UTC
      postGames(interaction);
    });
  },
};
