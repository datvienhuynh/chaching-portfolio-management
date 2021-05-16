import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

class LineChart extends Component {
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

    // Create new chart instance
    let chart = am4core.create(chartId, am4charts.XYChart);

    // Import data
    chart.data = data;

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = valueAxisTitle;

    // Create series
    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = 'value';
    series.dataFields.dateX = 'time';
    series.strokeWidth = 2;
    series.minBulletDistance = 10;
    series.tooltipText = '{valueY}';
    series.tooltip.pointerOrientation = 'vertical';
    series.tooltip.background.cornerRadius = 20;
    series.tooltip.background.fillOpacity = 0.5;
    series.tooltip.label.padding(12, 12, 12, 12);

    // Add scrollbar
    chart.scrollbarX = new am4charts.XYChartScrollbar();
    chart.scrollbarX.series.push(series);

    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    chart.cursor.snapToSeries = series;

    this.chart = chart;
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.dispose();
    }
  }

  render() {
    const { chartId } = this.props;
    return <Box id={chartId} style={{ width: '100%', height: '500px' }} />;
  }
}

export default LineChart;
