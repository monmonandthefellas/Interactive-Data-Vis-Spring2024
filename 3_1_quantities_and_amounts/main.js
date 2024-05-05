/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.9,
  margin = { top: 20, bottom: 60, left: 60, right: 40 },
  radius = 5;
let xScale, yScale, colorScale, svg;

const nationalityColors = {
  American: ["#CC0000"],
  German: ["#000000"],
  British: ["#CC0000"],
  French: ["#0055A4"],
  Italian: ["#009246"],
  Japanese: ["#BC002D"],
  Swiss: ["#FF0000"],
  Dutch: ["#21468B"],
  Russian: ["#D52B1E"],
  Austrian: ["#ED2939"]
};

const euroCountries = ["German", "British", "French", "Italian", "Swiss","Dutch", "Austrian"]

/* APPLICATION STATE */
let state = {
  data: [],
  selectedCountries: "All"
};

/* LOAD DATA */
d3.csv('../data/MoMA_topTenNationalities.csv', d3.autoType).then(raw_data => {
  console.log("data", raw_data);
  // save our data to application state
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  
  svg = d3.select("#container")
    .append('svg')
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "#F1F0E2")
  
  /* SCALES */

  xScale = d3.scaleBand()
    .domain(state.data.map(d => d.Nationality))
    .range([margin.left, width - margin.right]) // visual variable
    .paddingInner(.2);

  yScale = d3.scaleLinear()
    .domain([0, d3.max(state.data, d => d.Count)])
    .range([height - margin.top - margin.bottom, margin.bottom]);

  /* Axes */

  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)

  /* color scale */

  colorScale = d3.scaleOrdinal()
  .domain(Object.keys(nationalityColors))
  .range(Object.values(nationalityColors));

  /* UI elements */

  const dropdown = d3.select("#dropdown")
  .on("change", (event) => {
    state.selectedCountries = event.target.value;
    console.log(event.target.value)
      draw()
  });

  const option = dropdown
    .selectAll("option")
    .data(["All", "European Nationalities"]) 
    .join("option")
    .attr("value", d => d)
    .text(d => d);


 // Append x-axis
    svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

// Append y-axis
  svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);


  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this every time there is an update to the data/state
function draw() {
  /* Filter data */
 


  let filteredData = state.data
  
  if (state.selectedCountries !== "All") {
    filteredData = state.data.filter(d => euroCountries.includes(d.Nationality));
  }

  

  /* Update scales */
  xScale.domain(filteredData.map(d => d.Nationality));
  yScale.domain([0, d3.max(filteredData, d => d.Count)]);

  /* HTML ELEMENTS */
  const bars = svg.selectAll(".bars")
    .data(filteredData)
    .join (
  enter => enter.append("rect")
    .attr("x", d => xScale(d.Nationality))
    .attr("y", d => yScale(d.Count))
    .attr("height", d => height - margin.bottom - yScale(d.Count))
    .attr("fill", d => colorScale(d.Nationality)),

  update => update 
    .call (sel => sel.transition()
    .attr("x", d => xScale(d.Nationality))
    .attr("y", d => yScale(d.Count))
    .attr("height", d => height - margin.bottom - yScale(d.Count))
    .attr("fill", d => colorScale(d.Nationality))),
  exit => exit.remove()
    ) 
    .attr("class", "bars")
    .attr("width", xScale.bandwidth())



  /* Append x-axis */
  svg.select(".x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale));

  /* Append y-axis */
  svg.select(".y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale));

    console.log("drawing")
    console.log("Filtered Data:", filteredData);
}
