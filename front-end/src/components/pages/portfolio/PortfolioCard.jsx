import React from 'react';
import { makeStyles } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  link: {
    textDecoration: 'none !important',
  },
  nameContainer: {
    marginBottom: 10,
  },
  name: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 20,
  },
  descriptionContainer: {},
}));

const PortfolioCard = ({ portfolio }) => {
  const classes = useStyles();
  const path = `/portfolio/${portfolio.id}`;
  return (
    <Link component={RouterLink} to={path} className={classes.link}>
      <Card style={{ backgroundColor: portfolio.colour['hex_for_display'], padding: '1rem' }}>
        <CardContent>
          <div className={classes.nameContainer}>
            <span className={classes.name}>{portfolio.name}</span>
          </div>
          <div className={classes.descriptionContainer}>
            <span>{portfolio.description}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PortfolioCard;
