import React, { useState, useContext } from 'react';
import {
  Typography,
  Grid,
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  TextField,
  Button,
  LinearProgress,
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import ModalContext from '../contexts/ModalContext';
import SearchBar from '../common/SearchBar';
import { pushCompetitionPortfolio } from '../../utils/useCompetitions';

const useStyles = makeStyles({
  form: {
    minWidth: 650,
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  tableContainer: {
    maxHeight: 400,
  },
  error: {
    color: 'tomato',
  },
});

const capitalizeFirstLetter = (s) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const CompetitionPortfolioForm = ({ portfolio, competition, edit, fetchSubmissions }) => {
  const [holdings, setHoldings] = useState(portfolio ? [...portfolio.holdings] : []);
  const [loading, setLoading] = useState(false);
  const { showModal } = useContext(ModalContext);
  const styles = useStyles();

  const rows = edit
    ? holdings
    : holdings.sort((a, b) => {
        let aSubtotal = a.stockPrice * a.stockQuantity;
        let bSubtotal = b.stockPrice * b.stockQuantity;
        if (aSubtotal > bSubtotal) return -1;
        if (aSubtotal < bSubtotal) return 1;
        return 0;
      });

  const addToPortfolio = (result) => {
    const newHoldings = [...holdings];
    if (!newHoldings.find((el) => el.stockTicker === result.ticker)) {
      newHoldings.push({
        stockName: result.name,
        stockTicker: result.ticker,
        stockPrice: result.latestPrice,
        stockQuantity: 0,
      });
      setHoldings(newHoldings);
    }
  };

  const deleteHolding = (ticker) => {
    let newHoldings = holdings.filter((el) => el.stockTicker !== ticker);
    setHoldings(newHoldings);
  };

  const handleQuantityChange = (ticker, value) => {
    if (/[^0-9]/.test(value)) return;
    let newHoldings = [...holdings];
    let targetIndex = newHoldings.findIndex((el) => el.stockTicker === ticker);
    newHoldings[targetIndex] = {
      ...newHoldings[targetIndex],
      stockQuantity: value,
    };
    setHoldings(newHoldings);
  };

  const totalValue = rows.reduce(
    (total, holding) => total + holding.stockPrice * holding.stockQuantity,
    0,
  );

  let error = '';
  if (totalValue > competition.maxStartingValue) {
    error = `Exceeds Maximum competition portfolio value of $${competition.maxStartingValue}`;
  } else {
    for (let holding of holdings) {
      let quantity = parseInt(holding.stockQuantity) || 0;
      if (quantity <= 0) {
        error = `${holding.stockTicker}: quantity must be greater than zero`;
      }
    }
  }

  const cancel = () => {
    showModal(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await fetchSubmissions();
    await pushCompetitionPortfolio(portfolio.id, holdings);
    await fetchSubmissions();
    setLoading(false);
    showModal(null);
  };

  return (
    <Grid container className={styles.form} spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h3" align="center" className={styles.title}>
          {`${capitalizeFirstLetter(portfolio.username)}'s Submission`}
        </Typography>
      </Grid>
      {edit && (
        <Grid item xs={12}>
          <SearchBar overrideAddClick={addToPortfolio} />
        </Grid>
      )}
      <Grid item xs={12}>
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table className={styles.table}>
            <TableHead>
              <TableRow>
                <TableCell align="left" className={styles.bold}>
                  Name
                </TableCell>
                <TableCell align="right" className={styles.bold}>
                  Ticker
                </TableCell>
                <TableCell align="right" className={styles.bold}>
                  Price
                </TableCell>
                <TableCell align="right" className={styles.bold}>
                  Quantity
                </TableCell>
                <TableCell align="right" className={styles.bold}>
                  Subtotal
                </TableCell>
                {edit && <TableCell align="center" />}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((holding) => {
                return (
                  <TableRow key={holding.stockTicker}>
                    <TableCell align="left">{holding.stockName}</TableCell>
                    <TableCell align="right">{holding.stockTicker}</TableCell>
                    <TableCell align="right">{holding.stockPrice}</TableCell>
                    <TableCell align="right">
                      {edit && (
                        <TextField
                          variant="standard"
                          value={holding.stockQuantity}
                          onChange={(event) => {
                            handleQuantityChange(holding.stockTicker, event.target.value);
                          }}
                          inputProps={{ style: { textAlign: 'right', width: 100 } }}
                        />
                      )}
                      {!edit && <div>{holding.stockQuantity}</div>}
                    </TableCell>
                    <TableCell align="right">
                      {(holding.stockQuantity * holding.stockPrice).toFixed(2)}
                    </TableCell>
                    {edit && (
                      <TableCell>
                        <IconButton onClick={() => deleteHolding(holding.stockTicker)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {loading && <LinearProgress />}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4" align="center">
          {`Total: $${rows
            .reduce((total, holding) => total + holding.stockPrice * holding.stockQuantity, 0)
            .toFixed(2)}`}
        </Typography>
      </Grid>
      {edit && error && (
        <Grid item xs={12}>
          <Typography align="center" className={styles.error}>
            {error}
          </Typography>
        </Grid>
      )}
      {edit && (
        <React.Fragment>
          <Grid item xs={2} />
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="primary"
              disabled={!!error}
              fullWidth
              onClick={() => handleSubmit()}
            >
              Submit
            </Button>
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={3}>
            <Button variant="contained" fullWidth onClick={cancel}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={2} />
        </React.Fragment>
      )}
    </Grid>
  );
};

export default CompetitionPortfolioForm;
