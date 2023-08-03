var canvas = d3.select("#canvas");
var currYear = 2020;
var currTemp = 0;
var animalMap = new Map;
d3.csv("dataset.csv").then(function (d) {
    var tempCol = d.columns.slice(2);
    d.map(function (d) {
        var animal = {
            name: d.name,
            type: d.type,
            temp: tempCol.map(function (col) { return +d[col]; }),
            img: 'img/' + d.name + '.png',
            x: parseInt(d.x),
            y: parseInt(d.y),
            text: d.text,
        };
        animalMap.set(d.name, animal);
        addAnimal(animal);
    });
    console.log(animalMap);
    d3.select('#start-button').on('click', function () {
        d3.select('#start-container').remove();
        startFade(animalMap);
        var infoUpdateInterval = setInterval(function () {
            if (currYear == 2500) {
                clearInterval(infoUpdateInterval);
            }
            updateInfo();
        }, 75); // 36 seconds to go from 0C to 6C = 75 milliseconds per year
    });
});
var addAnimal = function (animal) {
    var animalElement = canvas
        .append('img')
        .attr('src', animal.img)
        .attr('id', animal.name)
        .style('width', '10%')
        .style('height', 'auto')
        .style('top', "".concat(animal.y, "px"))
        .style('left', "".concat(animal.x, "px"))
        .style('position', 'absolute');
    animalElement.on('mouseover', function () { return onMouseOver(animal); });
    animalElement.on('mouseleave', function () { return onMouseLeave(); });
    animalElement.on('mousemove', function (event) { return onMouseMove(event, animal); });
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
var tooltip = d3.select("#canvas")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip");
// tooltip
var onMouseOver = function (d) {
    tooltip.style("opacity", d3.select('#' + d.name).style('opacity'));
};
var onMouseMove = function (event, d) {
    tooltip
        .html("".concat(d.text))
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + 10 + "px");
};
var onMouseLeave = function () {
    tooltip.style("opacity", 0);
};
// info bar bottom
var bottomInfoBar = canvas
    .append("div")
    .attr("class", "bottom-info-bar");
var infoContainer = bottomInfoBar.append("div")
    .attr("class", "info-container");
infoContainer
    .append("p")
    .attr("id", "yearInfo")
    .text(currYear.toString());
infoContainer
    .append("p")
    .attr("id", "tempInfo")
    .text(currTemp + "C");
function calcTemp(year) {
    return -146.99 + (19.46 * Math.log(year));
}
function updateInfo() {
    d3.select("#yearInfo").text(currYear++);
    d3.select("#tempInfo").text(calcTemp(currYear).toFixed(1) + "C");
}
/*
let prevYearTemp = 1.11
for(let i = 2021; i <= 2500; i++) {
    let currentYearTemp = calcTemp(i)
    data.push({
        year: i,
        temperatureIncrease: currentYearTemp - prevYearTemp,
        totalTemperature: currentYearTemp
    })
    prevYearTemp = currentYearTemp
}
console.log(data)

 */
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
