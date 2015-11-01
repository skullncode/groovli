Session.setDefault('urmsgsC', 0);
Session.setDefault('userIdD', false); //user has been identified with mixpanel for this session
Session.setDefault('uhne', false); //user help notifications enabled - by default set it to FALSE so users are not disturbed

Template.semanticHeader.helpers({
  activeRouteIsMyGroovs: function() {
    if(FlowRouter.current().path === '/mygroovs')
    	return 'active';
  },
  activeRouteIsHome: function() {
    if(FlowRouter.current().path === '/songboard')
    	return 'active';
  },
  activeRouteIsTastemakers: function() {
    if(FlowRouter.current().path === '/tastemakers')
    	return 'active';
  },
  activeRouteIsGlobal: function() {
    if(FlowRouter.current().path === '/global')
    	return 'active';
  },
  activeRouteIsMessages: function() {
    if(FlowRouter.current().path.indexOf('/messages') >= 0)
      return 'active';
  },
  hasUnreadMsgs: function() {
    if(Session.get('urmsgsC') > 0)
      return true;
    else
      return false;
  },
  unreadMsgCount: function() {
    return Session.get('urmsgsC');
  },
  notifsEnabled: function() {
    if(!_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().notifsEnabled))
    {
      return Meteor.user().notifsEnabled;
    }
    else
    {
      return true;
    }
  },
  activatePopups: function() {
    Meteor.setTimeout(activatePopups, 500);
  },
  setNotifsSessionVar: function() {
    Session.set('uhne', Meteor.user().notifsEnabled);
  }
});

Template.semanticHeader.onRendered(function () {
  $('.right.menu.open').on("click",function(e){
		e.preventDefault();
		//$('.ui.vertical.menu').toggle();
    $('.mobileHeaderMenu').toggle();
	});

  $('.ui.dropdown.mainHeaderMenuDropdown').dropdown();
  identifyUserWithMixPanel();
});

Template.semanticHeader.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('userData', {onReady: setupHelpNotificationStatus});
    if(!_.isUndefined(Meteor.user()) && !_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user().services))
    {
      self.subscribe("unreadMsgCountForLoggedInUser", Meteor.user().services.facebook.id);
      Session.set('urmsgsC', Counts.get('unreadMsgCounterForLoggedInUser'));
      activatePopups();
    }
  });
});

function setupHelpNotificationStatus() {
  if(!_.isUndefined(Meteor.user()) && !_.isNull(Meteor.user()))
  {
    if(!_.isUndefined(Meteor.user().notifsEnabled))
    {
      if(Meteor.user().notifsEnabled)
      {
        Session.set('uhne', true);
      }
      else
      {
        Session.set('uhne', false);
      }
    }
    else
    {
      //NOT YET set that means new user so notifications are not yet DISABLED so set it to checked
      Session.set('uhne', true);
    }
  }
}


Template.semanticHeader.events({
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
                    FlowRouter.go('/');
                //}
                //else
                //    console.log('NOT DOING ANYTHING!!');
            }
        });
        return false;
    },
    'click .mygroovslink': function(event){
    	$('.mainHeaderMenu .active').removeClass('active');  
    	$('.mainHeaderMenu .mygroovslink').addClass('active');
    	FlowRouter.go('/mygroovs');
    },
    'click .homelink': function(event){
    	$('.mainHeaderMenu .active').removeClass('active');
    	$('.mainHeaderMenu .homelink').addClass('active');
    	FlowRouter.go('/songboard');
    },
    'click .tastemakerslink': function(event){
    	$('.mainHeaderMenu .active').removeClass('active');
    	$('.mainHeaderMenu .tastemakerslink').addClass('active');
    	FlowRouter.go('/tastemakers');
    },
    'click .globalpagelink': function(event){
    	$('.mainHeaderMenu .active').removeClass('active');
    	$('.mainHeaderMenu .globalpagelink').addClass('active');
    	FlowRouter.go('/global');
    }
});

function activatePopups(){
  $('.homelink').popup();
  $('.mygroovslink').popup();
  $('.tastemakerslink').popup();
  $('.globalpagelink').popup();
}

function userCheck(){
  return Meteor.user() && !_.isUndefined(Meteor.user()) && !_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook);
}

function identifyUserWithMixPanel(){
  if(userCheck() && !Session.get('userIdD'))
  {
    mixpanel.identify(Meteor.user()._id);
    mixpanel.people.set({
        "$first_name": Meteor.user().services.facebook.first_name,
        "$last_name": Meteor.user().services.facebook.last_name,
        "$created": Meteor.user().createdAt,
        "$email": Meteor.user().services.facebook.email,
        "$ip": Meteor.user().status.lastLogin.ipAddr
    });
    Session.set('userIdD', true);
  }
}