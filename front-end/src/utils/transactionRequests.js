import { get_URL } from '../configuration/constants';
import { handleError } from './backendRequests';
import HttpClient from './HttpClient';

const HTTPClient = HttpClient();

export const addStockToPortfolio = async (token, stock_id, portfolio_id, quantity, date) => {
  try {
    // Check if holding already in the target portfolio for the stock
    const resHolding = await HTTPClient.get(
      `${get_URL('holdings')}?stock=${stock_id}&portfolio=${portfolio_id}`,
    );
    let holding = null;
    if (resHolding.data?.results?.length) {
      holding = resHolding.data.results[0];
    }
    if (!holding) {
      // If holding does not exists create one
      const resHoldingCreate = await HTTPClient.post(get_URL('holdings'), {
        stock: stock_id,
        portfolio: portfolio_id,
      });
      holding = resHoldingCreate.data;
    }
    // Add transaction to holding
    const resTransaction = await HTTPClient.post(get_URL('transactions'), {
      quantity: quantity,
      date: date,
      holding: holding.id,
    });
    return { holding: holding, transaction: resTransaction.data };
  } catch (err) {
    handleError(err);
  }
};

/** Update holding for a portfolio */
export const updateHoldings = async (holdingId, quantity) => {
  try {
    const date = new Date();
    await HTTPClient.post(get_URL('transactions'), {
      quantity: quantity,
      holding: holdingId,
      date: date.toISOString().substring(0, 10),
    });
  } catch (err) {
    handleError(err);
  }
};

/** Fetch searched stock results from backend and update given state */
export const getSearchStocks = async (input) => {
  try {
    const res = await HTTPClient.get(`${get_URL('stocks')}?search=${input}`);
    return res.data.results;
  } catch (err) {
    handleError(err);
  }
};
