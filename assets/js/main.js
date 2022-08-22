const _START_SIZE = 25;
const _STEP_SIZE = 10;
const _MIN_SIZE = 15;

// let _VIZ_SIZE = 1000
// let _GRID_COLUMNS = 20;
// let _GRID_SIZE = _VIZ_SIZE/_GRID_COLUMNS;

let _VIZ_SIZE, _GRID_COLUMNS, _GRID_SIZE;

const _CIRCLE_OPT = .8;
const _RECT_OPT = .85;

const _START_YEAR = 2022;
const _MAX_YEAR = 2022;
const _MIN_YEAR = 2000;

var alunos, viz;
var size = _START_SIZE;
var year = _START_YEAR;

var colors, sizes, t;

d3.json('data/alunos.json').then(data => { // loading data
            
    alunos = _.values(data);

    colors = d3.scaleOrdinal()
    .domain(['am', 'br', 'in', 'pa', 'pr', 'nd', 'np'])
    .range(['#F5524E','#B4B1E7','#59A14F','#2B94DD','#FDC361','#7E15FE','#112035']);

    // sizes = d3.scaleLinear()
    //     .domain([d3.min(alunos, d => d.cestas_basicas), d3.max(alunos, d => d.cestas_basicas)])
    //     .range([.3, .8]);


    t = d3.transition()
        .duration(750)
        .ease(d3.easeLinear);


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
    // clear
    let vizContainer = d3.select('#viz').node().getBoundingClientRect();
    console.log(vizContainer)
    let fit = false;
    let nCols = 1;
    let nData = alunos.filter(d => d.ano === year).length;
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
        .domain([d3.min(alunos, d => d.cestas_basicas), d3.max(alunos, d => d.cestas_basicas)])
        .range([_GRID_SIZE/3, _GRID_SIZE]);

    d3.selectAll("#viz > *").remove();

    d3.select('#year').text(year);

    // data viz container
    viz = d3.select('#viz').append('svg').attr("viewBox", [0, 0, vizContainer.width, vizContainer.height]);
    g = viz.append('g');

   // create a particle for each row in data
    g.selectAll('g')
        .data(alunos.filter(d => d.ano === year))
        //.data(alunos)
        .join('g')
        .classed('aluno', true)
        .attr('transform', (d,i) => 'translate(' + (i%_GRID_COLUMNS)*_GRID_SIZE + ',' + Math.floor(i/_GRID_COLUMNS)*_GRID_SIZE + ')')
        .append('rect')
        .attr('width', _GRID_SIZE)
        .attr('height', _GRID_SIZE)
        .style('fill', '#FFF')
        .style('fill-opacity', d => (d.cursou_ensino_medio_publico === 'f' ? 0.1 : 0));
        
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
        .attr('r', d => sizes(d.cestas_basicas)/2)
        .attr('x', d => _GRID_SIZE/2 - sizes(d.cestas_basicas)*_RECT_OPT/2)
        .attr('y', d => _GRID_SIZE/2 - sizes(d.cestas_basicas)*_RECT_OPT/2)
        .attr('width', d => sizes(d.cestas_basicas)*_RECT_OPT)
        .attr('height', d => sizes(d.cestas_basicas)*_RECT_OPT)
        .attr('transform', d => 'rotate(45,' + _GRID_SIZE/2 + ',' + _GRID_SIZE/2 + ')')
        .style('fill', d => colors(d.cor_raca_autodeclarada));


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