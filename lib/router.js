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

Router.route('/allusers', {
  name: 'allusers',
  template: 'userMaster'
});

Router.route('/friends', {
  name: 'friendlist',
  template: 'friendList'
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


//FILTERS FOR INVITE SYSTEM
/*var checkUserLoggedIn = function() {
  console.log('CHECKING User Logged In NOW!!!');
  if (!Meteor.loggingIn() && !Meteor.user()) {
    return Router.go('/');
  } else {
    return this.next();
  }
};

var userAuthenticatedBetaTester = function() {
  console.log('CHECKING Auth Beta Tester NOW!!!');
  var isBetaTester, loggedInUser;
  loggedInUser = Meteor.user();
  isBetaTester = Roles.userIsInRole(loggedInUser, ['tester']);
  if (!Meteor.loggingIn() && isBetaTester) {
    return Router.go('/');
  } else {
    return this.next();
  }
};

var userAuthenticatedAdmin = function() {
  console.log('CHECKING Auth ADMIN NOW!!!');
  var isAdmin, loggedInUser;
  loggedInUser = Meteor.user();
  isAdmin = Roles.userIsInRole(loggedInUser, ['admin']);
  if (!Meteor.loggingIn() && isAdmin) {
    return Router.go('/');
  } else {
    return this.next();
  }
};
//END FILTERS FOR INVITE SYSTEM

//ACTIONS
Router.onBeforeAction(checkUserLoggedIn, {
  except: ['home', 'signup', 'signup/:token']
});

Router.onBeforeAction(userAuthenticatedBetaTester, {
  only: ['songboard', 'editprofile', 'profile', 'invites', 'signup', 'signup/:token']
});

Router.onBeforeAction(userAuthenticatedAdmin, {
  only: ['songboard', 'editprofile', 'profile', 'invites', 'signup', 'signup/:token']
});*/

//END INVITE SYSTEM

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
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
    }
  } else if (isAdmin) {
    this.next();
  }
  else if (!isAdmin){
    Router.go('/');
  }
}

var mustBeTester = function() {
  var isAdmin, loggedInUser;
  loggedInUser = Meteor.user();
  isAdmin = Roles.userIsInRole(loggedInUser, ['tester']);
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else if (isAdmin) {
    this.next();
  }
  else if (!isAdmin){
    Router.go('/');
  }
}

Router.onBeforeAction(requireLogin, {only: ['songboard', 'editprofile', 'profile', 'invites']});
Router.onBeforeAction(mustBeAdmin, {only: ['invites', 'pending', 'existing', 'allusers']});
Router.onBeforeAction(mustBeTester, {only: ['songboard']});