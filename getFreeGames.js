async function getFreeGames() {
  // Querys only discounted games,
  const response = await fetch(
    "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions",
    { mode: "cors" }
  );
  const json = await response.json();
  const filtered = await json.data.Catalog.searchStore.elements.filter(
    (element) =>
      element.price.totalPrice.discountPrice === 0 &&
      element.offerType !== "ADD_ON"
  );
  const queried = await filtered.map((element) => [
    {
      url: getUrl(element),
      timeStamp: getTimeStamp(element),
      title: element.title,
      price: element.price.totalPrice.originalPrice,
      thumbnail: element.keyImages[0].url,
    },
  ]);
  return queried.filter((game) => game[0].url !== false); // Remove rest of non-games(e.g Epic test game)
}

function getUrl(element) {
  let urlEnd = false;
  if (element.catalogNs.mappings[0] !== undefined) {
    urlEnd = element.catalogNs.mappings[0].pageSlug;
  } else if (
    element.productSlug !== null ||
    !Array.isArray(element.productSlug)
  ) {
    urlEnd = element.productSlug;
  }
  if (urlEnd === false || urlEnd === "[]") {
    // For some reason an empty productSlug array is a string
    return false;
  }
  return `https://epicgames.com/p/${urlEnd}`;
}

// Converts ISO-8601 to epoch
function getTimeStamp(element) {
  let endDate = false;
  if (element.price.lineOffers[0].appliedRules[0] !== undefined) {
    endDate = element.price.lineOffers[0].appliedRules[0].endDate;
  } else if (element.promotions.promotionalOffers[0] !== undefined) {
    endDate =
      element.promotions.promotionalOffers[0].promotionalOffers[0].endDate;
  }
  let epoch = Date.parse(endDate) / 1000;
  return `<t:${epoch}:R>`;
}

module.exports = { getFreeGames };
