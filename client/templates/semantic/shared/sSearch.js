Session.setDefault('clkdsrchresult', null);

var searchSource = new ReactiveVar('Groovli');

ytAPI_KEY ='AIzaSyBa-qA8oaPSih-gz3csSqvuXF7JJaWhUEY';
ytSearchAPIURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q={query}&type=video&videoCategoryId=10&key=##API_KEY##"
//siteSearchURL = '//localhost:3000/api/ss/{query}';
siteSearchURL = '//groovli.com/api/ss/{query}';
searchBOXURL = siteSearchURL;
resultsField = 'apiResults';
titleField = 'sa';
descriptionField = 'st';

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
  selectedSearchSource: function() {
  	return searchSource.get();
  }
  /*,
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

    if(searchSource.get() == 'Groovli')
	      {
	      	searchBOXURL = siteSearchURL;
	      }
	      else if(searchSource.get() == 'YouTube')
	      {
	      	searchBOXURL == ytSearchAPIURL.replace('##API_KEY##', ytAPI_KEY);
	      }
	      Session.set('srcSrc',searchBOXURL);
  }*/
});

Template.sSearch.onRendered(function () {
	initiateSearchAPI();
	$('.ui.dropdown.headerMenuSearchSource').dropdown({
	    action: 'select',
	    onChange: function(value, text, $selectedItem) {
	      // custom action
	      searchSource.set(text);
	      initiateSearchAPI();
	    }
	  });
	
	
});

function initiateSearchAPI() {
	//console.log('gonna reinitiate search!!!');
	if(searchSource.get() == 'Groovli')
	{
		searchBOXURL = siteSearchURL;
		$('#headerMenuSearchBox')
		  .search({
		    apiSettings: {
		    	url: siteSearchURL,
		    	onResponse: function(ytResponse) {
					//console.log('THIIIIIIIIIIIIIS Is the localhost response: ');
					//console.log(ytResponse);
					// translate localhost API response to work with search
					/*$.each(ytResponse.items, function(index, item) {
					  if(index >= maxResults) {
					    return false;
					  }
					  // add result to category
					  response.results.push({
					    title       : item.snippet.title,
					    url         : 'https://www.youtube.com/watch?v='+item.id.videoId,
					    image       : item.snippet.thumbnails.default.url
					  });
					});*/
					return ytResponse;
				}
		      //url: '//localhost:3000/api/ss/{query}'
		      //url: '//groovli.com/api/ss/{query}'
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
		    cache: false,
		    minCharacters : 3
		  });
	}
	else if(searchSource.get() == 'YouTube')
	{
		//searchBOXURL = ytSearchAPIURL.replace('##API_KEY##', ytAPI_KEY);
		$('#headerMenuSearchBox')
		  .search({
		    apiSettings: {
		    	url: ytSearchAPIURL.replace('##API_KEY##', ytAPI_KEY),
				onResponse: function(ytResponse) {
					var
					  response = {
					    results : []
					  }
					  maxResults = 5
					;
					// translate YouTube API response to work with search
					$.each(ytResponse.items, function(index, item) {
					  if(index >= maxResults) {
					    return false;
					  }
					  // add result to category
					  response.results.push({
					    title       : item.snippet.title,
					    url         : 'https://www.youtube.com/watch?v='+item.id.videoId,
					    image       : item.snippet.thumbnails.default.url,
					    songObject  : item
					  });
					});
					return response;
				}
		      //url: '//localhost:3000/api/ss/{query}'
		      //url: '//groovli.com/api/ss/{query}'
		    },
		    onSelect: function(result, response) {
		    	//console.log('THIS IS THE RESULT!!:');
		    	//console.log(result);
		    	Session.set('selYTsrchRes', result);
		    	mixpanel.track('preview song from YouTube before sharing', {
		          songObject: result,
		          type: 'yt'
		        });
				$('.ui.modal.previewYouTubeSongFromSearch').modal({
					onHide: function () {
						Session.set('selYTsrchRes', null);
						$('#headerSearchBoxText').val("");
						return true;
					},
					onDeny: function(){
						Session.set('selYTsrchRes', null);
						$('#headerSearchBoxText').val("");
						return true;
					},
					onApprove: function () {
						Session.set('selYTsrchRes', null);
						shareFromSearchResultToFacebook(result);
						$('#headerSearchBoxText').val("");
						return true;
					},
				  transition: 'horizontal flip'
				}).modal('show');
		    	//shareFromSearchResultToFacebook(result);
		    },
		    cache: false,
		    minCharacters : 3
		  });
	}
}


function playSongFromSearchResult(){
	//console.log("GOING TO PLAYYYYYYYY the selected SONG in the search results:");
	//$('#sresultsTabHeader').click()
	setSongObjectBasedOnSearchResult(Session.get('clkdsrchresult'));
	mixpanel.track('played song from search result');
}

function shareFromSearchResultToFacebook(ytSongObject){
	if(!_.isUndefined(ytSongObject))
    {
      //console.log(FB);
      FB.init({
            //appId      : '848177241914409', //dev app
            appId      : '1555076711418973', //prod app
            xfbml      : true,
            version    : 'v2.2'
          });
      FB.ui({
        method: 'share',
        href: ytSongObject.url,
      },
      // callback
      function(response) {
        if (response && !response.error_code) {
          //console.log('THIs IS THE RESPONSE!')
          /*var sharedFBObject = {
            storyTitle: '',
            uid: Meteor.user().services.facebook.id,
            msgWithStory: 'shared from Groovli',
            storyLink: cs.sl,
            systemDate: new moment().unix()
          };*/
          /*Meteor.call('insertNewSong',sharedFBObject, 'FB', 'YOUTUBE');*/ // COMMENTED OUT NOW as song is automatically being pulled in via FB
          //updateSongSourceTabInHistory(sharedFBObject);
          mixpanel.track('shared song to FB FROM YOUTUBE');
          toastr.success('Song shared successfully!');
        } else {
          toastr.error('Error while sharing song!');
        }
      });
    }
    return true;
}
/*
function activatePopups(){
  $('#headerMenuSearchBox').popup({position : 'left center'});
}*/