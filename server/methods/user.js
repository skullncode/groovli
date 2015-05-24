function updateUserFriendList(latestFriendList){
	//console.log('REACHED THE UPDATE USER FRIEND LIST server method, with this list of friends: ');
	//console.log(latestFriendList);
	Meteor.users.update({_id: Meteor.userId()},{$set:{fbFriends: latestFriendList}});
	insertFriendsIntoTastemakersList(latestFriendList);
}

function insertFriendsIntoTastemakersList(latestFriendList)
{
	var updatedTastemakerList = Meteor.user().tastemakers;
	//console.log('this is the current tastemaker list: ');
	//console.log(updatedTastemakerList);
	if(_.isNull(updatedTastemakerList) || _.isUndefined(updatedTastemakerList)){
		updatedTastemakerList = [];
	}
	_.each(latestFriendList, function(x) {
		//console.log('CHECKING TO SEE IF THIS FRIEND IS UNFOLLOWED OR NOT: ');
		//console.log('this is the result of the search: ');
		var result = _.findWhere(Meteor.user().unfollowedFriends, {'fbid': x.fbid});
		//console.log(result);
		//if undefined that means this friend is not unfollowed, and can be safely added to the existing tastemaker list
		if(_.isUndefined(_.findWhere(Meteor.user().unfollowedFriends, {'fbid': x.fbid})) && _.isUndefined(_.findWhere(updatedTastemakerList, {'fbid': x.fbid})))
		{
			//console.log('THIS FRIEND IS NOT UNFOLLOWED YET SO will add them as a tastemaker:');
			//console.log(x);
			updatedTastemakerList.push(x);
		}
	});

	_.uniq(updatedTastemakerList);

	Meteor.users.update({_id: Meteor.userId()},{$set:{tastemakers: updatedTastemakerList}});
}

