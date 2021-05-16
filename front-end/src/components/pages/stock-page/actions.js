// Return abbreviation of given large number
export const abbreviateNumber = (number) => {
  let newString = number;
  if (number >= 1000) {
    if (number >= 1000000000000) {
      newString = Math.round(number / 10000000000) / 100 + 't';
    } else if (number >= 1000000000) {
      newString = Math.round(number / 10000000) / 100 + 'b';
    } else if (number >= 1000000) {
      newString = Math.round(number / 10000) / 100 + 'm';
    } else {
      newString = Math.round(number / 10) / 100 + 'k';
    }
  }
  return newString;
};

// Return a slice of given length from a list
export const sliceList = (list, len) => {
  const listLen = list.length;
  if (listLen > len) {
    return list.slice(listLen - len, listLen);
  } else {
    return list;
  }
};

// Generate projection for prediction
export const generateFutureProjection = (data, prediction) => {
  const futureDateList = Object.keys(prediction);
  for (let i = 0; i < futureDateList.length; i++) {
    data.push({
      time: futureDateList[i],
      projection: Number(Number(prediction[futureDateList[i]]).toFixed(3)),
    });
  }
};

// Create data for rendering chart
export const processChartData = (data) => {
  const newData = [];
  for (let i = 0; i < data.date.length; i++) {
    newData.push({
      time: data.date[i],
      value: data.close[i],
    });
  }
  return newData;
};

// Return stock data retrieved from Alpha Vantage data
export const processStockData = (overview, daily, weekly, quote, news, prediction) => {
  const dailyData = daily;
  const weeklyData = weekly;
  const currentDate = daily.date[daily.date.length - 1];
  const updatedAt = daily.date[daily.date.length - 1];
  const latestPrice = quote['Quote Price'];
  const beta = quote['Beta (5Y Monthly)'];
  const sd = overview.sd.toFixed(3);

  // Create list of DAILY data for rendering chart in stock page
  const dailyPriceData = processChartData(dailyData);

  // make predicted curve continuous
  dailyPriceData.push({ time: currentDate, projection: latestPrice });
  generateFutureProjection(dailyPriceData, prediction);

  // Create list of WEEKLY data for rendering chart in stock page
  const weeklyPriceData = processChartData(weeklyData);

  const futureDateList = Object.keys(prediction);
  const predictionData = [];
  for (let i = 0; i < futureDateList.length; i++) {
    if (i % 7 === 0) {
      predictionData.push({
        date: futureDateList[i],
        value: [
          Number(prediction[futureDateList[i]]).toFixed(3),
          Number((prediction[futureDateList[i]] / latestPrice - 1) * 100).toFixed(2),
        ],
      });
    }
  }

  // Create data for Summary Table 1 in stock page
  const summaryTableData1 = [
    { label: 'Quote Type', value: overview.quoteType },
    { label: 'Country', value: overview.country },
    { label: 'Sector', value: overview.sector },
    { label: 'FT Employees', value: overview.fullTimeEmployees },
    { label: 'Previous Close', value: quote['Previous Close'].toFixed(4) },
    { label: 'Open', value: overview.open.toFixed(4) },
    { label: "Day's Range", value: quote["Day's Range"] },
    { label: '52-Week Range', value: quote['52 Week Range'] },
    { label: '52-Week Change', value: overview['52WeekChange'] },
  ];

  // Create data for Summary Table 2 in stock page
  const summaryTableData2 = [
    { label: 'PE Ratio', value: quote['PE Ratio (TTM)'] },
    { label: 'EPS (TTM)', value: quote['EPS (TTM)'] },
    { label: 'Earnings Date', value: quote['Earnings Date'] },
    { label: '1y Target Est', value: quote['1y Target Est'] },
    { label: 'Ask', value: quote['Ask'] },
    { label: 'Forward Dividend & Yield', value: quote['Forward Dividend & Yield'] },
    { label: 'Ex Dividend Date', value: quote['Ex-Dividend Date'] },
    { label: 'Volume', value: quote['Volume'] },
  ];

  // Get only 5 latest stock news at most
  let stockNews = [];
  if (news.length > 5) {
    stockNews = news.slice(0, 5);
  } else {
    stockNews = news;
  }

  return {
    overview: overview,
    quote: quote,
    dailyData: dailyData,
    weeklyData: weeklyData,
    dailyPriceData: dailyPriceData,
    weeklyPriceData: weeklyPriceData,
    predictionData: predictionData,
    summaryTableData1: summaryTableData1,
    summaryTableData2: summaryTableData2,
    currentDate: currentDate,
    updatedAt: updatedAt,
    latestPrice: latestPrice,
    news: stockNews,
    beta: beta,
    sd: sd,
  };
};
