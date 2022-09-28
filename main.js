let gridCellSize = 12;
const _RECT_OPT_CORR = 1.4; // optical ajustment for squares to have similar size of circles

sizes = d3
  .scaleLinear()
  .domain([1.29, 82]) // 1.29 e 82
  .range([0.3, 0.75]);

palette = d3
  .scaleOrdinal()
  .domain(['am', 'br', 'in', 'pa', 'pr', 'nd', 'np'])
  .range([
    '#F5524E',
    '#B4B1E7',
    '#59A14F',
    '#2B94DD',
    '#FDC361',
    '#7E15FE',
    '#112035',
  ]);

function drawTag(on, adaptive) {
  d3.select('#' + on + ' > *').remove();

  let d = {
    cestas_basicas: d3.select('#renda').node().value,
    cor_raca_autodeclarada: d3.select('#cor_raca_autodeclarada').node().value,
    sexo: d3.select('input[name="sexo"]:checked').node().value,
    cursou_ensino_medio_publico: d3
      .select('input[name="ensino_medio"]:checked')
      .node().value,
  };

  let svg;
  if (adaptive) {
    svg = d3
      .select('#' + on)
      .append('svg')
      .attr('viewBox', [0, 0, gridCellSize, gridCellSize]);
  } else {
    svg = d3.select('#' + on).append('svg');
  }

  svg
    .append(d.sexo === 'm' ? 'circle' : 'rect')
    .attr('cx', gridCellSize / 2)
    .attr('cy', gridCellSize / 2)
    .attr('r', (gridCellSize * sizes(d.cestas_basicas)) / 1.5)
    .attr(
      'x',
      gridCellSize / 2 -
        (gridCellSize * sizes(d.cestas_basicas) * _RECT_OPT_CORR) / 2
    )
    .attr(
      'y',
      gridCellSize / 2 -
        (gridCellSize * sizes(d.cestas_basicas) * _RECT_OPT_CORR) / 2
    )
    .attr('width', gridCellSize * sizes(d.cestas_basicas) * _RECT_OPT_CORR)
    .attr('height', gridCellSize * sizes(d.cestas_basicas) * _RECT_OPT_CORR)
    .style('fill', palette(d.cor_raca_autodeclarada))
    .style('stroke', d.cor_raca_autodeclarada === 'np' ? '#FFF' : 'none');

  svg
    .append(d.sexo === 'm' ? 'circle' : 'rect')
    .attr('cx', gridCellSize / 2)
    .attr('cy', gridCellSize / 2)
    .attr('r', d3.max([(gridCellSize * sizes(d.cestas_basicas)) / 2 - 1, 1]))
    .attr(
      'x',
      gridCellSize / 2 -
        (gridCellSize * sizes(d.cestas_basicas) * _RECT_OPT_CORR) / 2 +
        2
    )
    .attr(
      'y',
      gridCellSize / 2 -
        (gridCellSize * sizes(d.cestas_basicas) * _RECT_OPT_CORR) / 2 +
        2
    )
    .attr(
      'width',
      d3.max([gridCellSize * sizes(d.cestas_basicas) * _RECT_OPT_CORR - 4, 1])
    )
    .attr(
      'height',
      d3.max([gridCellSize * sizes(d.cestas_basicas) * _RECT_OPT_CORR - 4, 1])
    )
    .style(
      'fill',
      d.cursou_ensino_medio_publico === 'f'
        ? '#112035'
        : palette(d.cor_raca_autodeclarada)
    )
    .style(
      'stroke',
      d.cor_raca_autodeclarada === 'np' && d.cursou_ensino_medio_publico == 'f'
        ? '#FFF'
        : 'none'
    );
}

function youAreHere() {
  let everyone = d3.select('#thatIsEveryone');

  let miniYou = d3.select('#thisIsMiniYou');
  miniYou.style('display', 'block');

  everyone
    .transition()
    .duration(500)
    .style('height', '500px')
    .on('end', function () {
      everyone.transition().duration(500).style('opacity', 1);
    });

  d3.select('#showEveryone').style('display', 'none');
  d3.select('#beginStories').style('display', 'inline-block');

  d3.select('#becomeData p.step1').style('display', 'none');
  d3.select('#becomeData p.step2').style('display', 'block');

  let you = d3.select('#thisIsYou');
  you
    .transition()
    .duration(800)
    .style('opacity', '0')
    .style('width', '20px')
    .style('height', '20px')
    .on('end', function () {
      you.style('display', 'none');
      miniYou.transition().duration(500).style('opacity', '100');
    });
}

function togglePaais(on) {
  if (on) {
    d3.select('#descobertas02 img').attr(
        'src',
        'assets/img/2005-com-paais.png'
      );
  } else {
    d3.select('#descobertas02 img').attr(
      'src',
      'assets/img/2005-sem-paais.png'
    );
  }
}

function openHelp() {
  d3.select('#overlay').style('display', 'flex').transition().duration(1000).style('opacity', 1);
}

function closeHelp() {
  d3.select('#overlay').transition().duration(1000).style('opacity', 0).on('end', function() {
    d3.select('#overlay').style('display', 'none');
  });
}
