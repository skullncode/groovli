var ytplayer;
var progContainer;
var progBar;
var playerStarted = false;
/*function onYouTubeIframeAPIReady() {
  console.log('inside the jquery load event!');
      player = new YT.Player('sharePlayer',{
        events: {
            'onReady': function(e){ e.target.playVideo(); }
        }
    });
  console.log(player);
}*/

function playerLoaded()
{
  console.log('INSIDE THE PLAYER Loaded method!!!!!');
  ytplayer = new YT.Player('player', {
              playerVars: { 
                'autoplay': 0, 
                'controls': 0,
                'autohide': 1,
                'wmode':'opaque', 
                'enablejsapi': 1, 
                'showinfo': 0, 
                'color': 'white',
                'iv_load_policy': 3,
                'fs': 0
              }
  });
  ytplayer.addEventListener("onStateChange", "onPlayerStateChange");
	ytplayer.addEventListener("onReady", "onPlayerReady"); 
	ytplayer.addEventListener("onError", "onPlayerError"); 
	setInterval(updatePlayerInfo, 250);
	progContainer = document.getElementById('progContainer');
	progBar = document.getElementById('progBar');
  
	progContainer.addEventListener('click', function(e) {
	  console.log("clickedinside prog container at X"+e.offsetX);
	  console.log("clickedinside prog container at Y "+e.offsetY);
	  progBar.style.width = e.offsetX + "px";

	  var selectedPosition = (e.offsetX / progContainer.scrollWidth);

	  var selectedTime = selectedPosition * ytplayer.getDuration();

	  ytplayer.seekTo(selectedTime, true)
    //mixpanel.track("seeked thru song");
    
	}, false);
  
  //console.log(ytplayer);
}

function onPlayerReady() {
    console.log('inside on player ready method!!!');
    Session.set('playerLoaded', true);
    Session.set('playerStarted', false);
    //ytplayer.playVideo();
}

function onPlayerStateChange(event) {
  console.log('this is the current player state:' + event.data);
  var loader = $('img#songLoader');
  if(event.data === 0) {  //video finished playing, so move to next video      
      console.log("VID DONE!");
      var nextBtn = $('.glyphicon-step-forward');
      //mixpanel.track("reached end of song");
      nextBtn.click();
	}
  else if(event.data === -1 || event.data === 3) { //if buffering show loader 
    //console.log(loader);
    loader.css("visibility","visible");
  }
  else if(event.data === 1) { //if playing hide loader
    loader.css("visibility","hidden");
  }
}

function onPlayerError(errorCode) {
  //mixpanel.track("auto error");
  Session.set('SongErroneous', true);
  Session.set('YTErrorCode', errorCode.target.e);
  console.log('ERROR CODE IS: ');
  console.log(errorCode.target.e); 

  /*
  console.log('!!!!ERRONEOUS SHARE is: '+ss.getCurrentID());
  console.log('aeCount is: '+ss.getCS().aeCount);

  if(ss.getLastAction() == "next") // continue in the next direction if bad video found
  {
    var nextBtn = angular.element(document.querySelector('.glyphicon-step-forward'));
    nextBtn.click();
  }
  else if(ss.getLastAction() == "previous") // continue in the previous direction if bad video found
  {
    if(ss.getCurrentHistoryIndex() > 0) // if erroneous video at the beginning of the history then move forward
    {
      var prevBtn = angular.element(document.querySelector('.glyphicon-step-backward'));
      prevBtn.click();
    }
    else
    {
      console.log('erroneous video was the FIRST VIDEO!!!!');
	  var nextBtn = angular.element(document.querySelector('.glyphicon-step-forward'));
      nextBtn.click();      
    }      
  }
  ss = null;*/
}

function stopVideo() {
  ytplayer.stopVideo();
}

