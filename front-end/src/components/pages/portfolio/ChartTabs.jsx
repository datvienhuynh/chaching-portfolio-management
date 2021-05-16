import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme, Tabs, Tab, Typography, Box } from '@material-ui/core';
import LineChart from '../stock-page/charts/LineChart';
import { sliceList } from '../stock-page/actions';

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

const ChartTabs = ({ portfolio }) => {
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
        <LineChart
          chartId="1MPriceChart"
          data={sliceList(portfolio.values, 22)}
          valueAxisTitle={'Portfolio Value (AUD)'}
        />
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <LineChart
          chartId="3MPriceChart"
          data={sliceList(portfolio.values, 66)}
          valueAxisTitle={'Portfolio Value (AUD)'}
        />
      </TabPanel>
      <TabPanel value={value} index={2} dir={theme.direction}>
        <LineChart
          chartId="1YPriceChart"
          data={sliceList(portfolio.values, 264)}
          valueAxisTitle={'Portfolio Value (AUD)'}
        />
      </TabPanel>
      <TabPanel value={value} index={3} dir={theme.direction}>
        <LineChart
          chartId="3YPriceChart"
          data={portfolio.values}
          valueAxisTitle={'Portfolio Value (AUD)'}
        />
      </TabPanel>
      <TabPanel value={value} index={4} dir={theme.direction}>
        <LineChart
          chartId="MAXPriceChart"
          data={portfolio.values}
          valueAxisTitle={'Portfolio Value (AUD)'}
        />
      </TabPanel>
    </Box>
  );
};

export default ChartTabs;
