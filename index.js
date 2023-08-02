var canvas = d3.select('#canvas');
var maxPos = 800;
var minPos = 20;
var animalMap = new Map();
d3.csv('dataset.csv').then(function (d) {
    var tempCol = d.columns.slice(2);
    d.map(function (d) {
        var animal = {
            name: d.name,
            type: d.type,
            temp: tempCol.map(function (col) { return +d[col]; }),
            img: 'img/' + d.name + '.png',
            x: Math.floor(Math.random() * (800 - 10 + 1) + 10),
            y: Math.floor(Math.random() * (800 - 10 + 1) + 10),
        };
        animalMap.set(d.name, animal);
        addAnimal(animal);
    });
    d3.select('#start-button').on('click', function () {
        d3.select('#text-container').style('opacity', 0);
        startFade(animalMap);
    });
});
var addAnimal = function (animal) {
    canvas
        .append('img')
        .attr('src', animal.img)
        .attr('id', animal.name)
        .style('width', '10%')
        .style('height', 'auto')
        .style('top', "".concat(animal.y, "px"))
        .style('left', "".concat(animal.x, "px"))
        .style('position', 'absolute');
};
function startFade(animalMap) {
    animalMap.forEach(function (animal) {
        var startIndex = 1;
        for (var i = startIndex; i <= startIndex + 11; i++) {
            d3.select('#' + animal.name)
                .transition()
                .duration(36000)
                .style('opacity', 1 - animal.temp[i] / 100);
        }
    });
}
// info bar bottom
canvas
    .append('div')
    .attr('class', 'bottom-info-bar')
    .append('p')
    .text('2023')
    .append('p')
    .text('0C');
/*
const w = 1000;
const h = 1000;
var canvas = d3
  .select('#canvas')
  .append('svg')
  .attr('width', w)
  .attr('height', h)
  .style('background-color', 'black');
var animalData = [];
d3.csv('climatedata.csv').then(function (data) {
  animalData = data;
  draw();
  console.log(animalData);
});
var trigger = "one";
function draw() {
  canvas
    .selectAll('circle')
    .data(animalData)
    .join('circle')
    .attr('cx', function (d, i) {
      console.log(d);
      return i * 30;
    })
    .attr('cy', h / 2)
    .attr('r', function (d) {
      console.log(d)
      return d.one;
    })
    .attr('fill', 'white');
}
 */
