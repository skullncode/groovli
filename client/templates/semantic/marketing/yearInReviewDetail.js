var inReviewStatsLoaded = new ReactiveVar(false);
var songCountLoaded = new ReactiveVar(false);
var profileContext = new ReactiveVar(null);
var songTimeSpanLoaded = new ReactiveVar(false);
var totalSongCount = new ReactiveVar(0);
var totalSongPlaytime = new ReactiveVar(0);
var totalTimeSpan = new ReactiveVar(0);
Session.set('topArtists', []);
Session.set('topGenres', []);

Template.yearInReviewDetail.helpers({
	userFirstNameOnly: function()
	{
        if(!_.isUndefined(Meteor.user()))
		    return Meteor.user().profile.name.split(' ')[0];
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
    totalPlaytime: function(){
        return totalSongPlaytime.get();
    },
    totalTimeSpan: function(){
        return totalTimeSpan.get();
    },
    yearCountPluralRequired: function() {
        return totalTimeSpan.get() > 1 || totalTimeSpan.get() == 0;
    },
});

Template.yearInReviewDetail.onCreated(function() {
	var self = this;
	self.autorun(function() {
        Meteor.call('getListOfStatsForYearInReview', FlowRouter.current().params._id, function(error,result){
            if(error){
                console.log(error.reason);
            }
            else{
                // do something with result
                console.log('GOT THIS BACK From the server: ');
                console.log(result);
                totalSongCount.set(result.totalSongCount);
                var faveBandList = [];
                var faveGenreList = [];
                var faveBandGenres = result.faveBandGenres;
                _.each(faveBandGenres[0], function(x){
                    faveBandList.push({'artistName': x.sa});
                });
                if(!_.isEmpty(faveBandList))
                {
                    Session.set('topArtists', faveBandList);
                }

                _.each(faveBandGenres[1], function(x){
                    faveGenreList.push({'genreName': x.name});
                });

                getSpotifyArtistImage(faveBandList);
                if(!_.isEmpty(faveBandList))
                {
                    Session.set('topGenres', faveGenreList);
                }

                totalSongPlaytime.set(result.totalPlayTime);

                totalTimeSpan.set(result.songTimespan);

                inReviewStatsLoaded.set(true);
                //recentSongsLoaded.set(true);
            }
        });
	});
});

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
                console.log(error);
                throw new Meteor.Error("Facebook login failed");
            }
            else
            {
                //after logging in update FB friend list
                console.log('successfully logged in with meteor!!!');
                Meteor.call('updateFBFriendList', Meteor.user());
                /*amplitude.logEvent("click login with facebook button");
                ga('send', {
                  hitType: 'event',
                  eventCategory: 'landing',
                  eventAction: 'login with facebook'
                });*/
                FlowRouter.go('/songboard');
                //FlowRouter.go('/welcome');
            }
        });
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