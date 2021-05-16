import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import moment from 'moment';
import { Button, ButtonGroup } from '@material-ui/core';
import { expressAttitudeOnComment } from '../../../utils/useComments';
import { Star } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none !important',
  },
  cardContainer: {
    padding: 10,
    backgroundColor: theme.palette.secondary.light,
  },
  card: {},
  starContainer: {
    marginBottom: 10,
  },
  star: {
    display: 'flex',
    alignItems: 'center',
  },
  userContainer: {
    marginBottom: 10,
  },
  user: {
    fontSize: 15,
    color: '#666',
  },
  nameContainer: {
    marginBottom: 10,
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginBottom: 10,
  },
  description: {
    fontSize: 20,
    color: '#444',
    fontStyle: 'italic',
  },
  actionsContainer: {},
}));

const CommentCard = ({ comment, onUpdate }) => {
  const styles = useStyles();

  const handleClickLike = () => {
    expressAttitudeOnComment(comment.id, 'like').then(() => {
      onUpdate();
    });
  };

  const handleClickDislike = () => {
    expressAttitudeOnComment(comment.id, 'dislike').then(() => {
      onUpdate();
    });
  };

  return (
    <Card className={styles.cardContainer}>
      <CardContent>
        <div className={styles.userContainer}>
          <div>
            <span className={styles.user}>
              ({moment(comment.createdAt).fromNow(true)} ago) {comment.createdBy.username}:
            </span>
          </div>
        </div>
        {comment.rating !== 0 && (
          <div className={styles.starContainer}>
            <span className={styles.star}>
              <Star /> {comment.rating}
            </span>
          </div>
        )}
        <div className={styles.descriptionContainer}>
          <span className={styles.description}>{comment.content}</span>
        </div>
        <div className={styles.actionsContainer}>
          <ButtonGroup size="small" color="primary" aria-label="action buttons">
            <Button onClick={handleClickLike}>Like ({comment.nLikes})</Button>
            <Button onClick={handleClickDislike}>Dislike ({comment.nDislikes})</Button>
          </ButtonGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
