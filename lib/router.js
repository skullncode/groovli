Router.configure({
  layoutTemplate: 'appLayout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  //waitOn: function() {return [Meteor.subscribe('songs'),Meteor.subscribe('userData')]}
  waitOn: function() {return Meteor.subscribe('userData');}
});


Router.route('/', {
  name: 'home'
});

Router.route('/pending', {
  name: 'pending',
  template: 'reviewPending'
});

Router.route('/existing', {
  name: 'existing',
  template: 'reviewExisting'
});

Router.route('/allartists', {
  name: 'allartists',
  template: 'reviewArtists'
});

Router.route('/invalid', {
  name: 'invalid',
  template: 'reviewInvalid'
});

Router.route('/allusers', {
  name: 'allusers',
  template: 'userMaster'
});

Router.route('/friends', {
  name: 'friendlist',
  template: 'friendList'
});

Router.route('/messages', {
  name: 'messages',
  template: 'messagesMaster'
});


Router.route('/artist/:_name', {
  name: 'artist',
  template: 'artistProfile'
});


Router.route('/songboard', {
  //layoutTemplate: 'appLayout',
  /*waitOn: function() {
    return Meteor.subscribe('userData');
  },*/
  waitOn: function() {
    return Meteor.subscribe('songs');
  },
  name: 'songboard'
});

Router.route('/editprofile', {
  name: 'editprofile'
});

/*Router.route('/profile', {
  name: 'profile'
});*/

Router.route('/profile/:_id', {
  name: 'profile'
});

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

Router.route('dashboard', {
  path: '/dashboard',
  template: 'dashboard',
  onBeforeAction: function() {
    Session.set('currentRoute', 'dashboard');
    return this.next();
  }
});

Router.route('invites', {
  path: '/invites',
  template: 'invites',
  waitOn: function() {
    console.log('IN THE WAIT ON METHOD FOR INVITES');
    return Meteor.subscribe('/invites');
  },
  onBeforeAction: function() {
    console.log('IN THE ON BEFORE ACTION METHOD FOR INVITES');
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

var mustBeTester = function() {
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
}

Router.onBeforeAction(requireLogin, {only: ['songboard', 'editprofile', 'profile', 'invites', 'friendlist', 'messages', 'artist']});
Router.onBeforeAction(mustBeAdmin, {only: ['invites', 'pending', 'existing', 'allusers', 'invalid', 'allartists']});
Router.onBeforeAction(mustBeTester, {only: ['songboard']});