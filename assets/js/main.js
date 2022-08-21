const _GRID_SIZE = 30;
const _CIRCLE_OPT = .8;
const _RECT_OPT = .65;

d3.json('data/alunos.json').then(data => { // loading data
            
    const alunos = _.values(data);

    // data viz container
    viz = d3.select('#viz');

    // create a particle for each row
    viz.selectAll('div')
    .data(alunos.filter(d => (d.ano === 2002) || (d.ano === 2003)))
    //.data(alunos)
    .join('div')
    .classed('aluno', true)
    .style('height', _GRID_SIZE + 'px')
    .style('width', _GRID_SIZE + 'px')
    .classed('ensino-particular', d => d.cursou_ensino_medio_publico === 'f')
        .append('svg')
        .attr('height', _GRID_SIZE)
        .attr('width', _GRID_SIZE);  

    // scales
    const colors = d3.scaleOrdinal()
        .domain(['am', 'br', 'in', 'pa', 'pr', 'nd', 'np'])
        .range(['#F5524E','#B4B1E7','#59A14F','#2B94DD','#FDC361','#7E15FE','#112035']);

    const sizes = d3.scaleLinear()
        .domain([d3.min(alunos, d => d.cestas_basicas), d3.max(alunos, d => d.cestas_basicas)])
        .range([_GRID_SIZE*.5, _GRID_SIZE]);

    // draws shapes into each particle
    viz.selectAll('.aluno svg')
        .filter(d => d.sexo === 'm')
        .append('circle')
        .attr('cx', _GRID_SIZE/2)
        .attr('cy', _GRID_SIZE/2)
        .attr('r', d => sizes(d.cestas_basicas)/2*_CIRCLE_OPT )
        .style('fill', d => colors(d.cor_raca_autodeclarada));

    viz.selectAll('.aluno svg')
        .filter(d => d.sexo === 'f')
        .append('rect')
        .attr('x', d => _GRID_SIZE/2-sizes(d.cestas_basicas)*_RECT_OPT/2)
        .attr('y', d => _GRID_SIZE/2-sizes(d.cestas_basicas)*_RECT_OPT/2)
        .attr('width', d => sizes(d.cestas_basicas)*_RECT_OPT)
        .attr('height', d => sizes(d.cestas_basicas)*_RECT_OPT)
        .attr('transform', 'rotate(45,' + _GRID_SIZE/2 + ',' + _GRID_SIZE/2 + ')')
        .style('fill', d => colors(d.cor_raca_autodeclarada));     

    viz.selectAll('.aluno svg')
        .filter(d => d.cor_raca_autodeclarada === 'np')
        .style('stroke', '#FFFFFF')

});