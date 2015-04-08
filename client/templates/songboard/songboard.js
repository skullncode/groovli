Template.songboard.rendered = function() {

	//Youtube iFrame API inclusion
	var tag = document.createElement('script');
	tag.src = "https://www.youtube.com/iframe_api";
	tag.type = "text/javascript";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	//MUUT JS inclusion
	tag = document.createElement('script');
	tag.src = "//cdn.muut.com/1/moot.min.js";
	tag.type = "text/javascript";
	firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

	//MUUT CSS inclusion
	tag = document.createElement('link');
	tag.src = "//cdn.muut.com/1/moot.css";
	tag.type = "text/css";
	firstScriptTag = document.getElementsByTagName('link')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


  	//resetSession();
  	Meteor.call('getLatestStoriesFromDBAndFB');
	/*Meteor.setInterval(
		function(){
			console.log('Refreshing and getting latest tracks from social networks.');
			Meteor.call('getLatestStoriesFromDBAndFB');
		}, 60000);*/
};