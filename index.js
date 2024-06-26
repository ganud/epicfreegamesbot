const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const sqlite3 = require("sqlite3").verbose();
const { postGames } = require("./postGames");
const schedule = require("node-schedule");

// Recurring every Thursday, 15:10 UTC, when epic releases a new game
let rule = new schedule.RecurrenceRule();
rule.tz = "America/Sao_Paulo";
rule.hour = 12;
rule.minute = 10;
rule.dayOfWeek = 4;

const db = new sqlite3.Database(
  "./settings.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) return console.error(err.message);
    db.run(
      `create table if not exists settings(id INTEGER PRIMARY KEY,guild_id, channel_id, role_id )`
    );
  }
);

// Setup boilerplate from https://discordjs.guide/
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);

    const guildId = interaction.guildId;

    // Cancel schedule for the guild that ran removeChannel
    if (interaction.commandName === "removechannel") {
      schedule.cancelJob(guildId);
    }

    // Re-update scheduler after every setchannel
    if (interaction.commandName === "setchannel") {
      db.all(
        `SELECT * FROM settings WHERE guild_id='${guildId}'`,
        [],
        (err, rows) => {
          if (err) return console.error(err.message);
          // Clear existing scheduled pings for the existing guild
          schedule.cancelJob(guildId);
          // Re-add that schedule with the new channel
          schedule.scheduleJob(guildId, rule, function () {
            // Ping a role if it exists
            if (rows[0].role_id !== null) {
              interaction.channel.send("<@&" + rows[0].role_id + ">");
            }
            postGames(client, interaction.channelId);
          });
        }
      );
    }

    // Same for removerole and setrole, but it must check for a saved channel first
    if (
      interaction.commandName === "removerole" ||
      interaction.commandName === "setrole"
    ) {
      db.all(
        `SELECT * FROM settings WHERE guild_id='${guildId}'`,
        [],
        (err, rows) => {
          if (err) return console.error(err.message);
          schedule.cancelJob(guildId);
          if (rows[0].channel_id !== null) {
            schedule.scheduleJob(guildId, rule, function () {
              // Ping a role alongside the notification if it exists
              if (interaction.role_id !== null) {
                client.channels.cache
                  .get(rows[0].channel_id)
                  .send("<@&" + interaction.role_id + ">");
              }
              postGames(client, rows[0].channel_id);
            });
          }
        }
      );
    }
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  const guildIds = client.guilds.cache.map((g) => g.id);
  // Check for any saved data in guilds and schedule accordingly
  guildIds.forEach((guildId) => {
    db.all(
      `SELECT * FROM settings WHERE guild_id='${guildId}'`,
      [],
      (err, rows) => {
        if (err) return console.error(err.message);
        // If guild does not exist add guild
        if (rows.length === 0) {
          db.run(`INSERT INTO settings(guild_id) VALUES ('${guildId}')`);
        } else {
          // Check for saved channel if exists
          if (rows[0].channel_id !== null) {
            schedule.scheduleJob(guildId, rule, function () {
              // Ping a role if it exists
              console.log("run");
              if (rows[0].role_id !== null) {
                client.channels.cache
                  .get(rows[0].channel_id)
                  .send("<@&" + rows[0].role_id + ">");
              }
              postGames(client, rows[0].channel_id);
            });
          }
        }
      }
    );
  });
});

client.login(token);
