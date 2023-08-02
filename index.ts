const canvas = d3.select("#canvas");

const maxPos: number = 800;
const minPos: number = 20;

type Animal = {
    name: string,
    type: string,
    temp: number[],
    img: string,
    text?: string
    x: number,
    y: number
};

let animalMap = new Map<string, Animal>;

d3.csv("dataset.csv").then(d => {

    const tempCol = d.columns.slice(2);

    d.map((d) => {

        const animal: Animal = {
                name: d.name,
                type: d.type,
                temp: tempCol.map((col) => +d[col]),
                img: "img/" + d.name + ".jpg",
                x: (Math.floor(Math.random() * (800 - 10 + 1) + 10)),
                y: (Math.floor(Math.random() * (800 - 10 + 1) + 10)),
            };

        animalMap.set(d.name, animal);

        addAnimal(animal);
    });

    console.log(animalMap)
})

const addAnimal = (animal: Animal) => {
    canvas.append("img")
        .attr("src", animal.img)
        .style("width", "10%")
        .style("height", "auto")
        .style("transform", `translate(${animal.x}px, ${animal.y}px)`);

};

// info bar bottom
const bottomInfoBar = canvas
    .append("div")
    .attr("class", "bottom-info-bar");

const infoContainer = bottomInfoBar.append("div")
    .attr("class", "info-container")
    .style("background-color", "black")

infoContainer
    .append("p")
    .attr("id", "yearInfo")
    .text("2023");

infoContainer
    .append("p")
    .attr("id", "tempInfo")
    .text("0C");

let currYear = parseInt(d3.select("#yearInfo").html());
let currTemp = parseInt(d3.select("#tempInfo").html().replace('C', ''));

function updateInfo() {
    d3.select("#yearInfo").text(currYear++);
    d3.select("#tempInfo").text(currTemp++ + "C");
}

setInterval(updateInfo, 2000)

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
