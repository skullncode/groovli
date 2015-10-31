Session.setDefault('clkdsrchresult', null);

Template.sSearch.helpers({
  onSongboardPages: function() {
    //console.log('CHECKING FOR FAVE!!!');
    if(Session.get('cr') == '/semanticboard' || Session.get('cr') == '/mygroovs' || Session.get('cr') == '/tastemakers' || Session.get('cr') == '/global')
    	return true;
    else
    {
      //console.log('THERE ARE noooooo FAVES!!!');
      return false;
    }
  },
  activatePopups: function() {
    Meteor.setTimeout(activatePopups, 800);
  },
  notifsEnabled: function() {
    if(!_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().notifsEnabled))
    {
      return Meteor.user().notifsEnabled;
    }
    else
    {
      return true;
    }
  }
});

Template.sSearch.onRendered(function () {
	$('.ui.search')
	  .search({
	    apiSettings: {
	      //url: '//localhost:3000/api/ss/{query}'
	      url: '//groovli.com/api/ss/{query}'
	    },
	    fields: {
	      results : 'apiResults',
	      title   : 'sa',
	      description : 'st'
	    },
	    onSelect: function(result, response) {
	    	//console.log('THIS IS THE RESULT!!:');
	    	//console.log(result);
			Session.set('clkdsrchresult', result);
	        //alert(result);
	        var currentResults = Session.get('usrchResults');
	        currentResults.push(result);
	        Session.set('usrchResults', currentResults);
	        
	        Meteor.setTimeout(playSongFromSearchResult, 500);
	        /*var ytLinkID = result.sl.substring(result.sl.indexOf("v=")+2);
	        loadVideoById(ytLinkID);*/
	    },
	    minCharacters : 3
	  })
	;
});


function playSongFromSearchResult(){
	//console.log("GOING TO PLAYYYYYYYY the selected SONG in the search results:");
	//$('#sresultsTabHeader').click()
	setSongObjectBasedOnSearchResult(Session.get('clkdsrchresult'));
	mixpanel.track('played song from search result');
}

function activatePopups(){
  $('#headerMenuSearchBox').popup();
}