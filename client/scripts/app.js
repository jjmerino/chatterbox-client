// YOUR CODE HERE:

var app = {
  server: 'https://api.parse.com/1/classes/chatterbox'

};

app.init = function(){
  $('.username').on('click', function(){ app.addFriend(); })
  app.fetch(function (data) {
      console.log(data);
      console.log('chatterbox: Message sent');
      var template = _.template($('#messageTemplate').html());
      _.each(data.results, function(item, index){
        $('body').append(template(app.preprocess(item)));
      });
    });

};

app.preprocess = function(obj){
  // use _.escape on their text messages :D
  //use _.defaults
  var result = {};
  var defaults = _.defaults(obj, {username:"troll", text:"I'm a troll", roomname:"trollroom" });
  result.username = _.escape(defaults.username);
  result.text = _.escape(defaults.text);
  result.roomname = _.escape(defaults.roomname);

  return result;
}

app.send = function(message, onSuccess, onError){
  onError = onError || app.errorCallback;
  $.ajax({
    // always use this url
    url: app.url,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: onSuccess,
    error: onError
  });
};

app.fetch = function(onSuccess, onError){
  onError = onError || app.errorCallback;
  $.ajax({
    // always use this url
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    success: onSuccess,
    error: onError
  });
};

app.errorCallback = function(data){
  console.log("there is a callback error");
}

app.clearMessages = function(element){
  $('#chats').html('');
};

app.addMessage = function(message){
  var el = $('<div>');
  $('#chats').append(el);
};

app.addRoom = function(roomName){
  var el = $('<div>');
  $('#roomSelect').append(el);
}

app.addFriend = function(){

}

$(document).ready(app.init);
