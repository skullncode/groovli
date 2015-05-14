if (Meteor.isServer) {
	//console.log('Blog: configuring roles');
	Blog.config({
		adminRole: 'blogAdmin',
		authorRole: 'blogAuthor'
	});
}