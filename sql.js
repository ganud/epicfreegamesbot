const sqlite3 = require("sqlite3").verbose();
let sql;

const db = new sqlite3.Database(
  "./settings.db",
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) return console.error(err.message);
  }
);
// db.run("INSERT INTO settings(guild_id) VALUES ('803823557670600754')");
db.run("DELETE FROM settings WHERE id=24");

// db.run(sql, ["1224"], (err, rows) => {
//   if (err) return console.error(err.message);
// });
db.all(`SELECT * FROM settings`, [], (err, rows) => {
  if (err) return console.error(err.message);
  rows.forEach((row) => {
    console.log(row);
  });
  if (rows.length === 0) {
    // db.run("INSERT INTO settings(guild_id) VALUES ('803823557670600754')");
  }
});
