import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

class ComparingChart extends Component {
  static propTypes = {
    chartId: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    tickers: PropTypes.array.isRequired,
    valueAxisTitle: PropTypes.string,
  };

  componentDidMount() {
    const { chartId, data, tickers } = this.props;

    // Set theme for the chart
    am4core.useTheme(am4themes_animated);

    // Create new chart instance
    let chart = am4core.create(chartId, am4charts.XYChart);
    chart.padding(0, 15, 0, 15);
    chart.colors.step = 3;

    // Import data
    chart.data = data;

    // Arrange value axes vertically
    chart.leftAxesContainer.layout = 'vertical';

    // Create axes
    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.ticks.template.length = 8;
    dateAxis.renderer.ticks.template.strokeOpacity = 0.1;
    dateAxis.renderer.grid.template.disabled = true;
    dateAxis.renderer.ticks.template.disabled = false;
    dateAxis.renderer.ticks.template.strokeOpacity = 0.2;
    dateAxis.renderer.minLabelPosition = 0.01;
    dateAxis.renderer.maxLabelPosition = 0.99;
    dateAxis.keepSelection = true;

    dateAxis.groupData = true;
    dateAxis.minZoomCount = 5;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.zIndex = 1;
    valueAxis.renderer.baseGrid.disabled = true;
    valueAxis.height = am4core.percent(65);

    valueAxis.renderer.gridContainer.background.fill = am4core.color('#000000');
    valueAxis.renderer.gridContainer.background.fillOpacity = 0.05;
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.verticalCenter = 'bottom';
    valueAxis.renderer.labels.template.padding(2, 2, 2, 2);
    valueAxis.renderer.fontSize = '0.8em';

    // Create series
    function createSeries(name) {
      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = 'time';
      series.dataFields.valueY = name;
      series.dataFields.valueYShow = 'changePercent';
      series.tooltipText =
        "{name}: {valueY.changePercent.formatNumber('[#0c0]+#.00|[#c00]#.##|0')}%";
      series.name = name;
      series.tooltip.getFillFromObject = false;
      series.tooltip.getStrokeFromObject = true;
      series.tooltip.background.fill = am4core.color('#fff');
      series.tooltip.background.strokeWidth = 2;
      series.tooltip.label.fill = series.stroke;
      return series;
    }

    const seriesList = [];
    for (let i = 0; i < tickers.length; i++) {
      let series = createSeries(tickers[i]);
      seriesList.push(series);
    }

    let valueAxis2 = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis2.tooltip.disabled = true;
    valueAxis2.height = am4core.percent(35);
    valueAxis2.zIndex = 3;

    // Create gap between panels
    valueAxis2.marginTop = 30;
    valueAxis2.renderer.baseGrid.disabled = true;
    valueAxis2.renderer.inside = true;
    valueAxis2.renderer.labels.template.verticalCenter = 'bottom';
    valueAxis2.renderer.labels.template.padding(2, 2, 2, 2);
    valueAxis2.renderer.fontSize = '0.8em';

    valueAxis2.renderer.gridContainer.background.fill = am4core.color('#000000');
    valueAxis2.renderer.gridContainer.background.fillOpacity = 0.05;

    let volumeSeries = chart.series.push(new am4charts.StepLineSeries());
    volumeSeries.fillOpacity = 1;
    volumeSeries.fill = seriesList[0].stroke;
    volumeSeries.stroke = seriesList[0].stroke;
    volumeSeries.dataFields.dateX = 'time';
    volumeSeries.dataFields.valueY = 'volume';
    volumeSeries.yAxis = valueAxis2;
    volumeSeries.tooltipText = 'Volume: {valueY.value}';
    volumeSeries.name = 'Series 2';

    // Sum the volume
    volumeSeries.groupFields.valueY = 'sum';
    volumeSeries.tooltip.label.fill = volumeSeries.stroke;
    chart.cursor = new am4charts.XYCursor();

    // Add horizontal scrollbar
    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(seriesList[0]);
    scrollbarX.marginBottom = 20;
    let sbSeries = scrollbarX.scrollbarChart.series.getIndex(0);
    sbSeries.dataFields.valueYShow = undefined;
    chart.scrollbarX = scrollbarX;
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

export default ComparingChart;
