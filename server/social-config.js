ServiceConfiguration.configurations.remove({
    service: 'facebook'
});
 
ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '848177241914409', // DEV APP
    secret: 'df4b0d666929be37748992a087e76a15' // DEV APP
    //appId: '1555076711418973', // PROD APP
  	//secret: 'e2664e69f90232783611f33c816f3481' // PROD APP
});

Accounts.onCreateUser(function(options, user) {
 //console.log('INSiDE THE onCreateUser method!!!');
 //console.log('THIS IS THE OPTIONS STUFF: ');
 console.log(options);
 //console.log('THIS IS THE USER STUFFF: ');
 console.log(user);

 user.profile = options.profile;
 return user;
});