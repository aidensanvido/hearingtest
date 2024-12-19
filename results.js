const frequencies = [250, 500, 1000, 1500, 2000, 4000, 5000, 8000];
let l_min_volume = JSON.parse(localStorage.getItem("l_min_volume"));
let r_min_volume = JSON.parse(localStorage.getItem("r_min_volume"));

function downloadResults() {

    console.log("test");
    var a = document.createElement('a');
    a.href = hearing_results.toBase64Image();
    a.download = 'hearing_results.png';
    a.click();

}

const plugin = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart, args, options) => {
      const {ctx} = chart;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = options.color || '#bacae2';
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
  };

let my_chart = document.getElementById('hearing_results').getContext('2d');

let data = {

    type: 'line',

    data: {
        labels: frequencies,
        datasets: [
            {
                label: " Left Ear",
                data: l_min_volume,
                //borderColor: 'blue',
                pointStyle: 'crossRot',
                radius: 16,
                pointBorderWidth: 8,
                pointHoverRadius: 14,
                pointHoverBorderWidth: 10,
            },
            {
                label: " Right Ear",
                data: r_min_volume,
                //borderColor: 'red',
                pointStyle: 'circle',
                radius: 12,
                pointBorderWidth: 5,
                pointBackgroundColor: "rgba(0, 0, 0, 0)",
                pointHoverRadius: 12,
                pointHoverBorderWidth: 9

            }
        ]
    },
    options: {
        scales: {

            y: {
                grid: {
                    color: '#8b755b',
                    lineWidth: 3,
                },
                min: -10,
                max: 130,
                ticks: {
                    stepSize: 10,
                    autoSkip: false,
                    padding: 10,
                    font: {
                        size: 16,
                        family: "Montserrat"
                    },
                    color: "#8b755b"
                },
                reverse: true,
                title: {
                    display: true,
                    padding: 0,
                    align: 'center',
                    text: "Volume (dB)",
                    font: {
                        size: 20,
                        weight: "bold",
                        family: "Montserrat"
                    },
                    color: "#8b755b",
                }
                
            },
            x: {
                grid: {
                    color: '#8b755b',
                    lineWidth: 3,
                },
                position: "top",
                title: {
                    display: true,
                    align: 'start',
                    padding: 10,
                    text: "Frequency (Hz)",
                    font: {
                        size: 20,
                        weight: "bold",
                        family: "Montserrat"
                    },
                    color: "#8b755b",
                },
                ticks: {
                    padding: 5,
                    font: {
                        size: 16,
                        family: "Montserrat"
                    },
                    color: "#8b755b"
                }
            }
        },
        layout: {
            padding: {
                left: 140,
                right: 140,
                top: 50,
                bottom: 50
            }
        },
        plugins: {
            title: {
                display: false,
                text: "Hearing Test Results",
                font: {
                    size: 30,
                    family: "Montserrat",
                    
                },
                color: "#8b755b",
            },
            customCanvasBackgroundColor: {
                color: '#f8ede3'
            },
            legend: {
                position: 'bottom',

                labels: {
                    padding: 20,
                    usePointStyle: true,
                    font: {
                        size: 16,
                        weight: "bold",
                        family: "Montserrat"
                    },
                    color: "#8b755b"
                }
                
            },
            tooltip: {

                titleFont: {family: "Montserrat", size: 14},
                bodyFont: {family: "Montserrat", size: 14},
                padding: 15,
                usePointStyle: true,
                boxHeight: 14,
                boxWidth: 14,
                borderColor: 'black',

                callbacks: {
                    title: function(context) {

                        return frequencies[context[0].dataIndex] + " Hz";
                    },
                    label: function(context) {
                        
                        return " " + context.parsed.y + " dB";
                    }
                }

            },
        }
    },
    plugins: [plugin],
};

var max_of_l = Math.max.apply(null, l_min_volume);
var max_of_r = Math.max.apply(null, r_min_volume);

var mean_max = (max_of_l + max_of_r) / 2;

if (mean_max <= 25) {

    document.getElementById("results_title").innerHTML = "Normal Hearing";
    document.getElementById("results_blurb").innerHTML = "You likely have normal hearing. You are able to hear frequencies between 250Hz and 8000Hz that are below 25 dB.";

} else if (mean_max <= 40) {

    document.getElementById("results_title").innerHTML  = "Mild Hearing Loss";
    document.getElementById("results_blurb").innerHTML  = "You likely have mild hearing loss. You are able to hear frequencies between 250Hz and 8000Hz that are below 40 dB. This means you can typically hear conversations at a normal volume, but might struggle with softer sounds and whispering.";

} else if (mean_max <= 70) {

    document.getElementById("results_title").innerHTML  = "Moderate Hearing Loss";
    document.getElementById("results_blurb").innerHTML  = "You likely have moderate hearing loss. You are able to hear frequencies between 250Hz and 8000Hz that are below 70 dB. Hearing aids are typically recommended at your level of hearing, as holding conversations at a normal volume may be challenging.";


} else {

    document.getElementById("results_title").innerHTML  = "Profound Hearing Loss";
    document.getElementById("results_blurb").innerHTML  = "You likely have profound hearing loss. You are able to hear frequencies between 250Hz and 8000Hz that are below 100 dB. Hearing aids are required at this level of hearing loss, as even some shouted words are difficult to hear. Additionally, learning lip-reading or signing can be helpful to fill in gaps in hearing.";


}



const hearing_results = new Chart(my_chart, data);