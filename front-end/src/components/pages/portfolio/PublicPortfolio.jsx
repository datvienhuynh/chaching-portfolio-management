import React, { useEffect } from 'react';

import { makeStyles, Typography } from '@material-ui/core';
import { useHistory, useParams } from 'react-router';
import Table from '../../common/Table';
import { usePublicPortfolio } from '../../../utils/usePortfolios';
import { calcPortfolioValue } from './actions';
import Layout from '../../common/Layout';
import moment from 'moment';

const useStyles = makeStyles(() => ({
  content: {
    padding: '3rem',
  },
  sidebar: {
    background: '#ddd',
    height: '95vh',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
  },
}));

const PublicPortfolio = () => {
  const { allPortfolios, fetchAllPortfolios, loading, error } = usePublicPortfolio();
  const classes = useStyles();
  const history = useHistory();

  useEffect(() => {
    fetchAllPortfolios();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (clickedIndex) => {
    history.push(`/portfolio/${allPortfolios[clickedIndex].id}`);
  };

  const getTableBodyStyle = () => {
    return allPortfolios.map((p) => {
      return {
        background: `#${p.colour.hex}`,
      };
    });
  };

  const filterData = () => {
    let portfolioList = allPortfolios.map((p) => {
      return [
        p.name,
        p.description,
        moment(p.createdAt).format('YYYY-MM-DD'),
        `$${calcPortfolioValue(p.holdings).toFixed(2)}`,
      ];
    });
    const nodups = [];
    for (let p of portfolioList) {
      if (!nodups.find((el) => el[0] === p[0])) {
        nodups.push(p);
      }
    }
    return nodups;
  };

  return (
    <Layout
      loading={loading}
      error={error}
      heading={
        <Typography variant="h1" className={classes.heading}>
          Public Portfolio
        </Typography>
      }
    >
      <Table
        tableBodyStyle={getTableBodyStyle()}
        onClick={handleClick}
        tableHeader={['Name', 'Description', 'Created At', 'Value']}
        tableBodyData={filterData()}
      />
    </Layout>
  );
};

export default PublicPortfolio;
