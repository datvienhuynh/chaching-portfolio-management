import React, { useContext } from 'react';
import { Grid, Typography, Fab, Card, CardHeader, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import UserContext from '../../contexts/UserContext';
import ModalContext from '../../contexts/ModalContext.jsx';
import PortfolioCard from './PortfolioCard';
import NewPortfolioForm from '../../forms/NewPortfolioForm';
import { usePortfolios } from '../../../utils/usePortfolios';
import Box from '@material-ui/core/Box';
import { Add as AddIcon } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
  page: {
    paddingTop: 20,
  },
  headingContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
  },
}));

const PortfoliosPage = () => {
  const { token } = useContext(UserContext);
  const { showModal } = useContext(ModalContext);
  const [portfolios, , diversification] = usePortfolios([], [token, showModal]);

  const styles = useStyles();

  const handleClickAdd = () => {
    showModal(<NewPortfolioForm />);
  };

  return (
    <Box className={styles.page}>
      <div className={styles.headingContainer}>
        <div>
          <Typography variant="h1" className={styles.heading}>
            Portfolios
          </Typography>
        </div>
        <div>
          <Fab color="primary" onClick={handleClickAdd}>
            <AddIcon />
          </Fab>
        </div>
      </div>
      <div>
        <Grid container style={{ marginBottom: '4rem' }}>
          <Grid item xs={6} lg={12}>
            <Card style={{ padding: '1rem' }}>
              <CardHeader title="Diversification" />
              <CardContent>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      flex: 1,
                      background:
                        diversification < 0.33
                          ? 'red'
                          : diversification < 0.66
                          ? 'yellow'
                          : 'green',
                      height: '10px',
                      marginRight: '1rem',
                      borderRadius: '22px',
                    }}
                  />
                  <Typography>{diversification || 0}</Typography>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={6}>
          {portfolios &&
            portfolios.map((portfolio, index) => (
              <Grid item xs={12} lg={6}>
                <PortfolioCard key={index} portfolio={portfolio} />
              </Grid>
            ))}
        </Grid>
      </div>
    </Box>
  );
};

export default PortfoliosPage;
