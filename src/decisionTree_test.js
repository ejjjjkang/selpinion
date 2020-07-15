var dataset = {
  nodes: [
    {
      id: 1,
      name: "참여자 소개",
      cx: 3,
      cy: 5
    },
    {
      id: 2,
      name: "인상해야 한다",
      cx: 5,
      cy: 9
    },
    {
      id: 3,
      name: "인상을 반대한다",
      cx: 4,
      cy: 2
    },
    {
      id: 4,
      name: "여러분의 생각은 어떠신가요?",
      cx: 9,
      cy: 5
    }
  ],
  links: [
    {
      source: 1,
      target: 2
    },
    {
      source: 2,
      target: 3
    },
    {
      source: 3,
      target: 4
    }
  ]
};

let width = document.querySelector("#bar-chart").innerWidth;
let height = document.querySelector("#bar-chart").innerHeight;

let svg = d3
  .select("svg")
  .attr("width", width)
  .attr("height", height);

//normalize
let num_w = d3
  .scaleLinear()
  .domain([0, 10])
  .range([1, width]);

let num_h = d3
  .scaleLinear()
  .domain([0, 10])
  .range([1, height]);

let node = svg
  .selectAll("circle")
  .data(dataset.nodes)
  .enter()
  .append("circle")
  .attr("class", "nodes")
  .attr("r", 20)
  .attr("cx", d => {
    let a = num_w(d.cx);
    return a;
  })
  .attr("cy", d => {
    let a = num_h(d.cy);
    return a;
  })
  .attr("fill", d => {
    return "orange";
  })
  .attr("stroke", "black")
  .on("mouseover", handleMouseOver)
  .on("mouseout", handleMouseOut);

//hoverEffect
function handleMouseOver(d, i) {
  d3.select(this)
    .transition()
    .attr("fill", "black");
}
function handleMouseOut(d, i) {
  d3.select(this)
    .transition()
    .attr("fill", "blue");
}
