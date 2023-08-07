const canvas = d3.select('#canvas');

let currYear: number = 2020;
let currTemp: number = 0;

type Animal = {
  name: string;
  type: string;
  temp: number[];
  img: string;
  text?: string;
  extinctDegree: number;
  x: number;
  y: number;
};

let animalMap = new Map<string, Animal>();

d3.csv('dataset.csv').then((d) => {
  const tempCol = d.columns.slice(2);

  d.map((d) => {
    const animal: Animal = {
        name: d.name,
        type: d.type,
        temp: tempCol.map((col) => +d[col]),
        img: 'img/' + d.type + '/' + d.name + '.png',
        x: parseInt(d.x),
        y: parseInt(d.y),
        extinctDegree: parseFloat(d.extinctDegree),
        text: d.text,
    };

    animalMap.set(d.name, animal);

    addAnimal(animal);
  });

  console.log(animalMap);

  d3.select('#start-button').on('click', () => {
    d3.select('#start-container').remove();
    startFade(animalMap);
    const infoUpdateInterval = setInterval(() => {
      if (currYear == 2600) {
        clearInterval(infoUpdateInterval);
      }

      updateInfo();
    }, 75); // 36 seconds to go from 0C to 6C = 75 milliseconds per year
  });
});

const addAnimal = (animal: Animal) => {
  const animalElement = canvas
    .append('img')
    .attr('src', animal.img)
    .attr('id', animal.name)
    .style('max-width', '150px')
    .style('height', 'auto')
    .style('top', `${animal.y}px`)
    .style('left', `${animal.x}px`)
    .style('position', 'absolute');

  animalElement.on('mouseover', () => onMouseOver(animal));
  animalElement.on('mouseleave', () => onMouseLeave());
  animalElement.on('mousemove', (event) => onMouseMove(event, animal));
};

const xScale = d3.scaleLinear().domain([0, 6]).range([6000, 36000]);

function startFade(animalMap: Map<string, Animal>) {
  animalMap.forEach((animal) => {
    const animalElement = d3.select('#' + animal.name);
    let addToGrave = false;
    animalElement
      .transition()
      .duration(xScale(animal.extinctDegree))
      .tween('fade', () => {
        const interpolate = d3.interpolate(1, 1 - animal.temp[12] / 100);
        return (t) => {
          if (
            Number(((interpolate(t) * 100) / 100).toFixed(2)) == 0.02 &&
            !addToGrave
          ) {
            addToGrave = true;
            graveyard
              .append('img')
              .attr('src', animal.img)
              .attr('id', `${animal.name}-grave`)
              .style('max-width', '20px');
          }
          animalElement.style(
            'opacity',
            Number(((interpolate(t) * 100) / 100).toFixed(2))
          );
        };
      });
  });
}

const tooltip = d3
  .select('#canvas')
  .append('div')
  .style('opacity', 0)
  .attr('class', 'tooltip');

// tooltip
const onMouseOver = function (d: Animal) {
  tooltip.style('opacity', d3.select('#' + d.name).style('opacity'));
};

const onMouseMove = function (event: any, d: Animal) {
  tooltip
    .html(`${d.text}`)
    .style('left', event.pageX + 10 + 'px')
    .style('top', event.pageY + 10 + 'px');
};

const onMouseLeave = function () {
  tooltip.style('opacity', 0);
};

// graveyard
const graveyardContainer = canvas
  .append('div')
  .attr('class', 'graveyard-container');
const graveyardTitle = graveyardContainer
  .append('h3')
  .attr('class', 'graveyard-title')
  .text('The following animals are now extinct....');
const graveyard = graveyardContainer.append('div').attr('class', 'graveyard');

// info bar bottom
const bottomInfoBar = canvas.append('div').attr('class', 'bottom-info-bar');

const infoContainer = bottomInfoBar
  .append('div')
  .attr('class', 'info-container');

infoContainer.append('p').attr('id', 'yearInfo').text(currYear.toString());

infoContainer
  .append('p')
  .attr('id', 'tempInfo')
  .text(currTemp + 'C');

function calcTemp(year: number) {
    return -146.99 + (19.46 * Math.log(year));
}

function updateInfo() {
  d3.select('#yearInfo').text(currYear++);
  d3.select('#tempInfo').text(calcTemp(currYear).toFixed(1) + 'C');
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
