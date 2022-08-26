// #########
// constants
// #########
const _START_YEAR = 2022;
const _MAX_YEAR = 2022;
const _MIN_YEAR = 2000;
const _START_SORT = 'cestas_basicas';
const _LARGEST_DATA = 3571;
const _RECT_OPT_CORR = 1.2; // optical ajustment for squares to have similar size of circles

// ################
// global variables
// ################
var data, viz, alunos, tag, vizContainer, alunos; // important elements
var palette, sizes, cor_raca_autodeclarada, cursou_ensino_medio_publico, sexo, modalidade_ingresso, paais, cotas; // scales
var sort; // sorting config
var currentYear = _START_YEAR;
var currentSortField = _START_SORT;
let vizSize, gridColumnsNumber, gridCellSize; // size config

// #################
// acoes afirmativas
// #################
let acoesAfirmativas = {
    'eu' : [2019,2020,2022],
    'vi' : [2019,2020,2021,2022],
    'vo' : [2019,2020,2021,2022],
    'pr' : [2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022],
    'cotas' : [2019,2020,2021,2022],
    'paais' : [2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022]
}

// ###########
// load scales
// ###########
palette = d3.scaleOrdinal()
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

// ############
// loading data
// ############

d3.json('../data/alunos.json').then(d => { 
    data = _.values(d);

    sizes = d3.scaleLinear()
    .domain([d3.min(data, d => d.cestas_basicas), d3.max(data, d => d.cestas_basicas)])
    .range([.25, .75]);

    draw();
});

// #########
// functions
// #########

function sortViz(v) {
    currentSortField = v;
    alunos.sort(sort[currentSortField]['desc'])
        .transition().ease(d3.easeCubicInOut)
        .duration(800)
        .attr('transform', (d,i) => 'translate(' + (i%gridColumnsNumber)*gridCellSize + ',' + Math.floor(i/gridColumnsNumber)*gridCellSize + ')');
}

function refreshFilters() {
    if (acoesAfirmativas['eu'].includes(currentYear)) {
        d3.select('#enem-unicamp').attr('checked', 'true').attr('disabled', null);    
        d3.select('p.enem-unicamp').classed('strike', false);    
    } else {
        d3.select('#enem-unicamp').attr('checked', null).attr('disabled','true');
        d3.select('p.enem-unicamp').classed('strike', true);            
    }
    if (acoesAfirmativas['vi'].includes(currentYear)) {
        d3.select('#vestibular-indigena').attr('checked', 'true').attr('disabled', null);        
        d3.select('p.vestibular-indigena').classed('strike', false);            
    } else {
        d3.select('#vestibular-indigena').attr('checked', null).attr('disabled','true');        
        d3.select('p.vestibular-indigena').classed('strike', true);             
    }
    if (acoesAfirmativas['vo'].includes(currentYear)) {
        d3.select('#vagas-olimpicas').attr('checked', 'true').attr('disabled', null);
        d3.select('p.vagas-olimpicas').classed('strike', false);            
    } else {
        d3.select('#vagas-olimpicas').attr('checked', null).attr('disabled','true'); 
        d3.select('p.vagas-olimpicas').classed('strike', true);             
    }
    if (acoesAfirmativas['pr'].includes(currentYear)) {
        d3.select('#profis').attr('checked', 'true').attr('disabled', null);        
        d3.select('p.profis').classed('strike', false);            
    } else {
        d3.select('#profis').attr('checked', null).attr('disabled','true');
        d3.select('p.profis').classed('strike', true);             
    }
    if (acoesAfirmativas['paais'].includes(currentYear)) {
        d3.select('#paais').attr('checked', 'true').attr('disabled', null);
        d3.select('p.paais').classed('strike', false);            
    } else {
        d3.select('#paais').attr('checked', null).attr('disabled','true');        
        d3.select('p.paais').classed('strike', true);             
    }
    if (acoesAfirmativas['cotas'].includes(currentYear)) {
        d3.select('#cotas').attr('checked', 'true').attr('disabled', null);
        d3.select('p.cotas').classed('strike', false);            
    } else {
        d3.select('#cotas').attr('checked', null).attr('disabled','true');        
        d3.select('p.cotas').classed('strike', true);             
    }
}

