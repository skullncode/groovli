//setup for easy search
/*Songs.initEasySearch(['st', 'sa'], {
    'limit' : 10,
    'use' : 'mongo-db'
});*/ //NOT USING easy search

//Songs.initEasySearch(['st', 'sa']);
//Songs.initEasySearch(['st', 'sa']);


Template.semanticSearch.events({
  "focus .txtSongSearch": function (event) {
    //console.log('RATING CLICKED!!!');
    //console.log(event.toElement.value);
    //console.log('CURRENTLY SEARCHING FOR SONGS!!!');

    //$('#main').hide();
    //$('#songSearchMsg').show();

    //Session.set('ssrch', true);
    return true;
  },
  "blur .txtSongSearch": function (event) {
    //console.log('RATING CLICKED!!!');
    //console.log(event.toElement.value);

    //console.log('not SEARCHING FOR SONGS!!!');

    //$('#main').show();
    //$('#songSearchMsg').hide();

    //Session.set('ssrch', false);
    return true;
  },
  "click #btnClearSearch": function(event) {
  	//console.log('CLEAR this search box');
  	var instance = EasySearch.getComponentInstance(
        { index : 'songs' }
    );
    //console.log('THIS IS THE INSTANCE');
    //console.log(instance);
    $('.txtSongSearch').val('');
    instance.clear();
  }
});

Template.semanticSearch.onCreated(function () {
  this.autorun(function () {
    var instance = EasySearch.getComponentInstance(
        { index : 'songs' }
    );

    instance = EasySearch.getComponentInstance(
	    {index: 'songs', autorun: self.autorun }
	  );

    //console.log('THIS IS THE search instance:');
    //console.log(instance);

	  /*instance.on('searchingDone', function (searchingIsDone) {
	    searchingIsDone && console.log('I am done!');
	  });

	  instance.on('currentValue', function (val) {
	    console.log('The user searches for ' + val);
	  });*/
  });
});

/*
Template.songsearch.onCreated(function () {
  // set up reactive computation
  this.autorun(function () {
    var instance = EasySearch.getComponentInstance(
        { index : 'songs' }
    );

    instance.on('autosuggestSelected', function (values) {
      // run every time the autosuggest selection changes
      console.log('SELECTED SOMETHING!!!');
      console.log(values);
    });
  });
});*/