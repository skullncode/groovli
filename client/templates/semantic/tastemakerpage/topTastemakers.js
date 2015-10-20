Session.setDefault('ttmkrsLoaded', false);
Session.setDefault('ttmkrsExist', false);

Template.topTastemakers.helpers({
  tastemakersLoaded: function() {
    return Session.get('ttmkrsLoaded');
  },
  tastemakersExist: function() {
    return Session.get('ttmkrsExist');
  },
  topTastemakers: function() {
    if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
    {
      //exclude self
      return Meteor.users.find({'$nor':[{'services.facebook.id': Meteor.user().services.facebook.id}]});
    }
  } 
});

Template.topTastemakers.onCreated(function() {
  var self = this;
  self.autorun(function() {
    if(!_.isNull(Meteor.user()) && !_.isUndefined(Meteor.user()) && !_.isUndefined(Meteor.user().services) && !_.isUndefined(Meteor.user().services.facebook))
    {
      self.subscribe('topTastemakersForSpecificUser', Meteor.user().services.facebook.id, Meteor.user().tastemakers, {onReady: onTMSubReady});
    }
  });
});

function onTMSubReady()
{
  //console.log('TM SUBS IS FINALLY DONE - top tastemakers subscription finally ready!!!!');

  var result = Meteor.users.find({'$nor':[{'services.facebook.id': Meteor.user().services.facebook.id}]}).count();
  console.log(result);
  if(result > 0)
  {
    Session.set('ttmkrsLoaded', true);
    Session.set('ttmkrsExist', true);
  }
  else
  {
    Session.set('ttmkrsLoaded', true);
    Session.set('ttmkrsExist', false);
  }
}

/*
Template.topTastemakers.events({
    'click #hideShowComments': function(event) {
        if($('#commentSection').is(":visible"))
        {
          //$('.fa-comments').removeClass('commentsShown');
          //$('.fa-comments').addClass('commentsNotShown');
          $('#commentSection').slideUp();
          Session.set("scmntsVisible", false);
        }
        else
        {
          //$('.fa-comments').removeClass('commentsNotShown');
          //$('.fa-comments').addClass('commentsShown');
          $('#commentSection').slideDown();
          Session.set("scmntsVisible", true);
        }
    }
});*/