function filterViz(filter,checked) {
    if (filter == 'enem-unicamp') {
        alunos.filter(d => d.modalidade_ingresso === 'eu').transition().duration(1000).style('opacity', checked ? 1 : 0);
    } else if (filter == 'profis') {
        alunos.filter(d => d.modalidade_ingresso === 'pr').transition().duration(1000).style('opacity', checked ? 1 : 0);
    } else if (filter == 'vestibular-indigena') {
        alunos.filter(d => d.modalidade_ingresso === 'vi').transition().duration(1000).style('opacity', checked ? 1 : 0);
    } else if (filter == 'vagas-olimpicas') {
        alunos.filter(d => d.modalidade_ingresso === 'vo').transition().duration(1000).style('opacity', checked ? 1 : 0);
    } else if (filter == 'paais') {
        alunos.filter(d => d.paais === 's').transition().duration(1000).style('opacity', checked ? 1 : 0);
    } else if (filter == 'cotas') {
        alunos.filter(d => d.cotas === 's').transition().duration(1000).style('opacity', checked ? 1 : 0);
    }

}

function nextYear() {
    currentYear++;
    if (currentYear > _MAX_YEAR) {
        currentYear = _MIN_YEAR
    }
    draw();
}

function prevYear() {
    currentYear--;
    if (currentYear < _MIN_YEAR) {
        currentYear = _MAX_YEAR;
    }
    draw();
}

function calculateSizes() {
    // calculate dimensions
    vizContainer = d3.select('#viz').node().getBoundingClientRect();
    let fit = false;
    let nCols = 1;
    let nData = _LARGEST_DATA; // largest set of rows is year 2014. Faster just to set it hardcoded.
    while (!fit) {
        let nLines = nData/nCols;
        if (nLines*(vizContainer.width/nCols) > vizContainer.height) {
            nCols++;
        } else {
            fit = true;
        }
    }
    vizSize = vizContainer.width;
    gridColumnsNumber = nCols;
    gridCellSize = vizSize/gridColumnsNumber;

}

function clearViz() {
    d3.selectAll("#viz > *").remove();
}

function zoomed({transform}) {
    g.attr("transform", transform);
}        


