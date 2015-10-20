Template.semanticArtistProfileLayout.onRendered(function () {
	fixSemanticGrids();
});

/**
* Makes sure the positional 'wide' class is present for every device-specific semantic-ui rule
*/
function fixSemanticGrids() {
  var deviceList = ['computer', 'tablet', 'mobile'];
  $('.wide.column').each(function (i, e) { 
    var classes = $(e).attr('class').split(/\s+/);
    var newClasses = new Array();
    $.each(classes, function (j, c) {
      if($.inArray(c, deviceList) >= 0 && j > 0 && 'wide' != classes[j-1]) {
        newClasses.push('wide');
      }
      newClasses.push(c);
    });
    $(e).attr('class', newClasses.join(' '));
  });
};