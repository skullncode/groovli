FlowRouter.route( '/404', {
  action: function() {
    //console.log('GOING TO RENDER Semantic HOME!!');
    Session.set('cr', '/404');
    mixpanel.track("NAVIGATED TO: 404 / not found page");
    BlazeLayout.render( 'semanticLayout', { 
      header: 'semanticHeader',
      main: 'notFound',
      footer: 'semanticFooter'
      //sidebar: 'semantictabs'/*,
      //footer: '_footer'
    }); 
  },
  name: '404'
});

FlowRouter.route( '/terms', {
  action: function() {
    //console.log('GOING TO RENDER Semantic HOME!!');
    Session.set('cr', '/terms');
    mixpanel.track("NAVIGATED TO: terms & conditions page");
    BlazeLayout.render( 'semanticLayout', { 
      header: 'semanticHeader',
      main: 'terms',
      footer: 'semanticFooter'
      //sidebar: 'semantictabs'/*,
      //footer: '_footer'
    }); 
  },
  name: 'terms'
});

FlowRouter.route( '/privacypolicy', {
  action: function() {
    //console.log('GOING TO RENDER Semantic HOME!!');
    Session.set('cr', '/privacypolicy');
    mixpanel.track("NAVIGATED TO: privacy policy page");
    BlazeLayout.render( 'semanticLayout', { 
      header: 'semanticHeader',
      main: 'privacy',
      footer: 'semanticFooter'
      //sidebar: 'semantictabs'/*,
      //footer: '_footer'
    }); 
  },
  name: 'privacypolicy'
});

/*MERGED web and cordova routes for landing page - commented out for now as mobile dev will happen later
FlowRouter.route( '/', {
  action: function() {
    //console.log('GOING TO RENDER Semantic HOME!!');
    if(Meteor.isCordova)
    {
      //Session.set('cr', '/semanticroot');
      BlazeLayout.render( 'mobileLayout', { 
        //header: 'sheader',
        main: 'mobLandingPage'
        //sidebar: 'semantictabs'/*,
        //footer: '_footer'
      });
    }
    else
    {
      Session.set('cr', '/semanticroot');
      mixpanel.track("NAVIGATED TO: landing page");
      BlazeLayout.render( 'landingLayout', { 
        //header: 'sheader',
        main: 'semanticLanding'
        //sidebar: 'semantictabs'/*,
        //footer: '_footer'
      }); 
    }
  },
  name: 'semanticroot'
});*/

FlowRouter.route( '/', {
  action: function() {
    //console.log('GOING TO RENDER Semantic HOME!!');
    Session.set('cr', '/semanticroot');
    mixpanel.track("NAVIGATED TO: landing page");
    BlazeLayout.render( 'landingLayout', { 
      //header: 'sheader',
      main: 'semanticLanding'
      //sidebar: 'semantictabs'/*,
      //footer: '_footer'
    }); 
  },
  name: 'semanticroot'
});

/*FlowRouter.route( '/welcome', {
  action: function() {
    Session.set('cr', '/welcome');
    mixpanel.track("NAVIGATED TO: welcome page");
    BlazeLayout.render( 'welcomeLayout', { 
      header: 'semanticHeader',
      main: 'welcomePage',
      footer: 'semanticFooter'
    }); 
  },
  name: 'welcome'
});*/

FlowRouter.route( '/songboard', {
  triggersEnter: [requireLogin],
  action: function() {
    //console.log('GOING TO RENDER Semantic songboard TEMPLATE!!!');
    Session.set('cr', '/semanticboard');
    mixpanel.track("NAVIGATED TO: songboard page");
    BlazeLayout.render( 'songboardLayout', { 
      header: 'semanticHeader',
      main: 'splayer',
      sidebar: 'semantictabs',
      footer: 'semanticFooter'/**/
    }); 
  },
  name: 'semanticboard'
});

FlowRouter.route( '/mygroovs', {
  triggersEnter: [requireLogin],
  action: function() {
    //console.log('GOING TO RENDER Semantic my groovs TEMPLATE!!!');
    Session.set('cr', '/mygroovs');
    mixpanel.track("NAVIGATED TO: My Groovs page");
    BlazeLayout.render( 'songboardLayout', { 
      header: 'semanticHeader',
      main: 'splayer',
      sidebar: 'mygroovTabs',
      footer: 'semanticFooter'
    }); 
  },
  name: 'mygroovs'
});

FlowRouter.route( '/tastemakers', {
  triggersEnter: [requireLogin],
  action: function() {
    //console.log('GOING TO RENDER Semantic tastemakers TEMPLATE!!!');
    Session.set('cr', '/tastemakers');
    mixpanel.track("NAVIGATED TO: Tastemakers page");
    BlazeLayout.render( 'songboardLayout', { 
      header: 'semanticHeader',
      main: 'splayer',
      sidebar: 'tasteMakersTabs',
      footer: 'semanticFooter'
    }); 
  },
  name: 'tastemakerspage'
});

FlowRouter.route( '/global', {
  triggersEnter: [requireLogin],
  action: function() {
    //console.log('GOING TO RENDER Semantic global TEMPLATE!!!');
    Session.set('cr', '/global');
    mixpanel.track("NAVIGATED TO: Global page");
    BlazeLayout.render( 'songboardLayout', { 
      header: 'semanticHeader',
      main: 'splayer',
      sidebar: 'globalTabs',
      footer: 'semanticFooter'
    }); 
  },
  name: 'globalpage'
});

FlowRouter.route('/profile/:_id', {
  triggersEnter: [requireLogin],
  action: function(params) {
    //console.log("Yeah! Going to the Profile page for:", params._id);
    Session.set('cr', '/profile');
    BlazeLayout.render( 'semanticProfileLayout', { 
      header: 'semanticHeader',
      main: 'sprofile',
      sidebar: 'profileSidebar',
      footer: 'semanticFooter'
    }); 
  },
  name: 'profile'
});

