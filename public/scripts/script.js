window.onload = function () {
	var socket = io.connect('http://localhost:3000');
	
	/// all the user ids
	var users = {}
	/// currently chatting with
	var chattingWith;

	/// getting current user data
	currentUserName = currentUserName.innerText;
	currentUserEmail = currentUserEmail.innerText;
	currentUserId = currentUserId.innerText;


	// renders the sidebar
	function render (data){
		for (var key in data) {
			if (key != currentUserId) {
				/// store user data on the client side
				users[key] = data[key];

				var card = document.createElement('div')
        		card.setAttribute("class", "card");	
        		card.setAttribute("id", key);	
				
				card.addEventListener('click', function(event){
					chattingWith = event.target.id;
					currentName.innerText = users[event.target.id].userName;
					currentEmail.innerText = users[event.target.id].userEmail;

					loadAllMessage( currentUserId, chattingWith);
				})    			

        		var cardBody = document.createElement('div')
				cardBody.setAttribute('class', 'card-body')
        		cardBody.setAttribute("id", key);	


				var text = document.createElement('h2')
				text.innerText = data[key].userName;				
        		text.setAttribute("id", key);	
        		
        		var useremail = document.createElement('p')
				useremail.innerText = data[key].userEmail;				
        		useremail.setAttribute("id", key);	


        		cardBody.appendChild(text);
        		cardBody.appendChild(useremail);
        		card.appendChild(cardBody);

        		sidebarCard.appendChild(card);

			}
		}
       
    }

    (function(){
    	var promise = ajaxCallGet("/get_all_users");
    	
    	promise.then(
    		response => {
    			var allUserData = JSON.parse(response);
    			render(allUserData.data);
    		}, 
    		error => {
    			console.log(error);
    		}
    	)

    })();

	

	/// gets the data from message, send button and output
	var message = document.getElementById('message');
		btn 	= document.getElementById('send');
		output 	= document.getElementById('output');

	/// emits that this guy is
	//  online
	socket.emit('online', {
		userName: currentUserName,
		userId: currentUserId,
		userEmail: currentUserEmail
	});

	/// Gets previous online people
	// 	when this guy logs in  
	socket.on('previousOnline', function(data){
		//render(data);
	});

	/// Gets data when a new guy comes in
	socket.on('online', function(data){
		//render(data);
	});


	// when clicked on send uiser emits the message
	// to the receipient
	// and also saves data to the database
	btn.addEventListener('click', function(){
		// if no receipient selected
		// error alert thrown
		if (chattingWith) {
			// emmiting data to chat
			var newMessage = {
				message: message.value,
				handle: currentUserName,
				to: chattingWith,
				from:  currentUserId,
				sentById: currentUserId,
				sentBy: currentUserName
			}

			socket.emit('chat', newMessage)
			
			// ajax call to save data
			var promise = ajaxCall("put_one_message", newMessage)

			promise.then (
		 		response =>  {
		 			response = JSON.parse(response);
		 			if (response.data == null) {
		 				var makeNewUser = ajaxCall("post_message", newMessage)
		 				makeNewUser.then( 
		 					response => {
		 						var againInsert = ajaxCall("put_one_message", newMessage)
		 					},
		 					error => {
								console.log( error );
		 					}
		 				)		
		 			}
				},
				error => {
					console.log( error );
				}
			);
	
			// clears the messege in 
			// message input field
			message.value = "";

			// TODO: if srollable limit crossed
			// scroll to last
			var element = document.getElementById('chat-window');
			element.scrollTo(0, element.scrollHeight + 300 );			
		} else {
			alert("Please select a user to send message");
		} 
	})

	/// when a chat is received shown on display
	socket.on('chat', function(data) {
		output.innerHTML += "<p><strong>" + data.handle + "</strong> " + data.message +"</p>"
	});


	// CLick the send button when the user releases a key on the keyboard
	message.addEventListener("keyup", function(event) {
	  event.preventDefault();

	  if (event.keyCode === 13) {
	    btn.click();
	  }
	}); 

}

 //// No hype only Vanilla!!!
function ajaxCall( url, request ){
 	let promiseObject = new Promise(( resolve, reject ) => {
		var xhttp = new XMLHttpRequest();
		xhttp.open('POST', "http://localhost:3000/gossip/"+url, true);
		xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	  	
	  	// I lied, Still no hype though :( 
	  	var params = jQuery.param(request);

	  	xhttp.onreadystatechange = function() {
	   	 	if (this.readyState == 4 && this.status == 200) {
	    		 resolve(this.responseText);
	     	}
	  	};

	  	xhttp.send(params);
	})

	return promiseObject;
}


function ajaxCallGet( url ){
 	let promiseObject = new Promise(( resolve, reject ) => {
		var xhttp = new XMLHttpRequest();

	  	xhttp.onreadystatechange = function() {
	   	 	if (this.readyState == 4 && this.status == 200) {
	    		 resolve(this.responseText);
	     	}
	  	};

		xhttp.open('GET', "http://localhost:3000/gossip/"+url, true);
	  	xhttp.send();
	})

	return promiseObject;
}


/// sheow previous messages on screen
function loadMessageOnScreen(){

}

/// load all messages
// TODO: Caching
function loadAllMessage(currentUser, remoteUser){

	let promise = ajaxCall("/get_message", { from: currentUser, to: remoteUser })
	console.log(currentUser)
	console.log(remoteUser)
	promise.then(
		response => {
			var messages 	= JSON.parse(response);
			var output  	= document.getElementById('output');
			output.innerHTML = "";
			
			if (messages.data) {
				messages = messages.data.message;
			
				for (var i = 0; i < messages.length; i++) {
					output.innerHTML += "<p><strong>" + messages[i].sentBy + "</strong> " + messages[i].message +"</p>"
				}
			}			
		}, 
		error => {

		}
	)

}