# NodeJs WebScrapper

### Problem

node - for running scraping cheerio - for parsing html file (<https://www.npmjs.com/package/cheerio>, used similarly as jquery) either puppeteer/playwright or request-promise for fetching ads Purpose: scrape otomoto.pl portal using provided interface.

### Solution

Initial url <https://www.otomoto.pl/ciezarowe/uzytkowe/mercedes-benz/q-actros?search%5Bfilter_enum_damaged%5D=0&search%5Border%5D=created_at+%3Adesc&page=1>

- Added getNextPageUrl() function to iterate over pages
- Added addItems() function that fetches item urls + item ids (unique ids that the portal uses) from list page
- Added getTotalAdsCount() function - shows how many total ads exist for the provided initial url
- Added scrapeTruckItem() function - that scrapes the actual ads and parses into the format: item id, title, price, registration date, production date, mileage, power

### Test

```
1. console.log(pageInfo) --> shows total number of pages that a vehicle can have
2. console.log(getNextPageUrl(pageNumber)) --> getNextPageUrl Function takes number ar parameter and returns a new page url
3. http://localhost:8000/truck --> runs the addItems() function and shows an object of unique ids and urls of all the vehicle in one page
4. http://localhost:8000/articles --> runs the totalAdds() function and displays total ads for provided initial url
5. http://localhost:8000/truck_item --> runs the scrapeTruckItem() function and parses the result in the following format - {item_id, title, price, production_date, mileage, power}
```

### Questions/thoughts

- Ideas for error catching/solving, retry strategies?
- Accessing more ads from this link than the limit allows (max 50 pages)?
- Experience with CI/CD tools?
- Other considerations?
