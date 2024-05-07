
/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 60, left: 60, right: 40 },
  radius = 5;

let svg;
let xScale;
let yScale;
let colorScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selectedGender: "All" // + YOUR INITIAL FILTER SELECTION
};

/* LOAD DATA */
d3.csv("../data/MoMa_distributions.csv", d3.autoType).then(raw_data => {
  console.log("data", raw_data);
  // save our data to application state
  state.data = raw_data;

  init(); // Call init() after data loading and parsing
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  // + SCALES
  xScale = d3.scaleBand()
    .domain(state.data.map(d => d.Artist))
    .range([margin.left, width - margin.right])
    .padding(0.1);


  yScale = d3.scaleLinear()
    .domain(d3.extent(state.data, d => Math.max(20, Math.min(100, d.ArtistLifespan))))
    .range([height - margin.top, margin.top]);

  colorScale = d3.scaleOrdinal()
    .domain(["(Male)", "(Female)"])
    .range(["blue", "red"]);

  // + AXES
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // + UI ELEMENT SETUP
  const dropdown = d3.select("#dropdown");

  dropdown
    .selectAll("option")
    .data(["All", "(Female)", "(Male)"])
    .join("option")
    .attr("value", d => d)
    .text(d => d);

  dropdown
    .on("change", (event) => {
      console.log(event.target.value);
      state.selectedGender = event.target.value;
      draw();
    });

  // + CREATE SVG ELEMENT
  svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
    // .style("overflow", "visible")

  // + CALL AXES
  svg
    .append("g")
    .attr("id", "x-axis")
    .call(xAxis)
    .attr("transform", `translate(0,${height - margin.top})`)
    .selectAll("text")
    .style("visibility", "hidden");

  svg
    .append("g")
    .attr("id", "y-axis")
    .call(yAxis)
    .attr("transform", `translate(${margin.left},0)`);
    

  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this every time there is an update to the data/state
function draw() {
  // + FILTER DATA BASED ON STATE
  let filteredData = state.data
    .filter(d => state.selectedGender === "All" || state.selectedGender === d.Gender);

    const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

   const dot = svg
    .selectAll(".circle")
    .data(filteredData, d => d.Artist)
    .join (
    enter => enter.append("circle")
      .attr("cx", d => xScale(d.Artist))
      .attr("r", 5)
      .attr("fill", d => colorScale(d.Gender))
      .call(sel => sel.transition()
    .duration(1000) 
    .attr("cy", d => yScale(d.ArtistLifespan)))

      .on("mouseover", (event, d) => {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`${d.Artist}`)
          .style("left", (event.pageX + 10) + "px") 
          .style("top", (event.pageY - 28) + "px"); 
      })
      .on("mouseout", () => {
        // Hide tooltip on mouseout
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      })
      ,
      
      update => update
      .call(sel => sel.transition()
      .attr("cx", d => xScale(d.Artist))
      .attr("cy", d => yScale(d.ArtistLifespan))
      .attr("r", 5)
      .attr("fill", d => colorScale(d.Gender))),

      exit => exit.remove()
      )
      .attr("class", "circle")
    

/* Append x-axis */
  svg.select("#x-axis")
  .attr("transform", `translate(0, ${height - margin.bottom})`)
  .call(d3.axisBottom(xScale));

/* Append y-axis */
svg.select("#y-axis")
  .attr("transform", `translate(${margin.left}, 0)`)
  .call(d3.axisLeft(yScale));

}
