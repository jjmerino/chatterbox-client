// YOUR CODE HERE:

var app = {
  server: 'https://api.parse.com/1/classes/chatterbox/?order=-createdAt',
  chatRooms: {},
  currentRoom: "lobby",
  chatMessages: []
};


app.init = function(){
  app.username = getParameterByName('username');
  //load templates
  app.roomTemplate = _.template($('#roomItem').html());
  app.messageTemplate = _.template($('#messageTemplate').html());
  app.update();
  setInterval(app.update, 1000);

  $('.username').on('click', function(){ app.addFriend(); })
  $('#messageForm').on('submit', function(e){
    e.preventDefault();
    var text = $('#inputText').val();
    if(text.length<1){
      return;
    }
    $('#inputText').val('');

    var sendObj = {username:app.username, text:text, roomname:app.currentRoom};
    app.send(sendObj);
  });
};

app.render = function(){
  $("#roomContainer").html('');
  $('#chats').html('');
  for(var i = 0; i < app.chatMessages.length; i++){

    if(app.currentRoom === app.chatMessages[i].roomname){

        directionClass = 'right';
        directionClassB = 'left';

      app.chatMessages[i].ago = moment(app.chatMessages[i].createdAt).fromNow();


      app.chatMessages[i].directionClass = directionClass;
      app.chatMessages[i].directionClassB = directionClassB;
      $('#chats').prepend(app.messageTemplate(app.chatMessages[i]));
    }
  }
  for(var key in app.chatRooms){
    if(app.chatRooms.hasOwnProperty(key)){
      //create a room
      var className;
      if(app.currentRoom === key){
        className = "active";
      } else {
        className = "";
      }
      var el = app.roomTemplate({name:key,className:className});
      var $el = $(el);
      $("#roomContainer").append($el);
      //Handle events
      $el.find('a').on('click', function(e){
        console.log("Did you click me!");
        console.log( $(this).attr('data-roomname'));
        app.currentRoom = $(this).attr('data-roomname');
        app.render();
      });


    }
  }
//
//  var objDiv = document.getElementById("chats");
//  objDiv.scrollTop = objDiv.scrollHeight;
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
  // create a set
  _.each(data.results, function(item, index){
    if(item.roomname !== undefined){
      //create chat room
      app.chatRooms[_.escape(item.roomname)] = true;
      //add to set
    }
    app.addMessage(item);
  });
  app.render();
}

app.errorCallback = function(data){
  console.log("there is a callback error");
}

app.clearMessages = function(element){
  app.chatMessages = [];
};

app.addMessage = function(message){
  //var el = $('<div>');
  //$('#chats').append(el);
  var preprocess = app.preprocess(message);
  app.chatMessages.push(preprocess);

};

app.addRoom = function(roomName){
  var el = $('<div>');
  $('#roomSelect').append(el);
};

app.addFriend = function(){

};

app.update = function(){

  //fetch and draw messages & rooms
  app.fetch();

};

$(document).ready(app.init);

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
