'use strict';
let DATAS = [];
let COMMENTS = [];
const DATA_URL = 'http://localhost:3000/api/v1/users';
const COMMENTS_URL = 'http://localhost:3000/api/v1/comments';
const IMAGES_URL = 'http://localhost:3000/api/v1/images';
const imageCardBody = document.getElementById('image-cardBody');

window.addEventListener('DOMContentLoaded', (event) => {
	console.log('DOM fully loaded and parsed');

	let user = localStorage.getItem('user_id');
	if (user === null) {
		hideButton('imageB');
		userForm();
	} else {
		fetchingData();
		fetchingComments();
	}
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
	commentsDiv.className = 'card';
	imageCardBody.appendChild(commentsDiv);

	for (let c of COMMENTS) {
		if (c.image_id === imgObj.id) {
			let cDiv = document.createElement('div');
			cDiv.className = 'card-body';
			cDiv.id = 'c-div';
			commentsDiv.appendChild(cDiv);
			let comment = document.createElement('p');
			let smallUser = document.createElement('small');
			comment.textContent = c.comment;
			comment.id = 'comment-id';
			smallUser.textContent = ` - With Love, ${c.user.name}`;
			console.log('comments', c.comment);
			cDiv.appendChild(comment);
			comment.appendChild(smallUser);
		}
	}
}

function renderImages(DATAS) {
	let mainCard = document.getElementById('main-card-group');

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

function hideButton(element) {
	let e = document.getElementById(element);
	// mainCardGroup.removeAttribute('showDiv');
	e.id = 'hideButton';
}

function showElements(oldElement, newElement) {
	let e = document.getElementById(oldElement);
	e.removeAttribute('id');
	e.setAttribute('id', newElement);
}

function renderShowPage(imgObj, data) {
	hideButton('imageB');
	//the new card for a single image
	let body = document.body;
	let cardMb = document.createElement('div');
	cardMb.className = 'card';
	cardMb.id = 'show-card';
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
	userImg.id = 'user-img';
	let userName = document.createElement('p');
	let time = document.createElement('p');
	let likeButton = document.createElement('button');

	// Adding a back button to the page
	let backButton = document.createElement('button');
	backButton.id = 'back-button';
	backButton.textContent = 'Go Back';
	backButton.className = 'btn btn-info';
	backButton.addEventListener('click', () => {
		goBack();
	});

	//comment elements
	let form = document.createElement('form');
	form.id = 'comment-form';
	form.className = 'form-class';
	let textInput = document.createElement('input');
	textInput.placeholder = 'Add a comment!';
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
	colOne.appendChild(cardCaption);

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
	colOne.appendChild(userImg);
	colOne.appendChild(userName);
	colOne.appendChild(backButton);
	cardBody.appendChild(time);
}

function goBack() {
	hideElements('show-card');
	showElements('hideDiv', 'main-card-group');
	showElements('hideButton', 'imageB');
	fetchingData();
}

function addNewComment(textInput, imgObj) {
	fetch(COMMENTS_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			comment: textInput.value,
			user_id: localStorage.getItem('user_id'),
			image_id: imgObj.id
		})
	})
		.then((resp) => resp.json())
		.then((json) => {
			let div = document.getElementById('comments');

			let cDiv = document.createElement('div');
			cDiv.className = 'card-body';
			cDiv.id = 'c-div';

			let comment = document.createElement('p');

			let smallUser = document.createElement('small');
			comment.textContent = json.comment;
			comment.id = 'comment-id';
			smallUser.textContent = ` - With Love, ${json.user.name}`;
			console.log('comments', json.comment);

			cDiv.appendChild(comment);
			comment.appendChild(smallUser);
			div.appendChild(cDiv);
		});
}

function userForm() {
	let mainBody = document.body;
	let homeForm = document.createElement('form');
	centerForm(mainBody, homeForm);

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
		createUser(inputEmail, inputImg, inputName);
		showElements('hideDiv', 'imageB');
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

function createUser(inputEmail, inputImg, inputName) {
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
			return response.json();
		})
		.then((json) => {
			console.log(json);
			localStorage.setItem('user_id', json.id);
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

// This function centers a form on the page
function centerForm(mainAppend, formElement) {
	let row = document.createElement('row');
	row.id = 'row-id';
	row.className = 'row';
	let colOne = document.createElement('div');
	colOne.className = 'col-md-4';
	let colTwo = document.createElement('div');
	colTwo.className = 'col-md-4';
	let colThree = document.createElement('div');
	colThree.className = 'col-md-4';

	mainAppend.appendChild(row);
	row.appendChild(colOne);
	row.appendChild(colTwo);
	row.appendChild(colThree);
	colTwo.appendChild(formElement);
}

//add image section

function createImageForm() {
	let mainBody = document.body;
	let imageForm = document.createElement('form');
	imageForm.id = 'image-form';
	centerForm(mainBody, imageForm);

	let captionDiv = document.createElement('div');
	captionDiv.className = 'form-group';

	let imageDiv = document.createElement('div');
	imageDiv.className = 'form-group';

	let buttonDiv = document.createElement('div');
	buttonDiv.className = 'form-group';

	imageForm.appendChild(captionDiv);
	imageForm.appendChild(imageDiv);
	imageForm.appendChild(buttonDiv);

	// creating the form

	let inputCaption = document.createElement('input');
	let captionLabel = document.createElement('label');
	inputCaption.className = 'form-control';
	inputCaption.id = 'input-caption';
	captionLabel.textContent = 'Add a Caption!';

	let inputImg = document.createElement('input');
	// inputImg.type = 'file';
	inputImg.className = 'form-control-file';
	inputImg.id = 'img-input';
	let imgLabel = document.createElement('label');
	imgLabel.textContent = 'Add Your Photo';

	let inputSubmit = document.createElement('button');
	inputSubmit.className = 'btn btn-primary mb-2';
	inputSubmit.id = 'image-submit';
	inputSubmit.type = 'submit';
	inputSubmit.textContent = 'Submit';

	imageForm.addEventListener('submit', (ev) => {
		ev.preventDefault();
		createImage();
		hideElements('image-form');
		showElements('hideDiv', 'main-card-group');
		// renderImages(DATAS);
	});

	// appending the form
	captionDiv.appendChild(captionLabel);
	captionDiv.appendChild(inputCaption);
	buttonDiv.appendChild(imgLabel);
	buttonDiv.appendChild(inputImg);
	imageForm.appendChild(inputSubmit);
}

let imageB = document.getElementById('imageB');
console.log('image b', imageB);
imageB.addEventListener('click', () => {
	console.log('fired!!!!!!!!');
	const mainCard = document.getElementById('main-card-group');
	hideElements('main-card-group');
	createImageForm();
});

function createImage() {
	fetch(IMAGES_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			img_url: document.getElementById('img-input').value,
			caption: document.getElementById('input-caption').value,
			likes: 0,
			user_id: localStorage.getItem('user_id')
		})
	})
		.then((resp) => {
			resp.json;
		})
		.then((json) => {
			fetchingData(json);
		});
}
