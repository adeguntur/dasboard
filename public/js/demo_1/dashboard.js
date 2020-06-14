$(document).ready(function(tahun,awal,ahir){
    var today = new Date();
    var awal = 1;
    var ahir = today.getMonth() + 1; //January = 0!
    var tahun = today.getFullYear();

     $('#kl').prop('disabled', 'disabled');
     $('#komoditi').prop('disabled', 'disabled');
     $('#notif').prop('disabled', 'disabled');

    $('#tahun').val(tahun);
    $('#awal').val(awal);
    $('#ahir').val(ahir);
    short(tahun, awal, ahir); //pencarian data awal
    $("#cari").hide();
    
    $('#cari').click(function () {
        $("#loading").show(); //awal loading label
        $("#cari").hide();
        var tahun = $('#tahun').val();
        var awal = $('#awal').val();
        var ahir = $('#ahir').val();
       short(tahun,awal,ahir);
    });

    function short(tahun,awal,ahir) {

            $.ajax({
                url: 'http://localhost:3000/api/grafik',
                method: 'POST',
                data: {
                    tahun: tahun,
                    awal: awal,
                    ahir: ahir
                },
                dataType:'json',
                success: function (data) {
                    getPelabuhan('pelabuhan-pemasukan', data.kode_pelabuhan, data.jml_pemasukan);
                    getNegaraimport('negara-import', data.kode_negara, data.totalimport_negara);
                    getImportir('importir-terbesar', data.nama_importir, data.total_importir);
                    $("#loading").hide();
                    $("#cari").show(); 
                    //getBorder('perkembangan-realisasi');
                    //getPostborder('perkembangan-realisasi');
                    //getNonijin('perkembangan-realisasi');
                },
                error: function (data) {
                    console.log(data);
                }
            })
    }
    
});

//grafik top 5 pelabuhan pendapatan
async function getPelabuhan(chart, kode, total) {
    var labels = [];
    var jml_pemasukan = [];
    var progress = document.getElementById('animationProgresspel');

    for (var i in kode) {
        var bilangan = (total[i] / 1000).toFixed(0);
        labels.push(kode[i]);
        jml_pemasukan.push(bilangan);
        //console.log(bilangan);
    }

    var chartData = {
        labels: labels,
        datasets: [{
            label: "Thousands (RP)",
            backgroundColor: ["#878787", "#ffa07a", "#ffda00", "#00ff5f", "#ff007f"],
            fill: false,
            data: jml_pemasukan
        }]
    };
    redrawCanvas("pendapatan-pelabuhan-canvas", "pelabuhan-pemasukan");

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
                var akhir = $('#ahir').val();

                detailpelabuhan(kdpel, tahun, awal, akhir);
            },
            animation: {
                onProgress: function (animation) {
                    progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                },
                onAnimationComplete: function (animation) {
                    progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                }
            }
        }
    });
}
// grafik top 5 negara importir
async function getNegaraimport(chart, kode, total) {
    var labels = [];
    var totalimportNegara = [];
    var progress = document.getElementById('animationProgressneg');

    for(var i in kode) {
        var bilangan = (total[i] / 1000).toFixed(0);
        labels.push(kode[i]);
        totalimportNegara.push(bilangan);
    }

    var chartData = {
        labels: labels,
        datasets: [{
            label: "Thousands (RP)",
            backgroundColor: ["#878787", "#ffa07a", "#ffda00", "#00ff5f", "#ff007f"],
            fill: false,
            data: totalimportNegara
        }]
    };
    redrawCanvas("negara-import-canvas", "negara-import");

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

            }, animation: {
                onProgress: function (animation) {
                    progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                },
                onAnimationComplete: function (animation) {
                    progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                }
            }
        }
    });
}
//grafik top 10 importir  terbesar
async function getImportir(chart, kode, total) {
    var labels = [];
    var total_importir = [];
    var progress = document.getElementById('animationProgressimportir');

    for (var i in kode) {
        var bilangan = (total[i] / 1000).toFixed(0);
        labels.push(kode[i]);
        total_importir.push(bilangan);
    }

    var chartData = {
        labels: labels,
        datasets: [{
            label: "Thousands (RP)",
            backgroundColor: "#808080",
            fill: false,
            data: total
        }]
    };
    redrawCanvas("importir-canvas", "importir-terbesar");

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
                var akhir = $('#ahir').val();

                detailimportir(kdimportir, tahun, awal, akhir);

            }, animation: {
                onProgress: function (animation) {
                    progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                },
                onAnimationComplete: function (animation) {
                    progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                }
            }
        }
    });
}

//grafik detail negara
function detailnegara(kdneg, tahun, awal, akhir) {
$.ajax({
    url: 'http://localhost:3000/api/detneg',
    method: 'POST',
    data : {
        kdneg: kdneg,
        tahun : tahun,
        awal : awal,
        akhir : akhir
    },
    dataType: 'json',
    success: function (response) {
        let dataResult = response.finalResult;
        var html = '';
        var table = $('#detnegaratbl tbody');

        dataResult.forEach(data => {
            html += "<tr><td>" + data.negara + "</td><td>" + data.kode + "</td><td>" + data.total + "</td></tr>";
        })

        table.empty();
        table.append(html);
        $('#Modaldetailnegaraimpor').modal('show');
        
    },
    error: function (data) {
        console.log(data);
    }
});

}
//grafik detail pelabuhan   
function detailpelabuhan(kdpel, tahun, awal, akhir) {
    $.ajax({
        url: 'http://localhost:3000/api/detpel',
        method: 'POST',
        data: {
            kdpel: kdpel,
            tahun: tahun,
            awal: awal,
            akhir: akhir
        },
        dataType: 'json',
    success: function (response) {
        let dataResult = response.finalResult;
        var html = '';
        var table = $('#detpelabuhantbl tbody');

        dataResult.forEach(data => {
            var bilangan = (data.total / 1000).toFixed(0);
            var number_string = bilangan.toString(),
                sisa = number_string.length % 3,
                rupiah = number_string.substr(0, sisa),
                ribuan = number_string.substr(sisa).match(/\d{3}/g);

            if (ribuan) {
                separator = sisa ? '.' : '';
                rupiah += separator + ribuan.join('.');
            }

            html += "<tr><td>" + data.pel + "</td><td>" + data.kode + "</td><td> Rp." + rupiah + "</td></tr>";
        })

        table.empty();
        table.append(html);
        $('#Modaldetailpelabuhanpendapatan').modal('show');
        
    },
    error: function (data) {
        console.log(data);
    }
});


}
//grafik detail importir
function detailimportir(kode, tahun, awal, akhir) {
    $.ajax({
        url: 'http://localhost:3000/api/detimportir',
        method: 'POST',
        data: {
            kdimportir: kode,
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

function redrawCanvas(parent, child) {
    $("canvas#"+child).remove();
    $("div#" + parent).append(
      '<canvas class="mt-4" height="300" id="'+child+'"></canvas>'
    );
}
