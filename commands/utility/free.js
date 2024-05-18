const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getFreeGames } = require("../../getFreeGames");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("free")
    .setDescription("Get current free games"),
  async execute(interaction) {
    const games = await getFreeGames();
    interaction.reply(`${games.length} free games this week.`);
    for (let i = 0; i < games.length; i++) {
      // Post embed for every valid game
      const embed = createEmbed(games[i][0]);
      interaction.channel.send({ embeds: [embed] });
    }
  },
};

function createEmbed(game) {
  const embed = new EmbedBuilder()
    .setTitle(game.title)
    .setURL(game.url)
    .addFields({
      name: game.timeStamp,
      value: `💰 ~~$${game.price}~~ ➜ Free!`,
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
