
/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 60, left: 60, right: 40 },
  radius = 5;

// these variables allow us to define anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;
let colorScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selectedGender: "All" // + YOUR INITIAL FILTER SELECTION
};

console.log(state.data)

/* LOAD DATA */
d3.csv("../data/MoMa_distributions.csv", d3.autoType).then(raw_data => {
  console.log("data", raw_data);
  // save our data to application state
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  // + SCALES
  xScale = d3.scaleLinear()
    .domain(0, d3.extent(state.data, d => d.ArtistLifespan))
    .range([margin.left, width - margin.right]);
  
  yScale = d3.scaleLinear()
    .domain(state.data.map(d => d.Gender))
    .range([height-margin.top, margin.bottom]);

  colorScale = d3.scaleOrdinal()
    .domain(["Male", "Female"])
    .range(["red", "blue"])

  // + AXES
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)

  // + UI ELEMENT SETUP
  const selectElement = d3.select("#dropdown")

  selectElement  
    .selectAll("option")
    .data(["All", "Female", "Male"])
    .join("option")
    .attr("value", d => d)
    .text(d => d)

  selectElement
    .on("change", (event) => {
      console.log(event)
      state.selectedGender = event.target.value;
      draw();
    })


  // + CREATE SVG ELEMENT
  svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  // + CALL AXES
  svg
    .append("g")
    .call(xAxis)
    .attr("transform", `translate(0,${height - margin.top})`)
  
  svg
    .append("g")
    .call(yAxis)
    .attr("transform", `translate(${margin.left},0)`)

  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this every time there is an update to the data/state
function draw() {

  // + FILTER DATA BASED ON STATE
  const filteredData = state.data
    .filter(d => state.selectedGender === "All" || state.selectedGender === d.Gender)

  const dot = svg
    .selectAll("circle")
    .data(filteredData) //what's this about..?
    .join(
      // + HANDLE ENTER SELECTION
      enter => enter
      .append("circle")
        .attr("r", radius)
        .attr("cx", xScale)
        .attr("cy", d => yScale(d.ArtistLifespan))
        .attr("fill", d => colorScale(d.Gender))
        .call(sel => sel
          .transition()
          .duration(1000)
          .attr("cx", d => xScale(d.Artist))
        ),

      // + HANDLE UPDATE SELECTION
      update => update 
        
          .transition()
          .duration(250)
          .attr("r", radius * 3) // increase radius size
          .transition()
          .duration(250)
          .attr("r", radius) // bring it back to original size

        ,

      // + HANDLE EXIT SELECTION
      exit => exit
        .call(sel => sel
          //before
          .attr("opacity", 1)
          .transition()
          .duration(1000)
          // after
          .attr("opacity", 0)
          .remove()
        )
    );
}