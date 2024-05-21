const { SlashCommandBuilder } = require("discord.js");
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
    .setDescription("Set which channel to ping when notified!")
    .addStringOption((option) =>
      option
        .setName("role")
        .setDescription("The role to ping")
        .setRequired(true)
    ),
  async execute(interaction) {
    const guildId = interaction.guildId;
    const input = interaction.options.getString("role");
    // Query role with user input
    const role = interaction.member.roles.cache.find((r) => r.name === input);
    if (role === undefined) {
      interaction.reply("No matching role found");
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

    interaction.reply(`Now pinging the role ${input}`);
  },
};
