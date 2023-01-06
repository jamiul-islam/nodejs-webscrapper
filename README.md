# Task Description

### Need to use:

node - for running scraping cheerio - for parsing html file (https://www.npmjs.com/package/cheerio, used similarly as jquery) either puppeteer/playwright or request-promise for fetching ads Purpose: scrape otomoto.pl portal using provided interface.

### BONUS: scraping via otomoto mobile app.

Initial url https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc&page=1

- Add getNextPageUrl function to iterate over pages
- Add addItems function that fetches item urls + item ids (unique ids that the portal uses) from list page
- Add getTotalAdsCount function - shows how many total ads exist for the provided initial url
- Add scrapeTruckItem function - that scrapes the actual ads and parses into the format: item id, title, price, registration date, production date, mileage, power

# Questions/thoughts:

- Ideas for error catching/solving, retry strategies?
- Accessing more ads from this link than the limit allows (max 50 pages)?
- Experience with CI/CD tools?
- Other considerations?
