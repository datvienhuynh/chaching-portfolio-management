import HttpClient from './HttpClient';
import { useCallback, useEffect, useState } from 'react';
import { handleError } from './backendRequests';
import { get_URL, get_URL_with_QUERY_STRING } from '../configuration/constants';
import { formatDate } from '../components/common/formatting';

const HTTPClient = HttpClient();

export const usePortfolios = (initialState, dependencies) => {
  const [portfolios, setPortfolios] = useState(initialState);
  const [diversification, setDiversification] = useState(null);

  const fetchPortfolios = useCallback(async () => {
    try {
      const res = await HTTPClient.get(get_URL('portfolios', 'mine'));
      const { results } = res.data;

      const stockValues = [0];
      results.map((portfolio) => {
        portfolio.holdings.map((holding) => {
          stockValues.push(Number(holding.quantity) * Number(holding.stock.latestPrice));
        });
      });

      const totalPortfolioValue = stockValues.reduce((total, num) => total + num);

      const b = stockValues.map((value) => {
        return Math.abs(value / totalPortfolioValue);
      });
      const sumOfB = b.reduce((total, num) => total + num);

      setDiversification(1 - sumOfB);
      setPortfolios(res.data.results);
    } catch (err) {
      console.error('Error', err);
      handleError(err);
      setPortfolios(initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchPortfolios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPortfolios, ...dependencies]);

  return [portfolios, setPortfolios, diversification];
};

export const usePortfolio = (initialState, id, dependencies) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [portfolio, setPortfolio] = useState(initialState);
  const [diversification, setDiversification] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [canRead, setCanRead] = useState(false);

  const updatePortfolio = async (id, body) => {
    setLoading(true);
    try {
      const res = await HTTPClient.put(get_URL('portfolios', id), body);
      await fetchPortfolio();

      setError(false);
    } catch (err) {
      setError('Something went wrong');
      handleError(err);
    }
    setLoading(false);
  };

  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    try {
      const res = await HTTPClient.get(get_URL('portfolios', id));
      setError(false);
      const portfolioTemp = res.data.result;
      const stockValues = [0];
      portfolioTemp.holdings.map((item, index) => {
        stockValues.push(Number(item.quantity) * Number(item.stock.latestPrice));
      });
      const totalPortfolioValue = stockValues.reduce((total, num) => total + num);
      const b = stockValues.map((value) => {
        return Math.abs(value / totalPortfolioValue);
      });
      const sumOfB = b.reduce((total, num) => total + num);
      setDiversification(1 - sumOfB);

      setPortfolio({ ...portfolioTemp });
      setIsOwner(res.data.isOwner);
      setCanRead(res.data.isOwner || res.data.result.isPublic);
      //setPortfolio(res.data)
    } catch (err) {
      console.error('Error', err);
      setError('Something went wrong');
      handleError(err);
      setPortfolio(initialState);
    }
    setLoading(false);
  }, [initialState, id]);

  useEffect(() => {
    fetchPortfolio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies]);
  return [
    portfolio,
    setPortfolio,
    fetchPortfolio,
    loading,
    error,
    updatePortfolio,
    diversification,
    isOwner,
    canRead,
  ];
};

export const usePublicPortfolio = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [portfolios, setPortfolios] = useState([]);
  const [allPortfolios, setAllPortfolios] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [diversification, setDiversification] = useState(null);

  const fetchAllPortfolios = async () => {
    setLoading(true);
    try {
      const res = await HTTPClient.get(get_URL(`portfolios/publicPortfoliosRankedByValue`));

      setError(false);
      setAllPortfolios(res.data.results);
    } catch (err) {
      setError('Something went wrong');
      handleError(err);
    }
    setLoading(false);
  };

  const fetchPortfoliosByUserId = async (userId) => {
    setLoading(true);
    try {
      const res = await HTTPClient.get(
        get_URL_with_QUERY_STRING(`portfolios/publicPortfolio`, `userId=${userId}`),
      );

      setError(false);
      setPortfolios(res.data.results);
    } catch (err) {
      setError('Something went wrong');
      handleError(err);
    }
    setLoading(false);
  };

  const fetchPortfoliosByPortfolioId = async (portfolioId) => {
    setLoading(true);
    try {
      const res = await HTTPClient.get(
        get_URL_with_QUERY_STRING(
          `portfolios/getPublicPortfolioById`,
          `portfolioId=${portfolioId}`,
        ),
      );

      setError(false);
      setPortfolio(res.data.results[0]);
      const result = calculateDiversification(res.data.results[0]);
      setDiversification(result.diversification);
      // setPortfolios(res.data.results)
    } catch (err) {
      setError('Something went wrong');
      handleError(err);
    }
    setLoading(false);
  };

  return {
    portfolios,
    allPortfolios,
    fetchAllPortfolios,
    fetchPortfoliosByUserId,
    fetchPortfoliosByPortfolioId,
    portfolio,
    loading,
    error,
    diversification,
  };
};

//http://localhost:8000/api/v1/portfolios/publicPortfolio/?userId=2
export const delete_portfolio = async (id) => {
  try {
    await HTTPClient.delete(get_URL('portfolios', id));
  } catch (err) {
    handleError(err);
  }
};

export const add_portfolio = async (body) => {
  try {
    await HTTPClient.post(get_URL('portfolios'), body);
  } catch (err) {
    handleError(err);
  }
};

export const adjustDate = (date) => {
  const copy = new Date(date);
  let dayOfWeek = date.getDay();
  while (dayOfWeek < 1 || dayOfWeek > 5) {
    copy.setDate(copy.getDate() - 1);
    dayOfWeek = copy.getDay();
  }
  return copy;
};

export const get_wealth = async (date) => {
  try {
    let res;
    if (!!date) {
      const adjustedDate = adjustDate(new Date(date));
      res = await HTTPClient.get(
        get_URL('portfolios', `wealth/${formatDate(adjustedDate, 'YYYY-MM-DD')}`),
      );
    } else {
      res = await HTTPClient.get(get_URL('portfolios', 'wealth'));
    }
    return res.data?.result;
  } catch (err) {
    handleError(err);
  }
};

export const get_growth = async (wealth) => {
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);
  const wealthLastYear = await get_wealth(oneYearAgo);
  return wealth / wealthLastYear;
};
