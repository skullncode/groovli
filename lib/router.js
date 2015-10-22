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
      header: 'sheader',
      main: 'notFound'
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
      header: 'sheader',
      main: 'terms'
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
      header: 'sheader',
      main: 'privacy'
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
    BlazeLayout.render( 'semanticBasic', { 
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
    BlazeLayout.render( 'semanticLayout', { 
      header: 'sheader',
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
    BlazeLayout.render( 'semanticLayout', { 
      header: 'sheader',
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
    BlazeLayout.render( 'semanticLayout', { 
      header: 'sheader',
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
    BlazeLayout.render( 'semanticLayout', { 
      header: 'sheader',
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
      header: 'sheader',
      main: 'sprofile',
      /*sidebar: 'profileSidebar',*/
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
      header: 'sheader',
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
      header: 'sheader',
      main: 'semanticGenreProfile',
      sidebar: 'genrePageSidebar',
      footer: 'semanticFooter'
    }); 
  },
  name: 'genre'
});

FlowRouter.route('/messages/', {
  triggersEnter: [requireLogin],
  action: function(params) {
    //console.log("Yeah! Going to the Profile page for:", params._id);
    Session.set('cr', '/messages');
    BlazeLayout.render( 'messagesLayout', { 
      header: 'sheader',
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
      header: 'sheader',
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

// http://app.com/documents/:_id
/*
FlowRouter.route( '/songboard', {
  action: function() {
    console.log( "We're viewing a single document." );
  }
});*/

// http://app.com/documents
/*
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
});*/



/*
FlowRouter.notFound = {
    action: function() {
      BlazeLayout.render( 'v1Layout', { 
        headerSection: '_header',
        content: 'notFound',
        footerSection: '_footer'
      });
    }
};*/

/*
FlowRouter.route( '/', {
  action: function() {
    BlazeLayout.render( 'applicationLayout', { 
      headerSection: 'header',
      content: 'shome',
      footerSection: 'footer'
    }); 
  },
  name: 'home'
});*/

/*FlowRouter.route( '/songboard', {
  //triggersEnter: [requireLogin],
  action: function() {
    BlazeLayout.render( 'blazeProfileLayout', { 
      //header: 'header',
      //sidebar: 'stabsTemplate',
      content: 'sboard',
      //footer: 'footer'
    }); 
  },
  name: 'songboard'
});*/

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

function mustBeAdmin() {
  var isAdmin, loggedInUser;
  loggedInUser = Meteor.user();
  isAdmin = Roles.userIsInRole(loggedInUser, ['admin']);
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      BlazeLayout.render('appLayout', {content: 'accessDenied'});
      FlowRouter.go('/');
    }
  } /*else if (isAdmin) {
    this.next();
  }*/
  else if (!isAdmin){
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