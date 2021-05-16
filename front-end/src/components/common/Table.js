import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  table: {
    marginTop: '4rem',
    width: '100%',
    borderSpacing: '0 2em',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  headerColumn: {
    width: '16.66%',
    color: '#7d868c',
    marginBottom: '2rem',

    fontWeight: 100,
  },
  bodyColumn: {
    textAlign: 'center',
    padding: '0.5rem',
    border: '1px solid #ddd',

    borderLeft: 0,
    borderRight: 0,
    fontSize: '1.2rem',
    color: '#333',
  },
  companyPrice: {
    color: '#004c99',
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  change: { color: '#1ca41c' },
  chartImage: {},
}));

export default function Table({ tableHeader, tableBodyData, onClick, tableBodyStyle }) {
  const classes = useStyles();

  return (
    <>
      <table className={classes.table}>
        <tr>
          {tableHeader.map((col) => (
            <th className={classes.headerColumn}>{col}</th>
          ))}
        </tr>
        {tableBodyData.map((row, outerIndex) => {
          return (
            <tr
              style={Array.isArray(tableBodyStyle) ? tableBodyStyle[outerIndex] : {}}
              onClick={() => onClick(outerIndex)}
            >
              {row.map((col, index) => {
                let style = {};
                if (index === 0) {
                  style = {
                    borderLeft: '1px solid #ddd',
                    borderTopLeftRadius: '8px',
                    borderBottomLeftRadius: '8px',
                  };
                }
                if (index === row.length - 1) {
                  style = {
                    borderRight: '1px solid #ddd',
                    borderTopRightRadius: '8px',
                    borderBottomRightRadius: '8px',
                  };
                }
                return (
                  <td style={style} className={`${classes.bodyColumn}`}>
                    {col}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </table>
    </>
  );
}
