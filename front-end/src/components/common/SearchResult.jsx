import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SearchResultContainer from './SearchResultContainer';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
}));

// render each search result in a container row by row
const SearchResult = ({ results, overrideAddClick }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {results &&
        results.map((result) => {
          return (
            <SearchResultContainer
              result={result}
              key={result.id}
              overrideAddClick={overrideAddClick}
            />
          );
        })}
    </div>
  );
};

export default SearchResult;