Meteor.methods({
	updateFBFriendList: function()
	{
		var updatedFBGetURL = fbGraphURLforFriends.replace('#TOKEN#',Meteor.user().services.facebook.accessToken);
		var counter = 0;
		var fbFriends = [];
		Meteor.http.get(updatedFBGetURL,
			function(error, result) {
				if(!error && result.statusCode === 200) {
					while(counter < result.data.data.length)
					{
						//console.log('GOT THIS result from FB GRAPH: ' + Object.keys(result.data.data[counter]));
						//console.log('COUNTER now is: ' + counter);
						//console.log('THIS IS THE Friends Name: ' + result.data.data[counter].name);
						//console.log('THIS IS THE Friends ID: ' + result.data.data[counter].id);
						var foundFriend = {
							name: result.data.data[counter].name,
							fbid:result.data.data[counter].id
						};
						fbFriends.push(foundFriend);
						counter++;
					}
					//console.log('FOUND ' + fbFriends.length + ' friend(s)');
					if(fbFriends.length > 0)
						updateUserFriendList(fbFriends);

					return true
				}
				else// error is defined
				{
					console.log('ENCOUNTERED an error during FB graph get for FRIENDS: ' + error);
					return false;
				}
			}
		);
	},
	findUserForRouting: function(uid)
	{
		//console.log("REACHED SERVER METHOD TO GET USER DATA FOR THIS ID: " + uid);
		return Meteor.users.findOne(uid);
	},
	getFollowerCount: function(userObj)
	{
		var followerList = Meteor.users.find({'tastemakers.fbid': String(userObj.services.facebook.id)}).fetch();
		return followerList.length
	},
	addAdminRolesToKing: function(kingEmail)
	{
		if(kingEmail === 'reverieandreflection@gmail.com')
		{
			//console.log('going to add the BLOG ADMIN ROLE TO THE KING!!!');
			//console.log('THIS IS THE USER EMAIL TO ADD THE ADMIN ROLE TO: ');
			//console.log(kingEmail);
			var adminRolesToAdd = { 
				roles: ["blogAdmin", "admin", "tester"]
			};

			Meteor.users.update({'services.facebook.email': 'reverieandreflection@gmail.com'}, {$set: adminRolesToAdd}, function(error, result) {
		      if (error) {
		        // display the error to the user
		        console.log(error.reason);
		      }
		      else{
		      	console.log('################ SUCCESSFULLY added blog admin role!!');
		      }
			});
		}
		else
		{
			//console.log('this user is not the admin so will add only TESTER role!!');
			var testerRoleToAdd = { 
				roles: ["tester"]
			};

			Meteor.users.update({'services.facebook.email': kingEmail}, {$set: testerRoleToAdd}, function(error, result) {
		      if (error) {
		        // display the error to the user
		        console.log(error.reason);
		      }
		      else{
		      	console.log('################ SUCCESSFULLY added tester role!!');
		      }
			});
		}
	},
	unfollowUser: function(userToUnfollow, isUserFriend) {
		var currentTastemakerList = Meteor.user().tastemakers;

		//find user to unfollow, within tastemaker list
		var identifiedUserInList = _.findWhere(currentTastemakerList, {fbid: userToUnfollow.services.facebook.id});
		var locationOfThisUserInList = currentTastemakerList.indexOf(identifiedUserInList);

		//if user exists in tastemaker list, use location to splice and remove the user from the tastemaker list
		if(locationOfThisUserInList >= 0)
		{
			currentTastemakerList.splice(locationOfThisUserInList, 1)

			//console.log('updated tastemaker list: ');
			//console.log(currentTastemakerList);

			//update Tastemaker list
			Meteor.users.update({_id: Meteor.userId()},{$set:{tastemakers: currentTastemakerList}});
		}

		//if user is a friend add them to the unfollowed friends list
		if(isUserFriend)
		{
			var currentUnfollowedFriends = Meteor.user().unfollowedFriends;
			//first check to see that unfollowed friends list is empty or undefined; if so then go ahead and initialize the list to an empty array
			if(_.isNull(currentUnfollowedFriends) || _.isUndefined(currentUnfollowedFriends))
			{
				//console.log('NO UNFOLLOWED FRIENDS SO FAR!!!');
				currentUnfollowedFriends = [];
			}

			//check to see that the user to unfollow does not already exist in the unfollowed friends list
			var doesFriendAlreadyExistInUnfollowedFriendList = _.findWhere(currentUnfollowedFriends, {fbid: userToUnfollow.services.facebook.id});
			if(_.isUndefined(doesFriendAlreadyExistInUnfollowedFriendList))
			{
				currentUnfollowedFriends.push(identifiedUserInList);
				//console.log('UNFOLLOWED FRIENDS ARE NOW: ');
				//console.log(currentUnfollowedFriends);

				//if this person is also a friend add them to the list of unfollowed friends
				Meteor.users.update({_id: Meteor.userId()},{$set:{unfollowedFriends: currentUnfollowedFriends}});
			}
		}
	},
	followUser: function(userToFollow, isUserFriend) {
		var currentTastemakerList = Meteor.user().tastemakers;

		//console.log('THIS IS THE user to follows object: ');
		//console.log(userToFollow.profile.name);

		//check to see if current tastemaker list is blank or not; if blank then initialize list to empty array
		if(_.isNull(currentTastemakerList) || _.isUndefined(currentTastemakerList))
		{
			//console.log('NO TASTEMAKERS SO FAR!!!');
			currentTastemakerList = [];
		}

		//find if user to follow already exists in 
		var identifiedUserInList = _.findWhere(currentTastemakerList, {fbid: userToFollow.services.facebook.id})
		//console.log('THIS IS THE IDd user in the tastemaker list: ');
		//console.log(identifiedUserInList);
		var userObjToAddTastemakerList = _.findWhere(Meteor.user().fbFriends, {fbid: userToFollow.services.facebook.id})

		//this means that the user to follow is not a friend but an outsider / global user
		//create the user object manually
		if(_.isNull(userObjToAddTastemakerList) || _.isUndefined(userObjToAddTastemakerList))
		{
			userObjToAddTastemakerList = {
				name: userToFollow.profile.name,
				fbid: userToFollow.services.facebook.id
			};
		}
		
		//var locationOfThisUserInList = currentTastemakerList.indexOf(identifiedUserInList);
		
		//if(locationOfThisUserInList === -1)
		//if user is undefined or not found in current tastemakers list only then should they be added to the tastemaker list
		if(_.isUndefined(identifiedUserInList)) 
		{
			//console.log('DOES NOT EXIST IN CURRENT TASTEMAKER LIST, so will add them!!!');
			currentTastemakerList.push(userObjToAddTastemakerList);

			//console.log('NEW LIST is: ');
			//console.log(currentTastemakerList);
			
			//add this user to the Tastemaker list
			Meteor.users.update({_id: Meteor.userId()},{$set:{tastemakers: currentTastemakerList}});
		}

		//if user is a friend need to remove them from the unfollowed friend list
		if(isUserFriend)
		{
			//console.log('user is a friend!!!');
			var currentUnfollowedFriends = Meteor.user().unfollowedFriends;
			//console.log('AND THIS IS THE CURRENT UNFOLLOWED FRIEND LIST!!!');
			//console.log(currentUnfollowedFriends);
			//if current unfollowed friends list is empty then do nothing
			if(_.isNull(currentUnfollowedFriends) || _.isUndefined(currentUnfollowedFriends))
			{
				console.log('NO UNFOLLOWED FRIENDS SO FAR so nothing to remove!');
			}
			else//if unfollowed friend list is not empty then check to see if the user exists in the unfollowed friends list
			{
				var checkForUser = _.findWhere(currentUnfollowedFriends, {fbid: userObjToAddTastemakerList.fbid});

				if(!_.isUndefined(checkForUser))
				{
					var locationOfThisUserInUnfollowedFriendList = currentUnfollowedFriends.indexOf(checkForUser);
					//console.log('searching for this user object in the currentUnfollowedFriends list');
					//console.log(checkForUser);
					//console.log('location of the user in the unfollowed friend list is: ');
					//console.log(locationOfThisUserInUnfollowedFriendList);
					if(locationOfThisUserInUnfollowedFriendList >= 0)
					{
						currentUnfollowedFriends.splice(locationOfThisUserInUnfollowedFriendList, 1)

						//console.log('UNFOLLOWED FRIENDS ARE NOW after splicing: ');
						//console.log(currentUnfollowedFriends);

						//if this person is also a friend remove them to the list of unfollowed friends
						Meteor.users.update({_id: Meteor.userId()},{$set:{unfollowedFriends: currentUnfollowedFriends}});
					}
				}
			}
		}
	},
	getMasterUserData: function() {
		var allUserData = Meteor.users.find({}).fetch();
		return allUserData;
	},
	getFriendData: function(friendList) {
		var friendData = Meteor.users.find({'services.facebook.id': {$in: friendList}}).fetch();
		return friendData;
	}
});