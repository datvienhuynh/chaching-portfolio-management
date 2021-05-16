import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  link: {
    textDecoration: 'none !important',
  },
  cardContainer: {
    padding: 20,
    backgroundColor: theme.palette.primary.light,
  },
  card: {},
  nameContainer: {
    marginBottom: 10,
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  descriptionContainer: {},
  description: {
    fontSize: 20,
    color: '#444',
    fontStyle: 'italic',
  },
}));

const ForumCard = ({ forum }) => {
  const styles = useStyles();
  const path = `/forums/${forum.id}`;

  return (
    <Link component={RouterLink} to={path} className={styles.link}>
      <Card className={styles.cardContainer}>
        <CardContent>
          <div className={styles.nameContainer}>
            <span className={styles.name}>{forum.name}</span>
          </div>
          <div className={styles.descriptionContainer}>
            <span className={styles.description}>{forum.description}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ForumCard;
