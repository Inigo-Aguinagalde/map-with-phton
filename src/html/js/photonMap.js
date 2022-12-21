import myJson from './works.json';
import myJsonEU from './OF_OFERTAS_ODE_JSONEU.json';
var ofertasES = 0;
var ofertasEU = 0;
const responseES = myJson;
const responseEU = myJsonEU;
var local = new Set()
var map = L.map('map').setView([43.299288, -1.883533], 12);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const options = { method: 'GET' };

var ciudades = new Set()

responseES.filter(function (e) {

    ciudades.add(e.municipio);


})
ciudades = Array.from(ciudades)

    getJSON();

    



async function getJSON() {


    ciudades.forEach(async element => {
        await fetch(`http://api.geonames.org/searchJSON?name=${element}&username=ikcdd`, options)//ikcdd, ikbel
            .then(response => response.json())
            .then(response => filter(response))
            .catch(err => console.error(err));

    });


    


}



function filter(response) {

    const entries = Object.entries(response);

   

    
        entries[1][1].forEach(element => {

            if (element['adminName1'] == 'Basque Country' && element['fclName'] == 'city, village,...') {
    
                L.marker([element['lat'], [element['lng']]]).addTo(map).on('click', function (e) { filtrarOfertas(element['name']) }).bindPopup(`<canvas id=${element['name']}></canvas>`);
                
                return;
                
            }
    
    
        });
    

    

}




function filtrarOfertas(ciudad) {
    ciudad = ciudad.toUpperCase();
    document.getElementById('EU').innerHTML = "";
    document.getElementById('ES').innerHTML = "";
    let sSalida = "";
    let sIrtera = "";
    ofertasES = 0;
    ofertasEU = 0;
    let city = "";
    let city2 = "";
    if (ciudad.includes('/')) {
        ciudad = ciudad.split("/")
        ciudad[0]= ciudad[0].replace(" ","");
        city = ciudad[0];
        city2 = ciudad[1].replace(" ","");
    } else {
        city = ciudad;
    }



    responseES.filter(function (e) {


        if (e.municipio.includes(city) || e.municipio.includes(ciudad[1].replace(" ",""))) {
            ofertasES = ofertasES + 1;


            sSalida += "<div style='margin-top: 30px' id='text'>"
            sSalida += `<p><a href="${e.url}" target="_blank">${e.desEmpleo}</a></p>`;
            sSalida += `<p>${e.desPuesto}</p>`
            sSalida += "</div>"
        }
    });

    responseEU.filter(function (e) {

        if (e.municipio.includes(city) || e.municipio.includes(ciudad[1].replace(" ",""))) {
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



let chart;
function popUps(municipio) {
    const ctx = document.getElementById(municipio);

    if (chart) {
        chart.destroy();
    }

    if (ctx) {

        chart = new Chart(ctx, {

            type: 'bar',
            data: {
                labels: ['ES', 'EU'],
                datasets: [{
                    label: 'Ofertas ' + municipio,
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
let municipio = "";
map.on("popupopen", function () {
    let canvas = document.getElementsByTagName('canvas');

    if (canvas[0].id == municipio) {
        municipio = canvas[1].id;
    } else {
        municipio = canvas[0].id;
    }

    popUps(municipio);
})