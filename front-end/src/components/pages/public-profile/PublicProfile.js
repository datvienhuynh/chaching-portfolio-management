import React, { useEffect, useContext } from 'react';

import { makeStyles, Typography } from '@material-ui/core';
import UserContext from '../../contexts/UserContext';
import { useHistory, useParams } from 'react-router';
import Table from '../../common/Table';
import { usePublicPortfolio } from '../../../utils/usePortfolios';
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

const PublicProfile = () => {
  const params = useParams();
  const { portfolios, loading, error, fetchPortfoliosByUserId } = usePublicPortfolio();
  const classes = useStyles();

  const history = useHistory();

  useEffect(() => {
    fetchPortfoliosByUserId(params.id);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleClick = (clickedIndex) => {
    history.push(`/holdings/${portfolios[clickedIndex].id}`);
  };

  const getTableBodyStyle = () => {
    return portfolios.map((p) => {
      return {
        background: `#${p.colour.hex}`,
      };
    });
  };
  const filterData = () => {
    return portfolios.map((p) => {
      return [p.name, p.description, moment(p.createdAt).format('YYYY-MM-DD')];
    });
  };

  return (
    <Layout
      loading={loading}
      error={error}
      heading={
        <Typography variant="h1" className={classes.heading}>
          Profile
        </Typography>
      }
    >
      <Table
        tableBodyStyle={getTableBodyStyle()}
        onClick={handleClick}
        tableHeader={['Name', 'Description', 'Created At']}
        tableBodyData={filterData()}
      />
    </Layout>
  );
};
export default PublicProfile;
