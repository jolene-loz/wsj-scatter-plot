//=== Initialization ===
const margin = { top: 40, right: 20, bottom: 40, left: 30 }
const width = 900 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom; 

let svg = d3.select("body").append("svg")
.attr("width",width + margin.left + margin.bottom)
.attr("height",height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("driving.csv", d3.autoType).then(data => {

    //===AXIS===

    //X axis add 
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d=>d.miles)).nice()
        .range([0,width])      
        
    // Y axis add
    const y = d3.scaleLinear()
        .domain(d3.extent(data, d=> d.gas)).nice()
        .range([height,0])
    
    //== PATH TO CONNECT ===

    const line = d3
        .line()
        .x(function(d) {
            return x(d.miles)
        })
        .y(function (d){
            return y(d.gas)
        });

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        //styling:
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill", "white");


    // === DOTS === 
    let node = svg.append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("g")

    node.append("circle")
        .attr("class", "dot")
        .attr("cx", function (d) { return x(d.miles); } )
        .attr("cy", function (d) { return y(d.gas); } )
        .attr("r", 3)
        .style("fill", "white")
        .attr("stroke", "black")

    
    // === LABELS ===
    node.append("text")
        .attr("class", "label")
        .attr("x", function (d) { return x(d.miles); } )
        .attr("y", function (d) { return y(d.gas); } )
        .text(function (d) { return d.year; } )
        .attr('font-size', '10px')
        
    node.selectAll("text")
        .each(position)
        .call(halo);

    //=== x axis groups ===
    const xAxis = d3.axisBottom()
        .scale(x)
        .ticks(7, "s")
        .tickFormat(function(d){{ return d3.format(',')(d) }})

    let xAxisGroup = svg.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis)   
        .attr("transform", `translate(0, ${height})`)

    xAxisGroup.select(".domain").remove()

    //=== y axis groups ===
    const yAxis = d3.axisLeft()
        .scale(y)
        .ticks(12, "s")
        .tickFormat(function(d) { return '$' + d3.format('.2f')(d) })

    // Draw the axis
    let yAxisGroup = svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis)   
        
    yAxisGroup.select(".domain").remove()

    yAxisGroup.selectAll(".tick line")
        .clone()
        .attr("x2", width)
        .attr("stroke-opacity", 0.1) // make it transparent
      
    svg.append("text")
      .attr('x', width - 175)
      .attr('y', height - 7)
      .text("Miles per Person per Year")
      .attr('font-weight', 'bold')
      .attr('font-size',12)
      .call(halo)

    svg.append("text")
      .attr('x', 5)
      .attr('y', 7)
      .attr('font-size',12)
      .text("Cost per Gallon")
      .attr('font-weight', 'bold')
      .call(halo)

})
        
//Helper functions to help style + position
function position(d) {
    const t = d3.select(this);
    switch (d.side) {
        case "top":
        t.attr("text-anchor", "middle").attr("dy", "-0.7em");
        break;
        case "right":
        t.attr("dx", "0.5em")
            .attr("dy", "0.32em")
            .attr("text-anchor", "start");
        break;
        case "bottom":
        t.attr("text-anchor", "middle").attr("dy", "1.4em");
        break;
        case "left":
        t.attr("dx", "-0.5em")
            .attr("dy", "0.32em")
            .attr("text-anchor", "end");
        break;
    }
}

function halo(text) {
    text.select(function() {
        return this.parentNode.insertBefore(this.cloneNode(true), this);
        })
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 4)
        .attr("stroke-linejoin", "round");
}

