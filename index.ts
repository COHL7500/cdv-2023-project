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
      startSmoke();
    }, 10); // 36 seconds to go from 0C to 6C = 75 milliseconds per year
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
              .style('margin', '4px')
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

// info bar

const bottomInfoBarContainer = canvas
  .append('div')
  .attr('class', 'bottom-info-bar');

const bottomInfoBar = canvas.append('div').attr('class', 'bottom-info-bar');

const infoContainer = bottomInfoBar
  .append('div')
  .attr('class', 'info-container');

infoContainer.append('p').attr('id', 'yearInfo').text(currYear.toString());

infoContainer
  .append('p')
  .attr('id', 'tempInfo')
  .text(currTemp + 'C');

bottomInfoBar
  .append('img')
  .attr('src', 'img/chimney.svg')
  .attr('class', 'chimney1');
bottomInfoBar
  .append('img')
  .attr('src', 'img/chimney.svg')
  .attr('class', 'chimney2');

bottomInfoBar.append('img').attr('src', 'img/roof.png').attr('class', 'roof1');

bottomInfoBar.append('img').attr('src', 'img/roof.png').attr('class', 'roof2');

function calcTemp(year: number) {
  return -146.99 + 19.46 * Math.log(year);
}

function updateInfo() {
  d3.select('#yearInfo').text(currYear++);
  d3.select('#tempInfo').text(calcTemp(currYear).toFixed(1) + 'C');
}

//Add smoke 
class Particle {
  object: any; // Replace 'any' with the actual type of your object
  x: number;
  y: number;
  scale: number;
  duration: number;
  grow: number;
  velX: number;
  maxVelY: number;
  minVelY: number;
  velY: number;
  count: number;
  id: string;

  constructor(object, count, x, y, size) {
    this.object = object;
    this.x = x;
    this.y = y + size * Math.random();
    this.scale = parseFloat((3 / 10).toString()) * size;
    this.duration = Math.random() * 10000;
    this.grow = this.scale + size * Math.random();
    this.velX =
      (Math.random() < 0.5 ? -1 : 1) * parseFloat((1 / 2).toString()) * size;
    this.maxVelY = size / 2;
    this.minVelY = 1 * size;
    this.velY = size * 1 * Math.random() + size * 2;
    this.count = count;
    this.id = `smoke-${this.object.id}-${this.count}`;

    this.emit();
  }

  emit() {
    d3.select(this.object)
      .append('circle')
      .attr('id', `smoke-${this.object.id}-${this.count}`)
      .attr('class', 'particle')
      .attr('cx', this.x)
      .attr('cy', this.y)
      .attr('r', this.scale)
      .attr('fill', 'grey')
      .attr('opacity', '0.5')
      .transition()
      .duration(this.duration)
      .attr('cy', this.y - this.velY)
      .attr('cx', this.x + this.velX)
      .attr('r', this.grow)
      .attr('opacity', '0')
      .on('end', () => {
        document
          .getElementById(`smoke-${this.object.id}-${this.count}`)
          .remove();
      });
  }
}
class Smoke {
  id: number;
  particles: Particle[];
  limit: number;
  step: number;
  created: number;
  interval: number;

  constructor(id: number = 1) {
    this.id = id;
    this.particles = [];
    this.limit = 1; // Max number of particles.
    this.step = 5; // Max particles created per interval.
    this.created = 0; // A incrementing numeric id for each particle.
    this.interval = 100; // How often to add new particles.

    this.startAnimation();
  }

  startAnimation() {
    setInterval(() => {
      const filter = this.particles.filter((p) => {
        return document.getElementById(p.id) !== null;
      });

      this.particles = filter;
      let currentStep = 0;

      while (this.particles.length < this.limit && currentStep < this.step) {
        const point = document.querySelector(`#smoke`);
        if (point instanceof Element) {
          this.particles.push(new Particle(point, this.created, 500, 970, 40));
          this.particles.push(new Particle(point, this.created, 550, 970, 40));
          this.created += 1;
          currentStep += 1;
        }
      }
    }, this.interval);
  }
}

function startSmoke() {
  const point = d3.select('#smoke');
  const smoke = new Smoke();
}
