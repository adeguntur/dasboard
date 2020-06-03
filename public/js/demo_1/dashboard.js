$(document).ready(function(){
    $.ajax({
        url: 'http://localhost:3000/api/grafik',
        method: 'GET',
        success: function(data) {
            getPelabuhan('pelabuhan-pemasukan', data.kode_pelabuhan, data.jml_pemasukan);
            getNegaraimport('negara-import', data.kode_negara, data.totalimport_negara);
            getImportir('importir-terbesar', data.nama_importir, data.total_importir);
            getBorder('perkembangan-realisasi');
            getPostborder('perkembangan-realisasi');
            getNonijin('perkembangan-realisasi');
        },
        error: function(data) {
            console.log(data);
        }
    });
    
});

//grafik top 5 pelabuhan pendapatan
async function getPelabuhan(chart, kode, total) {
    var labels = [];
    var jml_pemasukan = [];

    for (var i in kode) {
        labels.push(kode[i]);
        jml_pemasukan.push(total[i]);
    }

    var chartData = {
        labels: labels,
        datasets: [{
            label: "Thousands (RP)",
            borderWidth: 1,
            backgroundColor: ["#878787", "#ffa07a", "#ffda00", "#00ff5f", "#ff007f"],
            fill: false,
            data: jml_pemasukan
        }]
    };

    var ctx = document.getElementById("pelabuhan-pemasukan")
    var chart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
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
                    var kdpel = element[0]._model.label;
                }
                var tahun = $('#tahun').val();
                var awal = $('#awal').val();
                var ahir = $('#ahir').val();

                detailpelabuhan(kdpel, tahun, awal, ahir);
                //$('#Modaldetailpelabuhanpendapatan').modal('show')
            },
            "animation": {
                "duration": 200,
                // "onProgress": function (animation) {
                //     progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                // },
                "onComplete": function () {
                    window.setTimeout(function () {
                        progress.value = 0;
                    }, 2000);

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
    });
}
// grafik top 5 negara importir
async function getNegaraimport(chart, kode, total) {
    var labels = [];
    var totalimportNegara = [];

    for(var i in kode) {
        labels.push(kode[i]);
        totalimportNegara.push(total[i]);
    }

    var chartData = {
        labels: labels,
        datasets: [{
            label: "Thousands (RP)",
            borderWidth: 1,
            backgroundColor: ["#878787", "#ffa07a", "#ffda00", "#00ff5f", "#ff007f"],
            fill: false,
            data: totalimportNegara
        }]
    };

    var ctx = document.getElementById("negara-import")
    var chart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
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
                    var kdneg = element[0]._model.label;
                }
                var tahun = $('#tahun').val();
                var awal = $('#awal').val();
                var ahir = $('#ahir').val();

                detailnegara (kdneg,tahun,awal,ahir);

            },
            "animation": {
                "duration": 1,
                // "onProgress": function (animation) {
                //     progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                // },
                "onComplete": function () {
                    window.setTimeout(function () {
                        progress.value = 0;
                    }, 2000);

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
    });
}
//grafik top 10 importir  terbesar
async function getImportir(chart, kode, total) {
    var labels = [];
    var total_importir = [];

    for (var i in kode) {
        labels.push(kode[i]);
        total_importir.push(total[i]);
    }

    var chartData = {
        labels: labels,
        datasets: [{
            label: "Thousands (RP)",
            borderWidth: 1,
            backgroundColor: ["#878787", "#ffa07a", "#ffda00", "#00ff5f", "#ff007f"],
            fill: false,
            data: total
        }]
    };

    var ctx = document.getElementById("importir-terbesar")
    var chart = new Chart(ctx, {
        type: 'horizontalBar',
        data: chartData,
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
                    var kdimportir = element[0]._model.label;
                }
                var tahun = $('#tahun').val();
                var awal = $('#awal').val();
                var ahir = $('#ahir').val();

                detailimportir(kdimportir, tahun, awal, ahir);

            },
            "animation": {
                "duration": 1,
                // "onProgress": function (animation) {
                //     progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                // },
                "onComplete": function () {
                    window.setTimeout(function () {
                        progress.value = 0;
                    }, 2000);

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
    });
}


function detailnegara(kode, tahun, awal, akhir) {
$.ajax({
    url: 'http://localhost:3000/api/detneg',
    method: 'POST',
    data : {
        kdneg: kode,
        tahun : tahun,
        awal : awal,
        akhir : akhir

    },
    success: function (data) {
        console.log(data);
    },
    error: function (data) {
        console.log(data);
    }
});

}

function detailpelabuhan(kode, tahun, awal, akhir) {
    $.ajax({
        url: 'http://localhost:3000/api/detpel',
        method: 'POST',
        data: {
            kdpel: kode,
            tahun: tahun,
            awal: awal,
            akhir: akhir

        },
        success: function (data) {
            console.log(data);
        },
        error: function (data) {
            console.log(data);
        }
    });

}

function detailimportir(kode, tahun, awal, akhir) {
    $.ajax({
        url: 'http://localhost:3000/api/detimportir',
        method: 'POST',
        data: {
            kdpel: kode,
            tahun: tahun,
            awal: awal,
            akhir: akhir

        },
        success: function (data) {
            console.log(data);
        },
        error: function (data) {
            console.log(data);
        }
    });

}

function getPriceNumber(value){
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}