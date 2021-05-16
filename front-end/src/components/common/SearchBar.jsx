import React, { useState } from 'react';

import { InputAdornment, Paper, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';

import SearchResult from './SearchResult';
import { getSearchStocks } from '../../utils/transactionRequests';

const useStyles = makeStyles((theme) => ({
  searchContainer: {
    position: 'relative',
  },
  searchBox: {
    marginTop: 30,
    width: '100%',
  },
  searchResultsContainer: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    maxHeight: 800,
    borderRadius: 10,
    overflow: 'scroll',
    overflowScrolling: 'auto',
    overscrollBehaviorY: 'contain',
  },
  searchIcon: {
    fontSize: 24,
  },
  input: {
    fontSize: 24,
  },
}));

const SearchBar = ({ overrideAddClick }) => {
  const classes = useStyles();

  // store states of search query and results
  const [results, setResults] = useState([]);

  // control text field
  const [input, setInput] = useState('');

  // update states when the input is changed
  const handleInputChange = async (event) => {
    const input = event.target.value;
    setInput(input);
    if (!input) {
      setResults([]);
    } else {
      const results = await getSearchStocks(input);
      setResults(results);
    }
  };

  const handleOverridenAddClick = (result) => {
    overrideAddClick(result);
    setInput('');
    setResults([]);
  };

  return (
    <div className={classes.searchContainer}>
      <TextField
        variant="outlined"
        className={classes.searchBox}
        size="medium"
        placeholder="Search for any equity..."
        value={input}
        onChange={(event) => {
          handleInputChange(event);
        }}
        InputProps={{
          className: classes.input,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon style={{ fontSize: 34 }} />
            </InputAdornment>
          ),
        }}
      />
      <Paper elevation={4} className={classes.searchResultsContainer}>
        <SearchResult
          results={results}
          overrideAddClick={overrideAddClick ? handleOverridenAddClick : undefined}
        />
      </Paper>
    </div>
  );
};

export default SearchBar;
