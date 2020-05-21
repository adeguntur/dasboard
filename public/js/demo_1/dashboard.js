(function ($) {
  'use strict';
  $(function () {
    //API URL
    const url = 'http://localhost:3000/api/test'
    fetch(url)
      .then(res =>{
        if (!res.ok) {
          throw new Error(res.statusText);   
        }
        return res.json()
      })
      .then(data => {
        //5 Negara import
        var negaraExportCanvas = document.getElementById("negara-export")
        var negaraExport = new Chart(negaraExportCanvas,{
          type: 'bar',
          data: {
          labels: data.user,
        datasets: [
          {
            label: "Thousands (RP)",
            backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
            data: data.id
          }
          ]
          },
          options: {
            legend: { display: false },
            title: {
              display: true,
              
            }
          }
        })
        
        //5 Pelabuhan pemasukan terbesar
        var pelabuhanExportCanvas = document.getElementById("pelabuhan-pemasukan")
        var pelabuhanExport = new Chart(pelabuhanExportCanvas,{
          type: 'bar',
          data: {
          labels: ["TPK", "BLW", "MKS", "TES", "TLG"],
          datasets: [
          {
            label: "Thousands (RP)",
            backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
            data: [200, 50, 30, 80, 70]
          }
        ]
          },
          options: {
            legend: { display: false },
            title: {
              display: true,
              
            }
          }
        })

        //Perkembangan realisasi import 
        var perkemRealisExportCanvas = document.getElementById("perkembangan-realisasi")
        var perkemRealisExport = new Chart(perkemRealisExportCanvas,{
          type: 'bar',
          data: {
          labels: [idx],
          datasets: [
          {
            label: "Thousands (RP)",
            backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
            data: [200, 50, 30, 80, 70]
          }
        ]
          },
          options: {
            legend: { display: false },
            title: {
              display: true,
              
            }
          }
        })
      })
    });
  })(jQuery);