FlowRouter.route('/artist/:_id', {
  triggersEnter: [requireLogin],
  action: function(params) {
    //console.log("Yeah! Going to the ARTIST page for:", params._id);
    Session.set('cr', '/artist');
    BlazeLayout.render( 'semanticArtistProfileLayout', { 
      header: 'semanticHeader',
      main: 'semanticArtistProfile',
      //sidebar: 'profileSidebar',
      footer: 'semanticFooter'
    }); 
  },
  name: 'artist'
});

FlowRouter.route('/genre/:_id', {
  triggersEnter: [requireLogin],
  action: function(params) {
    //console.log("Yeah! Going to the GENRE page for:", params._id);
    Session.set('cr', '/genre');
    BlazeLayout.render( 'semanticArtistProfileLayout', { 
      header: 'semanticHeader',
      main: 'semanticGenreProfile',
      sidebar: 'genrePageSidebar',
      footer: 'semanticFooter'
    }); 
  },
  name: 'genre'
});

//eagle eye - users
FlowRouter.route('/ee_users/', {
  triggersEnter: [requireLogin],
  action: function(params) {
    //console.log("Yeah! Going to the Profile page for:", params._id);
    Session.set('cr', '/ee_users');
    BlazeLayout.render( 'semanticProfileLayout', { 
      header: 'semanticHeader',
      main: 'semanticUserMaster',
      //sidebar: 'messagingSidebar',
      footer: 'semanticFooter'
    }); 
  },
  name: 'ee_users'
});

//eagle eye - existing songs
FlowRouter.route('/ee_existing/', {
  triggersEnter: [requireLogin],
  action: function(params) {
    //console.log("Yeah! Going to the Profile page for:", params._id);
    Session.set('cr', '/ee_existing');
    BlazeLayout.render( 'semanticProfileLayout', { 
      header: 'semanticHeader',
      main: 'reviewExistingSongs',
      //sidebar: 'messagingSidebar',
      footer: 'semanticFooter'
    }); 
  },
  name: 'ee_existing'
});

//eagle eye - pending songs
FlowRouter.route('/ee_pending/', {
  triggersEnter: [requireLogin],
  action: function(params) {
    //console.log("Yeah! Going to the Profile page for:", params._id);
    Session.set('cr', '/ee_pending');
    BlazeLayout.render( 'semanticProfileLayout', { 
      header: 'semanticHeader',
      main: 'reviewPendingSongs',
      //sidebar: 'messagingSidebar',
      footer: 'semanticFooter'
    }); 
  },
  name: 'ee_pending'
});

//eagle eye - invalid songs
FlowRouter.route('/ee_invalid/', {
  triggersEnter: [requireLogin],
  action: function(params) {
    //console.log("Yeah! Going to the Profile page for:", params._id);
    Session.set('cr', '/ee_invalid');
    BlazeLayout.render( 'semanticProfileLayout', { 
      header: 'semanticHeader',
      main: 'reviewInvalidSongs',
      //sidebar: 'messagingSidebar',
      footer: 'semanticFooter'
    }); 
  },
  name: 'ee_invalid'
});

//eagle eye - review artists
FlowRouter.route('/ee_artists/', {
  triggersEnter: [requireLogin],
  action: function(params) {
    //console.log("Yeah! Going to the Profile page for:", params._id);
    Session.set('cr', '/ee_artists');
    BlazeLayout.render( 'semanticProfileLayout', { 
      header: 'semanticHeader',
      main: 'semanticReviewArtists',
      //sidebar: 'messagingSidebar',
      footer: 'semanticFooter'
    }); 
  },
  name: 'ee_artists'
});

//eagle eye - review genes
FlowRouter.route('/ee_genres/', {
  triggersEnter: [requireLogin],
  action: function(params) {
    //console.log("Yeah! Going to the Profile page for:", params._id);
    Session.set('cr', '/ee_genres');
    BlazeLayout.render( 'semanticProfileLayout', { 
      header: 'semanticHeader',
      main: 'semanticReviewGenres',
      //sidebar: 'messagingSidebar',
      footer: 'semanticFooter'
    }); 
  },
  name: 'ee_genres'
});

//eagle eye - review all messages
FlowRouter.route('/ee_msgs/', {
  triggersEnter: [requireLogin],
  action: function(params) {
    //console.log("Yeah! Going to the Profile page for:", params._id);
    Session.set('cr', '/ee_msgs');
    BlazeLayout.render( 'semanticProfileLayout', { 
      header: 'semanticHeader',
      main: 'reviewMessages',
      //sidebar: 'messagingSidebar',
      footer: 'semanticFooter'
    }); 
  },
  name: 'ee_msgs'
});

//eagle eye - review all comments
FlowRouter.route('/ee_comments/', {
  triggersEnter: [requireLogin],
  action: function(params) {
    //console.log("Yeah! Going to the Profile page for:", params._id);
    Session.set('cr', '/ee_comments');
    BlazeLayout.render( 'semanticProfileLayout', { 
      header: 'semanticHeader',
      main: 'reviewComments',
      //sidebar: 'messagingSidebar',
      footer: 'semanticFooter'
    }); 
  },
  name: 'ee_comments'
});

//eagle eye - review all comments
FlowRouter.route('/ee_usrTastemakers/', {
  triggersEnter: [requireLogin],
  action: function(params) {
    //console.log("Yeah! Going to the Profile page for:", params._id);
    Session.set('cr', '/ee_usrTastemakers');
    BlazeLayout.render( 'semanticProfileLayout', { 
      header: 'semanticHeader',
      main: 'reviewUsrTastemakerObjects',
      //sidebar: 'messagingSidebar',
      footer: 'semanticFooter'
    }); 
  },
  name: 'ee_usrTastemakers'
});

FlowRouter.route('/messages/', {
  triggersEnter: [requireLogin],
  action: function(params) {
    //console.log("Yeah! Going to the Profile page for:", params._id);
    Session.set('cr', '/messages');
    BlazeLayout.render( 'messagesLayout', { 
      header: 'semanticHeader',
      main: 'messagesForUser',
      sidebar: 'messagingSidebar',
      footer: 'semanticFooter'
    }); 
  },
  name: 'messages'
});

