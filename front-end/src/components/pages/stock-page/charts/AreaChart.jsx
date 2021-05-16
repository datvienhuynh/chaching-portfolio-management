import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import am4themes_material from '@amcharts/amcharts4/themes/material';

class AreaChart extends Component {
  static propTypes = {
    chartId: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        time: PropTypes.string,
        value: PropTypes.number,
      }).isRequired,
    ).isRequired,
    valueAxisTitle: PropTypes.string,
  };

  componentDidMount() {
    const { chartId, data, valueAxisTitle } = this.props;
    // Set theme for the chart
    am4core.useTheme(am4themes_animated);
    am4core.useTheme(am4themes_material);

    // Create new chart instance
    let chart = am4core.create(chartId, am4charts.XYChart);

    // Import data
    chart.data = data;

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 50;
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = valueAxisTitle;

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.dateX = 'time';
    series.strokeWidth = 3;
    series.fillOpacity = 0.5;

    // Add vertical scrollbar
    chart.scrollbarY = new am4core.Scrollbar();
    chart.scrollbarY.marginLeft = 0;

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = 'zoomY';
    chart.cursor.lineX.disabled = true;

    this.chart = chart;
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    const { chartId } = this.props;
    return <Box id={chartId} style={{ width: '100%', height: '300px' }} />;
  }
}

export default AreaChart;
