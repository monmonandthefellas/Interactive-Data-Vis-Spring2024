
/* CONSTANTS AND GLOBALS */
// const width = ;
// const height = ;

/* LOAD DATA */
d3.csv('../data/MoMA_topTenNationalities.csv', d3.autoType)
  .then(data => {
    console.log("data", data)

    /* SCALES */
    /** This is where you should define your scales from data to pixel space */
    

    /* HTML ELEMENTS */
    /** Select your container and append the visual elements to it */
    
    const container = d3.select("#container")
    console.log(container)

    // container
    //   .selectAll(".data")
    //   .data(data)
    //   .join("div")
    //   .attr("class", "count")
    //   .text((d) => d.Nationality)
 

    const header = container
    .append("th")
    .style("background-color", "yellow")
    .text("Nationalities represented in the MoMa collection")

  const table = container
    .append("table")
    .attr("class", "data")


    const firstRow = table
    .append("tr")
    .attr("class","firstRow")

    firstRow.selectAll("td.cell")
    .data(data)
    .join("td")
    .attr("class","cell")
    .text((d) => d.Nationality)
    

    const secondRow = table
    .append("tr")
    .attr("class", "secondRow")

    secondRow.selectAll("td.cell")
    .data(data)
    .join("td")
    .attr("class","cell")
    .text((d) => d.Count)
    .style("color", "blue")
    .style("width", (d) => {
      return 100 + "px";
    }) 
    

  })