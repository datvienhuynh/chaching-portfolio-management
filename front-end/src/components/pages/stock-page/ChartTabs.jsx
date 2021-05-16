import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import LineChart from './charts/LineChart';
import ProjectionChart from './charts/ProjectionChart';
import { sliceList } from './actions';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  tab: {
    minWidth: 30,
    width: 50,
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const ChartTabs = ({ stock, type }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className={classes.root}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab className={classes.tab} label="1M" {...a11yProps(0)} />
        <Tab className={classes.tab} label="3M" {...a11yProps(1)} />
        <Tab className={classes.tab} label="1Y" {...a11yProps(2)} />
        <Tab className={classes.tab} label="3Y" {...a11yProps(3)} />
        <Tab className={classes.tab} label="MAX" {...a11yProps(4)} />
      </Tabs>
      <TabPanel value={value} index={0} dir={theme.direction}>
        {type === 'linechart' ? (
          <LineChart
            chartId="1MPriceChart"
            data={sliceList(stock.dailyPriceData, 22)}
            valueAxisTitle={'Share Price (' + stock.overview.currency + ')'}
          />
        ) : (
          <ProjectionChart
            chartId="1MProjectionChart"
            data={sliceList(stock.dailyPriceData, 22)}
            valueAxisTitle={'Share Price (' + stock.overview.currency + ')'}
          />
        )}
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        {type === 'linechart' ? (
          <LineChart
            chartId="3MPriceChart"
            data={sliceList(stock.dailyPriceData, 66)}
            valueAxisTitle={'Share Price (' + stock.overview.currency + ')'}
          />
        ) : (
          <ProjectionChart
            chartId="3MProjectionChart"
            data={sliceList(stock.dailyPriceData, 66)}
            valueAxisTitle={'Share Price (' + stock.overview.currency + ')'}
          />
        )}
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        {type === 'linechart' ? (
          <LineChart
            chartId="1YPriceChart"
            data={sliceList(stock.weeklyPriceData, 54)}
            valueAxisTitle={'Share Price (' + stock.overview.currency + ')'}
          />
        ) : (
          <ProjectionChart
            chartId="1YProjectionChart"
            data={sliceList(stock.dailyPriceData, 264)}
            valueAxisTitle={'Share Price (' + stock.overview.currency + ')'}
          />
        )}
      </TabPanel>
      <TabPanel value={value} index={3} dir={theme.direction}>
        {type === 'linechart' ? (
          <LineChart
            chartId="3YPriceChart"
            data={sliceList(stock.weeklyPriceData, 162)}
            valueAxisTitle={'Share Price (' + stock.overview.currency + ')'}
          />
        ) : (
          <ProjectionChart
            chartId="3YProjectionChart"
            data={sliceList(stock.dailyPriceData)}
            valueAxisTitle={'Share Price (' + stock.overview.currency + ')'}
          />
        )}
      </TabPanel>
      <TabPanel value={value} index={4} dir={theme.direction}>
        {type === 'linechart' ? (
          <LineChart
            chartId="MAXPriceChart"
            data={stock.weeklyPriceData}
            valueAxisTitle={'Share Price (' + stock.overview.currency + ')'}
          />
        ) : (
          <ProjectionChart
            chartId="MAXProjectionChart"
            data={sliceList(stock.dailyPriceData)}
            valueAxisTitle={'Share Price (' + stock.overview.currency + ')'}
          />
        )}
      </TabPanel>
    </Box>
  );
};

export default ChartTabs;
