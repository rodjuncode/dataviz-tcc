d3.json('data/alunos.json').then(data => { // loading data
            
    const alunos = _.values(data);

    viz = d3.select('#viz');

    viz.selectAll('div')
    .data(alunos.filter(d => d.ano === 2021))
    .join('div')
    .classed('aluno', true)
    .classed('ensino-particular', d => d.ensino_medio === 'exclusivamente escola particular')
        .append('svg')
        .attr('height', '40')
        .attr('width', '40');  

    const colors = d3.scaleOrdinal()
        .domain(['amarela', 'branca', 'indígena', 'parda', 'preta', 'não declarada', 'em branco', 'não perguntado'])
        .range(['#F5524E','#B4B1E7','#59A14F','#2B94DD','#FDC361','#7E15FE','#112035','#112035']);

    console.log(colors('indígena'));

    viz.selectAll('.aluno svg')
        .filter(d => d.sexo === 'masculino')
        .append('circle')
        .attr('cx', 20)
        .attr('cy', 20)
        .attr('r', 10)
        .style('fill', d => colors(d.cor_raca_autodeclarada));

    viz.selectAll('.aluno svg')
        .filter(d => d.sexo === 'feminino')
        .append('rect')
        .attr('x', 12)
        .attr('y', 12)
        .attr('width', 16)
        .attr('height', 16)
        .attr('transform', 'rotate(45,20,20)')
        .style('fill', d => colors(d.cor_raca_autodeclarada));     

});