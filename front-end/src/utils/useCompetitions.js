import HttpClient from './HttpClient';
import { useCallback, useEffect, useState } from 'react';
import { handleError } from './backendRequests';
import { get_URL } from '../configuration/constants';

const HTTPClient = HttpClient();
const COMPETITIONS_URL = get_URL('competition');

export const useCompetitions = (initialState, dependencies) => {
  const [competitions, setCompetitions] = useState(initialState);

  const fetchCompetitions = useCallback(async () => {
    try {
      const res = await HTTPClient.get(COMPETITIONS_URL);
      setCompetitions(
        res.data.results.map((comp) => {
          return {
            id: comp.id,
            startDate: new Date(comp.startDate),
            submissionClose: new Date(comp.submissionClose),
            endDate: new Date(comp.endDate),
            maxStartingValue: parseFloat(comp.maxStartingValue),
          };
        }),
      );
    } catch (err) {
      console.error(err);
      handleError(err);
      setCompetitions(initialState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchCompetitions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCompetitions, ...dependencies]);

  return [competitions, setCompetitions];
};

export const useCompetitionSubmissions = (id) => {
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState(null);
  const [competition, setCompetition] = useState(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await HTTPClient.get(`${COMPETITIONS_URL}${id}/portfolios`);
      setSubmissions(
        await Promise.all(
          res.data.results.map(async (submission) => {
            const newSubmission = { ...submission };
            newSubmission['username'] = (
              await HTTPClient.get(get_URL('users') + `${newSubmission.createdBy}`)
            ).data.username;
            newSubmission['totalValue'] = (
              await HTTPClient.get(`${COMPETITIONS_URL}portfolios/${newSubmission.id}/value`)
            ).data.data;
            newSubmission['updatedAt'] = new Date(newSubmission.updatedAt);
            let newHoldings = [];
            for (let holding of newSubmission.holdings) {
              let holdingDetails = (
                await HTTPClient.get(
                  `${COMPETITIONS_URL}portfolios/${newSubmission.id}/holdingvalue/${holding.id}`,
                )
              ).data;
              newHoldings.push({
                stockName: holding.stock.name,
                stockTicker: holding.stock.ticker,
                stockPrice: holdingDetails.price,
                stockQuantity: holdingDetails.quantity,
              });
            }
            newSubmission.holdings = newHoldings;
            return newSubmission;
          }),
        ),
      );
      setCompetition((await HTTPClient.get(`${COMPETITIONS_URL}${id}`)).data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      handleError(err);
      setSubmissions(null);
      setCompetition(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSubmissions]);

  return {
    submissions: submissions,
    competition: competition,
    fetchSubmissions: fetchSubmissions,
    submissionsLoading: loading,
  };
};

export const addCompetitionPortfolio = async (id) => {
  const portfolio = (await HTTPClient.post(`${COMPETITIONS_URL}${id}/portfolios/`)).data;
  portfolio['username'] = (
    await HTTPClient.get(get_URL('users') + `${portfolio.createdBy}`)
  ).data.username;
  portfolio['totalValue'] = 0;
  portfolio['updatedAt'] = new Date(portfolio.updatedAt);
  portfolio['holdings'] = [];
  return portfolio;
};

export const pushCompetitionPortfolio = async (id, holdings) => {
  const payload = {};
  for (let holding of holdings) {
    payload[holding.stockTicker] = parseInt(holding.stockQuantity);
  }
  await HTTPClient.put(`${COMPETITIONS_URL}portfolios/${id}/`, { holdings: payload });
};

export const deleteCompetitionPortfolio = async (id) => {
  await HTTPClient.delete(`${COMPETITIONS_URL}portfolios/${id}/`);
};
