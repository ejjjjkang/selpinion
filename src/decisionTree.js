// import { popup } from "./popup";

// var treeData = {
//   name: "Top Level",
//   children: [
//     {
//       name: "Level 2: A",
//       children: [{ name: "Son of A" }, { name: "Daughter of A" }]
//     },
//     {
//       name: "Level 2: A",
//       children: [{ name: "Son of A" }, { name: "Daughter of A" }]
//     },
//     {
//       name: "Level 2: A",
//       children: [{ name: "Son of A" }, { name: "Daughter of A" }]
//     }
//   ]
// };

// // Set the dimensions and margins of the diagram
// var margin = { top: 20, right: 90, bottom: 30, left: 90 };

// let width = document.querySelector("#bar-chart").clientWidth;
// let height = document.querySelector("#bar-chart").clientHeight;

// let svg = d3
//   .select("svg")
//   .attr("width", width + margin.right + margin.left)
//   .attr("height", height + margin.top + margin.bottom);

// var g = svg
//   .append("g")
//   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// // declares a tree layout and assigns the size
// var treemap = d3.tree().size([width, height]);

// //build hierarchy
// var root = d3.hierarchy(treeData, function(d) {
//   return d.children;
// });

// root.x0 = 0;
// root.y0 = width / 2;

// // //collapse
// // root.children.forEach(collapse);

// update(root);

// function collapse(d) {
//   if (d.children) {
//     d._children = d.children;
//     d._children.forEach(collapse);
//     d.children = null;
//   }
// }

// var i = 0;
// var duration_ = 2000;
// var nodes;

// function update(source) {
//   //assign hierarchy in the tree
//   var treeData = treemap(root);
//   nodes = treeData.descendants();
//   var links = treeData.descendants().slice(1); //Top을 제외하고 이후 전부
//   console.log(links);
//   //==================Node==================//

//   var node = g.selectAll("g.node").data(nodes, function(d) {
//     return d.id || (d.id = ++i);
//   });

//   //enter new node at the parent's previous position
//   var nodeEnter = node
//     .enter()
//     .append("g")
//     .attr("class", "node")
//     .attr("transform", function(d) {
//       return "translate(" + source.x0 + "," + source.y0 + ")";
//     });

//   nodeEnter
//     .append("circle")
//     .attr("class", "node")
//     .attr("r", 10)
//     .style("fill", function(d) {
//       return d._children ? "lightsteelblue" : "lightsteelblue";
//     });

//   //update
//   var nodeUpdate = nodeEnter.merge(node);

//   //transition
//   nodeUpdate
//     .transition()
//     .duration(duration_)
//     .attr("transform", function(d) {
//       return "translate(" + d.x + "," + d.y + ")";
//     });

//   //remove any exiting nodes
//   var nodeExit = node
//     .exit()
//     .transition()
//     .duration(duration_)
//     .attr("transform", function(d) {
//       return "translate(" + source.x + "," + source.y + ")";
//     })
//     .remove();

//   nodeExit.select("circle").attr("r", 10);

//   //==================Link==================//

//   //update Link
//   var link = g.selectAll(".link").data(links);

//   // Enter any new links at the parent's previous position.
//   var linkEnter = link
//     .enter()
//     .append("path")
//     .attr("class", "link")
//     .attr("d", function(d) {
//       var a = { y: source.y0, x: source.x0 };
//       return diagonal(a, a);
//     });

//   //update
//   var linkUpdate = linkEnter.merge(link);

//   // Transition back to the parent element position
//   linkUpdate
//     .transition()
//     .duration(duration_)
//     .attr("d", function(d) {
//       return diagonal(d, d.parent);
//     });

//   // Remove any exiting links
//   var linkExit = link
//     .exit()
//     .transition()
//     .duration(duration_)
//     .attr("d", function(d) {
//       var a = { x: source.x, y: source.y };
//       return diagonal(a, a);
//     })
//     .remove();

//   // Store the old positions for transition.
//   nodes.forEach(function(d, i) {
//     //   console.log(d)
//     d.x0 = d.x;
//     d.y0 = d.y;
//   });
// }

// // Creates a curved (diagonal) path from parent to the child nodes
// // switched around all the x's and y's from orig so it's verticle
// function diagonal(s, d) {
//   //console.log('in diag and s = ', s);
//   //console.log('d = ', d)

//   var path = `M ${s.x} ${s.y}
//           C ${(s.x + d.x) / 2} ${s.y},
//             ${(s.x + d.x) / 2} ${d.y},
//             ${d.x} ${d.y}`;

//   return path;
// }

// //hoverEffect
// function handleMouseOver(d, i) {
//   d3.select(this)
//     .transition()
//     .attr("fill", "black");
// }
// function handleMouseOut(d, i) {
//   d3.select(this)
//     .transition()
//     .attr("fill", "blue");
// }

// // Takes an index and an array and finds all the children.
// // returns an array which can be added to children of the root node to
// // make a json thing which can be used to make a d3.hierarchy();
// function getChildren() {
//   var child = [];
// }
