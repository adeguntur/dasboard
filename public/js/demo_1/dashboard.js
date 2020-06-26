$(document).ready(function(tahun,awal,ahir){
    var today = new Date();
    var awal = 1;
    var ahir = today.getMonth() + 1; //January = 0!
    var tahun = today.getFullYear();

     $('#kl').prop('disabled', 'disabled');
     $('#komoditi').prop('disabled', 'disabled');
     //$('#Modaldetailimportir').hide();

    $('#tahun').val(tahun);
    $('#awal').val(awal);
    $('#ahir').val(ahir);
    short(tahun, awal, ahir); //pencarian data awal
    $("#cari").hide();
    

    $("#nav-realisasi-tab").click(function () {
      $("#kl").prop("disabled", "disabled");
      $("#komoditi").prop("disabled", "disabled");
      $("#notif").prop("disabled", "disabled");
      $("#kl").val("0").change();
      $("#komoditi").val("0").change();
    });

    $("#nav-postborderjenis-tab").click(function () {
      $("#kl").prop("disabled", false);
      $("#komoditi").prop("disabled", false);
    });
    
    $('#cari').click(function () {
        $("#loading").show(); //awal loading label
        $("#loading1").show();
        $("#cari").hide();

        $("#animationProgressneg").hide();
        $("#animationProgresspel").hide();
        $("#animationProgressrel").hide();
        $("#animationProgressrelper").hide();
        $("#animationProgressimportir").hide();

        $("#labelProgressneg").show();
        $("#labelProgresspel").show();
        $("#labelProgressrel").show();
        $("#labelProgressrelper").show();
        $("#labelProgressimportir").show();

        var tahun = $('#tahun').val();
        var awal = $('#awal').val();
        var ahir = $('#ahir').val();
        var kl = $('#kl').val();
        var komoditi = $('#komoditi').val();
        short(tahun,awal,ahir,kl,komoditi);
        
    });

    $('#pb').click(function () {
        var tahun = $('#tahun').val();
        var awal = $('#awal').val();
        var ahir = $('#ahir').val();
        shortpb(tahun, awal, ahir);
    });

    function short(tahun,awal,ahir,kl,komoditi) {

            $.ajax({
                url: 'http://localhost:3000/api/grafik',
                method: 'POST',
                data: {
                    tahun: tahun,
                    awal: awal,
                    ahir: ahir,
                    kl:kl,
                    komoditi:komoditi
                },
                dataType:'json',
                success: function (data) {
                    getPelabuhan('pelabuhan-pemasukan', data.kode_pelabuhan, data.jml_pemasukan);
                    getNegaraimport('negara-import', data.kode_negara, data.totalimport_negara);
                    getImportir('importir-terbesar', data.nama_importir, data.total_importir);
                    getRealisasiimport('perkembangan-realisasi', data.bulan_border, data.total_border, data.bulan_postborder, data.total_postborder, data.bulan_nawas, data.total_nawas);
                    getRealisasiimportper('perkembangan-realisasiper', data.bulan_01, data.total_01, data.bulan_11, data.total_11, data.bulan_12, data.total_12, data.bulan_13, data.total_13);
                    console.log(data);

                    $("#animationProgressneg").hide();
                    $("#animationProgresspel").hide();
                    $("#animationProgressrel").hide();
                    $("#animationProgressrelper").hide();
                    $("#animationProgressimportir").hide();
                    
                    $("#labelProgressneg").hide();
                    $("#labelProgresspel").hide();
                    $("#labelProgressrel").hide();
                    $("#labelProgressrelper").hide();
                    $("#labelProgressimportir").hide();
                    
                    $("#loading").hide();
                    $("#loading1").hide();
                    $("#cari").show();
                },
                error: function (data) {
                    console.log(data);
                }
            })
    }


    function shortpb(tahun, awal, ahir) {

        $.ajax({
            url: 'http://localhost:3000/api/postborder',
            method: 'POST',
            data: {
                tahun: tahun,
                awal: awal,
                akhir: ahir
            },
            success: function (response) {
                let dataResult = response.finalResult;
                var html = '';
                var table = $('#detimportirtbl tbody');

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

                    html += "<tr><td>" + data.nopib + "</td><td>" + data.tglpib + "</td><td>" + data.seribarang + "</td><td>" + data.jmlsatuan + "</td><td>" + data.kodesatuan + "</td><td>" + data.npwp + "</td><td>" + data.importir + "</td></tr>";
                })
                table.empty();
                table.append(html);

                $('#Modaldetailimportir').modal('show')

            },
            error: function (data) {
                console.log(data);
            }
        });
    }
    
});
//grafik top 5 pelabuhan pendapatan
async function getPelabuhan(chart, kode, total) {
    var labels = [];
    var jml_pemasukan = [];
    var progress = document.getElementById('animationProgresspel' );

    for (var i in kode) {
        var bilangan = (total[i] / 1000000).toFixed(0); //penggunaan bilangan jutaan
        labels.push(kode[i]);
        jml_pemasukan.push(bilangan);
    }

    var chartData = {
        labels: labels,
        datasets: [{
            label: "Millions (RP)",
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
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        //kode di sini, return harus berupa string yang ingin ditampilkan
                        var val = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        if (parseInt(val) >= 1000) {
                            return 'in millions Rp. ' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                        } else {
                            return 'in millions Rp. ' + val;
                        }
                    }
                }
            },
            legend: {
                display: false
            },
            title: {
                display: true,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: function (value, index, values) {
                            if (parseInt(value) >= 1000) {
                                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                            } else {
                                return value;
                            }
                        }
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        beginAtZero: true,
                        callback: function (value, index, values) {
                            if (parseInt(value) >= 1000) {
                                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                            } else {
                                return value;
                            }
                        }
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
        var bilangan = (total[i] / 1000000).toFixed(0);
        labels.push(kode[i]);
        totalimportNegara.push(bilangan);
    }

    var chartData = {
        labels: labels,
        datasets: [
        {
            label: "(Millions Rp.)",
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
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        //kode di sini, return harus berupa string yang ingin ditampilkan
                        var val = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        if (parseInt(val) >= 1000) {
                            return 'in millions Rp. ' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                        } else {
                            return 'in millions Rp. ' + val;
                        }
                    }
                }
            },
            legend: {
                position: 'bottom',
                display: false
            },
            title: {
                display: false,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: function (value, index, values) {
                            if (parseInt(value) >= 1000) {
                                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                            } else {
                                return value;
                            }
                        }
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
    var lb = [];
    var labels = [];
    var res = [];
    var total_importir = [];
    var progress = document.getElementById('animationProgressimportir');

    for (var i in kode) {
        var bilangan = (total[i] / 1000000).toFixed(0); //penggunaan bilangan jutaan
        //var lb = kode[i];
        //var res = lb.substring(0, 15);
        labels.push(kode[i]);
        total_importir.push(bilangan);
    }
    var chartData = {
        labels: labels,
        datasets: [{
            label: "in millions Rp.",
            backgroundColor: "#808080",
            fill: false,
            data: total_importir
        }]
    };
    redrawCanvas("importir-canvas", "importir-terbesar");

    var ctx = document.getElementById("importir-terbesar")
    var chart = new Chart(ctx, {
        type: 'horizontalBar',
        data: chartData,
        options: {
            responsive: true,
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        //kode di sini, return harus berupa string yang ingin ditampilkan
                        var val = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        if (parseInt(val) >= 1000) {
                            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                        } else {
                            return val;
                        }
                    }
                }
            },
            legend: {
                position: 'bottom',
                display: true,
                labels: {
                    filter: function (legendItem, data) {
                        return legendItem.index != 1
                    }
                }
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
                        beginAtZero: true,
                            callback: function (value, index, values) {
                                if (parseInt(value) >= 1000) {
                                    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                                } else {
                                    return value;
                                }
                            }
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
//Perkembangan realisasi import 
async function getRealisasiimport(chart, bulan_border, total_border, bulan_postborder, total_postborder, bulan_nawas, total_nawas) {
var bilangan_border = [];
var bilangan_postborder = [];
var bilangan_nonijin = [];
var totalborder = [];
var totalpostborder = [];
var totalnonijin = [];
var progress = document.getElementById('animationProgressrel');

for (var i in bulan_border) {
    var bilangan_border = (total_border[i] / 1000000).toFixed(0);//penggunaan bilangan jutaan
    var bilangan_postborder = (total_postborder[i] / 1000000).toFixed(0);//penggunaan bilangan jutaan
    var bilangan_nonijin = (total_nawas[i] / 1000000).toFixed(0); //penggunaan bilangan jutaan
    
    totalborder.push(bilangan_border);
    totalpostborder.push(bilangan_postborder);
    totalnonijin.push(bilangan_nonijin);
}

redrawCanvas("perkembangan-realisasi-canvas", "perkembangan-realisasi");

var ctx = document.getElementById("perkembangan-realisasi")
var chart = new Chart(ctx,{
          type: 'bar',
          data: {
          labels: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Des"],
          datasets: [
          {
            label: "Border",
            borderWidth: 0,
            backgroundColor: "#878787",
            data: totalborder
          },
          {
            label: "Post Border",
            borderWidth: 0,
            backgroundColor: "#ff007f",
            data: totalpostborder
          },
          {
            label: "Non Ijin",
            borderWidth: 0,
            backgroundColor: "#964b00",
            data: totalnonijin
          },
        ]
          },
          options: {
            responsive: true,
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var val = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        if (parseInt(val) >= 1000) {
                            return 'in millions Rp. ' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                        } else {
                            return 'in millions Rp. ' + val;
                        }
                    }
                }
            },
             legend: {
                 position: 'bottom',
                 display: true,
                 labels: {
                     filter: function (legendItem, data) {
                         return legendItem.index != 1
                     }
                 }
             },
            title: {
              display: true,
            },
             scales: {
               yAxes: [{
                 ticks: {
                   beginAtZero: true,
                   callback: function (value, index, values) {
                       if (parseInt(value) >= 1000) {
                           return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                       } else {
                           return value;
                       }
                   }
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
             },animation: {
                onProgress: function (animation) {
                    progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                },
                onAnimationComplete: function (animation) {
                    progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                }
            }
          }
        })
}
//Perkembangan realisasi import per
async function getRealisasiimportper(chart, bulan_01, total_01, bulan_11, total_11, bulan_12, total_12, bulan_13, total_13) {
    var total01 = [];
    var total11 = [];
    var total12 = [];
    var total13 = [];
    var progress = document.getElementById('animationProgressrelper');

    
    for (var i in bulan_01) {
        var bilangan_01 = (total_01[i] / 1000000).toFixed(0);//penggunaan bilangan jutaan
        var bilangan_11 = (total_11[i] / 1000000).toFixed(0);//penggunaan bilangan jutaan
        var bilangan_12 = (total_12[i] / 1000000).toFixed(0); //penggunaan bilangan jutaan
        var bilangan_13 = (total_13[i] / 1000000).toFixed(0); //penggunaan bilangan jutaan
        
        total01.push(bilangan_01);
        total11.push(bilangan_11);
        total12.push(bilangan_12);
        total13.push(bilangan_13);
    }

    redrawCanvas("perkembangan-realisasiper-canvas", "perkembangan-realisasiper");

    var ctx = document.getElementById("perkembangan-realisasiper")
    var chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Des"],
            datasets: [
                {
                    label: "01",
                    borderWidth: 1,
                    backgroundColor: "#808080",
                    data: total01
                },
                {
                    label: "11",
                    borderWidth: 1,
                    backgroundColor: "#964b00",
                    data: total11
                },
                {
                    label: "12",
                    borderWidth: 1,
                    backgroundColor: "#ffff00",
                    data: total12
                },
                {
                    label: "13",
                    borderWidth: 1,
                    backgroundColor: "#008000",
                    data: total13
                }
            ]
        },
        options: {
            responsive: true,
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        //kode di sini, return harus berupa string yang ingin ditampilkan
                        var val = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                        if (parseInt(val) >= 1000) {
                            return 'in millions Rp. ' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                        } else {
                            return 'in millions Rp. ' + val;
                        }
                    }
                }
            },
            legend: {
                position: 'bottom',
                display: true,
                labels: {
                    filter: function (legendItem, data) {
                        return legendItem.index != 1
                    }
                }
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
            }, animation: {
                onProgress: function (animation) {
                    progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                },
                onAnimationComplete: function (animation) {
                    progress.value = animation.animationObject.currentStep / animation.animationObject.numSteps;
                }
            }
        }
    })
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
            var bilangan = (data.total / 1000000).toFixed(0);
            var number_string = bilangan.toString(),
                sisa = number_string.length % 3,
                rupiah = number_string.substr(0, sisa),
                ribuan = number_string.substr(sisa).match(/\d{3}/g);

            if (ribuan) {
                separator = sisa ? '.' : '';
                rupiah += separator + ribuan.join('.');
            }
            html += "<tr><td>" + data.negara + "</td><td>" + data.kode + "</td><td> (in millions) Rp." + rupiah + "</td></tr>";
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
            var bilangan = (data.total / 1000000).toFixed(0);
            var number_string = bilangan.toString(),
                sisa = number_string.length % 3,
                rupiah = number_string.substr(0, sisa),
                ribuan = number_string.substr(sisa).match(/\d{3}/g);

            if (ribuan) {
                separator = sisa ? '.' : '';
                rupiah += separator + ribuan.join('.');
            }

            html += "<tr><td>" + data.pel + "</td><td>" + data.kode + "</td><td> (in millions) Rp." + rupiah + "</td></tr>";
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
        success: function (response) {
        let dataResult = response.finalResult;
        var html = '';
        var table = $('#detimportirtbl tbody');

        dataResult.forEach(data => {
            var bilangan = (data.total_detimportir / 1000000).toFixed(0);
            var number_string = bilangan.toString(),
                sisa = number_string.length % 3,
                rupiah = number_string.substr(0, sisa),
                ribuan = number_string.substr(sisa).match(/\d{3}/g);

            if (ribuan) {
                separator = sisa ? '.' : '';
                rupiah += separator + ribuan.join('.');
            }

            html += "<tr><td>" + data.nama_importir + "</td><td>" + data.komoditi + "</td><td> (in millions) Rp." + rupiah + "</td></tr>";
        })
        table.empty();
        table.append(html);

        $('#Modaldetailimportir').modal('show')
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
