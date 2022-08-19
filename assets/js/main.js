// SYSTEM
const SUM_CHECK = 75214; // if JSON file is changed, this needs to be update!!!
const SIZE = 20;
let alunos_json;
let json_loaded = false;
let alunos = [];


// temp
let _s = 0;


fetch('data/alunos.json')
    .then(response => response.json())
    .then(data => {
        alunos_json = _.values(data);
    });

new Q5("global"); // initialize q5js

function preload() {
    console.log('[boot] pre-loading stuff...')
}

function setup() {
    createCanvas(windowWidth,windowHeight);
}

function draw() {
    if (json_loaded) {
        background(200);
        let x = 0;
        let y = 0;
        for (let i = 0; i < alunos.length; i++) {
            if (alunos[i].ano == 2000) {
                let c = floor(map(alunos[i].cestas_basicas,0, 100, 0, 255));
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
            rect(_s, 25, 50, 50);
            _s += 25;
            if (_s > width) _s = 0;
        }
    } else {
        if (alunos_json === undefined || alunos_json.length != SUM_CHECK) {
            console.log('[boot] loading...');
        } else {
            console.log('[boot] loaded JSON!');
            json_loaded = true;
            console.log('[boot] initializing objects...')
            for (let i = 0; i < alunos_json.length; i++) {
                alunos.push(new Tag(alunos_json[i]));
            }
            alunos_json = null;
            console.log('[boot] objects initialized!')            
        }
    }
}


