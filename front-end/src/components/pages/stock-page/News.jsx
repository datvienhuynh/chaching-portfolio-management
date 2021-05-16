import React, { useEffect, useState } from 'react';
import ShowMoreText from 'react-show-more-text';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

import { getGoogleImage } from '../../../api/backendRequests';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: 20,
    padding: theme.spacing(2),
    borderRadius: 20,
    margin: 'auto',
    position: 'relative',
  },
  image: {
    width: 192,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

const News = ({ stock }) => {
  const classes = useStyles();
  const [news, setNews] = useState(null);

  useEffect(() => {
    const fetchAVData = async () => {
      let query = '';
      if (stock.overview.longName) {
        query = stock.overview.longName;
      } else if (stock.overview.symbol === '^AXJO') {
        query = 'Australian Securities Exchange ASX 200';
      } else {
        query = stock.overview.symbol;
      }
      const paths = await getGoogleImage(query + ' recently', stock.news.length);
      // Add image path to each news
      for (let i = 0; i < stock.news.length; i++) {
        stock.news[i].img = paths[i];
      }
      setNews(stock.news);
    };
    fetchAVData();
  }, [stock.overview.longName, stock.overview.symbol, stock.news]);

  return (
    <Paper className={classes.paper}>
      <Typography variant="h6" style={{ marginBottom: 10 }}>
        <strong>News</strong>
      </Typography>
      {news &&
        news.map((n) => (
          <Grid container spacing={2} key={n.id} style={{ marginBottom: 20 }}>
            <Grid className={classes.image} item>
              {n.img && <img className={classes.img} alt="complex" src={n.img} />}
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs>
                <Link href={n.link}>
                  <Typography gutterBottom variant="subtitle2">
                    <strong>{n.title}</strong>
                  </Typography>
                </Link>
                <Typography variant="body2" gutterBottom>
                  <ShowMoreText lines={2} more="Show more" less="Show less" expanded={false}>
                    {n.summary}
                  </ShowMoreText>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Published at: {n.published}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        ))}
    </Paper>
  );
};

export default News;
