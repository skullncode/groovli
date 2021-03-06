geoBytesLocationURL = 'http://getcitydetails.geobytes.com/GetCityDetails?fqcn=#USER_IP#';

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

function setLocationForUser(uid)
{
	//console.log('REACHED LOCATION method in server!');
	var user = Meteor.users.findOne({'services.facebook.id': String(uid)});
	if(!_.isUndefined(user) && _.isUndefined(user.baseLocation))
	{
		//console.log('not undefined user but LOCATION IS UNDEFINED: ');
		//console.log(user);
		if(!_.isUndefined(user.status) && !_.isUndefined(user.status.lastLogin) && !_.isUndefined(user.status.lastLogin.ipAddr) && user.status.lastLogin.ipAddr !== '127.0.0.1')
		{
			updatedIPURL = geoBytesLocationURL.replace('#USER_IP#', user.status.lastLogin.ipAddr)
			//updatedIPURL = geoBytesLocationURL.replace('#USER_IP#', '106.51.234.19'); //testing
			Meteor.http.get(updatedIPURL, 
			function(error, result) {
				if(!error && result.statusCode === 200) {
					// this callback will be called asynchronously
					// when the response is available
					//console.log("THIS IS THE RESULT FROM GEOBYTES");
					//console.log(result.data);
					if(!_.isUndefined(result))
					{
						var locationProperties = {
							country: result.data.geobytescountry,
							countryInternetCode: result.data.geobytesinternet,
							city: result.data.geobytescity,
							state: result.data.geobytesregion,
							lat: result.data.geobyteslatitude,
							lon: result.data.geobyteslongitude,
							mapArea: result.data.geobytesmapreference,
							currency: result.data.geobytescurrency,
							currencyCode: result.data.geobytescurrencycode,
							nationality: result.data.geobytesnationalitysingular,
							nationalityPlural: result.data.geobytesnationalityplural
						};
						Meteor.users.update({_id: user._id},{$set:{baseLocation: locationProperties}});
					}
					else
						console.log('ENCOUNTERED an eRROR in IP LOCATION METHOD even though response was 200: '+response);
				}
				else
				{
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					console.log('REACHED IP LOCATION METHOD ERROR: ');
					console.log(error);
				}
			});
		}
	}
	//else
		//console.log('Base location already exists for this user; so not doing anything!');
}

