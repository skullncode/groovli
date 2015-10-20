var artistProfileContext = new ReactiveVar(null);
var Slices = new Meteor.Collection(null);
Session.setDefault('pieChartSort','none');
Session.setDefault('pieChartSortModifier',undefined);

/*if(Slices.find({}).count() === 0){
	for(i = 0; i < 2; i++)
		Slices.insert({
			value:Math.floor(Math.random() * 100)
		});
}*/

Template.d3ArtistPercentageChart.events({
	/*'click #add':function(){
		Slices.insert({
			value:Math.floor(Math.random() * 100)
		});
	},
	'click #remove':function(){
		var toRemove = Random.choice(Slices.find().fetch());
		Slices.remove({_id:toRemove._id});
	},
	'click #randomize':function(){
		//loop through bars
		Slices.find({}).forEach(function(bar){
			//update the value of the bar
			Slices.update({_id:bar._id},{$set:{value:Math.floor(Math.random() * 100)}});
		});
	},
	'click #toggleSort':function(){
		if(Session.equals('pieChartSort', 'none')){
			Session.set('pieChartSort','asc');
			Session.set('pieChartSortModifier',{sort:{value:1}});
		}else if(Session.equals('pieChartSort', 'asc')){
			Session.set('pieChartSort','desc');
			Session.set('pieChartSortModifier',{sort:{value:-1}});
		}else{
			Session.set('pieChartSort','none');
			Session.set('pieChartSortModifier',{});
		}
	}*/
});

Template.d3ArtistPercentageChart.rendered = function(){
	setupPieChart();
};

Template.d3ArtistPercentageChart.onCreated(function() {
	var self = this;
	self.autorun(function() {
		FlowRouter.watchPathChange();
	    var context = FlowRouter.current();
	    // use context to access the URL state
	    //console.log('%%%%%%%%%%%%%%%%%%%% ROUTE HAS CHANGED!!!!');
	    //console.log(context);
	    artistProfileContext.set(context);
	    //Session.setDefault(context.params._id+'_aCursor', 0);
	    /*self.subscribe('artistObjectForProfilePage', artistProfileContext.get().params._id, {onReady: artistExists});
		self.subscribe('allSongsForSpecificArtist', artistProfileContext.get().params._id, Session.get(artistProfileContext.get().params._id+'_aCursor'));
		self.subscribe('artistsForSite', {onReady: artistSubLoaded});*/
		if(!_.isUndefined(Session.get(artistProfileContext.get().params._id+'_artObj')))
		{
			self.subscribe("counterForArtistSpecificSongs", artistProfileContext.get().params._id, {onReady: artistSpecificCountReady});
        	self.subscribe("counterForAllSongs", Meteor.user()._id, {onReady: totalSongCountReady});        	
        }     
		//updateArtistSongPercentage();
	});
});

function artistSpecificCountReady(){
	Session.set(artistProfileContext.get().params._id+'_sc', Counts.get('songCountForArtistSpecificSongs'));
	//console.log('ARTIST specific song count is: ');
	//console.log(Session.get(artistProfileContext.get().params._id+'_sc'));
	resetSlices();
}

function resetSlices(){
	Slices = new Meteor.Collection(null);
	if(Slices.find({}).count() === 0){
		Slices.insert({
			value:Math.round(((Session.get('_asc') - Session.get(artistProfileContext.get().params._id+'_sc')) / Session.get('_asc')) * 10000) / 100
		});
		Slices.insert({
			value:Math.round((Session.get(artistProfileContext.get().params._id+'_sc') / Session.get('_asc'))* 10000) / 100
		});
	}
	setupPieChart();
}

function totalSongCountReady(){
	Session.set('_asc', Counts.get('songCountForAllSongs'));
	//console.log('ALL song count is: ');
	//console.log(Session.get('_asc'));
}


function setupPieChart(){
	//Width and height
	var w = 300;
	var h = 300;

	var outerRadius = w / 2;
	var innerRadius = 0;
	var arc = d3.svg.arc()
					.innerRadius(innerRadius)
					.outerRadius(outerRadius);
	
	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) {
			return d.value;
		});
	
	//Easy colors accessible via a 10-step ordinal scale
	var color = d3.scale.category10();

	//Create SVG element
	var svg = d3.select("#pieChart")
				.attr("width", w)
				.attr("height", h);
	
	var key = function(d){ 
		return d.data._id;
	};

	Deps.autorun(function(){
		var modifier = {fields:{value:1}};
		var sortModifier = Session.get('pieChartSortModifier');
		if(sortModifier && sortModifier.sort)
			modifier.sort = sortModifier.sort;
		
		//console.log("GOING TO REFRESH PIE CHART NOWW!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		var dataset = Slices.find({},modifier).fetch();
		//console.log("######################## this is the dataset:");
		//console.log(dataset);
		
		var arcs = svg.selectAll("g.arc")
					  .data(pie(dataset), key);

		var newGroups = 
			arcs
				.enter()
				.append("g")
				.attr("class", "arc")
				.attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
		
		//Draw arc paths
		newGroups
			.append("path")
			.attr("fill", function(d, i) {
				return color(i);
			})
			.attr("d", arc);
		
		//Labels
		newGroups
			.append("text")
			.attr("transform", function(d) {
				return "translate(" + arc.centroid(d) + ")";
			})
			.attr("text-anchor", "middle")
			.text(function(d) {
				return d.value;
			});

		arcs
			.transition()
			.select('path')
			.attrTween("d", function(d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					return arc(interpolate(t));
				};
			});
		
		arcs
			.transition()
			.select('text')
			.attr("transform", function(d) {
				return "translate(" + arc.centroid(d) + ")";
			})
			.text(function(d) {
				return d.value;
			});

		arcs
			.exit()
	 		.remove();
	});
}
