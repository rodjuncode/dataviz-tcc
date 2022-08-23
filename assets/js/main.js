const _START_SIZE = 25;
const _STEP_SIZE = 10;
const _MIN_SIZE = 15;

// let _VIZ_SIZE = 1000
// let _GRID_COLUMNS = 20;
// let _GRID_SIZE = _VIZ_SIZE/_GRID_COLUMNS;

let _VIZ_SIZE, _GRID_COLUMNS, _GRID_SIZE;
let _TAG_SIZE = 200;

const _CIRCLE_OPT = .8;
const _RECT_OPT = 1.2;

const _START_YEAR = 2022;
const _MAX_YEAR = 2022;
const _MIN_YEAR = 2000;

const _START_SORT = 'cestas_basicas';

var data, viz, alunos, tag;
var size = _START_SIZE;
var year = _START_YEAR;
var sortField = _START_SORT;

var colors, sizes, sort;

d3.json('data/alunos.json').then(d => { // loading data
            
    data = _.values(d);

    colors = d3.scaleOrdinal()
    .domain(['am', 'br', 'in', 'pa', 'pr', 'nd', 'np'])
    .range(['#F5524E','#B4B1E7','#59A14F','#2B94DD','#FDC361','#7E15FE','#112035']);

    cor_raca_autodeclarada = d3.scaleOrdinal()
    .domain(['am', 'br', 'in', 'pa', 'pr', 'nd', 'np'])
    .range(['Amarela','Branca','Indígena','Parda','Preta','Não declarada','Não perguntado']);

    cursou_ensino_medio_publico = d3.scaleOrdinal()
    .domain(['t', 'f'])
    .range(['Sim', 'Não']);

    sexo = d3.scaleOrdinal()
    .domain(['m', 'f'])
    .range(['Masculino', 'Feminino']);

    modalidade_ingresso = d3.scaleOrdinal()
    .domain(['vu', 'eu', 'pr', 'vi', 'vo'])
    .range(['Vestibular Unicamp', 'ENEM-Unicamp', 'Profis', 'Vestibular Indígena', 'Vagas Olímpicas']);

    paais = d3.scaleOrdinal()
    .domain(['s', 'n', 'na'])
    .range(['Sim', 'Não', 'Não se aplica']);

    cotas = d3.scaleOrdinal()
    .domain(['s', 'n', 'na'])
    .range(['Sim', 'Não', 'Não se aplica']);

    sort = {
        'cor_raca_autodeclarada' : {
            'asc' : (a,b) => d3.ascending(a.cor_raca_autodeclarada, b.cor_raca_autodeclarada),
            'desc' : (a,b) => d3.descending(a.cor_raca_autodeclarada, b.cor_raca_autodeclarada)
        },
        'cestas_basicas' : {
            'asc' : (a,b) => d3.ascending(a.cestas_basicas, b.cestas_basicas),
            'desc' : (a,b) => d3.descending(a.cestas_basicas, b.cestas_basicas)
        },
        'cursou_ensino_medio_publico' : {
            'asc' : (a,b) => d3.ascending(a.cursou_ensino_medio_publico, b.cursou_ensino_medio_publico),
            'desc' : (a,b) => d3.descending(a.cursou_ensino_medio_publico, b.cursou_ensino_medio_publico)
        },
        'sexo' : {
            'asc' : (a,b) => d3.ascending(a.sexo, b.sexo),
            'desc' : (a,b) => d3.descending(a.sexo, b.sexo)
        }                        
    }

    tag = d3.select('#tag');

    draw();

});

function zoomIn() {
    // size += _STEP_SIZE;
    // draw();

    // d3.selectAll("#viz > *").transition()
    //     .duration(1500)
    //     .style('width', '35px')
    //     .style('height', '35px');

    d3.selectAll('#viz > svg').transition()
        .duration(800)
        .attr('transform', 'scale(10)')
        .attr('transform-origin', '0 0');

}


function sortViz(v) {
    sortField = v;
    draw();
}

