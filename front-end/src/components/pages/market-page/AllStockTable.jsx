import React, { useState } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
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

const AllStockTable = ({ data }) => {
  const classes = useStyles();
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('percentchange');
  const [selected, setSelected] = useState([]);
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

  const headCells = [
    { id: 'ticker', numeric: false, disablePadding: true, label: 'Ticker' },
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'sector', numeric: false, disablePadding: true, label: 'Sector' },
    { id: 'latestPrice', numeric: true, disablePadding: false, label: 'Latest Price' },
    {
      id: 'predictedNextDayPrice',
      numeric: true,
      disablePadding: false,
      label: 'next day prediction',
    },
    {
      id: 'predictedPercentChange',
      numeric: true,
      disablePadding: false,
      label: 'prediction percent change',
    },
  ];

  return (
    <TableContainer>
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
          rowCount={10}
          headCells={headCells}
        />
        <TableBody>
          {stableSort(data, getComparator(order, orderBy)).map((row, index) => {
            const isItemSelected = isSelected(row['Ticker']);
            const labelId = `enhanced-table-checkbox-${index}`;

            return (
              <TableRow
                hover
                onClick={(event) => handleClick(event, row.symbol)}
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={row['ticker']}
                selected={isItemSelected}
              >
                <TableCell component="th" id={labelId} scope="row" padding="none">
                  <Link component={RouterLink} to={`/stock/${row.id}`}>
                    {row['ticker']}
                  </Link>
                </TableCell>
                <TableCell align="left">{row['name']}</TableCell>
                <TableCell align="left">{row['sector']}</TableCell>
                <TableCell align="right">{parseFloat(row['latestPrice'])}</TableCell>
                <TableCell
                  align="right"
                  className={
                    Number(row['predictedNextDayPrice']) > row['latestPrice']
                      ? classes.positiveTrend
                      : classes.negativeTrend
                  }
                >
                  {row['predictedNextDayPrice']}
                </TableCell>
                <TableCell
                  align="right"
                  className={
                    Number(row['predictedNextDayPrice']) > row['latestPrice']
                      ? classes.positiveTrend
                      : classes.negativeTrend
                  }
                >
                  {Number((row['predictedNextDayPrice'] / row['latestPrice'] - 1) * 100).toFixed(2)}
                  %
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AllStockTable;
