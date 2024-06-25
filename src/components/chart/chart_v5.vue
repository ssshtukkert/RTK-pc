<template>
    <q-card flat square style="background-color: rgb(60, 60, 60); padding: 0">
      <canvas id="canvas" ref="chart">
      </canvas>
      <q-inner-loading :showing="load" color="white" label-class="text-white" label-style="font-size: 1.1em" />
    </q-card>
  </template>

  <script>
  import { Chart } from 'chart.js';
  import { defineComponent, onMounted, ref } from 'vue';

  export default defineComponent({
    props: {
      title: {
        type: String,
        default: '',
      },
      title1: {
        type: String,
        default: '',
      },
      legend: {
        type: Boolean,
        default: true,
      }
    },

    setup(props) {
      const chart = ref(null);
      const ch = ref(null);
      const load = ref(true);
      onMounted(() => {
        // eslint-disable-next-line no-new
        ch.value = new Chart( // инициализируем плагин
          chart.value, // первым параметром передаем элемент canvas по селектору
          // вторым параметром передаем настройки в виде объекта
          {
            type: 'line',
            data: {
              labels: [],
              datasets: [],
            },
            options: {
              tooltips: {
                enabled: true,
                mode: 'index',
                intersect: false,
                position: 'nearest',
                bodyFontSize: 15,
                titleFontSize: 15,
                animation: false,
                displayColors: true,
                multiKeyBackground: 'RGB(0, 0, 0)',
              },
              scales: {
                xAxes: [
                  {
                    type: 'time',
                    bounds: 'data',
                    distribution: 'series',
                    ticks: {
                      maxRotation: 0,
                      fontSize: 12,
                      fontColor: 'white',
                      autoSkip: true,
                      autoSkipPadding: 64,
                    },
                    gridLines: {
                      color: 'grey',
                      offsetGridLines: false,
                    },
                    time: {
                      unit: 'second',
                      stepSize: 1,
                      displayFormats: {
                        second: 'HH:mm:ss',
                      },
                      tooltipFormat: 'HH:mm:ss DD-MM-YYYY',
                    },
                  },
                ],
                yAxes: [
                  {
                    bounds: 'ticks',
                    ticks: {
                      fontColor: 'white',
                      autoSkip: true,
                      autoSkipPadding: 20,
                      fontSize: 14,
                    },
                    gridLines: {
                      color: 'grey-4',
                    },
                    offset: true,
                    labelOffset: 1,
                  },
                ],
              },
              legend: {
                display: props.legend,
                labels: {
                  fontColor: 'white',
                },
              },
              title: {
                display: false,
              },
              elements: {
                point: {
                  radius: 1,
                },
              },
              parsing: false,
              normalized: true,
              animation: false,
            },
          },
        );
      });
      function pushValues(dataPoint) {
        ch.value.config.data.datasets[0].data.push(dataPoint.valueY);
        ch.value.config.data.datasets[1].data.push(dataPoint.valueY);
        ch.value.config.data.labels.push(dataPoint.valueX);
        ch.value.update();
      }
      function pushValuesArray(arrayPoints, names) {
    console.log(arrayPoints);
    ch.value.config.data.labels.length = 0;

    const newDatasets = []; // Create a new array to hold the new datasets
    const colors = ['white', 'green',  'red', 'blue', 'yellow', '#00ffe1', 'grey',  'orange',  '#ae00ff', '#6fff00', 'black', '#ff5ec9']

    for (let i = 0; i < arrayPoints.length; i += 1) {
      console.log(arrayPoints);
      // ch.value.options.tooltips.multiKeyBackground = colors[i];

      const newDataset = {
        borderColor: colors[i],
        label: names[i],
        labelColor: colors[i],
        color: colors[i],
        tension: 0.4,
        cubicInterpolationMode: 'monotone',
        data: [],
        order: i + 1,
      };

      arrayPoints[i].forEach((point) => {
        newDataset.data.push(point.valueY.toFixed(2));
          ch.value.config.data.labels.push(point.valueX);
      });

      newDatasets.push(newDataset); // Push the new dataset to the new array
    }

    ch.value.config.data.datasets = newDatasets; // Assign the new array to ch.value.config.data.datasets
    console.log(newDatasets);
    ch.value.update();
  }
      function getDataURL() {
        const canvas = document.getElementById('canvas');
        return canvas.toDataURL();
      }
      function setLoad(val) {
        load.value = val;
      }
      return {
        chart,
        ch,
        load,
        setLoad,
        pushValues,
        pushValuesArray,
        getDataURL,
      };
    },
  });
  </script>