FlowRouter.route('/messages/:_id', {
  triggersEnter: [requireLogin],
  action: function(params) {
    //console.log("Yeah! Going to the Profile page for:", params._id);
    Session.set('cr', '/messages/:_id');
    BlazeLayout.render( 'messagesLayout', { 
      header: 'semanticHeader',
      main: 'messagesForUser',
      sidebar: 'messagingSidebar',
      footer: 'semanticFooter'
    }); 
  },
  name: 'specificUserMessages'
});

FlowRouter.notFound = {
    action: function() {
      FlowRouter.go('/404');
    }
};

function regexEscape(s) {  
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}


function requireLogin() {
  //console.log('TESTING if logged in or not!');
  //console.log(Meteor.user());
  if (!_.isNull(Meteor.user())) {
    //console.log('METEOR USER EXISTS!!!');
    if (Meteor.loggingIn()) {
      //console.log('Still in the process of logging in so rendering loading template!');
      BlazeLayout.render('appLayout', {content: 'loading'});
    } else {
      //this.render('accessDenied');
      //console.log('NOT STILL LOGGING IN, ready to move on!!!');
      //FlowRouter.go('/');
    }
  }
  else {
      FlowRouter.go('/');
  } 
}

function generateMongoSelectorForFriends(userObj) {
    //console.log("GOING TO GET mongo selector for friends songs!!!!");
    var counter = 0;
    var selector = "";
    var ender = "]}";
    var query = {};
    
    var userSelf = {
      "sharedBy.uid": userObj.services.facebook.id
    };

    query["$nor"] = [];

    //first add self ID for exclusion from tastemaker list
    query["$nor"].push(userSelf);

    //console.log('##################################### this is the unfollowed friends length: ');
    //console.log(Meteor.user().unfollowedFriends);
    //if friends are unfollowed they need to be excluded from the tastemaker list also
    if(!_.isUndefined(userObj.unfollowedFriends))
    {
      if(userObj.unfollowedFriends.length > 0)
      {
        while(counter < userObj.unfollowedFriends.length)
        {
          var unfollowedFriendObj = {
            "sharedBy.uid": userObj.unfollowedFriends[counter].fbid
          };
          query["$nor"].push(unfollowedFriendObj);
          counter++;
        }
      }
    }

    counter = 0;

    if(!_.isUndefined(userObj.tastemakers) && !_.isEmpty(userObj.tastemakers))
    {
      query["$or"] = [];
      if(userObj.tastemakers.length > 0)
      {
        while(counter < userObj.tastemakers.length)
        {
            var additional = {
              "sharedBy.uid": userObj.tastemakers[counter].fbid
            }
            query["$or"].push(additional);
          //}

          counter++;
        }
      }
    }
    else
    {
      //console.log('NOOOOOOOOOOOOOOOOOOO TASTEMAKERS FOR THIS USER:');
      query["$or"] = [];
      //use a fake user to simplify not selecting anyone if tastemakers is empty
      var fakeUser = {
        "sharedBy.uid": String('testid_willnever_betrue')
      }
      query["$or"].push(fakeUser);
    }

    //console.log('THIS IS THE FINAL SELECTOR THAT WILL BE USED!!!!!');
    //console.log(query);

    return query;
}


function getMongoSelectorForGlobal(userObj) {
  var counter = 0;
  var selector = "";
  var ender = "]}";
  var query = {};

  var userSelf = {
    "sharedBy.uid": userObj.services.facebook.id
  };

  query["$nor"] = [];

  //first add self ID for exclusion from Global list
  query["$nor"].push(userSelf);


  //if(!_.isUndefined(Meteor.user().fbFriends)) {
  if(!_.isUndefined(userObj.tastemakers) && !_.isEmpty(userObj.tastemakers)) {
    //then add all of user's friends for exclusion from Global list
    //while(counter < Meteor.user().fbFriends.length)
    while(counter < userObj.tastemakers.length)
    {
      //var unfollowedFriends = Meteor.user().unfollowedFriends;
      //if user is an unfollowed friend, i.e not showing up in the unfollowed friend lsit, then only they should be added to the NOR list for the global list
      //if((!_.isUndefined(unfollowedFriends) && _.isUndefined(_.findWhere(Meteor.user().unfollowedFriends, {fbid: Meteor.user().fbFriends[counter].fbid}))) || (_.isUndefined(unfollowedFriends)))
      //{
        var additional = {
          //"sharedBy.uid": Meteor.user().fbFriends[counter].fbid
          "sharedBy.uid": userObj.tastemakers[counter].fbid
        };
        query["$nor"].push(additional);
      //}

      counter++;
    }
  }

  //console.log('THIS IS THE FINAL SELECTOR THAT WILL BE USED FOR THE GLOBAL LIST!!!!!');
  //console.log(query);

  return query;
}


function addSongValidatorsToSelector(sel, mode){
  if(_.isUndefined(sel["$and"]) && mode === 'tastemakers') //only initialize it if not already initialized!
    sel["$and"] = [];

  if(mode === 'tastemakers')
  {
    if(_.isUndefined(sel["$or"])) //only initialize it if not already initialized!
      sel["$or"] = [];

    var orObject = {};
    orObject["$or"] = [];
    orObject["$or"].push({iTunesValid:'VALID'});
    orObject["$or"].push({LFMValid:'VALID'});
    orObject["$or"].push({manualApproval:'VALID'});
    //VALID song selectors 
    sel["$and"].push(orObject);
  }
  else if(mode === 'global')
  {
    if(_.isUndefined(sel["$or"])) //only initialize it if not already initialized!
      sel["$or"] = [];

    sel["$or"].push({iTunesValid:'VALID'});
    sel["$or"].push({LFMValid:'VALID'});
    sel["$or"].push({manualApproval:'VALID'});
  }

  return sel;
}

function checkIfUserIsFollowedByLoggedinUser(loggedInUser, selectedUserID){
  if(_.isUndefined(_.findWhere(loggedInUser.tastemakers, {'fbid': selectedUserID})))
    return false;
  else
    return true;
}

