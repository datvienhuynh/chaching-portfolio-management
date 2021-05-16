import {
  CircularProgress,
  IconButton,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { Delete as DeleteIcon } from '@material-ui/icons';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { updateHoldings } from '../../../utils/transactionRequests';
import { getComparator, SortTableHead, stableSort } from '../../common/sortTableComponents';

SortTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  headCells: PropTypes.array.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 250,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  negativeTrend: {
    color: '#ff1744',
  },
  positiveTrend: {
    color: '#4caf50',
  },
}));

const StockTable = ({ portfolio, fetchPortfolio, isOwner }) => {
  const classes = useStyles();
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('Change Percent');
  const [selected, setSelected] = useState([]);
  const headCells = [
    { id: 'Stock', numeric: false, disablePadding: true, label: 'Stock' },
    { id: 'quantity', numeric: true, disablePadding: false, label: 'Quantity' },
    { id: 'Latest Price', numeric: true, disablePadding: false, label: 'Latest Price' },
    { id: 'Price Change', numeric: true, disablePadding: false, label: 'Price Change' },
    { id: 'Change Percent', numeric: true, disablePadding: false, label: 'Change Percent' },
    { id: 'Next Day', numeric: true, disablePadding: false, label: 'Next Day Price' },
    { id: 'Next Day Percent', numeric: true, disablePadding: false, label: 'Next Day % change' },
  ];
  const [data, setData] = useState(null);

  // Get all holdings with quantity greater than 0
  useEffect(() => {
    if (portfolio) {
      const holdingList = [];
      for (let i = 0; i < portfolio.holdings.length; i++) {
        if (portfolio.holdings[i].quantity > 0) {
          holdingList.push(portfolio.holdings[i]);
        }
      }
      setData(holdingList, portfolio.holdings);
    }
  }, [portfolio]);

  // Handle header clicked for sorting
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Handle deleting a holding from portfolio
  const onDeleteHolding = async (holdingId, quantity) => {
    await updateHoldings(holdingId, quantity);
    fetchPortfolio();
  };

  return (
    <TableContainer>
      {data && (
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size="medium"
          aria-label="enhanced table"
        >
          <SortTableHead
            classes={classes}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={data.length}
            headCells={headCells}
          />
          <TableBody>
            {stableSort(data, getComparator(order, orderBy)).map((row, index) => {
              const isItemSelected = isSelected(row.stock.ticker);
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableRow
                  hover
                  onClick={(event) => handleClick(event, row.stock.ticker)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.stock.ticker}
                  selected={isItemSelected}
                >
                  <TableCell component="th" id={labelId} scope="row" padding="none">
                    <Link component={RouterLink} to={`/stock/${row.stock.id}`}>
                      <strong>
                        {row.stock.name} ({row.stock.ticker})
                      </strong>
                    </Link>
                  </TableCell>
                  <TableCell align="right">{row.quantity}</TableCell>
                  <TableCell align="right">
                    {row['Latest Price'] ? (
                      row['Latest Price'].toFixed(2)
                    ) : (
                      <CircularProgress color="primary" size={10} />
                    )}
                  </TableCell>
                  <TableCell
                    align="right"
                    className={
                      row['Price Change'] > 0 ? classes.positiveTrend : classes.negativeTrend
                    }
                  >
                    {row['Price Change'] ? (
                      row['Price Change'].toFixed(2)
                    ) : (
                      <CircularProgress color="primary" size={10} />
                    )}
                  </TableCell>
                  <TableCell
                    align="right"
                    className={
                      row['Change Percent'] > 0 ? classes.positiveTrend : classes.negativeTrend
                    }
                  >
                    {row['Change Percent'] ? (
                      row['Change Percent'].toFixed(2) + '%'
                    ) : (
                      <CircularProgress color="primary" size={10} />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {row['Next Day'] ? (
                      row['Next Day'].toFixed(2)
                    ) : (
                      <CircularProgress color="primary" size={10} />
                    )}
                  </TableCell>
                  <TableCell
                    align="right"
                    className={
                      row['Next Day Percent'] > 0 ? classes.positiveTrend : classes.negativeTrend
                    }
                  >
                    {row['Next Day Percent'] ? (
                      row['Next Day Percent'].toFixed(2) + '%'
                    ) : (
                      <CircularProgress color="primary" />
                    )}
                  </TableCell>
                  {isOwner && (
                    <IconButton
                      onClick={() => {
                        onDeleteHolding(row.id, -row.quantity);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default StockTable;
