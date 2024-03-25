
/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7;
const height = 300;
const margin = 50;

/* LOAD DATA */
d3.csv('../data/MoMA_topTenNationalities.csv', d3.autoType)
  .then(data => {
    console.log("data", data);

    /* SCALES */
    const container = d3.select("#container")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.Count)])
      .range([margin, width - margin]);

    const yScale = d3.scaleBand()
      .domain(data.map(d => d.Nationality))
      .range([margin, height - margin])
      .paddingInner(0.1);

    const xAxis = d3.axisBottom(xScale);
    container.append("g")
      .attr("transform", `translate(0, ${height - margin})`)
      .call(xAxis);

    const yAxis = d3.axisLeft(yScale);
    container.append("g")
      .attr("transform", `translate(${margin}, 0)`)
      .call(yAxis);

    container.selectAll(".bar")
      .data(data)
      .join("rect")
      .attr("class", "bar")
      .attr("x", margin)
      .attr("y", d => yScale(d.Nationality))
      .attr("width", d => xScale(d.Count) - margin) 
      .attr("height", yScale.bandwidth()); 
  });

  

    /* HTML ELEMENTS */
    /** Select your container and append the visual elements to it */
    
   

    // container
    //   .selectAll(".data")
    //   .data(data)
    //   .join("div")
    //   .attr("class", "count")
    //   .text((d) => d.Nationality)
 

  //   const header = container
  //   .append("th")
  //   .style("background-color", "yellow")
  //   .text("Nationalities represented in the MoMa collection")

  // const table = container
  //   .append("table")
  //   .attr("class", "data")


  //   const firstRow = table
  //   .append("tr")
  //   .attr("class","firstRow")

  //   firstRow.selectAll("td.cell")
  //   .data(data)
  //   .join("td")
  //   .attr("class","cell")
  //   .text((d) => d.Nationality)
   
    

  //   const secondRow = table
  //   .append("tr")
  //   .attr("class", "secondRow")

  //   secondRow.selectAll("td.cell")
  //   .data(data)
  //   .join("td")
  //   .attr("class","cell")
  //   .text((d) => d.Count)
  //   .style("color", "blue")
  //   .style("width", (d) => {
  //     return 100 + "px";
  //   }) 
    

  