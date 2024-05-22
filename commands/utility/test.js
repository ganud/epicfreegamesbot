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
    .setName("test")
    .setDescription("Ping the role and channel saved in the server"),
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
    db.all(
      `SELECT * FROM settings WHERE guild_id='${guildId}'`,
      [],
      (err, rows) => {
        if (err) return console.error(err.message);
        interaction.reply({
          content: `Now pinging <@&${rows[0].role_id}> in <#${rows[0].channel_id}>`,
          ephemeral: true,
        });
      }
    );
  },
};
