// YOUR CODE HERE:

var app = {
  server: 'https://api.parse.com/1/classes/chatterbox'
};


app.init = function(){
  app.username = getParameterByName('username');
  console.log(app.username);
  app.messageTemplate = _.template($('#messageTemplate').html());
  $('.username').on('click', function(){ app.addFriend(); })
  app.fetch();
  setInterval(app.fetch, 1000);

  $('#messageForm').on('submit', function(e){
    e.preventDefault();
    var text = $('#inputText').val();

    var sendObj = {username:app.username, text:text, roomname:"lobby"};
    app.send(sendObj);
  })
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
  console.log("Message is sending" + message);
  $.ajax({
    // always use this url
    url: app.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: onSuccess,
    error: onError
  });
};

app.fetch = function(onSuccess, onError){
  onError = onError || app.errorCallback;
  onSuccess = onSuccess || app.successCallback;

  $.ajax({
    // always use this url
    url: app.server,
    type: 'GET',
    contentType: 'application/json',
    success: onSuccess,
    error: onError
  });
};

app.successCallback = function (data) {
  app.clearMessages();

  _.each(data.results, function(item, index){
    app.addMessage(item);
  });
}

app.errorCallback = function(data){
  console.log("there is a callback error");
}

app.clearMessages = function(element){
  $('#chats').html('');
};

app.addMessage = function(message){
  //var el = $('<div>');
  //$('#chats').append(el);
  var preprocess = app.preprocess(message);
  $('#chats').append(app.messageTemplate(preprocess));
};

app.addRoom = function(roomName){
  var el = $('<div>');
  $('#roomSelect').append(el);
}

app.addFriend = function(){

}

$(document).ready(app.init);

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
