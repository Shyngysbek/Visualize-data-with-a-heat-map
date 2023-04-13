let jsonObject = {};
let w = 1400;
let h = 600;
let padding = 60;

document.addEventListener('DOMContentLoaded', function() {
  fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then(response => response.json())
    .then(data => {
    jsonObject = data;
    showHeatMap();
  })
});

function showHeatMap() {
  let allYears = jsonObject.monthlyVariance.map((d) => d.year)
  let baseTemperature = 8.66;
  // let allTemps = jsonObject.monthlyVariance.map((d) => {
  //   return baseTemperature + d.variance;
  // });
  let allMonths = ["January", "February", "March", "April", "May", "June",
"July", "August", "September", "October", "November", "December"];
  // allMonths.forEach((d, i) => {
  //   allMonths[i] = new Date(2000, i);
  // });
  
  let allDates = jsonObject.monthlyVariance.map((d, i) => {
    return new Date(d.year, d.month);
  });
  let monthFormat = d3.timeFormat("%B");
  
  let xScale = d3.scaleLinear().domain([d3.min(allYears), d3.max(allYears)]).range([padding, w - padding]);
  let yScale = d3.scaleBand().domain(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]).range([padding, h - padding]);
  // let yScale = d3.scaleTime().domain([d3.min(allMonths), d3.max(allMonths)]).range([padding, h - padding]);
  
  let xAxis = d3.axisBottom(xScale).ticks(26).tickFormat(d3.format("d"));
  let yAxis = d3.axisLeft(yScale);
  
  let tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .attr("class", "tooltip")
    .style("opacity", 0);
  
  let svg = d3.select("svg")
    // .append("svg")
    .attr("width", w)
    .attr("height", h);
  
  svg.selectAll("rect")
    .data(jsonObject.monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => baseTemperature + d.variance)
    .attr("x", (d, i) => {
    let length = d3.max(allYears) - d3.min(allYears);
    return padding + (((w - (padding * 2)) / length) * (d.year - 1753));
  })
    .attr("y", (d, i) => {
    return padding + ((h - (padding * 2)) / 12) * (d.month - 1) ;
  })
    .attr("width", (d, i) => {
    let length = d3.max(allYears) - d3.min(allYears);
    return (w - (padding * 2)) / length;
  })
    .attr("height", (d, i) => {
    return (h - (padding * 2)) / 12;
  })
    .style("fill", (d, i) => {
    // baseTemperature
    let temp = baseTemperature + d.variance;
    if(temp > 2.8 && temp < 3.9) {return "#87CEFA";}
    else if(temp >= 3.9 && temp < 5.0) { return "#73A5C6";}
    else if(temp >= 5.0 && temp < 6.1) { return "#91BAD6";}
    else if(temp >= 6.1 && temp < 7.2) { return "#BCD2E8";}
    else if(temp >= 7.2 && temp < 8.3 ) { return "#FFFF99";}
    else if(temp >= 8.3 && temp < 9.5) { return "#FCE486";}
    else if(temp >= 9.5 && temp < 10.6) { return "#FFA500";}
    else if(temp >= 10.6 && temp < 11.7) {return "#E3724A";}
    else if(temp >= 11.7) {return "red";}
  })
  .on("mouseover", function(event, d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0.9);
    tooltip
      .html(d.year + " - " + allMonths[d.month - 1] + "</br>" + (baseTemperature + d.variance).toFixed(1) + "℃</br>" + d.variance.toFixed(1) + "℃")
      .style("left", event.pageX + 20 + "px")
      .style("top", event.pageY - 40 + "px");
    tooltip.attr("data-year", d.year);
  })
  .on("mouseout", function(event, d) {
    tooltip
      .transition()
      .duration(400)
      .style("opacity", 0);
  });
  
  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);
  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(yAxis);
  
  let legendRange = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8];
  let legendColors = ["#87CEFA", "#73A5C6", "#91BAD6", "#BCD2E8", "#FFFF99", "#FCE486", "#FFA500", "#E3724A", "red"];
  
  let legend = d3.select("#legend")
    .attr("width", 400)
    .attr("height", 60);
  
  let legendScale = d3.scaleBand().domain(legendRange).range([0, 360]);
  
  let legendAxis = d3.axisBottom(legendScale);
  
  legend.selectAll("rect")
    .data(legendColors)
    .enter()
    .append("rect")
    .attr("x", (d, i) => 40 + (40 * i))
    .attr("y", 0)
    .attr("width", 40)
    .attr("height", 40)
    .style("fill", (d) => d);
  
  legend.append("g")
    .attr("transform", "translate(40, 40)")
    .call(legendAxis);
}