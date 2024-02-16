const chatLog = document.querySelector('#chat-log');

async function openChat(userId, username) {
	chatLog.innerHTML = '';

	const dataRoom  = await getDataRoom(userId);
	const dataChat = await getDataChat(dataRoom.room_id);

	await setupWebSocket(dataChat.room_id, dataChat.current_user);
	initializeChatLog(dataChat.current_user, dataChat.messages);
	appendChatHeader(dataChat.other_user_username, dataChat.other_user_avatar)

	document.getElementById('no-chat-selected-message').style.display = 'none';
	document.getElementById('message-input-container').style.display = 'flex';
}

async function getDataRoom(userId) {
	if (!userId || isNaN(userId)) {
		console.error('Invalid user ID:', userId);
	} 
	else {
		try {
			const data = await fetch("/chat/create_or_open_chat/" + userId)
			const response = await data.json();
			return response;
		}
		catch (error) {
			console.error('Error during AJAX request:', error);
		}
	}
}

async function getDataChat(roomId) {
  	try {
		const data = await fetch("/chat/" + roomId);
		const response = await data.json();
		return response;
	} 
	catch (error) {
		console.error('Error during AJAX request:', error);
	}
}

function setupWebSocket(roomId, currentUser) {
	const base_url = 'ws://' + window.location.hostname + ':' + window.location.port + '/ws/chat/' + roomId + '/';
	chatSocket = new WebSocket(base_url);
	chatSocket.onmessage = (event) => {
		const parsed = JSON.parse(event.data);
		addReceivedMessage(currentUser, parsed.username, parsed.message, parsed.user_avatar);
	};
}

let lastMessageSender = null;
function addReceivedMessage(currentUser, sender, message, userAvatar) {
	const messageElement = document.createElement('div')
	const avatarElement = document.createElement('img');
	const textElement = document.createElement('p');
	const divImgElement = document.createElement('div')

	if (sender === currentUser) {
		messageElement.className = 'sent-message';
	}
	else {
		if (sender != lastMessageSender) {
			userAvatar ? userAvatar : 'https://res.cloudinary.com/dw9xon1xs/image/upload/v1706288572/arya2_lr9qcd.png'; 
			avatarElement.src = userAvatar;
			avatarElement.alt = 'Avatar';
			textElement.className =  'special-style';

		}
		divImgElement.className = 'user-photo';
		messageElement.className = 'received-message';
		divImgElement.appendChild(avatarElement)
		messageElement.appendChild(divImgElement);
	}

	textElement.textContent = message;
	messageElement.appendChild(textElement);
	chatLog.appendChild(messageElement);
	messageElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
	lastMessageSender = sender;
}

function initializeChatLog(current_user, messages) {
	let lastUser = "";
	messages.forEach((item) => {
		const isCurrentUser = item.user === current_user;
		const isUserChange = lastUser !== item.user || lastUser === '';
		chatLog.innerHTML +=`
			<div> 
				${ isCurrentUser
					? `
						<div class="sent-message">
							<p class="${isUserChange ? 'special-style' : ''}">${item.content}</p>
						</div>
					`
					: `
						<div class="received-message">
						  <div class="user-photo">
							${
								isUserChange
								? `<img src="${item.avatar}" alt="${item.user}" >` 
								: '<div></div>'
							}
						  </div>
						  <p class="${isUserChange ? 'special-style' : ''}">${item.content}</p>
						</div>
					`
				}
			</div>
		`;
		lastUser = item.user;
	  })
  }

document.addEventListener('DOMContentLoaded', function() {
  	document.getElementById('chat-message-input').addEventListener('keydown', function(event) {
		if (event.key === 'Enter') {
			sendMessage();
			event.preventDefault(); 
		}
  });
});

function sendMessage() {
	const messageInputDom = document.getElementById('chat-message-input');
	const message = messageInputDom.value.trim();
	let lastMessage = null;

	if (message !== '' && window.chatSocket) {
		window.chatSocket.send(JSON.stringify({
			'message': message
		}));
	}
	messageInputDom.value = '';

}

function appendChatHeader(otherUserUsername, otherUserAvatar, parentElement) {
	const chatHeader = document.createElement('header');
	chatHeader.className = 'chat-header';
	const existingChatHeader = document.querySelector('.chat-header');
	if (existingChatHeader) {
		existingChatHeader.remove();
	}
	if (otherUserUsername) {
		const userPhoto = document.createElement('img');
		userPhoto.alt = 'Avatar';
		userPhoto.src = otherUserAvatar ?
						otherUserAvatar :
						'https://res.cloudinary.com/dw9xon1xs/image/upload/v1706288572/arya2_lr9qcd.png'; 


		const usernameElement = document.createElement('h2');
		usernameElement.textContent = otherUserUsername;
	
		const divImgElement = document.createElement('div');
		divImgElement.className = 'user-photo';
					
		console.log(divImgElement)
		divImgElement.appendChild(userPhoto);
		chatHeader.appendChild(divImgElement);
		chatHeader.appendChild(usernameElement);
	}

  	document.getElementById('header-container').appendChild(chatHeader);
}

function selectItem(item) {
	var items = document.querySelectorAll('.item-user');
	items.forEach(function (item) {
		item.classList.remove('selected');
	});

	item.classList.add('selected');
} 