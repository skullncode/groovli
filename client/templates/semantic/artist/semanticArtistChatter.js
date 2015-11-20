var artistChatterContext = new ReactiveVar(null);
var artistChatterMsgsLoaded = new ReactiveVar(false);

Template.semanticArtistChatter.helpers({
    messagesLoaded: function() {
        return artistChatterMsgsLoaded.get();
    },
    messagesForArtistChatter: function() {
        return Messages.find({}, {sort: { 'timestamp': 1 }});
    },
    formattedTimestamp: function() {
        return new moment(this.timestamp * 1000).fromNow();
    },

    hasMessages: function() {
        if(Messages.find({}).count() > 0)
            return true;
        else
            return false;
    },

    messageIsFromCurrentLoggedInUser: function() {
        if(this.from === Meteor.user().services.facebook.id)
            return true;
        else
            return false;
    },

    userImageForThisMessage: function() {
        return 'http://graph.facebook.com/'+this.from+'/picture?type=square';
    },
    firstNameFromName: function() {
      return this.fromName.split(' ')[0];
    }
});

Template.semanticArtistChatter.events({
    "click #ac-btn-sendMessage": function(event) {
    	//console.log('CLICKED SEND BUTTON!!!');
    	var artistChatterGroup = artistChatterContext.get().context.params._id+"_artist_group";
    	var sender = Meteor.user().services.facebook.id;
    	var senderName = Meteor.user().profile.name;
    	var senderProfileID = Meteor.user()._id;
    	var timestamp = new moment().unix();
    	var content = $('#ac-input-chatMessage').val().trim();
    	if(!_.isEmpty(content)) //sanity check to see that user selected is the user being sent to 
    	{
    		//console.log('NO GOLMAAAL; will send message!');
    		Meteor.call('insertNewArtistGenreGroupMessage', sender, senderName, senderProfileID, artistChatterGroup, timestamp, content, function(error,result){
			    if(error){
			    	toastr.error(error.reason);
			    }
			    else{
                    // do something with result
                    //toastr.success('Message successfully sent!');
                    $('#ac-input-chatMessage').val("");
                    amplitude.logEvent('sent message within artist chatterbox', {
                        from: Meteor.user().services.facebook.id,
                        to: artistChatterContext.get().context.params._id+"_artist_group"
                      });
                    //$('#chatbox').animate({scrollTop: $('#chatbox').get(0).scrollHeight}, 500); //auto scroll to bottom of chat window
                    if(artistChatterGroup === artistChatterContext.get().context.params._id+"_artist_group")
                    {
                        Meteor.call('markMessageAsRead', result);
                    }
                    Meteor.setTimeout(animateToBottomOfChat, 100);
			    }
			});
    	}
    	else if(_.isEmpty(content)) //if input box had blank spaces, reset it
    	{
    		$('#ac-input-chatMessage').val("");
    	}
    },
    "keydown #ac-input-chatMessage": function(event) {
    	//console.log('this is the KEYDOWN event');
    	//console.log(event);
    	if(event.keyCode === 13) //hit enter
    	{
            //console.log("GOING TO send messsagge!! CLICKING button!!!!");
    		$("#ac-btn-sendMessage").click();
    	}
    },
    "focus #ac-input-chatMessage": function(event){
    	Meteor.setTimeout(animateToBottomOfChat, 100);
    }
});

//NOT USING TEMPLATE LEVEL SUBSCRIPTIONS
Template.semanticArtistChatter.onCreated(function() {
    var self = this;
    self.autorun(function() {
        FlowRouter.watchPathChange();
        var context = FlowRouter.current();
        // use context to access the URL state
        //console.log('%%%%%%%%%%%%%%%%%%%% ROUTE HAS CHANGED!!!!');
        //console.log(context);
        artistChatterContext.set(context);
        //artistsSubLoaded.set(false);
        //console.log("THIS IS THE PROFILE CONTEXT REACTIVE VAAAAAAAAAAAAAAAAAR: ");
        //console.log(artistChatterContext.get());
        Session.setDefault(context.params._id+'_aCursor', 0);
        /*self.subscribe('artistObjectForProfilePage', artistChatterContext.get().params._id, {onReady: artistExists});
        self.subscribe('allSongsForSpecificArtist', artistProfileContext.get().params._id, Session.get(artistChatterContext.get().params._id+'_aCursor'));
        self.subscribe('artistsForSite', {onReady: artistSubLoaded});

        if(!_.isUndefined(Meteor.user()))
            self.subscribe("counterForAllSongs", Meteor.user()._id, {onReady: totalSongCountReady});    
        //self.subscribe("favoriteCountForSpecificUser", artistProfileContext.get().params._id);
        //Session.set(artistProfileContext.get().params._id+'_faveCount', Counts.get('faveCounterForUser'));
        //console.log("FINISHED TRYING TO GET all subscriptions")
        if(!_.isUndefined(Session.get(artistChatterContext.get().params._id+'_artObj')))
        {
            self.subscribe("counterForArtistSpecificSongs", artistChatterContext.get().params._id);
            Session.set(artistChatterContext.get().params._id+'_sc', Counts.get('songCountForArtistSpecificSongs'));
            calculateArtistPercentage();
        }*/
        self.subscribe('messagesForEntity', artistChatterContext.get().params._id+"_artist_group", {onReady: artistMsgsLoaded}); //subscribe to messages for this artist page
        Session.set(artistChatterContext.get().params._id+"_mc", Messages.find({}).count());
    });
});

function artistMsgsLoaded(){
    //console.log("ARTIST MESSSSSSSSSSSSSSSSSSAGES Loaded!!!");
    artistChatterMsgsLoaded.set(true);
}

function animateToBottomOfChat() {
    //console.log('THIS IS THE chatbox last: ');
    //console.log($('#chatbox').find('.message').last()[0]);
    $('.artistChatterMessages').animate({ scrollTop: $('.artistChatterMessages')[0].scrollHeight}, 500);
}
