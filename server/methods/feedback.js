Meteor.methods({
  sendFeedback: function(feedbackType, feedbackText, userEmail, siteSpeed) {
    console.log('THis is the feedbackType: ' + feedbackType);
    console.log('THis is the feedback Text: ' + feedbackText);
    console.log('THis is the user email: ' + userEmail);
    console.log('THis is the siteSpeed: ' + siteSpeed);
    Email.send({
      to: "sandeep@groovli.com",
      from: userEmail,
      subject: "Groovli Contact Form - " + feedbackType,
      html: Handlebars.templates['send-feedback']({
        type: feedbackType,
        detailedText: feedbackText,
        speed: siteSpeed,
        emailAddress: userEmail
      })
    });
  }
});