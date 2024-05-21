async function loadData() {
    const response = await fetch('../data/MoMa_Artists_data.csv'); // Load the CSV file using fetch
    const text = await response.text(); // Get the text content of the file
    const links = d3.csvParse(text, d3.autoType); // Parse the CSV data using d3.csvParse and d3.autoType

    // Create a map to store unique nodes
    const nodesMap = new Map();
    let nodeId = 0;

    // Function to add node if not exists and return node id
    function getNode(name, type) {
        if (!name || name.trim().toLowerCase() === "none") return null;
        const key = `${name.trim()}-${type}`;
        if (!nodesMap.has(key)) {
            nodesMap.set(key, { id: nodeId++, name: name.trim(), type, label: name.trim() });
        }
        return nodesMap.get(key).id;
    }

    // Create links array with source and target being node ids
    const formattedLinks = links.map(link => {
        const source = getNode(link.undergraduate, "undergraduate");
        const target = getNode(link.graduate, "graduate");
        return source && target ? { source, target, value: 1 } : null;
    }).filter(link => link !== null); // Filter out invalid links

    // Convert nodes map to array
    const nodes = Array.from(nodesMap.values());

    return { nodes, links: formattedLinks };
}

// Call the function to start loading the data
loadData().then(data => {
    console.log("Loaded data:", data);

    const width = window.innerWidth * 0.9;
    const height = window.innerHeight * 0.9;

    // Create a Sankey layout
    const sankeyLayout = d3.sankey()
        .nodeId(d => d.id)
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 1], [width - 1, height - 6]]); // Adjust extent as needed

    const sankeyData = sankeyLayout({
        nodes: data.nodes.map(d => Object.assign({}, d)),
        links: data.links.map(d => Object.assign({}, d))
    });

    // Manually set positions for the nodes based on their type
    sankeyData.nodes.forEach(node => {
        if (node.type === "undergraduate") {
            node.x0 = 1;
            node.x1 = node.x0 + 15;
        } else if (node.type === "graduate") {
            node.x0 = width - 16;
            node.x1 = node.x0 + 15;
        }
    });

    // Assuming you have an SVG element with id "svg-container" where you want to draw the visualization
    const svg = d3.select("#svg-container")
        .append("svg")
        .attr("width", "120%")
        .attr("margin", "auto")
        .attr("padding", "50px")
        .attr("height", height);

    // Draw the links
    svg.append("g")
        .selectAll("path")
        .data(sankeyData.links)
        .join("path")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke", "black")
        .attr("padding", "35px")
        .attr("stroke-width", d => Math.max(1, d.width))
        .attr("fill", "none")
        .attr("width", "50%")
        .attr("margin", "auto");


    // Draw the nodes
    // const node = svg.append("g")
    //     .selectAll("rect")
    //     .data(sankeyData.nodes)
    //     .join("rect")
    //     .attr("x", d => d.x0)
    //     .attr("y", d => d.y0)
    //     .attr("height", d => d.y1)
    //     .attr("width", d => d.x1 - d.x0)
    //     .attr("fill", d => d.type === "undergraduate" ? "#9DDFFF80" : "green");

    // Add labels
    svg.append("g")
        .selectAll("text")
        .data(sankeyData.nodes)
        .join("text")
        .attr("x", d => d.type === "undergraduate" ? d.x0 + 100: d.x1 -10) // Position the text based on node type
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.76em")
        .attr("margin", "20px")
        .attr("padding", "20px")
        .attr("text-anchor", d => d.type === "undergraduate" ? "end" : "start")
        .text(d => d.label)
        .attr("font-size", "12px")
        .attr("line-height", "16px")
        .attr("overflow", "visible")
        .attr("fill", "black");

}).catch(error => {
    console.error("Error loading data:", error); // Log any errors during data loading
});
