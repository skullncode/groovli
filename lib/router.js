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
  JsonRoutes.add("get", "/api/mobile/myg/:_email/:_accessToken/", function (req, res, next) {
    var email = req.params._email;
    var userAccessToken = req.params._accessToken;
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
    if(_.isEmpty(userSongsRequiredFor))
    {
      JsonRoutes.sendResult(res, 200, {'result': 'no user found for those details'});
    }
    else
    {
      var result = Songs.find({"sharedBy._id": userSongsRequiredFor[0]._id},{sort: {"sharedBy.systemDate": -1 }, limit: 10}).fetch();
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
  });
}