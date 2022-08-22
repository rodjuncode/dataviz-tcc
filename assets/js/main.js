const _START_SIZE = 25;
const _STEP_SIZE = 10;
const _MIN_SIZE = 15;

const _CIRCLE_OPT = .8;
const _RECT_OPT = .85;

const _START_YEAR = 2022;
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
        .range([.3, .8]);

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

    d3.select('#viz > g').transition()
        .duration(1500)
        .attr('transform', 'scale(5)');

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
   viz.append('g').selectAll('circle')
   .data(alunos.filter(d => d.ano === year))
   //.data(alunos)
    .join('circle')
    .attr('cx', (d,i) => i*_MIN_SIZE)
    .attr('cy', (d,i) => i*_MIN_SIZE)
    .attr('r', _MIN_SIZE/2)
    .classed('aluno', true)
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