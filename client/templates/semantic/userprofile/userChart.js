Template.userChart.onRendered(function () {

console.log('RENDERED user chart!!!!');
	var pieData = [];
	var ttg = Session.get('ttg');
	if(!_.isUndefined(ttg))
		var calcValue = 100 / (ttg.length);
	else
		var calcValue = 10;
	
	_.each(ttg, function(x){
		pieData.push({value: calcValue, color: randomColor({luminosity: 'bright', format: 'rgb' }), label: x.name})
	});

	var pieOptions = {
		segmentShowStroke : false,
		animateScale : true,
		// String - Template string for single tooltips
    	tooltipTemplate: "<%if (label){%><%=label%><%}%>"
	}
	// Get the context of the canvas element we want to select
	var ctx = document.getElementById("myChart").getContext("2d");
	new Chart(ctx).Pie(pieData, pieOptions);
});