if (Meteor.isServer) {
  //API routes
  //SS - song search
  JsonRoutes.add("get", "/api/ss/:_query", function (req, res, next) {
    var searchQuery = req.params._query;
    searchQuery = regexEscape(searchQuery);
    //console.log('THIS IS THE search query:');
    //console.log(searchQuery);
    //var result = Songs.find({$or: [{"st": {$regex: new RegExp('^' + searchQuery + '$', 'i')}},{"sa": {$regex: new RegExp('^' + searchQuery + '$', 'i')}}], $and: [{$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]}]}, {limit: 5}).fetch();
    var result = Songs.find({$or: [{"st": {$regex: new RegExp(searchQuery, 'i')}},{"sa": {$regex: new RegExp(searchQuery, 'i')}}], $and: [{$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]}]}, {limit: 5}).fetch();
    var formattedResult = {"apiResults": result};
    //console.log("THIS IS THE formatted RESULT FOR THE API:");
    //console.log(formattedResult);
    /*mixpanel.track('SEARCH API: searched for a song', {
          query: searchQuery
        });*/
    JsonRoutes.sendResult(res, 200, formattedResult);
  });

  //Mobile - get songs for "My groovs"
  JsonRoutes.add("get", "/api/mobile/myg/:_email/:_accessToken/:_cursorSkip", function (req, res, next) {
    var email = req.params._email;
    var userAccessToken = req.params._accessToken;
    var cursorSkipValue = req.params._cursorSkip;
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("for a MY SONGS request tHIS IS THE EMAIL ID: ");
    console.log(email);
    console.log("THIS IS THE access token: ");
    console.log(userAccessToken);
    
    var userSongsRequiredFor = Meteor.users.find({ $and: [{ 'services.facebook.email': email }, { 'mobileFBToken': userAccessToken }]}).fetch();
    //var result = Songs.find({$or: [{"st": {$regex: new RegExp(searchQuery, 'i')}},{"sa": {$regex: new RegExp(searchQuery, 'i')}}], $and: [{$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]}]}, {limit: 5}).fetch();
    //var formattedResult = {"apiResults": result};
    //console.log("THIS IS THE formatted RESULT FOR THE API:");
    //console.log(formattedResult);
    /*mixpanel.track('SEARCH API: searched for a song', {
          query: searchQuery
        });*/
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#########FOUND this USER for those deets; going to return songs now!!!");
    console.log(userSongsRequiredFor[0]._id);
    if(_.isEmpty(userSongsRequiredFor))
    {
      console.log("#########found no songs and user for those supplied details!");
      JsonRoutes.sendResult(res, 200, {'apiResults': 'no user found for those details'});
    }
    else
    {
      /*Meteor.call('getMyGroovsForMobileApp', userSongsRequiredFor[0]._id, cursorSkipValue, function(error, result) {
        if(error)
        {
          console.log('Encountered error while trying to get songs for a specific user!');
          JsonRoutes.sendResult(res, 200, {"apiResults": JSON.stringify(error)});
        }
        else
        {
          console.log('Successfully got songs for this user!!!!');
          //console.log(userSongsRequiredFor[0]._id)
          console.log(result);
          var formattedResult = {"apiResults": result};
          JsonRoutes.sendResult(res, 200, formattedResult);
        }
      });*/
      var options = {
        fields: {
        "songSearchText": 0, 
        "aeCount": 0, 
        "meCount": 0, 
        "iTunesValid": 0, 
        "LFMValid": 0, 
        "cleanedTrackSearchQuery": 0, 
        "wuzzyFactor": 0, 
        "error": 0, 
        "LFMLargeAlbumArt": 0, 
        "LFMMediumAlbumArt": 0, 
        /*"iTunesMediumAlbumArt": 0, 
        "iTunesLargeAlbumArt": 0,*/
        "iTunesAlbumURL": 0, 
        "iTunesAlbumPrice": 0,
        "iTunesPriceCurrency": 0,
        "iTunesTrackPrice": 0,
        "iTunesTrackURL": 0,
        "discCount": 0,
        "discNumber": 0
      },
      sort: {'sharedBy.systemDate': -1 },
      skip: Number(cursorSkipValue),
      limit: 50};
      var result = Songs.find({"sharedBy._id": userSongsRequiredFor[0]._id,$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]},options).fetch();
      //var result = Songs.find({"sharedBy._id": userSongsRequiredFor[0]._id},{sort: {'sharedBy.systemDate': -1 }, skip: Number(cursorSkip), limit: 50}).fetch();
      //console.log("with these options: ");
      //console.log(options);
      //var result = Songs.find({"sharedBy._id": userSongsRequiredFor[0]._id}, options).fetch();
      console.log("#########locally got these songs from the API:");
      console.log(result);
      var formattedResult = {"apiResults": result};
      JsonRoutes.sendResult(res, 200, formattedResult);
    }
  });

  //Mobile - get songs for "Tastemakers groovs"
  JsonRoutes.add("get", "/api/mobile/tstg/:_email/:_accessToken/:_cursorSkip", function (req, res, next) {
    var email = req.params._email;
    var userAccessToken = req.params._accessToken;
    var cursorSkipValue = req.params._cursorSkip;
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("for a Tastemaker SONGS request tHIS IS THE EMAIL ID: ");
    console.log(email);
    console.log("THIS IS THE access token: ");
    console.log(userAccessToken);
    
    var userSongsRequiredFor = Meteor.users.find({ $and: [{ 'services.facebook.email': email }, { 'mobileFBToken': userAccessToken }]}).fetch();
    //var result = Songs.find({$or: [{"st": {$regex: new RegExp(searchQuery, 'i')}},{"sa": {$regex: new RegExp(searchQuery, 'i')}}], $and: [{$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]}]}, {limit: 5}).fetch();
    //var formattedResult = {"apiResults": result};
    //console.log("THIS IS THE formatted RESULT FOR THE API:");
    //console.log(formattedResult);
    /*mixpanel.track('SEARCH API: searched for a song', {
          query: searchQuery
        });*/
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#########FOUND this USER for those deets; going to return songs now!!!");
    console.log(userSongsRequiredFor[0]._id);
    if(_.isEmpty(userSongsRequiredFor))
    {
      console.log("#########found no songs and user for those supplied details!");
      JsonRoutes.sendResult(res, 200, {'apiResults': 'no user found for those details'});
    }
    else
    {
      var options = {
        fields: {
        "songSearchText": 0, 
        "aeCount": 0, 
        "meCount": 0, 
        "iTunesValid": 0, 
        "LFMValid": 0, 
        "cleanedTrackSearchQuery": 0, 
        "wuzzyFactor": 0, 
        "error": 0, 
        "LFMLargeAlbumArt": 0, 
        "LFMMediumAlbumArt": 0, 
        /*"iTunesMediumAlbumArt": 0, 
        "iTunesLargeAlbumArt": 0,*/
        "iTunesAlbumURL": 0, 
        "iTunesAlbumPrice": 0,
        "iTunesPriceCurrency": 0,
        "iTunesTrackPrice": 0,
        "iTunesTrackURL": 0,
        "discCount": 0,
        "discNumber": 0
      },
      sort: {'sharedBy.systemDate': -1 },
      skip: Number(cursorSkipValue),
      limit: 50};
      var finalTastemakerSel = addSongValidatorsToSelector(generateMongoSelectorForFriends(userSongsRequiredFor[0]), "tastemakers");
      var result = Songs.find(finalTastemakerSel, options).fetch();
      //var result = Songs.find({"sharedBy._id": userSongsRequiredFor[0]._id},{sort: {'sharedBy.systemDate': -1 }, skip: Number(cursorSkip), limit: 50}).fetch();
      //console.log("with these options: ");
      //console.log(options);
      //var result = Songs.find({"sharedBy._id": userSongsRequiredFor[0]._id}, options).fetch();
      console.log("#########locally got these tastemaker songs from the API:");
      console.log(result);
      var formattedResult = {"apiResults": result};
      JsonRoutes.sendResult(res, 200, formattedResult);
    }
  });

  //Mobile - get songs for "global groovs"
  JsonRoutes.add("get", "/api/mobile/glg/:_email/:_accessToken/:_cursorSkip", function (req, res, next) {
    var email = req.params._email;
    var userAccessToken = req.params._accessToken;
    var cursorSkipValue = req.params._cursorSkip;
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("for a Tastemaker SONGS request tHIS IS THE EMAIL ID: ");
    console.log(email);
    console.log("THIS IS THE access token: ");
    console.log(userAccessToken);
    
    var userSongsRequiredFor = Meteor.users.find({ $and: [{ 'services.facebook.email': email }, { 'mobileFBToken': userAccessToken }]}).fetch();
    //var result = Songs.find({$or: [{"st": {$regex: new RegExp(searchQuery, 'i')}},{"sa": {$regex: new RegExp(searchQuery, 'i')}}], $and: [{$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]}]}, {limit: 5}).fetch();
    //var formattedResult = {"apiResults": result};
    //console.log("THIS IS THE formatted RESULT FOR THE API:");
    //console.log(formattedResult);
    /*mixpanel.track('SEARCH API: searched for a song', {
          query: searchQuery
        });*/
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#########FOUND this USER for those deets; going to return songs now!!!");
    console.log(userSongsRequiredFor[0]._id);
    if(_.isEmpty(userSongsRequiredFor))
    {
      console.log("#########found no songs and user for those supplied details!");
      JsonRoutes.sendResult(res, 200, {'apiResults': 'no user found for those details'});
    }
    else
    {
      var options = {
        fields: {
        "songSearchText": 0, 
        "aeCount": 0, 
        "meCount": 0, 
        "iTunesValid": 0, 
        "LFMValid": 0, 
        "cleanedTrackSearchQuery": 0, 
        "wuzzyFactor": 0, 
        "error": 0, 
        "LFMLargeAlbumArt": 0, 
        "LFMMediumAlbumArt": 0, 
        /*"iTunesMediumAlbumArt": 0, 
        "iTunesLargeAlbumArt": 0,*/
        "iTunesAlbumURL": 0, 
        "iTunesAlbumPrice": 0,
        "iTunesPriceCurrency": 0,
        "iTunesTrackPrice": 0,
        "iTunesTrackURL": 0,
        "discCount": 0,
        "discNumber": 0
      },
      sort: {'sharedBy.systemDate': -1 },
      skip: Number(cursorSkipValue),
      limit: 50};
      var finalGlobalSel = addSongValidatorsToSelector(getMongoSelectorForGlobal(userSongsRequiredFor[0]), "global");
      var result = Songs.find(finalGlobalSel, options).fetch();
      //var result = Songs.find({"sharedBy._id": userSongsRequiredFor[0]._id},{sort: {'sharedBy.systemDate': -1 }, skip: Number(cursorSkip), limit: 50}).fetch();
      //console.log("with these options: ");
      //console.log(options);
      //var result = Songs.find({"sharedBy._id": userSongsRequiredFor[0]._id}, options).fetch();
      console.log("#########locally got these global songs from the API:");
      console.log(result);
      var formattedResult = {"apiResults": result};
      JsonRoutes.sendResult(res, 200, formattedResult);
    }
  });

  //Mobile - make first contact with email and access token
  JsonRoutes.add("post", "/api/mobile/deets/:_email/:_accessToken/", function (req, res, next) {
    var email = req.params._email;
    var userAccessToken = req.params._accessToken;
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("THIS IS THE EMAIL ID: ");
    console.log(email);
    console.log("THIS IS THE access token: ");
    console.log(userAccessToken);
    var userUpdateObj = Meteor.users.find({'services.facebook.email': String(email)}).fetch();
    var finalTastemakerSel = addSongValidatorsToSelector(generateMongoSelectorForFriends(userUpdateObj[0]), "tastemakers");
    var finalGlobalSel = addSongValidatorsToSelector(getMongoSelectorForGlobal(userUpdateObj[0]), "global");
    //console.log("THIS IS THE MONGO FRIEND selector: ");
    //console.log(finalTastemakerSel);
    var mySongCount = Songs.find({"sharedBy._id": userUpdateObj[0]._id,$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}]}).count();
    var tastemakerSongCount = Songs.find(finalTastemakerSel).count();
    var globalSongCount = Songs.find(finalGlobalSel).count();
    //console.log(JSON.stringify(userUpdateObj[0]));
    console.log("##############################################");
    if(_.isUndefined(userUpdateObj[0].mobileFBToken) || _.isNull(userUpdateObj[0].mobileFBToken) || userUpdateObj[0].mobileFBToken !== userAccessToken)
    // token needs to be updated
    {
      console.log("MOBILE fb token has changed!!! so need to update it in the DB");
      Meteor.call('updateMobileFBToken', userUpdateObj[0], userAccessToken, function(error, result) {
        if(error)
        {
          console.log('Encountered error while trying to update mobile token!');
          JsonRoutes.sendResult(res, 200, {"result": "Encountered error while trying to update mobile token!"});
        }
        else
        {
          console.log('SUCCESSFULLY updated this users mobile token:!!');
          console.log(userUpdateObj[0])
          JsonRoutes.sendResult(res, 200, {"result": String(userUpdateObj[0]._id), "myGroovsCount": mySongCount, "tastemakerSongCount": tastemakerSongCount, "globalSongCount": globalSongCount});
        }
      });
    }
    else{
      console.log("MOBILE FB token is the same and doesn't need to be updated!");
      JsonRoutes.sendResult(res, 200, {"result": "MOBILE FB token is the same and doesn't need to be updated!", "myGroovsCount": mySongCount, "tastemakerSongCount": tastemakerSongCount, "globalSongCount": globalSongCount});
    }
  });

  //Mobile - trigger to get pull in latest fb songs
  JsonRoutes.add("post", "/api/mobile/lfbs/:_email/:_accessToken/", function (req, res, next) {
    var email = req.params._email;
    var userAccessToken = req.params._accessToken;
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("THIS IS THE EMAIL ID: ");
    console.log(email);
    console.log("THIS IS THE access token: ");
    console.log(userAccessToken);
    var userUpdateObj = Meteor.users.find({'services.facebook.email': String(email)}).fetch();
    //console.log("THIS IS THE MONGO FRIEND selector: ");
    //console.log(finalTastemakerSel);
    Meteor.call('remoteAPITriggerToGetLatestFromFB', userUpdateObj[0], function(error, result) {
        if(error)
        {
          console.log('Encountered error while trying to trigger latest pull from FB!');
          JsonRoutes.sendResult(res, 200, {"result": "Encountered error while trying to pull latest from FB: " + error});
        }
        else
        {
          console.log('SUCCESSFULLY triggered song pull from FB!');
          //console.log(userUpdateObj[0])
          console.log(result);
          JsonRoutes.sendResult(res, 200, {"result": result});
        }
      });
    console.log("##############################################");
  });

  //Mobile - get user deets for song shared profile view
  JsonRoutes.add("get", "/api/mobile/usrprof/:_fbid/:_usrid/:_accessToken", function (req, res, next) {
    var fbID = req.params._fbid;
    var userID = req.params._usrid;
    var axToken = req.params._accessToken
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("THIS IS THE user ID: ");
    console.log(userID);
    var requestingUser = Meteor.users.findOne({mobileFBToken: String(axToken)});
    var userProfileObj = Meteor.users.findOne({_id: String(userID)});
    console.log("THIS IS THE found USER PROFILE OBJECT: ");
    if(_.isUndefined(userProfileObj) || _.isEmpty(userProfileObj))
    {
      console.log("user profile OBJECT IS EMPTY!!! going to search using FBID: " + fbID);
      userProfileObj = Meteor.users.findOne({"services.facebook.id": String(fbID)}); // did not find anything using userID so search using FBID
    }
    console.log(userProfileObj.services.facebook.name);
    console.log("and this is the requesting user OBJECT:");
    console.log(requestingUser.services.facebook.name);
    if(!_.isEmpty(userProfileObj) && !_.isEmpty(requestingUser))
    {
      console.log('*****************GOING to get user specific COUNTS NOW');
      var songCount = Songs.find({$or: [{iTunesValid:'VALID'},{LFMValid:'VALID'},{manualApproval:'VALID'}], $and: [{'sharedBy.uid': String(userProfileObj.services.facebook.id)}]}).count();
      console.log("finished getting song count");
      var ratingCount = Ratings.find({'uid': String(userProfileObj.services.facebook.id)}).count();
      console.log('finished getting rating count');
      var listenCount = Listens.find({'uid': String(userID)}).count()
      console.log('finished getting listens count');
      var alreadyFollowed = checkIfUserIsFollowedByLoggedinUser(requestingUser, userProfileObj.services.facebook.id);
      if(!_.isUndefined(userProfileObj.tastemakers))
        var followingCount = userProfileObj.tastemakers.length;
      else
        var followingCount = 0;
      console.log('finished getting following count');
      var followedByCount = Meteor.users.find({'tastemakers.fbid': String(userProfileObj.services.facebook.id)}).count();
      console.log('****************going to get a list of fave bands now!');
      
      Meteor.call('getFaveBandList', String(userProfileObj.services.facebook.id), function(error, result) {
          if(error)
          {
            console.log('Encountered error while trying get favebands and genres!');
            JsonRoutes.sendResult(res, 200, {"result": "Encountered error while trying to pull top bands and genres from Groovli DB: " + error});
          }
          else
          {
            console.log('SUCCESSFULLY got favebands and genres');
            JsonRoutes.sendResult(res, 200, {"sharedSongCount": songCount, "ratingCount": ratingCount, "listenCount": listenCount, "followingCount": followingCount, "followedByCount": followedByCount, "alreadyFollowed": alreadyFollowed, "topBands": result[0], "topGenres": result[1], "userObj": userProfileObj});
          }
        });
      console.log("##############################################");
    }
    else
    {
      JsonRoutes.sendResult(res, 200, {"result": "no user found"});
    }
  });

  //Mobile - trigger to follow a specific user
  JsonRoutes.add("post", "/api/mobile/fusr/:_userToFollow/:_accessToken/", function (req, res, next) {
    var userToFollow = req.params._userToFollow;
    var axToken = req.params._accessToken;
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    var userToFollowObj = Meteor.users.findOne({"services.facebook.id": String(userToFollow)});
    console.log("THIS IS THE user to follow: ");
    console.log(userToFollowObj.services.facebook.name);
    var requestingUser = Meteor.users.findOne({mobileFBToken: String(axToken)});
    console.log("and this is the user requesting to follow:");
    console.log(requestingUser.services.facebook.name);
    Meteor.call('followUserFromApp', requestingUser, userToFollowObj, function(error, result) {
        if(error)
        {
          console.log('Encountered error while trying to follow specific user!');
          JsonRoutes.sendResult(res, 200, {"result": "Encountered error while trying to follow specific user: " + error});
        }
        else
        {
          console.log(result);
          JsonRoutes.sendResult(res, 200, {"result": result});
        }
      });
    //JsonRoutes.sendResult(res, 200, {"result": "stil testing API"});
    console.log("##############################################");
  });

  //Mobile - trigger to UNFOLLOW a specific user
  JsonRoutes.add("post", "/api/mobile/ufusr/:_userToUnfollow/:_accessToken/", function (req, res, next) {
    var userToUnfollow = req.params._userToUnfollow;
    var axToken = req.params._accessToken;
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    var userToUnfollowObj = Meteor.users.findOne({"services.facebook.id": String(userToUnfollow)});
    console.log("THIS IS THE user to unfollow: ");
    console.log(userToUnfollowObj.services.facebook.name);
    var requestingUser = Meteor.users.findOne({mobileFBToken: String(axToken)});
    console.log("and this is the user requesting to unfollow:");
    console.log(requestingUser.services.facebook.name);
    Meteor.call('unfollowUserFromApp', requestingUser, userToUnfollowObj, function(error, result) {
        if(error)
        {
          console.log('Encountered error while trying to unfollow specific user!');
          JsonRoutes.sendResult(res, 200, {"result": "Encountered error while trying to unfollow specific user: " + error});
        }
        else
        {
          console.log(result);
          JsonRoutes.sendResult(res, 200, {"result": result});
        }
      });
    //JsonRoutes.sendResult(res, 200, {"result": "stil testing API"});
    console.log("##############################################");
  });

  //Mobile - get possible users for messaging master list
  JsonRoutes.add("get", "/api/mobile/msglist/:_accessToken/", function (req, res, next) {
    var axToken = req.params._accessToken;
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    //var recipientObj = Meteor.users.findOne({"services.facebook.id": String(userToUnfollow)});
    var requestingUser = Meteor.users.findOne({mobileFBToken: String(axToken)});
    console.log("need to get messages for this user:");
    console.log(requestingUser.services.facebook.name);
    var msgsForUser = Messages.find({$or: [{from: String(requestingUser.services.facebook.id)},{to: String(requestingUser.services.facebook.id)}]}, {sort: {'timestamp': -1}}).fetch();
    //console.log("found these messages:");
    //console.log(msgsForUser.length);
    var unreadMsgCount = Messages.find({'to': String(requestingUser.services.facebook.id), 'read': false}).count();
    var unreadMsgs = Messages.find({'to': String(requestingUser.services.facebook.id), 'read': false}).fetch();
    var allMessagingRecipients = [];
    _.each(msgsForUser, function(z){
      if(z.to !== String(requestingUser.services.facebook.id) && _.isUndefined(_.findWhere(allMessagingRecipients, z.to)))
					allMessagingRecipients.push(z.to);
      else if(z.from !== String(requestingUser.services.facebook.id) && _.isUndefined(_.findWhere(allMessagingRecipients, z.from)))
        allMessagingRecipients.push(z.from);
    })

    Meteor.call('getFriendData', allMessagingRecipients, function(error, result) {
				if(error){
			        console.log(error.reason);
			    }
			    else{
			    	//console.log('REVIEW EXISTING SUCCESS: ');
			    	//console.log(result);
			    	JsonRoutes.sendResult(res, 200, {"recipientList": result, "loggedInUser": requestingUser, "unreadMsgCount": unreadMsgCount, "unreadMsgs": unreadMsgs});
			    	//Session.set('friendCount', result.length);
			    }
			});
    console.log("##############################################");
  });

  //Mobile - get messages between a specific user
  JsonRoutes.add("get", "/api/mobile/msgthread/:_recipientID/:_accessToken/", function (req, res, next) {
    var recipientID = req.params._recipientID;
    var axToken = req.params._accessToken;
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    var recipientObj = Meteor.users.findOne({"services.facebook.id": String(recipientID)});
    var requestingUser = Meteor.users.findOne({mobileFBToken: String(axToken)});
    //console.log("need to get messages for this user:");
    //console.log(requestingUser.services.facebook.name);
    console.log('and this user: ');
    console.log(recipientObj.services.facebook.name);
    var msgsForUser = Messages.find({$or:[{$and: [{from: String(requestingUser.services.facebook.id)}, {to: String(recipientObj.services.facebook.id)}]},{$and: [{to: String(requestingUser.services.facebook.id)}, {from: String(recipientObj.services.facebook.id)}]}]}, {sort: {'timestamp': 1}}).fetch();
    //console.log("found these messages:");
    //console.log(msgsForUser.length);
    JsonRoutes.sendResult(res, 200, {"result": msgsForUser});
    console.log("##############################################");
  });
  
  //Mobile - method to send message to a specific user
  JsonRoutes.add("post", "/api/mobile/msg/:_timestamp/:_msgContent/:_recipientID/:_accessToken/", function (req, res, next) {
    var msgTimestamp = Number(req.params._timestamp);
    var msgContent = decodeURIComponent(req.params._msgContent);
    var msgRecipientID = req.params._recipientID;
    var axToken = req.params._accessToken;
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    //var recipientObj = Meteor.users.findOne({"services.facebook.id": String(userToUnfollow)});
    console.log("THIS IS THE user to send the message to: ");
    console.log(msgRecipientID);
    var sendingUser = Meteor.users.findOne({mobileFBToken: String(axToken)});
    console.log("from this user:");
    console.log(sendingUser.services.facebook.name);
    console.log('this message: ');
    console.log(msgContent);
    console.log('and this is the timestamp: ');
    console.log(msgTimestamp);
    Meteor.call('insertNewArtistGenreGroupMessage', sendingUser.services.facebook.id, sendingUser.services.facebook.name, sendingUser._id, msgRecipientID, msgTimestamp, msgContent, function(error, result) {
        if(error)
        {
          console.log('Encountered error while trying to post message to user!');
          JsonRoutes.sendResult(res, 200, {"result": "Encountered error while trying to post message to user: " + error});
        }
        else
        {
          console.log(result);
          JsonRoutes.sendResult(res, 200, {"result": result});
        }
      });
    //JsonRoutes.sendResult(res, 200, {"result": "stil testing API"});
    console.log("##############################################");
  });

  //Mobile - method to mark messages in thread as read
  JsonRoutes.add("post", "/api/mobile/msgread/:_recipientID/:_accessToken/", function (req, res, next) {
    var msgRecipientID = req.params._recipientID;
    var axToken = req.params._accessToken;
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    //var recipientObj = Meteor.users.findOne({"services.facebook.id": String(userToUnfollow)});
    console.log("THIS IS THE selected user thread: ");
    console.log(msgRecipientID);
    var loggedInUser = Meteor.users.findOne({mobileFBToken: String(axToken)});
    console.log('this is the loggedin user: ' + loggedInUser.services.facebook.name);
    var unreadMSGS = Messages.find({'from':String(msgRecipientID), 'to': String(loggedInUser.services.facebook.id), 'read': false}).fetch();
    console.log("############ this is the unreadmsg count!!!! going to mark them as read!!!!");
    console.log(unreadMSGS);
    if(unreadMSGS.length > 0)
    {
      _.each(unreadMSGS, function(z){
      Meteor.call('markMessageAsRead', z._id, function(error, result) {
          if(error){
                console.log(error.reason);
                JsonRoutes.sendResult(res, 200, {"result": "Encountered error while trying to mark messages read in thread: " + error});
            }
            else{
              //console.log('REVIEW EXISTING SUCCESS: ');
              //console.log(result);
              console.log('successfully marked msgs read!')
              JsonRoutes.sendResult(res, 200, {"result": "successfully marked msgs read"});
              //Session.set('friendCount', result.length);
            }
        });
      })
    }
    else
    {
      JsonRoutes.sendResult(res, 200, {"result": "no unread msgs"});
    }
    //JsonRoutes.sendResult(res, 200, {"result": "stil testing API"});
    console.log("##############################################");
  });

  //Mobile - method to mark messages in thread as read
  JsonRoutes.add("post", "/api/mobile/slisten/:_sid/:_accessToken/", function (req, res, next) {
    var songID = req.params._sid;
    var axToken = req.params._accessToken;
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    //var recipientObj = Meteor.users.findOne({"services.facebook.id": String(userToUnfollow)});
    console.log("THIS IS THE selected songID: ");
    console.log(songID);
    var loggedInUser = Meteor.users.findOne({mobileFBToken: String(axToken)});
    console.log('this is the loggedin user: ' + loggedInUser.services.facebook.name);
    var songURL = "https://www.youtube.com/watch?v="+songID;
    var songToIncrement = Songs.find({'sl':String(songURL)}).fetch();
    console.log("############ this is the song to increment");
    console.log(songToIncrement[0].st);
    if(!_.isUndefined(songToIncrement[0]) && !_.isUndefined(loggedInUser))
    { 
      Meteor.call('insertMobileSongListen', songID, loggedInUser, function(error, result) {
        if(error)
        {
          console.log('Encountered error while trying to increment song listen!');
          JsonRoutes.sendResult(res, 200, {"result": "Encountered error while trying to increment song listen!"});
        }
        else
        {
          console.log('SUCCESSFULLY incremented song listen count!!');
          console.log(result)
          JsonRoutes.sendResult(res, 200, {"result": "success"});
        }
      });
    }
    //JsonRoutes.sendResult(res, 200, {"result": "stil testing API"});
    console.log("##############################################");
  });

  //Mobile - update album art for song - DO THIS LATER AFTER the app is working fine!!!
  /*JsonRoutes.add("post", "/api/mobile/aart/:_songID/:_mediumAlbumArtID/:_largeAlbumArtID", function (req, res, next) {
    var songID = req.params._songID;
    var mediumAlbumArt = req.params._mediumAlbumArtID;
    var largeAlbumArt = req.params._largeAlbumArtID;
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("GOT THIS song ID: ");
    console.log(songID);
    console.log("THIS IS THE large token: ");
    console.log(userAccessToken);
    var userUpdateObj = Meteor.users.find({'services.facebook.email': String(email)}).fetch();
    console.log("##############################################");
    if(_.isUndefined(userUpdateObj[0].mobileFBToken) || _.isNull(userUpdateObj[0].mobileFBToken) || userUpdateObj[0].mobileFBToken !== userAccessToken)
    // token needs to be updated
    {
      console.log("MOBILE fb token has changed!!! so need to update it in the DB");
      Meteor.call('updateMobileFBToken', userUpdateObj[0], userAccessToken, function(error, result) {
        if(error)
        {
          console.log('Encountered error while trying to update mobile token!');
          JsonRoutes.sendResult(res, 200, {"result": "Encountered error while trying to update mobile token!"});
        }
        else
        {
          console.log('SUCCESSFULLY updated this users mobile token:!!');
          console.log(userUpdateObj[0])
          JsonRoutes.sendResult(res, 200, {"result": String(userUpdateObj[0]._id)});
        }
      });
    }
    else{
      console.log("MOBILE FB token is the same and doesn't need to be updated!");
      JsonRoutes.sendResult(res, 200, {"result": "MOBILE FB token is the same and doesn't need to be updated!"});
    }
  });*/
}