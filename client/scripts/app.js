// YOUR CODE HERE:

var app = {
  server: 'https://api.parse.com/1/classes/chatterbox/?order=-createdAt',
  chatRooms: {}
};


app.init = function(){
  app.username = getParameterByName('username');
  //load templates
  app.roomTemplate = _.template($('#roomItem').html());
  app.messageTemplate = _.template($('#messageTemplate').html());
  //Handle events
  $('.username').on('click', function(){ app.addFriend(); })
  $('#messageForm').on('submit', function(e){
    e.preventDefault();
    var text = $('#inputText').val();
    var sendObj = {username:app.username, text:text, room:"lobby"};
    app.send(sendObj);
  })
  //fetch and draw messages & rooms
  app.fetch();
  app.render();
  setInterval(app.fetch, 1000);

};

app.render = function(){
  $("#roomContainer").html('');
  for(var key in app.chatRooms){
    if(app.chatRooms.hasOwnProperty(key)){
      //create a room
      $("#roomContainer").append(app.roomTemplate({name:key}));
    }
  }
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
    if(item.roomname !== undefined){
      //create chat room
      app.chatRooms[item.roomname] = true;
    }
    app.addMessage(item);
  });

  app.render();
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
  $('#chats').prepend(app.messageTemplate(preprocess));
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
