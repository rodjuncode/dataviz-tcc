// SYSTEM
const SUM_CHECK = 75214; // if JSON file is changed, this needs to be update!!!
const SIZE = 40;
let alunos_json;
let json_loaded = false;
let alunos = [];
let stickers = {};
let palette = {
    'Vestibular Unicamp': '#F18B64',
    'ENEM-Unicamp': '#FFD930',
    'Profis': '#8DA0CB',
    'Vagas Olímpicas': '#DF8BB9',
    'Vestibular Indígena': '#E25759'
}

// temp
let _s = 0;


fetch('data/alunos.json')
    .then(response => response.json())
    .then(data => {
        alunos_json = _.values(data);
    });

console.log('[boot] Loading q5.js...');
new Q5("global"); // initialize q5js
console.log('[boot] Loaded q5.js!');


function preload() {
    console.log('[boot] pre-loading stuff...')
    stickers['branca'] = loadImage('assets/img/stickers/branca.png');
    stickers['preta'] = loadImage('assets/img/stickers/preta.png');
    stickers['parda'] = loadImage('assets/img/stickers/parda.png');
    stickers['amarela'] = loadImage('assets/img/stickers/amarela.png');
    stickers['indígena'] = loadImage('assets/img/stickers/indigena.png');
    stickers['em branco'] = loadImage('assets/img/stickers/nao-declarada.png');
    stickers['não declarada'] = loadImage('assets/img/stickers/nao-declarada.png');
    stickers['não perguntado'] = loadImage('assets/img/stickers/nao-perguntado.png');
    console.log('[boot] pre-loaded all good!')
}

function setup() {
    createCanvas(windowWidth,5000);
}

function draw() {
    if (json_loaded) {
        background(200);
        let x = 0;
        let y = 0;
        for (let i = 0; i < alunos.length; i++) {
            alunos[i].show(x,y,SIZE);
            x += SIZE;
            if (x + SIZE > width) {
                x = 0;
                y += SIZE;
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
                if (alunos_json[i]['ano'] == 2019)
                alunos.push(new Tag(alunos_json[i]));
            }
            alunos_json = null;
            console.log('[boot] objects initialized!')            
        }
    }
}


