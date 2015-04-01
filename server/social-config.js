ServiceConfiguration.configurations.remove({
    service: 'facebook'
});
 
ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '848177241914409',
    secret: 'df4b0d666929be37748992a087e76a15'
});

/*Accounts.onCreateUser(function(options, user) {
 console.log('INSiDE THE onCreateUser method!!!');
 console.log('THIS IS THE OPTIONS STUFF: ');
 console.log(options);
 console.log('THIS IS THE USER STUFFF: ');
 console.log(user);
 return user;
});*/