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
      element.offerType !== "OTHERS" &&
      element.offerType !== "ADD_ON"
  );
  const queried = await filtered.map((element) => [
    {
      url: getUrl(element),
      timeStamp: getTimeStamp(element),
      title: element.title,
      price: element.price.totalPrice.originalPrice,
    },
  ]);
  return queried[0];
  // const filtered = json.data.Catalog.searchStore.elements.filter(
  //   (element) =>
  //     element.price.totalPrice.discountPrice === 0 &&
  //     element.offerType !== "OTHERS" &&
  //     element.offerType !== "ADD_ON"
  // );

  // return filtered.map((element) => [
  //   {
  //     url: getUrl(element),
  //     timeStamp: getTimeStamp(element),
  //     title: element.title,
  //     price: element.price.totalPrice.originalPrice,
  //   },
  // ]);
}

function getUrl(element) {
  if (element.catalogNs.mappings[0] === undefined) {
    return false;
  }
  return `https://store.epicgames.com/p/${element.catalogNs.mappings[0].pageSlug}`;
}

// Converts ISO-8601 to epoch
function getTimeStamp(element) {
  let epoch =
    Date.parse(element.price.lineOffers[0].appliedRules[0].endDate) / 1000;
  return `<t:${epoch}:R>`;
}

module.exports = { getFreeGames };
