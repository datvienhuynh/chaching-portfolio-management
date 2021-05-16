import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import LinkIcon from '@material-ui/icons/Link';
import moment from 'moment';
import { Button, ButtonGroup } from '@material-ui/core';
import { expressAttitudeOnPost } from '../../../utils/usePost';

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none !important',
  },
  cardContainer: {
    padding: 20,
    backgroundColor: theme.palette.secondary.light,
  },
  card: {},
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
  linkContainer: {
    marginBottom: 10,
  },
  linkWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  linkIcon: {
    marginRight: 5,
  },
  description: {
    fontSize: 20,
    color: '#444',
    fontStyle: 'italic',
  },
  actionsContainer: {},
}));

const PostCard = ({ post, hasLink = false, onUpdate }) => {
  const styles = useStyles();
  const path = `/posts/${post.id}`;

  const handleClickLike = () => {
    expressAttitudeOnPost(post.id, 'like').then(() => {
      onUpdate();
    });
  };

  const handleClickDislike = () => {
    expressAttitudeOnPost(post.id, 'dislike').then(() => {
      onUpdate();
    });
  };

  const card = (
    <Card className={styles.cardContainer}>
      <CardContent className={styles.cardContent}>
        <div className={styles.userContainer}>
          <div>
            <span className={styles.user}>
              ({moment(post.createdAt).fromNow(true)} ago) {post.createdBy.username}:
            </span>
          </div>
        </div>
        <div className={styles.nameContainer}>
          <span className={styles.name}>{post.name}</span>
        </div>
        <div className={styles.descriptionContainer}>
          <span className={styles.description}>{post.content}</span>
        </div>
        {!hasLink && !!post.portfolio && (
          <div className={styles.linkContainer}>
            <Link
              component={RouterLink}
              to={`/portfolio/${post.portfolio}`}
              target="_blank"
              className={styles.linkWrapper}
            >
              <LinkIcon className={styles.linkIcon} />
              Portfolio #{post.portfolio}
            </Link>
          </div>
        )}
        {hasLink && (
          <div>
            <div>
              <span>{post.nLikes} Like</span>
            </div>
            <div>
              <span>{post.nDislikes} Dislike</span>
            </div>
          </div>
        )}
        {!hasLink && (
          <div className={styles.actionsContainer}>
            <ButtonGroup size="small" color="primary" aria-label="action buttons">
              <Button onClick={handleClickLike}>Like ({post.nLikes})</Button>
              <Button onClick={handleClickDislike}>Dislike ({post.nDislikes})</Button>
            </ButtonGroup>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // determine if the link for routing is needed
  if (!hasLink) return card;

  return (
    <Link component={RouterLink} to={path} className={styles.link}>
      {card}
    </Link>
  );
};

export default PostCard;
