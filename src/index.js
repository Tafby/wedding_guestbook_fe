'use strict';
let DATAS = [];
let COMMENTS = [];
const DATA_URL = 'http://localhost:3000/api/v1/users';
const COMMENTS_URL = 'http://localhost:3000/api/v1/comments';
const IMAGES_URL = 'http://localhost:3000/api/v1/images';
const imageCardBody = document.getElementById('image-cardBody');

window.addEventListener('DOMContentLoaded', (event) => {
	console.log('DOM fully loaded and parsed');
	// userForm();
	fetchingData();
	fetchingComments();
});

function fetchingData() {
	fetch(DATA_URL)
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			DATAS = json;
			renderImages(DATAS);
		});
}

function fetchingComments() {
	fetch(COMMENTS_URL)
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			COMMENTS = json;
		});
}

function renderComments(COMMENTS, imgObj, imageCardBody) {
	let commentsDiv = document.createElement('div');
	commentsDiv.id = 'comments';
	imageCardBody.appendChild(commentsDiv);

	for (let c of COMMENTS) {
		if (c.image_id === imgObj.id) {
			let comment = document.createElement('p');
			let smallUser = document.createElement('small');
			comment.textContent = c.comment;
			comment.id = 'comment-id';
			smallUser.textContent = ` - With Love, ${c.user.name}`;
			console.log('comments', c.comment);
			commentsDiv.appendChild(comment);
			comment.appendChild(smallUser);
		}
	}
}

function renderImages(DATAS) {
	const mainCard = document.getElementById('main-card-group');

	for (let i of DATAS) {
		if (i.images.length > 0) {
			for (let imgObj of i.images) {
				const card = document.createElement('div');
				card.className = 'card';
				const cardBody = document.createElement('div');
				cardBody.className = 'card-body';
				mainCard.appendChild(card);

				let img = document.createElement('img');
				img.addEventListener('click', () => {
					hideElements('main-card-group');
					renderShowPage(imgObj, i);
				});
				let p = document.createElement('p');
				p.className = 'card-text';
				img.className = 'card-img-top';
				img.src = imgObj.img_url;
				p.textContent = imgObj.caption;
				card.appendChild(img);
				card.appendChild(cardBody);
				cardBody.appendChild(p);
			}
		}
	}
}

function hideElements(element) {
	let e = document.getElementById(element);
	// mainCardGroup.removeAttribute('showDiv');
	e.id = 'hideDiv';
}

// function showElements() {
// 	let mainCardGroup = document.getElementById('main-card-group');
// 	mainCardGroup.removeAttribute('hideDiv');
// }

function renderShowPage(imgObj, data) {
	//the new card for a single image
	let body = document.body;
	let cardMb = document.createElement('div');
	cardMb.className = 'card';
	cardMb.style = 'max-width: 80rem;';

	let row = document.createElement('div');
	row.className = 'row no-gutters';
	let colOne = document.createElement('div');
	colOne.className = 'col-md-6';
	let colTwo = document.createElement('div');
	colTwo.classList = 'col-md-5';
	let cardBody = document.createElement('div');
	cardBody.className = 'card-body';
	cardBody.id = 'image-cardBody';
	let img = document.createElement('img');
	img.className = 'card-img';
	let cardCaption = document.createElement('h5');
	cardCaption.className = 'card-title';
	let colThree = document.createElement('div');
	colThree.className = 'col-md-1';

	//these elements will be on the right side of the single image card
	let userImg = document.createElement('img');
	let userName = document.createElement('p');
	let time = document.createElement('p');
	let likeButton = document.createElement('button');

	//comment elements
	let form = document.createElement('form');
	form.id = 'comment-form';
	form.className = 'form-class';
	let textInput = document.createElement('input');
	let submit = document.createElement('input');
	submit.type = 'submit';
	submit.className = 'btn btn-info';

	form.addEventListener('submit', (ev) => {
		ev.preventDefault();
		addNewComment(textInput, imgObj);
		document.getElementById('comment-form').reset();
	});
	//appending the form

	form.appendChild(textInput);
	form.appendChild(submit);

	//appending new card
	body.appendChild(cardMb);
	cardMb.appendChild(row);
	row.appendChild(colThree);
	row.appendChild(colOne);
	colOne.appendChild(img);
	row.appendChild(colTwo);
	colTwo.appendChild(cardBody);
	cardBody.appendChild(cardCaption);

	//appending comment section
	cardBody.appendChild(form);

	renderComments(COMMENTS, imgObj, cardBody);

	cardBody.appendChild(userImg);

	//text fill in
	img.src = imgObj.img_url;
	cardCaption.textContent = imgObj.caption;

	//filling in the card details
	userImg.src = data.avatar;
	userName.textContent = data.name;
	time.className = 'card-text';
	let smallText = document.createElement('small');
	smallText.className = 'text-muted';
	smallText.textContent = imgObj.created_at;
	time.appendChild(smallText);

	//like button
	likeButton.textContent = `Like: ${imgObj.likes}`;
	likeButton.className = 'btn btn-info';
	likeButton.addEventListener('click', () => {
		addLike(imgObj, likeButton);
	});

	cardBody.appendChild(likeButton);
	colThree.appendChild(userImg);
	colThree.appendChild(userName);
	cardBody.appendChild(time);
}

