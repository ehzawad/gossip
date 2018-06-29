window.onload = function () {
	var socket = io.connect('http://localhost:3000');
	var users = {}

	function render (data){
		for (var key in data) {
			if (!users.key) {
				/// store user data on the client side
				users[key] = data[key];

				var card = document.createElement('div')
        		card.setAttribute("class", "card");	
        		card.setAttribute("id", key);	
        		
        		var cardBody = document.createElement('div')
				cardBody.setAttribute('class', 'card-body')

				var text = document.createElement('h2')
				text.innerText = data[key].userName;				
        		
        		var useremail = document.createElement('p')
				useremail.innerText = data[key].userEmail;				


        		cardBody.appendChild(text);
        		cardBody.appendChild(useremail);
        		card.appendChild(cardBody);

        		sidebarCard.appendChild(card);
        		console.log(users);

			}
		}
       
     }

	/// getting current user data
	currentUserName = currentUserName.innerText;
	currentUserEmail = currentUserEmail.innerText;
	currentUserId = currentUserId.innerText;


	var message = document.getElementById('message');
		handle 	= document.getElementById('handle');
		btn 	= document.getElementById('send');
		output 	= document.getElementById('output');


	socket.emit('online', {
		userName: currentUserName,
		userId: currentUserId,
		userEmail: currentUserEmail
	});

	socket.on('previousOnline', function(data){
		console.log('previos')

		render(data);
		
	});

	socket.on('online', function(data){
		console.log(data);

		render(data);
	});

	btn.addEventListener('click', function(){
		socket.emit('chat', {
			message: message.value,
			handle: handle.value,
			from: currentUserId
		})

		message.value = "";
		var element = document.getElementById('chat-window');
		//element.scrollIntoView(true);
		element.scrollTo(0, element.scrollHeight + 300 );
	})


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
