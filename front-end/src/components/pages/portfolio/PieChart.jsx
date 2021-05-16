import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

class PieChart extends Component {
  static propTypes = {
    chartId: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    valueAxisTitle: PropTypes.string,
  };

  componentDidMount() {
    const { chartId, data } = this.props;

    // Set theme for the chart
    am4core.useTheme(am4themes_animated);

    // Create new chart instance
    let chart = am4core.create(chartId, am4charts.PieChart);
    chart.startAngle = 160;
    chart.endAngle = 380;

    // Make an empty circle at the size of 50% the radius
    chart.innerRadius = am4core.percent(30);

    // Import data
    chart.data = data;

    // Create series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'quantity';
    pieSeries.dataFields.category = 'ticker';
    pieSeries.slices.template.stroke = new am4core.InterfaceColorSet().getFor('background');
    pieSeries.slices.template.strokeWidth = 1;
    pieSeries.slices.template.strokeOpacity = 1;

    // Disabling labels and ticks on inner circle
    pieSeries.labels.template.disabled = true;
    pieSeries.ticks.template.disabled = true;

    // Disable sliding out of slices
    pieSeries.slices.template.states.getKey('hover').properties.shiftRadius = 0;
    pieSeries.slices.template.states.getKey('hover').properties.scale = 1;
    pieSeries.radius = am4core.percent(40);
    pieSeries.innerRadius = am4core.percent(30);

    let cs = pieSeries.colors;
    cs.list = [am4core.color(new am4core.ColorSet().getIndex(0))];

    cs.stepOptions = {
      lightness: -0.05,
      hue: 0,
    };
    cs.wrap = false;

    // Create second series
    let pieSeries2 = chart.series.push(new am4charts.PieSeries());
    pieSeries2.dataFields.value = 'value';
    pieSeries2.dataFields.category = 'ticker';
    pieSeries2.slices.template.stroke = new am4core.InterfaceColorSet().getFor('background');
    pieSeries2.slices.template.strokeWidth = 1;
    pieSeries2.slices.template.strokeOpacity = 1;
    pieSeries2.slices.template.states.getKey('hover').properties.shiftRadius = 0.05;
    pieSeries2.slices.template.states.getKey('hover').properties.scale = 1;

    pieSeries2.labels.template.disabled = true;
    pieSeries2.ticks.template.disabled = true;

    let label = chart.seriesContainer.createChild(am4core.Label);
    label.textAlign = 'middle';
    label.horizontalCenter = 'middle';
    label.verticalCenter = 'middle';
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total += data[i].value;
    }
    label.adapter.add('text', function (text, target) {
      return (
        '[font-size:18px]Total Value[/]:\n[bold font-size:30px]AUD$' + total.toFixed(2) + '[/]'
      );
    });
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

export default PieChart;