function draw() {

    refreshFilters();

    calculateSizes();
    clearViz();

    d3.select('#year').text(currentYear);

    // data viz container
    viz = d3.select('#viz').append('svg').attr("viewBox", [0, 0, vizContainer.width, vizContainer.height]);
    viz.call(d3.zoom()
        .extent([[0, 0], [500, 500]])
        .scaleExtent([1, 5])
        .translateExtent([[0,0],[500,500]])
        .on("zoom", zoomed));

    g = viz.append('g');

   // create a particle container for each row in data ('aluno')
    alunos = g.selectAll('g')
        .data(data.filter(d => d.ano === currentYear).sort(sort[currentSortField]['desc']))
        .join('g')
        .classed('aluno', true)
        .attr('transform', (d,i) => 'translate(' + (i%gridColumnsNumber)*gridCellSize + ',' + Math.floor(i/gridColumnsNumber)*gridCellSize + ')');

    // draws shapes into each particle
    viz.selectAll('#viz > svg > g > g')
        .append(d => document.createElementNS('http://www.w3.org/2000/svg', d.sexo === 'm' ? 'circle' : 'rect'))
        .attr('cx',gridCellSize/2)
        .attr('cy',gridCellSize/2)
        .attr('r', d => gridCellSize*sizes(d.cestas_basicas)/1.5)
        .attr('x', d => gridCellSize/2 - gridCellSize*sizes(d.cestas_basicas)*_RECT_OPT_CORR/2)
        .attr('y', d => gridCellSize/2 - gridCellSize*sizes(d.cestas_basicas)*_RECT_OPT_CORR/2)
        .attr('width', d => gridCellSize*sizes(d.cestas_basicas)*_RECT_OPT_CORR)
        .attr('height', d => gridCellSize*sizes(d.cestas_basicas)*_RECT_OPT_CORR)
        .style('fill', d => palette(d.cor_raca_autodeclarada))
        .style('stroke', d => d.cor_raca_autodeclarada === 'np' ? '#FFF' : 'none');

    // draws stroke
    viz.selectAll('#viz > svg > g > g')
        .append(d => document.createElementNS('http://www.w3.org/2000/svg', d.sexo === 'm' ? 'circle' : 'rect'))
        .attr('cx',gridCellSize/2)
        .attr('cy',gridCellSize/2)
        .attr('r', d => d3.max([gridCellSize*sizes(d.cestas_basicas)/2 - 2, 1]))
        .attr('x', d => gridCellSize/2 - gridCellSize*sizes(d.cestas_basicas)/2 + 2)
        .attr('y', d => gridCellSize/2 - gridCellSize*sizes(d.cestas_basicas)/2 + 2)
        .attr('width', d => d3.max([gridCellSize*sizes(d.cestas_basicas) - 4,1]))
        .attr('height', d => d3.max([gridCellSize*sizes(d.cestas_basicas) - 4,1]))
        .style('fill',  d => d.cursou_ensino_medio_publico === 'f' ? '#112035' : palette(d.cor_raca_autodeclarada))
        .style('stroke', d => d.cor_raca_autodeclarada === 'np' && d.cursou_ensino_medio_publico == 'f' ? '#FFF' : 'none');

        alunos.on("mouseover", function(e, d) {
            d3.select('#tag > *').remove(); // clear tag

            let svg = d3.select('#tag').append('div').classed('icon', true).append('svg').attr("viewBox", [0, 0, gridCellSize, gridCellSize]);

            svg.append('rect')
            .attr('x', '0')
            .attr('y', '0')
            .attr('width', '100%')
            .attr('height', '100%')
            .style('fill', '#112035');

            svg.append(d.sexo === 'm' ? 'circle' : 'rect')
            .attr('cx',gridCellSize/2)
            .attr('cy',gridCellSize/2)
            .attr('r', gridCellSize*sizes(d.cestas_basicas)/1.5)
            .attr('x', gridCellSize/2 - gridCellSize*sizes(d.cestas_basicas)*_RECT_OPT_CORR/2)
            .attr('y', gridCellSize/2 - gridCellSize*sizes(d.cestas_basicas)*_RECT_OPT_CORR/2)
            .attr('width', gridCellSize*sizes(d.cestas_basicas)*_RECT_OPT_CORR)
            .attr('height', gridCellSize*sizes(d.cestas_basicas)*_RECT_OPT_CORR)
            .style('fill', palette(d.cor_raca_autodeclarada))
            .style('stroke', d.cor_raca_autodeclarada === 'np' ? '#FFF' : 'none');  

            svg.append(d.sexo === 'm' ? 'circle' : 'rect')
            .attr('cx',gridCellSize/2)
            .attr('cy',gridCellSize/2)
            .attr('r', d3.max([gridCellSize*sizes(d.cestas_basicas)/2 - 2, 1]))
            .attr('x', gridCellSize/2 - gridCellSize*sizes(d.cestas_basicas)/2 + 2)
            .attr('y', gridCellSize/2 - gridCellSize*sizes(d.cestas_basicas)/2 + 2)
            .attr('width', d3.max([gridCellSize*sizes(d.cestas_basicas) - 4,1]))
            .attr('height', d3.max([gridCellSize*sizes(d.cestas_basicas) - 4,1]))
            .style('fill',  d.cursou_ensino_medio_publico === 'f' ? '#112035' : palette(d.cor_raca_autodeclarada))
            .style('stroke', d.cor_raca_autodeclarada === 'np' && d.cursou_ensino_medio_publico == 'f' ? '#FFF' : 'none');
                
            d3.select('#tag > div.description').remove();
            let tagDesc = d3.select('#tag').append('div').classed('description', true);
            tagDesc.append('label').text('Cestas básicas');
            tagDesc.append('span').text(d.cestas_basicas);
            tagDesc.append('label').text('Cor/raça');
            tagDesc.append('span').text(cor_raca_autodeclarada(d.cor_raca_autodeclarada));
            tagDesc.append('label').text('Sexo');
            tagDesc.append('span').text(sexo(d.sexo));
            tagDesc.append('label').text('Ensino médio público');
            tagDesc.append('span').text(cursou_ensino_medio_publico(d.cursou_ensino_medio_publico));
            tagDesc.append('label').text('Modalidade');
            tagDesc.append('span').text(modalidade_ingresso(d.modalidade_ingresso));
            tagDesc.append('label').text('PAAIS');
            tagDesc.append('span').text(paais(d.paais));
            tagDesc.append('label').text('Cotas');
            tagDesc.append('span').text(cotas(d.cotas));
        });

}