Template.newFlylistModal.helpers({
  genresForFilter: function() {
  	return Session.get('agens');
  },
  flylistCreation: function() {
  	if(Session.get('flistM') === 'new')
  		return true;
  	else
  		return false;
  },
  nameOfFlylistBeingEdited: function() {
  	return Session.get('eflistnm');
  }
});

Template.newFlylistModal.onRendered(function () {
	console.log('RENDERING of modal flylist creation screen!!!');
	$('.ui.dropdown.flylistGenres').dropdown({
		action: 'select',
	    onChange: function(value, text, $selectedItem) {
	    	handleGenreSelectionsInModal(value);
	    },
	    maxSelections: 4
	});
});


function handleGenreSelectionsInModal(currentGenreSel) {
	//console.log('SOMETHING NEW HAS BEEN SELECTED FROM THE GENRE selector:');
	//console.log(currentGenreSel);
	Session.set('genForNewFlylist', currentGenreSel);
}