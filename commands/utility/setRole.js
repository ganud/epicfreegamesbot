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
    .setName("setrole")
    .setDescription("Set which role I should ping!")
    .addStringOption((option) =>
      option
        .setName("role")
        .setDescription("The role to ping")
        .setRequired(true)
    ),
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
    const input = interaction.options.getString("role");
    // Query role with user input
    const role = interaction.member.roles.cache.find((r) => r.name === input);
    if (role === undefined) {
      interaction.reply(
        "No matching role found. (Role must be assigned first to be pinged!)"
      );
      return;
    }

    // Save role to discord server
    db.all(
      `SELECT * FROM settings WHERE guild_id='${guildId}'`,
      [],
      (err, rows) => {
        if (err) return console.error(err.message);
        db.run(
          `UPDATE settings SET role_id='${role.id}' WHERE guild_id='${guildId}'`
        );
      }
    );

    interaction.role_id = role.id; // Pass role_id to index.js because sql doesn't update in time

    interaction.reply({
      content: `Now pinging the role <@&${role.id}>!`,
      ephemeral: true,
    });
  },
};
