import myJson from './works.json';
import myJsonEU from './OF_OFERTAS_ODE_JSONEU.json';
var ofertasES = 0;
var ofertasEU = 0;
const responseES = myJson;
const responseEU = myJsonEU;

var map = L.map('map').setView([43.299288, -1.883533], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

L.marker([51.5, -0.09]).addTo(map)

function filtrarOfertas(ciudad) {
    ciudad = ciudad.toUpperCase();
    document.getElementById('EU').innerHTML = "";
    document.getElementById('ES').innerHTML = "";
    let sSalida = "";
    let sIrtera = "";
    ofertasES = 0;
    ofertasEU = 0;

    responseES.filter(function (e) {

        if (e.municipio == ciudad) {
            ofertasES = ofertasES + 1;


            sSalida += "<div style='margin-top: 30px' id='text'>"
            sSalida += `<p><a href="${e.url}" target="_blank">${e.desEmpleo}</a></p>`;
            sSalida += `<p>${e.desPuesto}</p>`
            sSalida += "</div>"
        }
    });

    responseEU.filter(function (e) {

        if (e.municipio == ciudad) {
            ofertasEU = ofertasEU + 1;

            sIrtera += "<div style='margin-top: 20px' id='text'>"
            sIrtera += `<p><a href="${e.url}" target="_blank">${e.desEmpleo}</a></p>`;
            sIrtera += `<p>${e.desPuesto}</p>`
            sIrtera += "</div>"
        }
    });


    document.getElementById('EU').innerHTML = sIrtera;

    document.getElementById('ES').innerHTML = sSalida;
}


L.marker([43.338147, -1.78885]).addTo(map).on('click', function (e) { filtrarOfertas('IRUN') }).bindPopup('<canvas id="IRUN"></canvas>');//Irun

L.marker([43.313044, -1.978032]).addTo(map).on('click', function (e) { filtrarOfertas('DONOSTIA/SAN SEBASTIÁN') }).bindPopup('<canvas id="DONOSTIA"></canvas>');//Donosti

L.marker([43.366229, -1.793868]).addTo(map).on('click', function (e) { filtrarOfertas('HONDARRIBIA') }).bindPopup('<canvas id="HONDARRIBIA"></canvas>');//Honsarribi

L.marker([43.310046, -1.902431]).addTo(map).on('click', function (e) { filtrarOfertas('ERRENTERIA') }).bindPopup('<canvas id="ERRENTERIA"></canvas>');//Errenteria



let chart;
function popUps(municipio) {
    const ctx = document.getElementById(municipio);
    console.log(municipio)
    if (chart) {
        chart.destroy();
    }

    if (ctx) {

        chart = new Chart(ctx, {

            type: 'bar',
            data: {
                labels: ['ES', 'EU'],
                datasets: [{
                    label: 'Ofertas '+municipio,
                    data: [ofertasES, ofertasEU],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

    }

}
let municipio ="";
map.on("popupopen", function (e) {
    let canvas = document.getElementsByTagName('canvas');    
   
    if(canvas[0].id == municipio){
        municipio = canvas[1].id;
    }else{
        municipio = canvas[0].id;
    }
    
    popUps(municipio);
})
