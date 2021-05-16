import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

class ProjectionChart extends Component {
  static propTypes = {
    chartId: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        time: PropTypes.string,
        value: PropTypes.number,
        projection: PropTypes.number,
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
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 30;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.verticalCenter = 'bottom';
    valueAxis.renderer.labels.template.dx = -5;
    valueAxis.renderer.labels.template.dy = 10;
    valueAxis.renderer.maxLabelPosition = 0.95;
    valueAxis.title.text = valueAxisTitle;
    valueAxis.title.marginRight = 5;

    // Create series
    function createSeries(field, name, color, dashed) {
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = field;
      series.dataFields.dateX = 'time';
      series.name = name;
      series.tooltipText = '[bold]{name}[/]\n{dateX}: [b]{valueY}[/]';
      series.strokeWidth = 2;
      series.smoothing = 'monotoneX';
      series.stroke = color;

      if (dashed) {
        series.strokeDasharray = '5 3';
      }

      return series;
    }

    createSeries('value', 'Price', am4core.color('#B1B106'));
    createSeries('projection', 'Projection', am4core.color('#B1B106'), true);

    chart.legend = new am4charts.Legend();
    chart.cursor = new am4charts.XYCursor();

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

export default ProjectionChart;
