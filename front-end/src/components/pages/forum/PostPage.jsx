import React, { useContext, useState } from 'react';
import { Fab, makeStyles, MenuItem, TextField, Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import PostCard from './PostCard';
import { usePost } from '../../../utils/usePost';
import CommentCard from './CommentCard';
import { useComments } from '../../../utils/useComments';
import { Add as AddIcon } from '@material-ui/icons';
import ModalContext from '../../contexts/ModalContext';
import NewCommentForm from '../../forms/NewCommentForm';
import DateRangePicker from '../../forms/form-components/DateRangePicker';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(() => ({
  page: {
    paddingTop: 20,
  },
  subheadingContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  subheading: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
  },
  selectContainer: {
    marginRight: 40,
  },
  postCardContainer: {
    marginBottom: 40,
  },
  commentCardContainer: {
    marginBottom: 20,
  },
}));

const PostPage = () => {
  const { id } = useParams();
  const { token } = useContext(UserContext);
  const { showModal } = useContext(ModalContext);
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
  const [sorting, setSorting] = useState(sortingOptions[0].value);
  const [minDate, setMinDate] = useState(
    new Date(new Date().setFullYear(new Date().getFullYear() - 10)), // 10 years ago
  );
  const [maxDate, setMaxDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 1)), // 1 day later
  );
  const [post, , fetchPost] = usePost(null, id, [token]);
  const [comments, , fetchComments] = useComments([], id, sorting, minDate, maxDate, [
    token,
    sorting,
    minDate,
    maxDate,
    showModal,
  ]);
  const styles = useStyles();

  const handleClickAdd = () => {
    showModal(<NewCommentForm postID={post.id} hasPortfolio={!!post.portfolio} />);
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
      <div className={styles.postCardContainer}>
        {post && <PostCard post={post} onUpdate={fetchPost} />}
      </div>
      <div>
        <div className={styles.subheadingContainer}>
          <div>
            <Typography variant="h2" className={styles.subheading}>
              Comments
            </Typography>
          </div>
          <div>
            <Fab color="primary" onClick={handleClickAdd}>
              <AddIcon />
            </Fab>
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
        <Grid container>
          <Grid item sm={12} lg={8}>
            {comments &&
              comments.map((comment) => (
                <div key={comment.id} className={styles.commentCardContainer}>
                  <CommentCard comment={comment} onUpdate={fetchComments} />
                </div>
              ))}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default PostPage;
