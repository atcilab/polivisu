import { ChartOptions } from "chart.js";
import * as moment from "moment-timezone";
moment.tz.setDefault("Europe/Brussels");
export const chartOptions: ChartOptions = {
  responsive: true,
  legend: {
    position: "bottom",
    fullWidth: true,
  },
  scales: {
    xAxes: [
      {
        ticks: {
          callback: (val, i, values) => {
            const hour = (moment(val, "ddd D/M h a").hour() % 12) - 1;
            // return moment(val, "ddd D/M h a").format(`ddd D/M [${hour}-]h a`);
            return moment(val, "ddd D/M h a").format(`ddd D/M h a`);
          },
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          suggestedMin: 0,
        },
      },
    ],
  },
  tooltips: {
    mode: "index",
    position: "nearest",
    callbacks: {
      title: ([key, value], data) => {
        const hour = (moment(value.label, "ddd D/M h a").hour() % 12) - 1;
        // return moment(value.label, "ddd D/M h a").format(`ddd D/M [${hour}-]h a`);
        return moment(value.label, "ddd D/M h a").format(`ddd D/M h a`);
      },
      label: (item, data) => {
        let label = data.datasets[item.datasetIndex].label;
        let value: number = +data.datasets[item.datasetIndex].data[item.index];
        return value % 1 !== 0
          ? `${label}: ${Math.round(value)}`
          : `${label}: ${value}`;
      },
    },
  },
};
