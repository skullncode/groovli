Template.oauthcallback.onCreated(function() {
	window.opener.openFB.oauthCallback(window.location.href);
	window.close();
});
