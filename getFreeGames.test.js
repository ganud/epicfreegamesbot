const { getFreeGames, getTimeStamp } = require("./getFreeGames");
const response = require("./response.json");
require("jest-fetch-mock").enableMocks();

it("Filters only games", async () => {
  fetch.mockResponseOnce(JSON.stringify(response));
  const games = await getFreeGames();
  console.log(games);
  expect(games.length).toEqual(1);
});
