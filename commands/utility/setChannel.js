const { SlashCommandBuilder } = require("discord.js");
const schedule = require("node-schedule");
const { postGames } = require("../../postGames");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(
  "./settings.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) return console.error(err.message);
  }
);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setchannel")
    .setDescription("Set which channel to send game notifications at"),
  async execute(interaction) {
    const guildId = interaction.guildId;
    const channelId = interaction.channel.id;

    db.all(
      `SELECT * FROM settings WHERE guild_id='${guildId}'`,
      [],
      (err, rows) => {
        if (err) return console.error(err.message);
        db.run(
          `UPDATE settings SET channel_id='${channelId}' WHERE guild_id='${guildId}'`
        );
      }
    );

    interaction.reply(
      `Now posting games in ${interaction.channel.name} at ${channelId}`
    );
  },
};
