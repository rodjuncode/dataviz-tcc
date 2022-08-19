// SYSTEM
const SUM_CHECK = 75214; // if JSON file is changed, this needs to be update!!!
const SIZE = 20;
let alunos;
let json_loaded = false;


fetch('data/alunos.json')
    .then(response => response.json())
    .then(data => {
        alunos = _.values(data);
    });

new Q5("global"); // initialize q5js
function setup() {
    createCanvas(windowWidth,windowHeight);
}
function draw() {
    if (json_loaded) {
        background(200);
        let x = 0;
        let y = 0;
        for (let i = 0; i < alunos.length; i++) {
            if (alunos[i]['ano'] == 2000) {
                let c = floor(map(alunos[i]['cestas_basicas_min'],0, 100, 0, 255));
                fill(c);
                rect(x,y,SIZE,SIZE);
                x += SIZE;
                if (x > width) {
                    x = 0;
                    y += SIZE;
                }
            }
        }
        if (mouseIsPressed) {
            ellipse(50, 50, 50, 50);
        } else {
            rect(25, 25, 50, 50);
        }
    } else {
        if (alunos === undefined || alunos.length != SUM_CHECK) {
            console.log('[data] loading...');
        } else {
            console.log('[data] loaded JSON!');
            json_loaded = true;
        }
    }
}


