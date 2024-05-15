const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getFreeGames } = require("../../getFreeGames");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("free")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    const games = await getFreeGames();
    for (let i = 0; i < games.length; i++) {
      const embed = createEmbed(games[i]);
      interaction.reply({ embeds: [embed] });
    }
  },
};

function createEmbed(game) {
  const embed = new EmbedBuilder()
    .setTitle(game.title)
    .setURL(game.url)
    .addFields({
      name: game.timeStamp,
      value: "💰 ~~$19.99~~ ➜ Free!",
      inline: false,
    })
    .setImage(game.thumbnail)
    .setColor("#00b7ff")
    .setFooter({
      text: "EpicFreeGames",
      iconURL: "https://slate.dan.onl/slate.png",
    })
    .setTimestamp();

  return embed;
}
