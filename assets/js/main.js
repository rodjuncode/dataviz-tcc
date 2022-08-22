const _START_SIZE = 25;
const _STEP_SIZE = 10;
const _MIN_SIZE = 15;

const _CIRCLE_OPT = .8;
const _RECT_OPT = .65;

const _START_YEAR = 2000;
const _MAX_YEAR = 2022;
const _MIN_YEAR = 2000;

var alunos;
var size = _START_SIZE;
var year = _START_YEAR;

var colors, sizes, t;

d3.json('data/alunos.json').then(data => { // loading data
            
    alunos = _.values(data);

    colors = d3.scaleOrdinal()
    .domain(['am', 'br', 'in', 'pa', 'pr', 'nd', 'np'])
    .range(['#F5524E','#B4B1E7','#59A14F','#2B94DD','#FDC361','#7E15FE','#112035']);

    sizes = d3.scaleLinear()
        .domain([d3.min(alunos, d => d.cestas_basicas), d3.max(alunos, d => d.cestas_basicas)])
        .range([size*.5, size]);

    t = d3.transition()
        .duration(750)
        .ease(d3.easeLinear);

    draw();

});

function zoomIn() {
    // size += _STEP_SIZE;
    // draw();
    d3.selectAll("#viz > *").transition()
        .duration(1500)
        .style('width', '35px')
        .style('height', '35px');

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
    d3.selectAll("#viz > *").remove();

    d3.select('#year').text(year);

    // data viz container
    viz = d3.select('#viz');

    // create a particle for each row
    viz.selectAll('div')
    .data(alunos.filter(d => d.ano === year))
    //.data(alunos)
    .join('div')
    .classed('aluno', true)
    .style('height', size + 'px')
    .style('width', size + 'px')
    .classed('ensino-particular', d => d.cursou_ensino_medio_publico === 'f')
        .append('svg')
        .attr('height', '100%')
        .attr('width', '100%');  

    // draws shapes into each particle
    viz.selectAll('.aluno svg')
        .filter(d => d.sexo === 'm')
        .append('circle')
        // .attr('cx', size/2)
        // .attr('cy', size/2)
        .attr('cx', '50%')
        .attr('cy', '50%')
        //.attr('r', d => sizes(d.cestas_basicas)/2*_CIRCLE_OPT )
        .attr('r', '50%')
        .style('fill', d => colors(d.cor_raca_autodeclarada));

    viz.selectAll('.aluno svg')
        .filter(d => d.sexo === 'f')
        .append('rect')
        .attr('x', d => size/2-sizes(d.cestas_basicas)*_RECT_OPT/2)
        .attr('y', d => size/2-sizes(d.cestas_basicas)*_RECT_OPT/2)
        .attr('width', d => sizes(d.cestas_basicas)*_RECT_OPT)
        .attr('height', d => sizes(d.cestas_basicas)*_RECT_OPT)
        .attr('transform', 'rotate(45,' + size/2 + ',' + size/2 + ')')
        .style('fill', d => colors(d.cor_raca_autodeclarada));     

    viz.selectAll('.aluno svg')
        .filter(d => d.cor_raca_autodeclarada === 'np')
        .style('stroke', '#FFFFFF');     
}