function zoomOut() {
    // size -= 10;
    // if (size < _MIN_SIZE) {
    //     size = _MIN_SIZE;
    // }
    // draw();
    d3.selectAll("#viz > *").transition()
        .duration(1500)
        .style('width', '25px')
        .style('height', '25px');
}

function nextYear() {
    year++;
    if (year > _MAX_YEAR) {
        year = _MIN_YEAR
    }
    draw();
}

function prevYear() {
    year--;
    if (year < _MIN_YEAR) {
        year = _MAX_YEAR;
    }
    draw();
}

function draw() {

    // calculate dimensions
    let vizContainer = d3.select('#viz').node().getBoundingClientRect();
    let fit = false;
    let nCols = 1;
    //let nData = alunos.filter(d => d.ano === year).length;
    let nData = 3571; // largest set of rows is year 2014.
    while (!fit) {
        let nLines = nData/nCols;
        if (nLines*(vizContainer.width/nCols) > vizContainer.height) {
            nCols++;
        } else {
            fit = true;
        }
    }
    _VIZ_SIZE = vizContainer.width;
    _GRID_COLUMNS = nCols;
    _GRID_SIZE = _VIZ_SIZE/_GRID_COLUMNS;

    sizes = d3.scaleLinear()
        .domain([d3.min(data, d => d.cestas_basicas), d3.max(data, d => d.cestas_basicas)])
        .range([.25, .8]);

    // clear
    d3.selectAll("#viz > *").remove();

    d3.select('#year').text(year);

    // data viz container
    viz = d3.select('#viz').append('svg').attr("viewBox", [0, 0, vizContainer.width, vizContainer.height]);
    g = viz.append('g');

   // create a particle for each row in data
    g.selectAll('g')
        .data(data.filter(d => d.ano === year).sort(sort[sortField]['desc']))
        //.data(alunos)
        .join('g')
        .classed('aluno', true)
        .attr('transform', (d,i) => 'translate(' + (i%_GRID_COLUMNS)*_GRID_SIZE + ',' + Math.floor(i/_GRID_COLUMNS)*_GRID_SIZE + ')')
        .append('rect')
        .attr('width', _GRID_SIZE)
        .attr('height', _GRID_SIZE)
        .style('fill', '#112035')
        // .style('fill-opacity', d => (d.cursou_ensino_medio_publico === 't' ? 0.15 : 0));
        
        viz.call(d3.zoom()
        .extent([[0, 0], [500, 500]])
        .scaleExtent([1, 8])
        .translateExtent([[0,0],[500,500]])
        .on("zoom", zoomed));

        function zoomed({transform}) {
            g.attr("transform", transform);
        }        
    // draws shapes into each particle
    viz.selectAll('#viz > svg > g > g')
        .append(d => document.createElementNS('http://www.w3.org/2000/svg', d.sexo === 'm' ? 'circle' : 'rect'))
        .attr('cx',_GRID_SIZE/2)
        .attr('cy',_GRID_SIZE/2)
        .attr('r', d => _GRID_SIZE*sizes(d.cestas_basicas)/1.5)
        .attr('x', d => _GRID_SIZE/2 - _GRID_SIZE*sizes(d.cestas_basicas)*_RECT_OPT/2)
        .attr('y', d => _GRID_SIZE/2 - _GRID_SIZE*sizes(d.cestas_basicas)*_RECT_OPT/2)
        .attr('width', d => _GRID_SIZE*sizes(d.cestas_basicas)*_RECT_OPT)
        .attr('height', d => _GRID_SIZE*sizes(d.cestas_basicas)*_RECT_OPT)
        //.attr('transform', d => 'rotate(45,' + _GRID_SIZE/2 + ',' + _GRID_SIZE/2 + ')')
        .style('fill', d => colors(d.cor_raca_autodeclarada))
        .style('stroke', d => d.cor_raca_autodeclarada === 'np' ? '#FFF' : 'none');

    // draws stroke
    viz.selectAll('#viz > svg > g > g')
        .append(d => document.createElementNS('http://www.w3.org/2000/svg', d.sexo === 'm' ? 'circle' : 'rect'))
        .attr('cx',_GRID_SIZE/2)
        .attr('cy',_GRID_SIZE/2)
        .attr('r', d => d3.max([_GRID_SIZE*sizes(d.cestas_basicas)/2 - 2, 1]))
        .attr('x', d => _GRID_SIZE/2 - _GRID_SIZE*sizes(d.cestas_basicas)*_RECT_OPT/2 + 2)
        .attr('y', d => _GRID_SIZE/2 - _GRID_SIZE*sizes(d.cestas_basicas)*_RECT_OPT/2 + 2)
        .attr('width', d => d3.max([_GRID_SIZE*sizes(d.cestas_basicas)*_RECT_OPT - 4,1]))
        .attr('height', d => d3.max([_GRID_SIZE*sizes(d.cestas_basicas)*_RECT_OPT - 4,1]))
        //.attr('transform', d => 'rotate(45,' + _GRID_SIZE/2 + ',' + _GRID_SIZE/2 + ')')
        .style('fill', d => (d.cursou_ensino_medio_publico === 'f') ? 'none' : '#112035')
        .style('stroke', d => d.cor_raca_autodeclarada === 'np' ? '#FFF' : 'none');

        alunos = g.selectAll('g');
        alunos.on("mouseover", function(e, d) {
            let svg = d3.select('#tag > *').remove(); // clear tag

            svg = d3.select('#tag').append('svg').attr("viewBox", [0, 0, _GRID_SIZE, _GRID_SIZE]);

            svg.append('rect')
            .attr('x', '0')
            .attr('y', '0')
            .attr('width', '100%')
            .attr('height', '100%')
            .style('fill', '#112035');

            svg.append(d.sexo === 'm' ? 'circle' : 'rect')
            .attr('cx',_GRID_SIZE/2)
            .attr('cy',_GRID_SIZE/2)
            .attr('r', _GRID_SIZE*sizes(d.cestas_basicas)/1.5)
            .attr('x', _GRID_SIZE/2 - _GRID_SIZE*sizes(d.cestas_basicas)*_RECT_OPT/2)
            .attr('y', _GRID_SIZE/2 - _GRID_SIZE*sizes(d.cestas_basicas)*_RECT_OPT/2)
            .attr('width', _GRID_SIZE*sizes(d.cestas_basicas)*_RECT_OPT)
            .attr('height', _GRID_SIZE*sizes(d.cestas_basicas)*_RECT_OPT)
            .style('fill', colors(d.cor_raca_autodeclarada))
            .style('stroke', d.cor_raca_autodeclarada === 'np' ? '#FFF' : 'none');  

            svg.append(d.sexo === 'm' ? 'circle' : 'rect')
            .attr('cx',_GRID_SIZE/2)
            .attr('cy',_GRID_SIZE/2)
            .attr('r', d3.max([_GRID_SIZE*sizes(d.cestas_basicas)/2 - 2, 1]))
            .attr('x', _GRID_SIZE/2 - _GRID_SIZE*sizes(d.cestas_basicas)*_RECT_OPT/2 + 2)
            .attr('y', _GRID_SIZE/2 - _GRID_SIZE*sizes(d.cestas_basicas)*_RECT_OPT/2 + 2)
            .attr('width', d3.max([_GRID_SIZE*sizes(d.cestas_basicas)*_RECT_OPT - 4,1]))
            .attr('height', d3.max([_GRID_SIZE*sizes(d.cestas_basicas)*_RECT_OPT - 4,1]))
            .style('fill', d.cursou_ensino_medio_publico === 'f' ? 'none' : '#112035')
            .style('stroke', d.cor_raca_autodeclarada === 'np' ? '#FFF' : 'none');;
            
            d3.select('#tag > div.description').remove();
            let tagDesc = d3.select('#tag').append('div').classed('description', true);

            tagDesc.append('label').text('Cestas básicas');
            tagDesc.append('span').text(d.cestas_basicas);
            tagDesc.append('label').text('Cor/raça autodeclarada');
            tagDesc.append('span').text(cor_raca_autodeclarada(d.cor_raca_autodeclarada));
            tagDesc.append('label').text('Sexo');
            tagDesc.append('span').text(sexo(d.sexo));
            tagDesc.append('label').text('Cursou ensino médico público');
            tagDesc.append('span').text(cursou_ensino_medio_publico(d.cursou_ensino_medio_publico));
            tagDesc.append('label').text('Modalidade de ingresso');
            tagDesc.append('span').text(modalidade_ingresso(d.modalidade_ingresso));
            tagDesc.append('label').text('PAAIS');
            tagDesc.append('span').text(paais(d.paais));
            tagDesc.append('label').text('Cotas');
            tagDesc.append('span').text(cotas(d.cotas));


            // tag.text(
            //     '<p><strong>Cestas básicas: </strong>'+ d.cestas_basicas + '</p> ' + 
            //     d.cor_raca_autodeclarada + ', ' +
            //     d.sexo + ', ' +
            //     d.cursou_ensino_medio_publico + ', ' +
            //     d.ano + ', ' +
            //     d.modalidade_ingresso + ', ' +
            //     d.paais + ', ' +
            //     d.cotas);

        });

   // draws shapes into each particle
//    viz.selectAll('.aluno svg')
//        .filter(d => d.sexo === 'm')
//        .append('circle')
//        .attr('cx', '50%')
//        .attr('cy', '50%')
//        .attr('r', '50%')
//        .attr('transform', d => 'scale(' + sizes(d.cestas_basicas) + ')')
//        .attr('transform-origin', '50% 50%')
//        .style('fill', d => colors(d.cor_raca_autodeclarada));

//    viz.selectAll('.aluno svg')
//        .filter(d => d.sexo === 'f')
//        .append('rect')
//        .attr('width', '100%')
//        .attr('height', '100%')
//        .attr('transform', d => 'rotate(45) scale(' + sizes(d.cestas_basicas)*_RECT_OPT + ')')
//        .attr('transform-origin', '50% 50%')
//        .style('fill', d => colors(d.cor_raca_autodeclarada));     

//    viz.selectAll('.aluno svg')
//        .filter(d => d.cor_raca_autodeclarada === 'np')
//        .style('stroke', '#FFFFFF');     

    // // create a particle for each row
    // viz.selectAll('div')
    // .data(alunos.filter(d => d.ano === year))
    // //.data(alunos)
    // .join('div')
    // .classed('aluno', true)
    // .style('height', size + 'px')
    // .style('width', size + 'px')
    // .classed('ensino-particular', d => d.cursou_ensino_medio_publico === 'f')
    //     .append('svg')
    //     .attr('height', '100%')
    //     .attr('width', '100%');  

    // // draws shapes into each particle
    // viz.selectAll('.aluno svg')
    //     .filter(d => d.sexo === 'm')
    //     .append('circle')
    //     .attr('cx', '50%')
    //     .attr('cy', '50%')
    //     .attr('r', '50%')
    //     .attr('transform', d => 'scale(' + sizes(d.cestas_basicas) + ')')
    //     .attr('transform-origin', '50% 50%')
    //     .style('fill', d => colors(d.cor_raca_autodeclarada));

    // viz.selectAll('.aluno svg')
    //     .filter(d => d.sexo === 'f')
    //     .append('rect')
    //     .attr('width', '100%')
    //     .attr('height', '100%')
    //     .attr('transform', d => 'rotate(45) scale(' + sizes(d.cestas_basicas)*_RECT_OPT + ')')
    //     .attr('transform-origin', '50% 50%')
    //     .style('fill', d => colors(d.cor_raca_autodeclarada));     

    // viz.selectAll('.aluno svg')
    //     .filter(d => d.cor_raca_autodeclarada === 'np')
    //     .style('stroke', '#FFFFFF');     
}