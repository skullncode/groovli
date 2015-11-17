/*var v1 = FlowRouter.group({
  prefix: '/'
});*/

/*var v2 = FlowRouter.group({
  prefix: '/v2'
});*/

/*v1 - older routes
FlowRouter.route( '/', {
  action: function() {
    //console.log('ON GROUp route v1 - root home');
    BlazeLayout.render( 'v1Layout', { 
      headerSection: '_header',
      content: 'home',
      footerSection: '_footer'
    }); 
  },
  name: 'home'
});

FlowRouter.route( '/songboard', {
  triggersEnter: [requireLogin],
  action: function() {
    //console.log('GOING TO RENDER SONGBOARD TEMPLATE!!!');
    BlazeLayout.render( 'v1Layout', { 
      headerSection: '_header',
      content: 'songboard',
      footerSection: '_footer'
    }); 
  },
  name: 'songboard'
});

FlowRouter.route('/artist/:_name', {
  triggersEnter: [requireLogin],
  action: function(params) {
    console.log("Yeah! Going to the Artist page:", params._name);
    BlazeLayout.render( 'v1Layout', { 
      headerSection: '_header',
      content: 'artistProfile',
      footerSection: '_footer'
    }); 
  },
  name: 'artist'
});*/

// http://app.com/documents
/*FlowRouter.route( '/', {
  action: function() {
    console.log('ON GROUp route v2');
    BlazeLayout.render( 'v2Layout', { 
      headerSection: 'header',
      content: 'shome',
      footerSection: 'footer'
    }); 
  },
  name: 'home'
});*/

/*FlowRouter.route( '/songboard', {
  triggersEnter: [requireLogin],
  action: function() {
    //console.log('GOING TO RENDER SONGBOARD TEMPLATE!!!');
    BlazeLayout.render( 'v2Layout', { 
      headerSection: 'header',
      content: 'sboard',
      footerSection: 'footer'
    }); 
  },
  name: 'songboard'
});*/

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
}