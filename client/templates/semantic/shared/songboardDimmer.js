Template.songboardDimmer.onRendered(function () {
    Tracker.autorun(function () {
        if(Session.get('playerStarted')){
            hideDimmer();
        }
        else
        {
            showDimmer();
        }
    });   
});

function showDimmer(){
    $('.ui.page.dimmer')
          .dimmer({
            closable: false
          }).dimmer('show')
        ;
}

function hideDimmer(){
    $('.ui.page.dimmer').dimmer('hide');
}