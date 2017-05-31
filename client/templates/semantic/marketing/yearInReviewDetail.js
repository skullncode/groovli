var inReviewStatsLoaded = new ReactiveVar(false);
var songCountLoaded = new ReactiveVar(false);
var profileContext = new ReactiveVar(null);
var songTimeSpanLoaded = new ReactiveVar(false);
var totalSongCount = new ReactiveVar(0);
var totalSongPlaytime = new ReactiveVar(0);
var totalTimeSpan = new ReactiveVar(0);
var socialText = new ReactiveVar(null);
var userFirstName = new ReactiveVar(null);
var checkProgressFxn = null;

Session.set('topArtists', []);
Session.set('topGenres', []);

Template.yearInReviewDetail.helpers({
	userFirstNameOnly: function()
	{
        return userFirstName.get();
	},
    songsShared: function() {
        return totalSongCount.get() > 0;
    },
    songCount: function() {
      //return Session.get(this._id+'_sc');
        return totalSongCount.get();
    },
    songCountPluralRequired: function() {
        return totalSongCount.get() > 1 || totalSongCount.get() == 0;
    },
    statsLoaded: function() {
        return inReviewStatsLoaded.get();
    },
    topArtists: function() {
        return Session.get('topArtists');
    },
    topGenres: function() {
        return Session.get('topGenres');
    },
    totalPlaytimeInMinutes: function(){
        return totalSongPlaytime.get();
    },
    totalPlaytimeInHours: function(){
        return (totalSongPlaytime.get() / 60).toFixed(1);
    },
    hourPlaytimeVisible: function(){
        return (totalSongPlaytime.get() / 60) > 1;
    },
    totalTimeSpan: function(){
        return totalTimeSpan.get();
    },
    yearCountPluralRequired: function() {
        return totalTimeSpan.get() > 1 || totalTimeSpan.get() == 0;
    },
    yearInReviewURLToBeShared: function() {
        return "https://groovli.com" + FlowRouter.current().path;
    },
    socialTxt: function() {
        //socialText.set("asdfasdfasfasdfadfs");
        return socialText.get();
    }
});

Template.yearInReviewDetail.onCreated(function() {
    setSEODeets("https://groovli.com/images/yirogimage.png");
	var self = this;
	self.autorun(function() {
        self.subscribe("importProgressForSpecificUser", FlowRouter.current().params._id, {onReady: setUpCheckProgress});
	});
});

function setUpCheckProgress() {
    checkProgressFxn = Meteor.setInterval(checkImportProgress, 500);
}

function setSEODeets(imgURL){
    SEO.set({
        title: 'Groovli - Year in Review',
        description: 'What music defined you last year?',
        meta: {
        'property="og:image"': imgURL
        }
    });
}

function pullInDetailsForYearInReview(){
    Meteor.call('getListOfStatsForYearInReview', FlowRouter.current().params._id, function(error,result){
        if(error){
            console.log(error.reason);
        }
        else{
            // do something with result
            console.log('GOT THIS BACK From the server: ');
            console.log(result);
            totalSongCount.set(result.totalSongCount);
            socialText.set(result.socialText);  
            userFirstName.set(result.firstName);
            console.log("this is the social text: ");
            console.log(socialText.get());
            var faveBandList = [];
            var faveGenreList = [];
            var faveBandGenres = result.faveBandGenres;
            _.each(faveBandGenres[0], function(x){
                faveBandList.push({'artistName': x.sa});
            });
            if(!_.isEmpty(faveBandList))
            {
                Session.set('topArtists', faveBandList);
                //topArtistName.set(faveBandList[0].artistName);
                //console.log('top artist name: ' + topArtistName.get());
            }

            _.each(faveBandGenres[1], function(x){
                faveGenreList.push({'genreName': x.name});
            });

            getSpotifyArtistImage(faveBandList);
            if(!_.isEmpty(faveBandList))
            {
                Session.set('topGenres', faveGenreList);
                //topGenreName.set(faveGenreList[0].genrenname);
            }

            totalSongPlaytime.set(result.totalPlayTime);

            totalTimeSpan.set(result.songTimespan);

            inReviewStatsLoaded.set(true);
            //recentSongsLoaded.set(true);
        }
    });
}


var checkImportProgress = function () {
    var x = Meteor.users.findOne(FlowRouter.current().params._id);
    //console.log("this is the found user: ");
    //console.log(x.importProgress);
    updateProgressBar(x.importProgress + 0.10)
    if(x.importProgress >= 0.9)
    {
        Meteor.clearInterval(checkProgressFxn);
        pullInDetailsForYearInReview();
    }
}

function updateProgressBar(prcnt){
    prcnt = prcnt * 100;
    //console.log('updating progress bar with this percentage:' + prcnt);
    $('#pbYIR').progress({
        percent: prcnt
    });
}


