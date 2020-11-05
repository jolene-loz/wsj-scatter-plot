//=== Initialization ===
const margin = { top: 100, right: 20, bottom: 40, left: 90 }
const width = 1000 - margin.left - margin.right
const height = 600 - margin.top - margin.bottom; 


d3.csv("driving.csv", d3.autoType).then(data => {

    let svg = d3.select("body").append("svg")
        .attr("width",width + margin.left + margin.bottom)
        .attr("height",height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d=>d.miles))
        .range([0,width]);

    // X axis add
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))

    // Y axis add
    const y = d3.scaleLinear()
        .domain(d3.extent(data, d=> d.gas))
        .range([height,0])

    svg.append("g")
        .call(d3.axisLeft(y))
        
    svg.append("g")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x));
    // svg.append("g")
    //     .call(d3.axisLeft(y).tickFormat(function (d) {
    //         return "$" + d3.format(".2f")(d)
    //     }));

    //connect the dots

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
        .attr("fill", "#FFFFFF");

        // Add dots
        svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.miles); } )
            .attr("cy", function (d) { return y(d.gas); } )
            .attr("r", 3)
            .style("fill", "white")
            .attr("stroke", "black")
            .append("text")
            text((d,i) => {
                d.year })

    //    var labels = svg.selectAll("text")
    //         .data(data)
    //         .enter()
    //         .append("text")
    //         .attr('x', (d,i) => d.miles)
    //         .attr('y', (d,i)=>d.gas)
    //         .
    //         .attr('dy', -10)
    //         .attr('text-anchor', "middle")
    //         .attr('font-size', 10)

        

    })
        

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
    text
        .select(function() {
        return this.parentNode.insertBefore(this.cloneNode(true), this);
        })
        .attr("fill", "none")
        .attr("stroke", "white")
        .attr("stroke-width", 4)
        .attr("stroke-linejoin", "round");
    }



