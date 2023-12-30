const finnhub = require("finnhub");

const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = "cm17kahr01qk0g5flqu0cm17kahr01qk0g5flqug";
const finnhubClient = new finnhub.DefaultApi();

function getStocks() {
  finnhubClient.quote("symbol", (error, data, response) => {
    console.log("\n", JSON.stringify(data));
    console.log(response["statusCode"]);
    // console.log(error);
    // console.log(response);
  });
}

getStocks();
