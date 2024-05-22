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
    .setName("removerole")
    .setDescription("Remove the role that is currently being pinged"),
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

    // Find the saved role and remove it from the guild
    db.all(
      `SELECT * FROM settings WHERE guild_id='${guildId}'`,
      [],
      (err, rows) => {
        if (err) return console.error(err.message);
        db.run(`UPDATE settings SET role_id=null WHERE guild_id='${guildId}'`);
        if (rows[0].role_id === null) {
          interaction.reply({
            content: `There is no role to remove!`,
            ephemeral: true,
          });
        } else {
          interaction.reply({
            content: `Removed <@&${rows[0].role_id}> from notifications.`,
            ephemeral: true,
          });
        }
      }
    );
    interaction.role_id = null; // Pass role_id to index.js because sql doesn't update in time
  },
};
