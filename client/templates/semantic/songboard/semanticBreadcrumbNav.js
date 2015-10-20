Template.semanticBreadcrumbNav.helpers({
  /*currentlyOnMyGroovsPath: function() {
    if(Session.get('cr') === '/mygroovs')
      return true;
    else
      return false;
  },*/
  currentlyOnTastemakersPath: function() {
    if(Session.get('cr') === '/tastemakers')
    {
      //showVideoPlayer();
      return true;
    }
    else
      return false;
  }/*,
  currentlyOnMyFollowersPath: function() {
    if(Session.get('cr') === '/followers')
    {
      hideVideoPlayer();
      return true;
    }
    else
      return false;
  }*/
});


function hideVideoPlayer()
{
  if($('#responsivePlayerContainer').is(":visible"))
    $('#responsivePlayerContainer').slideUp();
}

function showVideoPlayer()
{
  if(!$('#responsivePlayerContainer').is(":visible"))
    $('#responsivePlayerContainer').slideDown();
}