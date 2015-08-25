Router.configure({
  layoutTemplate: 'appLayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  //waitOn: function() {return [Meteor.subscribe('songs'),Meteor.subscribe('userData')]}
  waitOn: function() {return Meteor.subscribe('userData');}
});

//Router.plugin('dataNotFound', {notFoundTemplate: 'notFound'});

var subMgr = new SubsManager();


Router.route('/', {
  name: 'home',
  fastRender: true
});

Router.route('/404', {
  name: 'notFound',
  fastRender: true
});

/*Router.route('/landing', {
  name: 'landing',
  fastRender: true
});*/

Router.route('/pending', {
  name: 'pending',
  template: 'reviewPending',
  fastRender: true
});

Router.route('/existing', {
  name: 'existing',
  template: 'reviewExisting',
  fastRender: true,
  waitOn: function() {
    //return Meteor.subscribe('songs');
    //return Meteor.subscribe('allSongsForSongBoard', Session.get('ud'));
    //return subMgr.subscribe('allSongsForSongBoard', Session.get('ud'));
    if(!_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
    {
      //analytics.page();
      return subMgr.subscribe('allSongsForSongBoard', Meteor.user().services.facebook.id);
    }
  }
});

Router.route('/allartists', {
  name: 'allartists',
  template: 'reviewArtists',
  fastRender: true
});

Router.route('/allgenres', {
  name: 'allgenres',
  template: 'reviewGenres',
  fastRender: true
});

Router.route('/invalid', {
  name: 'invalid',
  template: 'reviewInvalid',
  fastRender: true
});

Router.route('/allusers', {
  name: 'allusers',
  template: 'userMaster',
  fastRender: true,
  waitOn: function() {
    if(!_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
    {
      //analytics.page();
      return subMgr.subscribe('allSongsForSongBoard', Meteor.user().services.facebook.id);
    }
  }
});

Router.route('/friends', {
  name: 'friendlist',
  template: 'friendList',
  fastRender: true,
  waitOn: function() {
    if(!_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
    {
      //analytics.page();
      return subMgr.subscribe('allSongsForSongBoard', Meteor.user().services.facebook.id);
    }
  }
});

Router.route('/messages', {
  name: 'messages',
  template: 'messagesMaster',
  fastRender: true
});

/* OLD routing method using waitOn
Router.route('/artist/:_name', {
  name: 'artist',
  template: 'artistProfile',
  fastRender: true,
  waitOn: function() {
    var songsForArtist = subMgr.subscribe('allSongsForSpecificArtist', this.params._name);
    var artistObjectForPage = subMgr.subscribe('artistObjectForProfilePage', this.params._name);
    if(!_.isUndefined(songsForArtist) && !_.isUndefined(artistObjectForPage))
    {
      //analytics.page();
      if(songsForArtist.ready() && artistObjectForPage.ready())
      {
        //console.log('BOTH subscriptions are ready!!!');
        return [
          songsForArtist,
          artistObjectForPage
        ];
      }
      else
      {
        //console.log('ENCOUNTERED AN ERROR WITH SUBSCRIPTIONS!!!!!!!');
        return [];
      }
    }
  }
});*/

/* OLD routing method using waitOn
Router.route('/genre/:_name', {
  name: 'genre',
  template: 'genreProfile',
  fastRender: true,
  waitOn: function() {
    var artistsForGenre = subMgr.subscribe('artistsForGenre', this.params._name);
    var genreObjectForPage = subMgr.subscribe('genreObjectForProfilePage', this.params._name);
    //analytics.page();
    if(!_.isUndefined(artistsForGenre) && !_.isUndefined(genreObjectForPage))
    {
      if(artistsForGenre.ready() && genreObjectForPage.ready())
      {
        //console.log('BOTH subscriptions are ready!!!');
        //return genreObjectForPage;
        return [
          artistsForGenre,
          genreObjectForPage
        ];
      }
      else
      {
        //console.log('ENCOUNTERED AN ERROR WITH SUBSCRIPTIONS!!!!!!!');
        return [];
      }
    }
  }
});*/


Router.route('/songboard', {
  name: 'songboard',
  waitOn: function() {
    //console.log('THIS IST HE meteor user details:');

    //return Meteor.subscribe('songs');
    //return Meteor.subscribe('allSongsForSongBoard', Session.get('ud'));
    //console.log(Meteor.user().services.facebook.id);
    //return subMgr.subscribe('allSongsForSongBoard', Session.get('ud'));
    if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
    {
      //analytics.page();
      return subMgr.subscribe('allSongsForSongBoard', Meteor.user().services.facebook.id);
    }
  }
});

/*Router.route('/editprofile', {
  name: 'editprofile'
});*/

//newer ROUTING method using subscriptions / action / sub error re-routing to 404
Router.route('/artist/:_name', {
  name: 'artist',
  subscriptions: function() {
    // returning a subscription handle or an array of subscription handles
    // adds them to the wait list.
    // add the subscription handle to our waitlist
    subMgr.subscribe('allSongsForSpecificArtist', this.params._name, {onError: onErrorWithSubscription});
    this.wait(subMgr.subscribe('artistObjectForProfilePage', this.params._name, {onError: onErrorWithSubscription}));
  },

  action: function () {
    if (this.ready()) {
      this.render('artistProfile', {
        data: function () {
          return Artists.findOne({'name': {$regex: new RegExp('^' + Router.current().params._name + '$', 'i')}});
        }
      });
    } else {
        this.render('loading');  
    }
  }
});


//newer ROUTING method using subscriptions / action / sub error re-routing to 404
Router.route('/genre/:_name', {
  name: 'genre',
  subscriptions: function() {
    // returning a subscription handle or an array of subscription handles
    // adds them to the wait list.
    // add the subscription handle to our waitlist
    subMgr.subscribe('artistsForGenre', this.params._name, {onError: onErrorWithSubscription});
    this.wait(subMgr.subscribe('genreObjectForProfilePage', this.params._name, {onError: onErrorWithSubscription}));
  },

  action: function () {
    if (this.ready()) {
      this.render('genreProfile', {
        data: function () {
          return Genres.findOne({'name': {$regex: new RegExp('^' + Router.current().params._name + '$', 'i')}});
        }
      });
    } else {
        this.render('loading');  
    }
  }
});

//newer ROUTING method using subscriptions / action / sub error re-routing to 404
Router.route('/profile/:_id', {
  name: 'profile',
  subscriptions: function() {
    // returning a subscription handle or an array of subscription handles
    // adds them to the wait list.
    // add the subscription handle to our waitlist
    subMgr.subscribe('allSongsForSpecificUser', this.params._id, {onError: onErrorWithSubscription});
    this.wait(subMgr.subscribe('userObjectForProfilePage', this.params._id, {onError: onErrorWithSubscription}));
    subMgr.subscribe('favoritesForSpecificUser', String(Router.current().params._id), {onError: onErrorWithSubscription});
  },

  action: function () {
    if (this.ready()) {
      this.render('profile', {
        data: function () {
          //console.log('THIS IS THE FOUND USER OBJECT: ');
          //console.log(Meteor.users.findOne(this.params._id));
          return Meteor.users.findOne(this.params._id);
        }
      });
    } else {
        this.render('loading');  
    }
  }
});

//NEWER ROUTING METHOD USING TEMPLATE - LEVEL subscriptions
/*Router.route('/profile/:_id', {
  fastRender: true,
  action: function () {
    this.render('profile');
  }
});*/

/* OLD routing method using waitOn
Router.route('/profile/:_id', {
  name: 'profile',
  waitOn: function() {
    var songsForUser = subMgr.subscribe('allSongsForSpecificUser', this.params._id);
    var usrObjectForPage = subMgr.subscribe('userObjectForProfilePage', this.params._id);
    var favoritesForUser = subMgr.subscribe("favoritesForSpecificUser", String(Router.current().params._id));
    if(!_.isUndefined(songsForUser) && !_.isUndefined(usrObjectForPage) && !_.isUndefined(favoritesForUser))
    {
      //analytics.page();
      if(songsForUser.ready() && usrObjectForPage.ready() && favoritesForUser.ready())
      {
        return [
          songsForUser,
          usrObjectForPage,
          favoritesForUser
        ];
      }
    }
  },
  data: function () {
    //var x = Meteor.users.findOne(this.params._id)
    //console.log("THIS IS THE USER RESULT: ");
    //console.log(x);
    return Meteor.users.findOne(this.params._id)
  }
});*/

//INVITE SYSTEM

Router.route('signup', {
  path: '/signup',
  template: 'signup',
  onBeforeAction: function() {
    Session.set('currentRoute', 'signup');
    Session.set('betaToken', '');
    return this.next();
  }
});

Router.route('signup/:token', {
  path: '/signup/:token',
  template: 'signup',
  onBeforeAction: function() {
    Session.set('currentRoute', 'signup');
    Session.set('betaToken', this.params.token);
    return this.next();
  }
});

/*
Router.route('dashboard', {
  path: '/dashboard',
  template: 'dashboard',
  onBeforeAction: function() {
    Session.set('currentRoute', 'dashboard');
    return this.next();
  }
});*/

Router.route('invites', {
  path: '/invites',
  template: 'invites',
  waitOn: function() {
    //console.log('IN THE WAIT ON METHOD FOR INVITES');
    return Meteor.subscribe('/invites');
  },
  onBeforeAction: function() {
    //console.log('IN THE ON BEFORE ACTION METHOD FOR INVITES');
    Session.set('currentRoute', 'invites');
    return this.next();
  }
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      //this.render('accessDenied');
      Router.go('/');
    }
  } else {
    this.next();
  }
}

var mustBeAdmin = function() {
  var isAdmin, loggedInUser;
  loggedInUser = Meteor.user();
  isAdmin = Roles.userIsInRole(loggedInUser, ['admin']);
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
      Router.go('/');
    }
  } else if (isAdmin) {
    this.next();
  }
  else if (!isAdmin){
    Router.go('/');
  }
}

function onErrorWithSubscription(subError) {
  //console.log('INSIDE THE subscription ERROR FUNCTION');
  //console.log(subError);
  Router.go('/404');
}

/*var mustBeTester = function() {
  var isBetaTester, loggedInUser;
  loggedInUser = Meteor.user();
  isBetaTester = Roles.userIsInRole(loggedInUser, ['tester']);
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      //this.render('accessDenied');
      Router.go('/');
    }
  } else if (isBetaTester) {
    this.next();
  }
  else if (!isBetaTester){
    Router.go('/');
  }
}*/

Router.onBeforeAction(requireLogin, {only: ['songboard', 'editprofile', 'profile', 'invites', 'friendlist', 'messages', 'artist', 'genre']});
Router.onBeforeAction(mustBeAdmin, {only: ['invites', 'pending', 'existing', 'allusers', 'invalid', 'allartists', 'allgenres']});
//Router.onBeforeAction(mustBeTester, {only: ['songboard']});