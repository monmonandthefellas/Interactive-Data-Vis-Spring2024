const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 60, left: 60, right: 40 },
  radius = 5;

/* LOAD DATA */
d3.json("../data/environmentRatings.json", d3.autoType).then(data => {
  console.log(data)

    /* SCALES */
    // xscale - linear.count
    const xScale = d3.scaleLinear()
    .domain([0,1])
    .range([])
    
    /* HTML ELEMENTS */
  //svg
  const svg = d3.select(#container)
  .append("svg")
  .attr("width", width)
  .attr("height", height)
    
  });