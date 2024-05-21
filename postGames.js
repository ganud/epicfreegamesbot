const { getFreeGames } = require("./getFreeGames");
const { EmbedBuilder } = require("discord.js");

function createEmbed(game) {
  const embed = new EmbedBuilder()
    .setTitle(game.title)
    .setURL(game.url)
    .setDescription(`🔴 ${game.timeStamp}`)
    .setImage(game.thumbnail)
    .setColor("#00b7ff")
    .setFooter({
      text: "EpicFreeGames",
      iconURL: "https://slate.dan.onl/slate.png",
    })
    .setTimestamp();
  return embed;
}

// Send all free games into a channel
async function postGames(interaction, channelId = false) {
  const games = await getFreeGames();
  for (let i = 0; i < games.length; i++) {
    // Post embed for every valid game
    const embed = createEmbed(games[i][0]);
    if (channelId === false) {
      interaction.channel.send({ embeds: [embed] });
    } else {
      interaction.channels.cache.get(channelId).send({ embeds: [embed] }); // If client is used instead
    }
  }
}

module.exports = { postGames };
