import React, { useContext, useState } from 'react';
import {
  Fab,
  InputAdornment,
  makeStyles,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core';
import { useParams } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import { useForum } from '../../../utils/useForums';
import PostCard from './PostCard';
import { usePosts } from '../../../utils/usePost';
import { Add as AddIcon } from '@material-ui/icons';
import { Search as SearchIcon } from '@material-ui/icons';
import ModalContext from '../../contexts/ModalContext';
import NewPostForm from '../../forms/NewPostForm';
import DateRangePicker from '../../forms/form-components/DateRangePicker';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(() => ({
  page: {
    paddingTop: 20,
  },
  headingContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 20,
    color: '#888',
    fontStyle: 'italic',
  },
  sectionContainer: {
    marginBottom: 20,
    display: 'flex',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  searchContainer: {
    width: '100%',
    maxWidth: '500px',
  },
  search: {
    width: '100%',
  },
  selectContainer: {
    marginRight: 40,
  },
  cardContainer: {
    marginBottom: 20,
  },
}));

const ForumPage = () => {
  const { id } = useParams();
  const { token } = useContext(UserContext);
  const { showModal } = useContext(ModalContext);
  const [query, setQuery] = useState('');
  const sortingOptions = [
    {
      value: '-createdAt',
      label: 'Most Recent',
    },
    {
      value: '-nLikes',
      label: 'Most Liked',
    },
  ];
  const [minDate, setMinDate] = useState(
    new Date(new Date().setFullYear(new Date().getFullYear() - 10)), // 10 years ago
  );
  const [maxDate, setMaxDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1)), // 1 day later
  );
  const [sorting, setSorting] = useState(sortingOptions[0].value);
  const [forum] = useForum(null, id, [token]);
  const [posts] = usePosts([], id, query, sorting, minDate, maxDate, [
    token,
    query,
    sorting,
    minDate,
    maxDate,
    showModal,
  ]);
  const styles = useStyles();

  const handleClickAdd = () => {
    showModal(<NewPostForm forumID={id} />);
  };

  const handleChangeQuery = (event) => {
    setQuery(event.target.value);
  };

  const handleChangeSorting = (event) => {
    setSorting(event.target.value);
  };

  const handleChangeMin = (date) => {
    setMinDate(date);
  };

  const handleChangeMax = (date) => {
    setMaxDate(date);
  };

  return (
    <div className={styles.page}>
      <div className={styles.headingContainer}>
        <div>
          <Typography variant="h2" className={styles.heading}>
            {forum && forum.name}
          </Typography>
          <Typography variant="h3" className={styles.description}>
            {forum && forum.description}
          </Typography>
        </div>
        <div>
          <Fab color="primary" onClick={handleClickAdd}>
            <AddIcon />
          </Fab>
        </div>
      </div>
      <div className={styles.sectionContainer}>
        <div className={styles.searchContainer}>
          <TextField
            id="input-field"
            label="Search in the forum"
            variant="outlined"
            className={styles.search}
            onChange={handleChangeQuery}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>
      </div>
      <div className={styles.sectionContainer}>
        <div className={styles.selectContainer}>
          <TextField
            id="sorting-select"
            select
            label="Sort by"
            value={sorting}
            onChange={handleChangeSorting}
            variant="outlined"
          >
            {sortingOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div>
          <DateRangePicker
            min={minDate}
            max={maxDate}
            onChangeMin={handleChangeMin}
            onChangeMax={handleChangeMax}
          />
        </div>
      </div>
      <div>
        <Grid container>
          <Grid item sm={12} lg={8}>
            {posts &&
              posts.map((post) => (
                <div key={post.id} className={styles.cardContainer}>
                  <PostCard post={post} hasLink />
                </div>
              ))}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default ForumPage;