// Display information about the current state of the player
function updatePlayerInfo() {
  // Also check that at least one function exists since when IE unloads the
  // page, it will destroy the SWF before clearing the interval.
	//var progressBar = document.getElementById("progressBar");
  //console.log('updating player noww!!!');
	//var inside = document.getElementById('progInside');
	var progBar = document.getElementById('progBar');
	if(ytplayer)
	{
		try
		{
			if(ytplayer.getPlayerState() == 1)
			{
				var currentProgress = (ytplayer.getCurrentTime() / ytplayer.getDuration()) * 100;
				//progressBar.setAttribute("style","width:"+currentProgress + "%");
				//inside.style.width = currentProgress + "%";
        //console.log('this is the current progress: '+ currentProgress);
				progBar.style.width = currentProgress + "%";
				//progressBar.width == currentProgress + "%";

				//console.log("ABSOLUTE VALUE OF CURRENT PROGRESS IS: "+abs(currentProgress));
				if(currentProgress == 100)
				{
					clearInterval(this);
				}
				else if(currentProgress < 1)
				{
          var listName = '';
          if(Session.get('activeTab') === 'me')
          {
            listName = '#mygroovsList';
          }
          else if(Session.get('activeTab') === 'friends')
          {
            listName = '#tastemakersList';
          } 
					var currentScrollOffset = $(listName).scrollTop();//$("#personalVidList").scrollTop();
					$(listName).animate({ scrollTop: $(".thumbnail.shareBrowserItem.selected").offset().top - 140 + currentScrollOffset}, 500);
				}
			}
		}
		catch(err)
		{
			if(err == "TypeError: Object #<HTMLObjectElement> has no method 'getPlayerState'")
			{
				//do nothing
			}
		}
	}
}

function playpauseVideo() {
  var playpauseButton = $('.glyphicon-play');
  console.log('inside playpause method!!! this is the playpausebutton result: '+ playpauseButton.length);
  //ytplayer = document.getElementById("sharePlayer");
  if(playpauseButton.length == 0 || playpauseButton == [] || playpauseButton == undefined || playpauseButton == null)
  {
    //console.log('GOING TO PAUSE now!!!');
    //mixpanel.track("pause song");
    playpauseButton = $('.glyphicon-pause');
    if (ytplayer) {
      ytplayer.pauseVideo();
    }
    playpauseButton.toggleClass('glyphicon-pause glyphicon-play');
  }
  else
  { 
    //console.log('GOING TO PLAY now!!!');
    //mixpanel.track("play song");
    if (ytplayer) {
      ytplayer.playVideo();
    }
    playpauseButton.toggleClass('glyphicon-play glyphicon-pause');
  }  
}

function makeMuutCommentRelatedUpdates(soundID, currentSong) {
  //UPDATE MUUT COMMENTS BOX
  var commentsUniqueID = "https://muut.com/i/groovli/music/comments:" + soundID;
  var pageTitle = '';
  console.log('#$#$#$#$##$#$#$#$#$THIS IS THE COMMENTS UNIQUE ID: ' + commentsUniqueID);
   //CHANGE PAGE TITLE
  if(currentSong.sa === currentSong.st)
    pageTitle = 'groovli - '+ currentSong.sa
  else
    pageTitle = 'groovli - '+ currentSong.sa + ' - ' + currentSong.st;
  $("#muut-custom").replaceWith('<div data-show_title="false" class="muut" id="muut-custom"></div>');
  var conf = {
     url: commentsUniqueID,
     title: pageTitle,
     channel: pageTitle,
     show_online: false,
     upload: false
  };
  $("#muut-custom").muut(conf);
  //UPDATE PAGE TITLE
  $(document).prop('title', pageTitle);
}

function loadVideoById(soundID, currentSong) {
  var playpauseButton = $('.glyphicon-play');
  playpauseButton.toggleClass('glyphicon-play glyphicon-pause');
  console.log('inside the video loader!!!');
	if(ytplayer) {
	  ytplayer.loadVideoById(soundID,0,"large")
	}
  //mixpanel.track("load new YT song");
  //makeMuutCommentRelatedUpdates(soundID, currentSong);
}