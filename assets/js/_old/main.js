// SYSTEM
const SUM_CHECK = 75214; // if JSON file is changed, this needs to be update!!!
const SIZE = 20;
let alunos_json;
let json_loaded = false;
let alunos = [];
let stickers = {};
let palette = {
    'Vestibular Unicamp': '#d0d1e6',
    'ENEM-Unicamp': '#FFD930',
    'Profis': '#8DA0CB',
    'Vagas Olímpicas': '#DF8BB9',
    'Vestibular Indígena': '#E25759'
}
//let paletteCestaBasica = ['#980043','#dd1c77','#df65b0','#c994c7','#d4b9da','#f1eef6']
//let paletteCestaBasica = ["#f1eef6","#d7b5d8","#df65b0","#dd1c77","#980043"];
//let paletteCestaBasica = ["#f2f0f7","#cbc9e2","#9e9ac8","#756bb1","#54278f"]
let paletteCestaBasica = ["#feebe2","#fbb4b9","#f768a1","#c51b8a","#7a0177"]

let paletteRaca = {
    'branca' : '#6e40aa',
    'parda' : '#df40a1',
    'preta' : '#ff704e',
    'amarela' : '#d2c934',
    'indígena' : '#6bf75c',
    'não declarada' : '#1bd9ac',
    'em branco' : '#1bd9ac',
    'não perguntado' : '#000000'
};


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


// function preload() {
//     console.log('[boot] pre-loading stuff...')
//     // stickers['branca'] = loadImage('assets/img/stickers/branca.png');
//     // stickers['preta'] = loadImage('assets/img/stickers/preta.png');
//     // stickers['parda'] = loadImage('assets/img/stickers/parda.png');
//     // stickers['amarela'] = loadImage('assets/img/stickers/amarela.png');
//     // stickers['indígena'] = loadImage('assets/img/stickers/indigena.png');
//     // stickers['em branco'] = loadImage('assets/img/stickers/nao-declarada.png');
//     // stickers['não declarada'] = loadImage('assets/img/stickers/nao-declarada.png');
//     // stickers['não perguntado'] = loadImage('assets/img/stickers/nao-perguntado.png');
//     stickers['branca'] = {};
//     stickers['branca']['feminino'] = loadImage('assets/img/stickers/branca.png');
//     stickers['branca']['masculino'] = loadImage('assets/img/stickers/branca.png');
//     stickers['preta'] = {};
//     stickers['preta']['feminino'] = loadImage('assets/img/stickers/preta.png');
//     stickers['preta']['masculino'] = loadImage('assets/img/stickers/preta.png');
//     stickers['parda'] = {};
//     stickers['parda']['feminino'] = loadImage('assets/img/stickers/parda.png');
//     stickers['parda']['masculino'] = loadImage('assets/img/stickers/parda.png');
//     stickers['amarela'] = {};
//     stickers['amarela']['feminino'] = loadImage('assets/img/stickers/amarela.png');
//     stickers['amarela']['masculino'] = loadImage('assets/img/stickers/amarela.png');
//     stickers['indígena'] = {};
//     stickers['indígena']['feminino'] = loadImage('assets/img/stickers/indigena.png');
//     stickers['indígena']['masculino'] = loadImage('assets/img/stickers/indigena.png');
//     stickers['em branco'] = {};
//     stickers['em branco']['feminino'] = loadImage('assets/img/stickers/nao-declarada.png');
//     stickers['em branco']['masculino'] = loadImage('assets/img/stickers/nao-declarada.png');
//     stickers['não declarada'] = {};
//     stickers['não declarada']['feminino'] = loadImage('assets/img/stickers/nao-declarada.png');
//     stickers['não declarada']['masculino'] = loadImage('assets/img/stickers/nao-declarada.png');
//     stickers['não perguntado'] = {};
//     stickers['não perguntado']['feminino'] = loadImage('assets/img/stickers/nao-perguntado.png');
//     stickers['não perguntado']['masculino'] = loadImage('assets/img/stickers/nao-perguntado.png');
//     console.log('[boot] pre-loaded all good!')
// }

function setup() {
    createCanvas(windowWidth,5000);
}

function draw() {
    if (json_loaded) {
        background(0);
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
                //if (alunos_json[i]['ano'] == 2022)
                    alunos.push(new Tag(alunos_json[i]));
            }
            alunos_json = null;
            console.log('[boot] objects initialized!')            
        }
    }
}