Meteor.methods({
	saveLastLoginTimestamp: function(loggedInUser){
		Meteor.users.update({_id: loggedInUser.userId()},{$set:{fbFriends: latestFriendList}})
	},
	updateFBFriendList: function(loggedInUser)
	{
		//console.log('THIS IS THE METEOR USER OBJECT!!!');
		//console.log(Meteor.user());
		//var updatedFBGetURL = fbGraphURLforFriends.replace('#TOKEN#',Meteor.user().services.facebook.accessToken);
		var updatedFBGetURL = fbGraphURLforFriends.replace('#TOKEN#',loggedInUser.services.facebook.accessToken);
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
						var foundFriendObj = Meteor.users.findOne({'services.facebook.id': result.data.data[counter].id});

						//console.log(foundFriendObj);
						if(!_.isUndefined(foundFriendObj))
						{
							var foundFriend = {
								name: result.data.data[counter].name,
								uid: foundFriendObj._id,
								fbid: result.data.data[counter].id
							};
						}
						else
						{
							var foundFriend = {
								name: result.data.data[counter].name,
								uid: undefined,
								fbid: result.data.data[counter].id
							};
						}

						/*var foundFriend = {
							name: result.data.data[counter].name,
							fbid: result.data.data[counter].id
						};*/
						
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
	getFollowerCountWithFBID: function(fbid)
	{
		var followerList = Meteor.users.find({'tastemakers.fbid': String(fbid)}).fetch();
		return followerList.length
	},
	addSecondaryIPAddress: function(metuserID, ip){
		console.log('###################### adding secondary IP to this user:' + metuserID);
		console.log(ip);
		Meteor.users.update({_id: metuserID},{$set:{secondaryIP: ip}});
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
		//console.log('REACHED UNFOLLOW USER method on server, with this user object: ');
		//console.log(userToUnfollow);
		//console.log('and this is the ID:')
		//console.log(userToUnfollow.services.facebook.id);
		//find user to unfollow, within tastemaker list

		if(!_.isUndefined(userToUnfollow.services))
			var identifiedUserInList = _.findWhere(currentTastemakerList, {fbid: userToUnfollow.services.facebook.id});
		else if(!_.isUndefined(userToUnfollow.uid))
			var identifiedUserInList = _.findWhere(currentTastemakerList, {fbid: userToUnfollow.uid});
		
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

		if(!_.isUndefined(userToFollow.services) && !_.isUndefined(userToFollow.profile)) //if STANDARD User object
		{
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
					fbid: userToFollow.services.facebook.id,
					uid: userToFollow._id
				};
			}
		}
		else if(!_.isUndefined(userToFollow.uid) && !_.isUndefined(userToFollow.name))
		{
			var identifiedUserInList = _.findWhere(currentTastemakerList, {fbid: userToFollow.uid})
			var userObjToAddTastemakerList = _.findWhere(Meteor.user().fbFriends, {fbid: userToFollow.name})

			//this means that the user to follow is not a friend but an outsider / global user
			//create the user object manually
			if(_.isNull(userObjToAddTastemakerList) || _.isUndefined(userObjToAddTastemakerList))
			{
				userObjToAddTastemakerList = {
					name: userToFollow.name,
					fbid: userToFollow.uid,
					uid: userToFollow._id
				};
			}
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
	unfollowUserFromApp: function(loggedInUser, userToUnfollow) {
		var currentTastemakerList = loggedInUser.tastemakers;

		if(!_.isUndefined(userToUnfollow.services))
			var identifiedUserInList = _.findWhere(currentTastemakerList, {fbid: userToUnfollow.services.facebook.id});
		else if(!_.isUndefined(userToUnfollow.uid))
			var identifiedUserInList = _.findWhere(currentTastemakerList, {fbid: userToUnfollow.uid});
		
		var locationOfThisUserInList = currentTastemakerList.indexOf(identifiedUserInList);

		//if user exists in tastemaker list, use location to splice and remove the user from the tastemaker list
		if(locationOfThisUserInList >= 0)
		{
			currentTastemakerList.splice(locationOfThisUserInList, 1)

			console.log('updated tastemaker list: ');
			console.log(currentTastemakerList);

			//update Tastemaker list
			Meteor.users.update({_id: loggedInUser._id},{$set:{tastemakers: currentTastemakerList}});
		}

		return 'successfully unfollowed user!';
	},
	followUserFromApp: function(loggedInUser, userToFollow) {
		var currentTastemakerList = loggedInUser.tastemakers;

		//console.log('THIS IS THE user to follows object: ');
		//console.log(JSON.stringify(userToFollow));

		//console.log('and the fb friends of the logged in user: ');
		//console.log(loggedInUser.fbFriends);

		//check to see if current tastemaker list is blank or not; if blank then initialize list to empty array
		if(_.isNull(currentTastemakerList) || _.isUndefined(currentTastemakerList))
		{
			console.log('NO TASTEMAKERS SO FAR!!!');
			currentTastemakerList = [];
		}

		if(!_.isUndefined(userToFollow.services) && !_.isUndefined(userToFollow.profile)) //if STANDARD User object
		{
			//find if user to follow already exists in 
			var identifiedUserInList = _.findWhere(currentTastemakerList, {fbid: userToFollow.services.facebook.id})
			console.log('THIS IS THE IDd user in the tastemaker list: ');
			console.log(identifiedUserInList);
			var userObjToAddTastemakerList = _.findWhere(loggedInUser.fbFriends, {fbid: userToFollow.services.facebook.id})

			//this means that the user to follow is not a friend but an outsider / global user
			//create the user object manually
			if(_.isNull(userObjToAddTastemakerList) || _.isUndefined(userObjToAddTastemakerList))
			{
				userObjToAddTastemakerList = {
					name: userToFollow.profile.name,
					fbid: userToFollow.services.facebook.id,
					uid: userToFollow._id
				};
			}
		}

		//var locationOfThisUserInList = currentTastemakerList.indexOf(identifiedUserInList);
		
		//if(locationOfThisUserInList === -1)
		//if user is undefined or not found in current tastemakers list only then should they be added to the tastemaker list
		if(_.isUndefined(identifiedUserInList)) 
		{
			console.log('DOES NOT EXIST IN CURRENT TASTEMAKER LIST, so will add them!!!');
			currentTastemakerList.push(userObjToAddTastemakerList);

			//console.log('NEW LIST is: ');
			//console.log(currentTastemakerList);
			
			//add this user to the Tastemaker list
			Meteor.users.update({_id: loggedInUser._id},{$set:{tastemakers: currentTastemakerList}});
		}

		return 'successfully followed user!';
	},
	getMasterUserData: function() {
		var allUserData = Meteor.users.find({}).fetch();
		return allUserData;
	},
	getFriendData: function(friendList) {
		var friendData = Meteor.users.find({'services.facebook.id': {$in: friendList}}, {sort: {'status.online': -1, 'status.lastLogin.date': -1}}).fetch();
		return friendData;
	},
	setUserBaseLocation: function(fbid) {
		setLocationForUser(fbid);
	},
	setLocationForUnsetUsers: function() {
		var unsetUsers = Meteor.users.find({'baseLocation': { '$exists': false }, 'status.lastLogin': { '$exists': true }, 'status.lastLogin.ipAddr': {'$ne': '127.0.0.1'}}).fetch();
		//console.log('THESE ARE THE USERS WHO do not have location set yet, but have a last login and the last login IP address is not 127.0.0.1: ');
		//console.log(unsetUsers.length + ' USERS in total');
		//console.log(unsetUsers);
		if(!_.isEmpty(unsetUsers))
		{
			_.each(unsetUsers, function(z){
				setLocationForUser(z.services.facebook.id);
			});
		}
	},
	getOneSidedFollowers: function(fbid) {
		//console.log('reached onesided server method with this fbid: ' + fbid);
		//var onesided = Meteor.users.find({'tastemakers.fbid': String(fbid), 'fbFriends.fbid': {'$ne': String(fbid)}, 'tastemakers.fbid': {'$ne': String(fbid)}}).fetch();
		var onesided = Meteor.users.find({'tastemakers.fbid': String(fbid)}).fetch();
		var currentUserObj = Meteor.users.findOne({'services.facebook.id': String(fbid)});
		var oneSidedCopy = [];
		if(!_.isEmpty(currentUserObj) && !_.isUndefined(currentUserObj.fbFriends) && !_.isEmpty(onesided))
		{
			_.each(onesided, function(x){
				if(_.isUndefined(_$.findWhere(currentUserObj.fbFriends, {'fbid': x.services.facebook.id})) && _.isUndefined(_.findWhere(currentUserObj.tastemakers, {'fbid': x.services.facebook.id})))
				{
					//console.log('this person is NOT a friend or a tastemaker, so theyre good: ' + x.profile.name);
					oneSidedCopy.push(x);
				}
			});
		}
		//console.log('this is the result: ');
		return oneSidedCopy;
	},
	getUserIDsForSocIDs: function(socarray){//for use within following list as Tastemaker list does not contain USER IDs only social network ids
		var idArray = [];
		//console.log('%%%%%%%%%%%%%%%%%% this is the SOC array :');
		//console.log(socarray);
		if(!_.isEmpty(socarray))
		{
			_.each(socarray, function(x){
				var foundUser = Meteor.users.findOne({'services.facebook.id': String(x.fbid)});
				if(!_.isUndefined(foundUser))
				{
					var socObject = {
						'_id':foundUser._id,
						'fbid':x.fbid
					};
					idArray.push(socObject);
				}
			});
		}
		return idArray;
	},
	getSongDateRangeForSpecificUser: function(fbid){
		//console.log("################reached date method to get date range for user: " + fbid);

		var pipeline = [{$unwind:"$sharedBy"},
 						{$match:{"sharedBy.uid":String(fbid)}},
 						{$sort:{'sharedBy.systemDate':1}},
 						{$limit:1}];

 		var dateRangeResult = Songs.aggregate(pipeline);
 		var beginYear = 0;

 		if(!_.isEmpty(dateRangeResult))
 		{
 			_.each(dateRangeResult, function(z){
 				if(z.sharedBy.uid === String(fbid))
 				{
 					beginYear = z.sharedBy.systemDate;
 				}
 			})
 		}

 		pipeline = [{$unwind:"$sharedBy"},
 						{$match:{"sharedBy.uid":String(fbid)}},
 						{$sort:{'sharedBy.systemDate':-1}},
 						{$limit:1}];

 		dateRangeResult = Songs.aggregate(pipeline);
 		var endYear = 0;

 		if(!_.isEmpty(dateRangeResult))
 		{
 			_.each(dateRangeResult, function(z){
 				if(z.sharedBy.uid === String(fbid))
 				{
 					endYear = z.sharedBy.systemDate;
 				}
 			})
 		}

 		var dateRange = [];
 		dateRange.push(new Date(beginYear * 1000).getFullYear());
 		dateRange.push(new Date(endYear * 1000).getFullYear());

 		//console.log('###############$$$$$$$$$$$$$$$$$$$$$$$$$ THIS IS THE DATE RANGE:')
 		//console.log(dateRange);

 		return dateRange;
	},
	toggleHelpNotifications: function (userID, notificationsEnabled) {
		var foundUser = Meteor.users.findOne(userID)

		if(!_.isUndefined(foundUser))
		{
			var conditions = {_id: userID};	
			var updateVars = {$set:{notifsEnabled: notificationsEnabled}};
			Meteor.users.update(conditions, updateVars, function(error, result) {
		      if (error) {
		        // display the error to the user
		        console.log(error.reason);
		      }
		      else{
		      	console.log('################ successfully UPDATED HELP NOTIFICATION enabled STATUS for user: ' + userID);
		      }
			});
		}
		else
		{
			console.log('USER NOT FOUND: ' + userID);
		}
	},
	deleteUser: function(userID) {
		Meteor.users.remove({_id: userID}, function(error) {
	          if (error) {
	            // display the error to the user
	            return error;
	          }
	          else{
	            //console.log('result');
	          }
	      })
	},
	updateUserTastemakerObject: function(userID){
		var foundUser = Meteor.users.findOne(userID);
		var newFbFriendsObj = [];
		var newTastemakersObj = [];
		
		_.each(foundUser.fbFriends, function(x){
			//console.log('this is the fbid: ');
			//console.log(x.fbid);
			//console.log('THIS IS THE FB friend object: ');
			//console.log(x);
			var foundFriendObj = Meteor.users.findOne({'services.facebook.id': x.fbid});

			//console.log(foundFriendObj);
			if(!_.isUndefined(foundFriendObj))
			{
				newFbFriendsObj.push(
				{
					fbid: x.fbid,
					uid: foundFriendObj._id,
					name: x.name
				});
			}
			else
			{
				newFbFriendsObj.push(
				{
					fbid: x.fbid,
					uid: undefined,
					name: x.name
				});
			}
		});


		console.log('THIS IS THE UPDATED fb friends Object: ');
		console.log(newFbFriendsObj);

		var conditions = {_id: userID};	
		var updateVars = {$set:{fbFriends: newFbFriendsObj}};
		Meteor.users.update(conditions, updateVars, function(error, result) {
	      if (error) {
	        // display the error to the user
	        console.log(error.reason);
	      }
	      else{
	      	console.log('################ successfully UPDATED FB Friends Object: ' + userID);
	      }
		});

		_.each(foundUser.tastemakers, function(x){
			//console.log('this is the fbid: ');
			//console.log(x.fbid);
			//console.log('THIS IS THE FB friend object: ');
			//console.log(x);
			var foundTastemakerObj = Meteor.users.findOne({'services.facebook.id': x.fbid});

			//console.log(foundFriendObj);
			if(!_.isUndefined(foundTastemakerObj))
			{
				newTastemakersObj.push(
				{
					fbid: x.fbid,
					uid: foundTastemakerObj._id,
					name: x.name
				});
			}
			else
			{
				newTastemakersObj.push(
				{
					fbid: x.fbid,
					uid: undefined,
					name: x.name
				});
			}
		});

		//console.log('THIS IS THE UPDATED tastemakers Object: ');
		//console.log(newTastemakersObj);

		conditions = {_id: userID};	
		updateVars = {$set:{tastemakers: newTastemakersObj}};
		Meteor.users.update(conditions, updateVars, function(error, result) {
	      if (error) {
	        // display the error to the user
	        console.log(error.reason);
	      }
	      else{
	      	console.log('################ successfully UPDATED FB tastemakers Object: ' + userID);
	      }
		});
	},
	updateMobileFBToken: function(userObj, accessToken)
	{
		//var foundUser = Meteor.users.findOne({'services.facebook.email': String(userObj.services.facebook.email)});
		if(!_.isUndefined(userObj) && !_.isNull(userObj))
		{
			Meteor.users.update({'services.facebook.email': userObj.services.facebook.email},{$set:{mobileFBToken: accessToken}});
		}
		var foundUser = Meteor.users.findOne({'services.facebook.email': String(userObj.services.facebook.email)});
		return foundUser;
	},
	updateUserDataForNewlyCreatedUser: function(internalUSERID, emailID, accessToken)
	{
		var fbDataURL = "https://graph.facebook.com/v2.6/me?fields=id%2Cname%2Cemail&access_token=" + accessToken;
		console.log("################this is the FB url we're going to try and access to get more details for this user: " + fbDataURL);
		Meteor.http.get(fbDataURL, 
			function(error, result) {
				if(!error && result.statusCode === 200) {
					// this callback will be called asynchronously
					// when the response is available
					console.log("THIS IS THE RESULT FROM FB servers");
					console.log(result.data);
					console.log("going to update this user with this data now: " + internalUSERID);
					if(!_.isUndefined(result))
					{
						Meteor.users.update({_id: internalUSERID},{$set:
							{
								profile:{"name":result.data.name},
								services:{"facebook":{"id": result.data.id, "email": emailID}}
							}
						});
						console.log('########Successfully updated brand new user internal fb details!');
					}
					else
						console.log('ENCOUNTERED an eRROR while trying to update the users internal fb details: '+response);

				}
				else
				{
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					console.log('REACHED FB data update METHOD ERROR: ');
					console.log(error);
				}
			});
	},
	updateDataImportProgress: function(userID, currentProgress)
	{
		//console.log('##########updated the import progress for USERID: ' + userID + ' - to ' + currentProgress);
		Meteor.users.update({_id: userID},{$set:{importProgress: currentProgress}});
		Meteor.users.update({_id: userID},{$set:{importProgress: currentProgress}}, function(error, result) {
			if (error) {
			// display the error to the user
				console.log(error.reason);
			}
			else{
				//console.log('################ SUCCESSFULLY updated data import progress!!');
			}
		});
	}
});