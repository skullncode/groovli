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

Router.route('/profile', {
  name: 'profile'
});

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

Router.onBeforeAction(requireLogin, {only: ['songboard', 'editprofile', 'profile']});