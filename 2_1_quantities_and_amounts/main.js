
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

    container
      .selectAll(".data")
      .data(data)
      .join("div")
      .attr("class", "data")
      .text((d) => d.nationality)
  })

  