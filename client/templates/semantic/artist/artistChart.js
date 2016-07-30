Template.artistChart.onRendered(function () {

console.log('RENDERED artist chart!!!!');
	var pieData = [];
	var ttg = Session.get('ttg');
	if(!_.isUndefined(ttg))
		var calcValue = 100 / (ttg.length);
	else
		var calcValue = 10;
	
	_.each(ttg, function(x){
		pieData.push({value: calcValue, color: randomColor({luminosity: 'bright', format: 'rgb' }), label: x.name})
	});
	var x = (Session.get(FlowRouter._current.params._id+'_sc') / Session.get('_asc')) * 100;
	var data = [
	    {
	        value: Session.get(FlowRouter._current.params._id+'_sc'),
	        color:"#F7464A",
	        highlight: "#FF5A5E",
	        label: Session.get(FlowRouter._current.params._id+'_artObj').name
	    },
	    {
	        value: Session.get('_asc'),
	        color: "#949FB1",
	        highlight: "#A8B3C5",
	        label: "Other songs on Groovli"
	    }
	];

	var pieOptions = {
		segmentShowStroke : false,
		animateScale : true,
		// String - Template string for single tooltips
    	tooltipTemplate: "<%if (label){%><%=label%><%}%>"
	}
	// Get the context of the canvas element we want to select
	var ctx = document.getElementById("artChart").getContext("2d");
	//new Chart(ctx).Pie(pieData, pieOptions);
	new Chart(ctx).PolarArea(data, pieOptions);
});