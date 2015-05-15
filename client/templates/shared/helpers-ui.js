UI.registerHelper('currentRoute', function(route) {
  if (Session.equals('currentRoute', route)) {
    return 'active';
  } else {
    return '';
  }
});

UI.registerHelper('epochToString', function(timestamp) {
  return moment.unix(timestamp / 1000).format("MMMM Do, YYYY");
});