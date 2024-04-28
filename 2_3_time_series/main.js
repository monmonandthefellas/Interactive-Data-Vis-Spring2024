 /* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 60 };

/* LOAD DATA */
d3.csv('../data/populationOverTime.csv', d => {
  return {
    year: new Date(+d.Year, 0, 1),
    country: d.Entity,
    population: +d.Population
  }
}).then(data => {
  console.log('data :>> ', data);

  // SCALES
  const xScale = d3.scaleTime()
  .domain(d3.extent(data, d => d.year))
  .range([margin.left, width - margin.right])

  const yScale = d3.scaleLinear()
  .domain(d3.extent(data, d => d.population))
  .range([height - margin.bottom, margin.top])

  // CREATE SVG ELEMENT
  const svg = d3.select("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

  // BUILD AND CALL AXES

  // LINE GENERATOR FUNCTION
  const lineGen = d3.line()
  .x(d => xScale(d.year))
  .y(d => yScale(d.population))

  // DRAW LINE
const afghanistan = data.filter( d => d.country === "Afghanistan")
const hungary = data.filter( d => d.country === "Hungary")
const china = data.filter( d => d.country === "China")


// svg.selectAll(".circle")
// .data(afghanistan)
// .join("circle")
// .attr("class", "circle")
// .attr("cx", d => xScale(d.year))
// .attr("cx", d => xScale(d.population))
// .attr("r", 1)

// svg.selectAll(".country")
// .data([afghanistan, hungary, china])
// .join("path")
// .attr("class", "afghanistan")
// .attr("fill", "none")
// .attr("stroke", "black")
// .attr("d", d => lineGen(d))
// 

const groupedData = d3.groups(data, d => d.country)
console.log(groupedData)

svg.selectAll("path.country")
.data(groupedData)
.join("path")
.attr("class", "country")
.attr("d", ([countryName, data]) => lineGen(data))
.attr("fill", "none")
.attr("stroke", "black")
});