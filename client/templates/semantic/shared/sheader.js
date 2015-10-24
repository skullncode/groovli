Session.setDefault('urmsgsC', 0);

Template.sheader.helpers({
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
  }
});

Template.sheader.onRendered(function () {
  $('.right.menu.open').on("click",function(e){
		e.preventDefault();
		//$('.ui.vertical.menu').toggle();
    $('.mobileHeaderMenu').toggle();
	});

  $('.ui.dropdown.mainHeaderMenuDropdown').dropdown();
});

Template.sheader.onCreated(function() {
  var self = this;
  self.autorun(function() {
    self.subscribe('userData');
    if(!_.isUndefined(Meteor.user()) && !_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user().services))
    {
      self.subscribe("unreadMsgCountForLoggedInUser", Meteor.user().services.facebook.id);
      Session.set('urmsgsC', Counts.get('unreadMsgCounterForLoggedInUser'));
    }
  });
});


Template.sheader.events({
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


/*
{ '$nor': 
[ { 'sharedBy.uid': '721431527969807' },
{ 'sharedBy.uid': '10153166103642774' },
{ 'sharedBy.uid': '10205130516756424' } ],
'$or': 
[ { iTunesValid: 'VALID' },
{ LFMValid: 'VALID' },
{ manualApproval: 'VALID' } ],
sa: 
{ '$in': [ 'Chet Baker','Don Ellis Band','Koop','The Sonic Chameleon','No BS! Brass Band','John Coltrane',
'Miles Davis','Kenny G','Fromwood','Nina Simone','Michael Bublé','Kat Edmonson','Norah Jones',
'Snarky Puppy','Billy Strayhorn','Meghan Trainor','The Trio of OZ' ] } }*/