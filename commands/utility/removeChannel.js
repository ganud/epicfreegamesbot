const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
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
    .setName("removechannel")
    .setDescription("Remove this channel from being notified"),
  async execute(interaction) {
    // Must have manage server permissions to run command
    if (
      !interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)
    ) {
      interaction.reply({
        content: "You do not have the permissions to run this command.",
        ephemeral: true,
      });
      return;
    }

    const guildId = interaction.guildId;
    const channelId = interaction.channel.id;

    db.all(
      `SELECT * FROM settings WHERE guild_id='${guildId}'`,
      [],
      (err, rows) => {
        if (err) return console.error(err.message);
        db.run(
          `UPDATE settings SET channel_id=null WHERE guild_id='${guildId}'`
        );
      }
    );

    interaction.reply({
      content: `Stopped posting games in <#${channelId}>`,
      ephemeral: true,
    });
  },
};
