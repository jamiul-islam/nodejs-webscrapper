const PORT = 8000;
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const url =
  "https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc&page=1";

app.get("/", function (req, res) {
  res.json("This is my webscraper");
});

// global variables
var pageInfo = [];

app.get("/result", (req, res) => {
  axios(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const trucks = [];

      $(".fc-item__title", html).each(function () {
        const title = $(this).text();
        const url = $(this).find("a").attr("href");
        trucks.push({
          title,
          url,
        });
      });
      res.json(trucks);
    })
    .catch((err) => console.log(err));
});

// global function for getting total page number
// error-checking thought: getNextPageUrl will run (totalPageNumber - 1) times
axios(url)
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const page = [];

    $(".pagination-item", html).each(function () {
      const number = $(this).text();
      page.push(number);
    });
    const totalPage = parseInt(page[page.length - 2]);
    pageInfo.push({
      totalPage: totalPage,
    });
    // console.log(pageInfo);
  })
  .catch((err) => console.log(err));

// /////////////////////////////////////////////////
// Add getNextPageUrl function to iterate over pages
// /////////////////////////////////////////////////
const getNextPageUrl = (nextPage = 1, url) => {
  return `https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc&page=${nextPage}`;
  // return (url + "&page=" + nextPage)
};
// console.log(getNextPageUrl(10));
// --------------another thought process of implementing getNextPageUrl--------------
// if we have a button in our UI, the user will click on the button,
// then a function will be triggered and we will increment the page count by 1

// /////////////////////////////////////////////////
// - Add addItems function that fetches item urls + item ids (unique ids that the portal uses) from list page
// /////////////////////////////////////////////////
var trucks = [];
const addItems = () => {
  axios(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $("article", html).each(function () {
        const id = $(this).attr("id");
        const url = $(this).find("a").attr("href");
        trucks.push({
          url,
          id,
        });
      });

      // remove 6 social media from truck urls
      for (let i = 0; i < 6; i++) {
        trucks.pop();
      }
      // console.log(trucks);
    })
    .catch((err) => console.log(err));

  // test using http://localhost:8000/truck
  app.get("/truck", (req, res) => {
    res.json(trucks);
  });
};
addItems();

// /////////////////////////////////////////////////
// - Add getTotalAdsCount function - shows how many total ads exist for the provided initial url
// /////////////////////////////////////////////////
var totalAdds = [];
const getTotalAdsCount = () => {
  axios(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $('main[data-testid="search-results"]')
        .find("article")
        .find("a")
        .each(function (index, element) {
          totalAdds.push($(element).text());
        });
    })
    .catch((err) => console.log(err));

  // test using http://localhost:8000/articles
  app.get("/articles", (req, res) => {
    res.json(totalAdds);
  });
};
getTotalAdsCount();

// /////////////////////////////////////////////////
// - Add scrapeTruckItem function - that scrapes the actual ads and parses into the format: item id, title, price, registration date, production date, mileage, power
// /////////////////////////////////////////////////
var truckItem = [];
const scrapeTruckItem = () => {
  axios(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $("article", html).each(function () {
        const title = $(this).find("h2").text();
        const id = $(this).attr("id");
        // error: some article has price in 4th div, some has in 3rd div
        // but there's no id, class, or attributes which I can select and parse truck's id
        const price = $(this).find("div:nth-of-type(3)").text();
        const year = $(this)
          .find("div:nth-of-type(1)")
          .find("ul")
          .find("li:nth-of-type(1)")
          .text()
          .slice(0, 4);
        const milage = $(this)
          .find("div:nth-of-type(1)")
          .find("ul")
          .find("li:nth-of-type(2)")
          .text()
          .split("km");
        truckItem.push({
          item_id: id,
          title,
          price,
          production_date: year,
          milage: `${milage[0]}km`,
        });
      });
    })
    .catch((err) => console.log(err));

  // test using http://localhost:8000/truck_item
  app.get("/truck_item", (req, res) => {
    res.json(truckItem);
  });
};
scrapeTruckItem();

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
