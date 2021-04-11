// Submit change handler
function handleSubmit() {
  
  // Prevent the page from refreshing
  

  // Select the input value from the form
  var dropdownmenu = d3.select("#selDataset");
  var test_id= dropdownmenu.property('value')
  d3.json("data/samples.json").then((data) => {
    for (var i=0; i <data.names.length; i++){
      if(test_id === data.names[i]){
         buildPlot(i)
         return 
      }
  
    }
  
  
  });

};

//create a buildplot function to retrive data and plot all graphs
function buildPlot(index){
  d3.json("data/samples.json").then((data) => {

    console.log(data);
    id_values= data.names
  
    // Add ID#s to dropdown menu
    d3.select('#selDataset').selectAll('option')
        .data(id_values)
        .enter()
        .append('option')
        .text(function(d){
            return d;
            console.log(d);
        });
    
    // get table and demograhics info
      var otu_ids= data.samples[index].otu_ids.slice(0, 10).reverse().map(id => "OTU" + id)
      var values= data.samples[index].sample_values.slice(0, 10).reverse()
      var demo= data.metadata[index]
      var key= Object.keys(demo)
      var obj_values= Object.values(demo)
      var demo_info= d3.select("#sample-metadata")
      

      var trace1 = [{
        type: "bar",
        orientation: "h",
        x: values,
        y: otu_ids
        
      }]
      Plotly.newPlot("bar", trace1); 
      
      for (var i = 0; i< key.length; i++) {
        var li2 = demo_info.append("p").text(`${key[i]}: ${obj_values[i]}`);  
        console.log(li2)
      };

    // get bubble chart info
      var ids= data.samples[index].otu_ids
      var s_values= data.samples[index].sample_values
      var out_labels= data.samples[index].otu_labels
 
      var bubble= [{
        x:ids,
        y: s_values,
        text: out_labels,
        mode: 'markers',
        marker:{
          color: ids,
          size: s_values,
          opacity: [1, 0.8, 0.6, 0.4]

        }
      }]
      Plotly.newPlot('bubble', bubble);

     // get gauge chart info 

     var wash_freq= data.metadata[index].wfreq
     var gauge = [{
      domain: {x: [0, 1], y: [0,1]},
      type: "indicator",
      mode: "gauge+number",
      value: wash_freq,
      title: { text: "Belly Button Washes Per Week" },
      gauge: {
        axis: { range: [0, 9], tickwidth: 0.5, tickcolor: "black" },
        bar: { color: "#ff4500" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "transparent",
        steps: [
          { range: [0, 1], color: "#fe5a1d" },
          { range: [1, 2], color: "#ed872d" },
          { range: [2, 3], color: "#e08d3c" },
          { range: [3, 4], color: "#ff9933" },
          { range: [4, 5], color: "#e3ab57" },
          { range: [5, 6], color: "#e3a857" },
          { range: [6, 7], color: "#ff9f00" },
          { range: [7, 8], color: "#ffa700" },
          { range: [8, 9], color: "#ffb300" }

        ],
      }
    }];

        Plotly.newPlot('gauge', gauge);
  
  });

};
//set up a default chart
buildPlot(0);
// Add event listener for change option
d3.select("#selDataset").on("change", handleSubmit);
