function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    // console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

// Initialize the dashboard
init();

// create the function for selecting the new person's data
// this function is called from the HTML file
function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
};

// Demographics Panel 
// this function fills in the person's demographic info, pulled from the metadata array.
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    PANEL.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
      var sampleValues = data.samples
    // 4. Create a variable that filters the samples for the object with the desired sample number.
      var filteredSamples = sampleValues.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
      var oneSample = filteredSamples[0];
      // var oneSample = sampleObj[0];
      
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var my_otu_ids = oneSample.otu_ids
      // console.log(my_otu_ids);

      var my_otu_labels = oneSample.otu_labels
      // console.log(my_otu_labels);

      var my_sample_values = oneSample.sample_values

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    my_sample_values.sort((firstNum, secondNum) => secondNum - firstNum);
    // console.log('Sorted with Arrow Function', my_sample_values);
    // get the top 10 OTU_IDs
    var top10 = my_otu_ids.slice(0, 10);
    console.log(top10);

// supposed to chain the slice() method with map() and reverse() functions to retrieve the top10 otu_ids in descending order.

  // var yticks = 

   // 8. Create the trace for the bar chart. 
    var trace1 ={
      x: top10.map(object => object.sample_values),
      y: top10.map(object => object.otu_ids),
      type: "bar",
      orientation: "h"
    };

    var barData = [trace1];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 OTU samples",
      xaxis: {title: "bacteria count"},
      yaxis: {title: "OTU type"}
     };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);
  });
};
