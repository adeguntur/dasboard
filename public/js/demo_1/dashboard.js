$(document).ready(function(tahun,awal,ahir){
    var today = new Date();
    var awal = 1;
    var ahir = today.getMonth() + 1; //January is 0!
    var tahun = today.getFullYear();

    $('#tahun').val(tahun);
    $('#awal').val(awal);
    $('#ahir').val(ahir);
    short(tahun, awal, ahir); //pencarian data awal
    
    $('#tahun').change(function () {
        var tahun = $('#tahun').val();
        var awal = $('#awal').val();
        var ahir = $('#ahir').val();
       short(tahun,awal,ahir);
    });
    $('#awal').change(function () {
       var tahun = $('#tahun').val();
       var awal = $('#awal').val();
       var ahir = $('#ahir').val();
       short(tahun, awal, ahir);
    });
    $('#ahir').change(function () {
        var tahun = $('#tahun').val();
        var awal = $('#awal').val();
        var ahir = $('#ahir').val();
        short(tahun, awal, ahir);
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
                    //getBorder('perkembangan-realisasi');
                    //getPostborder('perkembangan-realisasi');
                    //getNonijin('perkembangan-realisasi');
                },
                error: function (data) {
                    console.log(data);
                }
            })
    }


    // $.ajax({
    //     url: 'http://localhost:3000/api/grafik',
    //     method: 'GET',
    //     success: function(data) {
    //         getPelabuhan('pelabuhan-pemasukan', data.kode_pelabuhan, data.jml_pemasukan);
    //         getNegaraimport('negara-import', data.kode_negara, data.totalimport_negara);
    //         getImportir('importir-terbesar', data.nama_importir, data.total_importir);
    //         //getBorder('perkembangan-realisasi');
    //         //getPostborder('perkembangan-realisasi');
    //         //getNonijin('perkembangan-realisasi');
    //     },
    //     error: function(data) {
    //         console.log(data);
    //     }
    // });
    
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
                var akhir = $('#ahir').val();

                detailpelabuhan(kdpel, tahun, awal, akhir);
                //$('#Modaldetailpelabuhanpendapatan').modal('show')
            },
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
                "duration": 1
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
            backgroundColor: "#808080",
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
                var akhir = $('#ahir').val();

                detailimportir(kdimportir, tahun, awal, akhir);

            },
            "animation": {
                "duration": 1
            }
        }
    });
}


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
            html += "<tr><td>" + data.pel + "</td><td>" + data.kode + "</td><td>" + data.total + "</td></tr>";
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

function getPriceNumber(value){
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}