function addNewComment(textInput, imgObj) {
	fetch(COMMENTS_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			comment: textInput.value,
			user_id: 27,
			image_id: imgObj.id
		})
	})
		.then((resp) => resp.json())
		.then((json) => {
			let div = document.getElementById('comments');
			let comment = document.createElement('p');
			let smallUser = document.createElement('small');
			comment.textContent = json.comment;
			comment.id = 'comment-id';
			smallUser.textContent = ` - With Love, ${json.user.name}`;
			console.log('comments', json.comment);
			div.appendChild(comment);
			comment.appendChild(smallUser);
			div.appendChild(comment);
		});
}

function userForm() {
	let mainBody = document.body;
	let homeForm = document.createElement('form');

	let row = document.createElement('row');
	row.id = 'row-id';
	row.className = 'row';
	let colOne = document.createElement('div');
	colOne.className = 'col-md-4';
	let colTwo = document.createElement('div');
	colTwo.className = 'col-md-4';
	let colThree = document.createElement('div');
	colThree.className = 'col-md-4';

	mainBody.appendChild(row);
	row.appendChild(colOne);
	row.appendChild(colTwo);
	row.appendChild(colThree);
	colTwo.appendChild(homeForm);

	let nameDiv = document.createElement('div');
	nameDiv.className = 'form-group';

	let emailDiv = document.createElement('div');
	emailDiv.className = 'form-group';

	let imgDiv = document.createElement('div');
	imgDiv.className = 'form-group';

	homeForm.appendChild(nameDiv);
	homeForm.appendChild(emailDiv);
	homeForm.appendChild(imgDiv);

	// creating the form

	let inputName = document.createElement('input');
	let nameLabel = document.createElement('label');
	inputName.className = 'form-control';
	nameLabel.textContent = 'Name';

	let inputEmail = document.createElement('input');
	inputEmail.className = 'form-control';
	let emailLabel = document.createElement('label');
	emailLabel.textContent = 'Email';

	let inputImg = document.createElement('input');
	inputImg.type = 'file';
	inputImg.className = 'form-control-file';
	let imgLabel = document.createElement('label');
	imgLabel.textContent = 'Add Your Photo';

	let inputSubmit = document.createElement('button');
	inputSubmit.className = 'btn btn-primary mb-2';
	inputSubmit.id = 'home-submit';
	inputSubmit.type = 'submit';
	inputSubmit.textContent = 'Submit';

	homeForm.addEventListener('submit', (ev) => {
		ev.preventDefault();
		inputName.clear;
		creatUser(inputEmail, inputImg, inputName);
		fetchingData();
		hideElements('row-id');
	});

	// appending the form

	nameDiv.appendChild(nameLabel);
	nameDiv.appendChild(inputName);
	emailDiv.appendChild(emailLabel);
	emailDiv.appendChild(inputEmail);
	imgDiv.appendChild(imgLabel);
	imgDiv.appendChild(inputImg);
	homeForm.appendChild(inputSubmit);
}

function creatUser(inputEmail, inputImg, inputName) {
	fetch(DATA_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			name: inputName.value,
			email: inputEmail.value,
			avatar: inputImg.value
		})
	})
		.then((response) => {
			return response;
		})
		.then((json) => {
			console.log(json);
		});
}

function addLike(imgObj, likeButton) {
	imgObj.likes++;
	fetch(IMAGES_URL + `/${imgObj.id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			likes: imgObj.likes
		})
	})
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			likeButton.textContent = `Like: ${json.likes}`;
		});
}