Template.yearInReviewDetail.events({
    'click #facebook-login': function(event) {
        //Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'read_stream', 'email', 'publish_actions', 'user_activities', 'user_interests', 'user_friends', 'user_about_me', 'user_status', 'user_posts', 'user_actions.music', 'user_actions.video', 'user_location', 'user_hometown']}, function(err){
          Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'email', 'user_friends', 'user_posts']}, function(err){
            if (err) {
                /*amplitude.logEvent("facebook login failed");
                ga('send', {
                  hitType: 'event',
                  eventCategory: 'landing',
                  eventAction: 'facebook login failed'
                });*/
                console.log('encountered an error while trying to login with facebook');
                console.log(err);
                throw new Meteor.Error("Facebook login failed");
            }
            else
            {
                //after logging in update FB friend list
                console.log('successfully logged in with meteor!!!');
                console.log(Meteor.user());
                //Meteor.call('updateFBFriendList', Meteor.user());
                /*amplitude.logEvent("click login with facebook button");
                ga('send', {
                  hitType: 'event',
                  eventCategory: 'landing',
                  eventAction: 'login with facebook'
                });*/
                FlowRouter.go('/yir/'+Meteor.user()._id);
                //FlowRouter.go('/welcome');
            }
        });
    },
    'click #logout': function(event) {
        //console.log("GOING to log out now!!");
        Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
            }
            else
            {
                //Router.go('/')
                //if(FlowRouter.current().path !== "/")
                //{
                    //console.log("NOT on homepage so will redirect to HOME!");
                    Session.set('ud', null);
                    FlowRouter.go('/yir');
                //}
                //else
                //    console.log('NOT DOING ANYTHING!!');
            }
        });
        return false;
    },
    'click #btnFBMusicalHistory': function(e) {
        //console.log('CLICKED FB yir share button!');
        //console.log(FB);
        FB.init({
            //appId      : '848177241914409', //dev app
            appId      : '1555076711418973', //prod app
            xfbml      : true,
            version    : 'v2.7'
            });
        FB.ui({
            method: 'share',
            mobile_iframe: true,
            href: "https://groovli.com" + FlowRouter.current().path,
        },
        // callback
        function(response) {
        if (response && !response.error_code) {
            //console.log('THIs IS THE RESPONSE!')
            toastr.success('Successfully shared year in review!');
        } else {
            toastr.error('Error while sharing year in review!');
        }
        });
        return true;
  }
})

function getSpotifyArtistImage(artistList){
    var artistImg = '';
    if(!_.isEmpty(artistList))
    {
        //console.log("going to try and get a spotify image for this artist:");
        //console.log(artistList);
        var updatedArtistListWithImages = [];
        _.each(artistList, function(x){
            //console.log('this is the artist we gonna look for:'+ x.artistName);
            var searchQuery = x.artistName;
            var spotifyArtistImageURL = "https://api.spotify.com/v1/search?q="+searchQuery+"&offset=0&limit=3&type=artist";
            Meteor.http.get(spotifyArtistImageURL, function(error, result) {
                if(!error) {
                    // this callback will be called asynchronously
                    // when the response is available
                    //console.log('this is the result from the spotify search:');
                    //console.log(result.data.tracks);
                    //console.log("returning this now:");
                    //console.log(result.data.artists.items);
                    //console.log("going to try and match this result name: "+ result.data.artists.items[0].name.toLowerCase());
                    //console.log('with this name: '+ searchQuery.toLowerCase());
                    if(!_.isEmpty(result) && !_.isEmpty(result.data) && !_.isEmpty(result.data.artists) && !_.isEmpty(result.data.artists.items) && !_.isEmpty(result.data.artists.items[0]) && result.data.artists.items[0].name.toLowerCase() == searchQuery.toLowerCase())
                    {
                        if(!_.isEmpty(result.data.artists.items[0].images) && !_.isEmpty(result.data.artists.items[0].images[0]))
                        {
                            updatedArtistListWithImages.push({'artistName': searchQuery, 'artistImage': result.data.artists.items[0].images[0].url});
                        }
                    }
                    else
                    {
                        //console.log('did not find a matching artist in spotify!!!');
                        //artImg.set(null);
                        updatedArtistListWithImages.push({'artistName': searchQuery, 'artistImage': null})
                    }
                    Session.set('topArtists', updatedArtistListWithImages);
                    //console.log('going to set og images now!!')
                    /*if(!_.isEmpty(updatedArtistListWithImages))
                    {
                        //console.log('NOT EMPTY!!!');
                        //console.log(updatedArtistListWithImages[0].artistImage);
                        setSEODeets(updatedArtistListWithImages[0].artistImage);
                    }
                    else
                    {
                        //console.log("IS EMPTY!!!!!");
                        setSEODeets("https://groovli.com/images/fbogimage.png");                        
                    }*/
                    //blankLPRecent.push({sa: songObj.sa, st: songObj.st, spotifyAlbumArtURL: result.data.tracks.items[0].album.images[2].url})
                    //Session.set("lp_recent",blankLPRecent);           
                    //return result;
                }
                else
                {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.log('REACHED spotify album art ERROR: ');
                    console.log(error);
                    return error;
                }
            });
        });
        /**/
    }
}