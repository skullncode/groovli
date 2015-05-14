if (Meteor.isServer) {
	console.log('configuring blog roles!!!!!');
	Blog.config({
		adminRole: 'blogAdmin',
		authorRole: 'blogAuthor'
	});
}