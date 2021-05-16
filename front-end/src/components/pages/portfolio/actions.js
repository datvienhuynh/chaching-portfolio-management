import {
  makePrediction,
  getStockData,
  getHoldingData,
  YF_QUOTE,
} from '../../../api/backendRequests';
import { processChartData } from '../stock-page/actions';

// Fetch and calculate stock data held in given portfolio
// Return list of holdings whose quantity is greater than 0
export const getPortfolioInfo = async (portfolio) => {
  const stockList = [];
  for (let i = 0; i < portfolio.holdings.length; i++) {
    // Convert to number
    portfolio.holdings[i].quantity = Number(portfolio.holdings[i].quantity);
    // Only fetch holdings with quantity greater than 0
    if (portfolio.holdings[i].quantity > 0) {
      const quote = await getStockData(portfolio.holdings[i].stock.id, YF_QUOTE);
      const dailyData = await getHoldingData(portfolio.holdings[i].id);
      const daily = dailyData.results;
      const boughtAt = dailyData.boughtAt;
      const prediction = await makePrediction(portfolio.holdings[i].stock.id);
      const futureDateList = Object.keys(prediction);
      const nextDayPred = Number(Number(prediction[futureDateList[0]]).toFixed(2));
      portfolio.holdings[i]['Latest Price'] = quote['Quote Price'];
      portfolio.holdings[i]['Price Change'] = quote['Price Change'];
      portfolio.holdings[i]['Change Percent'] = quote['Change Percent'];
      portfolio.holdings[i]['Volume'] = quote['Volume'];
      portfolio.holdings[i]['Daily Data'] = processChartData(daily);
      portfolio.holdings[i]['Next Day'] = nextDayPred;
      portfolio.holdings[i]['beta'] = quote['Beta (5Y Monthly)'];
      portfolio.holdings[i]['Next Day Percent'] = (nextDayPred / quote['Quote Price'] - 1) * 100;
      portfolio.holdings[i].boughtAt = boughtAt + 'T00:00:00';
      stockList.push(portfolio.holdings[i]);
    }
  }
  // Calculate important stats
  [
    portfolio.value,
    portfolio.change,
    portfolio.changePercent,
    portfolio.nextDay,
    portfolio.tickers,
    portfolio.pieChartData,
    portfolio.beta,
  ] = calcPortfolioStats(stockList);
  // Prepare dataset for rendering charts
  [portfolio.values, portfolio.stockData] = calcPortfolioValues(stockList);
  return stockList;
};

// Return data for rendering Line Graph and Comparing Chart
export const calcPortfolioValues = (holdings) => {
  const values = [];
  const stockData = [];

  if (holdings.length === 0) return values;

  let copiedHoldings = [...holdings];
  for (let i = 0; i < copiedHoldings.length; i++) {
    copiedHoldings[i]['Daily Data'].reverse();
  }

  for (let i = 0; i < copiedHoldings[0]['Daily Data'].length; i++) {
    let value = 0;
    let time = copiedHoldings[0]['Daily Data'][i].time;
    let volume = 0;
    let dataPoint = {};
    let stopSavingValues = true;

    for (let j = 0; j < copiedHoldings.length; j++) {
      if (
        Date.parse(copiedHoldings[j]['Daily Data'][i].time) >=
        Date.parse(copiedHoldings[j].boughtAt)
      ) {
        value += copiedHoldings[j]['Daily Data'][i].value * copiedHoldings[j].quantity;
        stopSavingValues = false;
      }
      volume += copiedHoldings[j]['Volume'];
      dataPoint[copiedHoldings[j].stock.ticker] = copiedHoldings[j]['Daily Data'][i].value;
    }
    if (!stopSavingValues) {
      values.push({
        time: time,
        value: value,
      });
    }
    dataPoint.time = time;
    dataPoint.volume = volume;
    stockData.push(dataPoint);
  }
  return [values.reverse(), stockData.reverse()];
};

// Return latest value of a portfolio given a list of holdings
export const calcPortfolioValue = (holdings) => {
  let value = 0;
  if (holdings.length === 0) return value;
  for (let i = 0; i < holdings.length; i++) {
    if (Number(holdings[i].quantity) > 0) {
      value += Number(holdings[i].stock.latestPrice) * Number(holdings[i].quantity);
    }
  }
  return value;
};

// Calculate essential stats of holdings with data for rendering Pie Chart
export const calcPortfolioStats = (holdings) => {
  let value = 0;
  let change = 0;
  let changePercent = 0;
  let totalQuantity = 0;
  let nextDay = 0;
  let beta = 0;
  const tickers = [];
  const pieChartData = [];

  if (holdings.length === 0) return [value, change, changePercent, nextDay, beta];

  for (let i = 0; i < holdings.length; i++) {
    value += holdings[i]['Latest Price'] * holdings[i].quantity;
    change += holdings[i]['Price Change'] * holdings[i].quantity;
    changePercent += holdings[i]['Change Percent'] * holdings[i].quantity;
    totalQuantity += holdings[i].quantity;
    nextDay += holdings[i]['Next Day'] * holdings[i].quantity;
    tickers.push(holdings[i].stock.ticker);
    pieChartData.push({
      ticker: holdings[i].stock.ticker,
      value: holdings[i]['Latest Price'] * holdings[i].quantity,
      quantity: holdings[i].quantity,
    });
  }

  changePercent = changePercent / totalQuantity;

  for (let i = 0; i < holdings.length; i++) {
    beta += ((holdings[i]['Latest Price'] * holdings[i].quantity) / value) * holdings[i]['beta'];
  }
  return [value, change, changePercent, nextDay, tickers, pieChartData, beta];
};
