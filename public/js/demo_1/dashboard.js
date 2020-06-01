(function ($) {
  'use strict';
  $(function () {
    //API URL
    const url = 'http://localhost:3000/api/grafik'
    fetch(url)
      .then(res =>{
        if (!res.ok) {
          throw new Error(res.statusText);   
        }
        return res.json()
      })
      .then(
        data => {
        //5 Negara import
        var modal = document.getElementById("myModal");
        var negaraExportCanvas = document.getElementById("negara-export")
        modal.style.display = "none"
        var negaraExport = new Chart(negaraExportCanvas,{
          type: 'bar',
          data: {
          labels: data.kode_negara,
        datasets: [
          {
            label: "Thousands (RP)",
            borderWidth: 1,
            backgroundColor: ["#878787", "#ffa07a", "#ffda00", "#00ff5f", "#ff007f"],
            data: data.totalimport_negara,
          }
          ]
          },
         options: {
           responsive: true,
           legend: {
             display: false
           },
           title: {
             display: true,
           },
           scales: {
             yAxes: [{
               ticks: {
                 beginAtZero: true
               }
             }],
             xAxes: [{
               gridLines: {
                 display: false
               },
               ticks: {
                 beginAtZero: true
               }
             }]
           },
           "hover": {
             "animationDuration": 0
           },
           onClick: function (event, array) {
             var span = document.getElementById("close");
             let element = this.getElementAtEvent(event);
             if (element.length > 0) {
               var series = element[0]._model.datasetLabel;
               var label = element[0]._model.label;
               var value = this.data.datasets[element[0]._datasetIndex].data[element[0]._index];
               //alert("Kode negara " + label + " dengan nilai import thousands (RP) " + value);
               modal.style.display = "block";
           }
          },
           "animation": {
             "duration": 1,
             "onComplete": function () {
               var chartInstance = this.chart,
                 ctx = chartInstance.ctx;

               ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
               ctx.textAlign = 'center';
               ctx.textBaseline = 'bottom';

               this.data.datasets.forEach(function (dataset, i) {
                 var meta = chartInstance.controller.getDatasetMeta(i);

                 meta.data.forEach(function (bar, index) {
                   var data = dataset.data[index];
                   ctx.fillText(data, bar._model.x, bar._model.y + 20);

                 });
               });

             }

           }
         }
        })
        
        //5 Pelabuhan pemasukan terbesar
        var pelabuhanExportCanvas = document.getElementById("pelabuhan-pemasukan")
        var pelabuhanExport = new Chart(pelabuhanExportCanvas,{
          type: 'bar',
          data: {
          labels: data.kode_pelabuhan,
          datasets: [
          {
            label: "Thousands (RP)",
            borderWidth: 1,
            backgroundColor: ["#878787", "#ff007f","#964b00","#ffda00","#ff7b00"],
            data: data.jml_pib
          }
        ]
          },
          options: {
            responsive: true,
            legend: {
              display: false,
              text: ''
            },
            title: {
              display: true,
            },
             scales: {
               yAxes: [{
                 ticks: {
                   beginAtZero: true
                 }
               }],
               xAxes: [{
                 gridLines: {
                   display: false
                 },
                 ticks: {
                   beginAtZero: true
                 }
               }]
             },
             "hover": {
               "animationDuration": 0
             },
             onClick: function (event, array) {
               let element = this.getElementAtEvent(event);
               if (element.length > 0) {
                 var series = element[0]._model.datasetLabel;
                 var label = element[0]._model.label;
                 var value = this.data.datasets[element[0]._datasetIndex].data[element[0]._index];
                 alert("Kode pelabuhan " + label + " dengan nilai pemasukan thousands (RP) " + value);
               }
             },
             "animation": {
               "duration": 1,
               "onComplete": function () {
                 var chartInstance = this.chart,
                   ctx = chartInstance.ctx;

                 ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                 ctx.textAlign = 'center';
                 ctx.textBaseline = 'bottom';

                 this.data.datasets.forEach(function (dataset, i) {
                   var meta = chartInstance.controller.getDatasetMeta(i);

                   meta.data.forEach(function (bar, index) {
                     var data = dataset.data[index];
                     ctx.fillText(data, bar._model.x, bar._model.y + 20);

                   });

                 });

               }

             }
          }
        })
      
         // 10 Importir terbesar
         var importirExportCanvas = document.getElementById("importir-terbesar")
         var importirExport = new Chart(importirExportCanvas, {
           type: 'horizontalBar',
           data: {
             labels: data.nama_importir,
             datasets: [{
               label: "Thousands (RP)",
               borderWidth: 1,
               backgroundColor: "#878787",
               data: data.total_importir
             }]
           },
           options: {
             responsive: true,
             legend: {
               display: false
             },
             title: {
               display: true,
             },
              scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true
                  }
                }],
                xAxes: [{
                  gridLines: {
                    display: false
                  },
                  ticks: {
                    beginAtZero: true
                  }
                }]
              },
              "hover": {
                "animationDuration": 0
              },
              onClick: function (event, array) {
                let element = this.getElementAtEvent(event);
                if (element.length > 0) {
                  var series = element[0]._model.datasetLabel;
                  var label = element[0]._model.label;
                  var value = this.data.datasets[element[0]._datasetIndex].data[element[0]._index];
                  alert("Nama importir " + label + " dengan nilai import thousands (RP)" + value);
                }
              },
              "animation": {
                "duration": 1,
                "onComplete": function () {
                  var chartInstance = this.chart,
                    ctx = chartInstance.ctx;

                  ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'bottom';

                  this.data.datasets.forEach(function (dataset, i) {
                    var meta = chartInstance.controller.getDatasetMeta(i);

                    meta.data.forEach(function (bar, index) {
                      var data = dataset.data[index];
                      ctx.fillText(data, bar._model.x, bar._model.y + 20);

                    });

                  });

                }

              }
           }
         })

        //Perkembangan realisasi import 
        var perkemRealisExportCanvas = document.getElementById("perkembangan-realisasi")
        var perkemRealisExport = new Chart(perkemRealisExportCanvas,{
          type: 'bar',
          data: {
          labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Des"],
          datasets: [
          {
            label: "Border",
            borderWidth: 1,
            backgroundColor: "#878787",
            data: [200, 50, 30, 80, 70]
          },
          {
            label: "Post Border",
            borderWidth: 1,
            backgroundColor: "#ff007f",
            data: [200, 50, 30, 80, 70]
          },
          {
            label: "Non Ijin",
            borderWidth: 1,
            backgroundColor: "#964b00",
            data: [200, 50, 30, 80, 70]
          },
        ]
          },
          options: {
            responsive: true,
            legend: { display: false },
            title: {
              display: true,
            },
             scales: {
               yAxes: [{
                 ticks: {
                   beginAtZero: true
                 }
               }],
               xAxes: [{
                 gridLines: {
                   display: false
                 },
                 ticks: {
                   beginAtZero: true
                 }
               }]
             },
             "hover": {
               "animationDuration": 0
             },
             onClick: function (event, array) {
               let element = this.getElementAtEvent(event);
               if (element.length > 0) {
                 var series = element[0]._model.datasetLabel;
                 var label = element[0]._model.label;
                 var value = this.data.datasets[element[0]._datasetIndex].data[element[0]._index];
                 alert(series + " Bulan " + label + " dengan nilai thousands (RP). " + value );
               }
             },
             "animation": {
               "duration": 1,
               "onComplete": function () {
                 var chartInstance = this.chart,
                   ctx = chartInstance.ctx;

                 ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                 ctx.textAlign = 'center';
                 ctx.textBaseline = 'bottom';

                 this.data.datasets.forEach(function (dataset, i) {
                   var meta = chartInstance.controller.getDatasetMeta(i);

                   meta.data.forEach(function (bar, index) {
                     var data = dataset.data[index];
                     ctx.fillText(data, bar._model.x, bar._model.y + 20);

                   });

                 });

               }

             }
          }
        })
      })
    });
  })(jQuery);