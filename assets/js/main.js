// SYSTEM
const SUM_CHECK = 75214;
let alunos;
let json_loaded = false;

fetch('data/alunos.json')
    .then(response => response.json())
    .then(data => {
        alunos = _.values(data);
    });

new Q5("global"); // initialize q5js
function setup() {
    createCanvas(500,2000);
}
function draw() {
    if (json_loaded) {
        background(200);
        for (a in alunos) {
            if (a['ano'] = 2000) {
                rect(10,10,10,10);
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


