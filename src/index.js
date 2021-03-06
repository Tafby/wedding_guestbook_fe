'use strict';
let DATAS = [];
let COMMENTS = [];
let IMAGES = [];
const DATA_URL = 'http://localhost:3000/api/v1/users';
const COMMENTS_URL = 'http://localhost:3000/api/v1/comments';
const IMAGES_URL = 'http://localhost:3000/api/v1/images';
const imageCardBody = document.getElementById('image-cardBody');

window.addEventListener('DOMContentLoaded', (event) => {
	console.log('DOM fully loaded and parsed');

	//this checks if a user has been created in localstorage
	let user = localStorage.getItem('user_id');
	if (user === null) {
		hideButton('imageB');
		hideButton('attending');
		userForm();
	} else {
		fetchingImages();
		fetchingComments();
		fetchingData();
	}
});

//FETCHING FUNCTIONS
//this fetches the all users
function fetchingData() {
	fetch(DATA_URL)
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			DATAS = json;
		});
}
//this fetches all comments
function fetchingComments() {
	fetch(COMMENTS_URL)
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			COMMENTS = json;
		});
}
//this fetches all images
function fetchingImages() {
	fetch(IMAGES_URL)
		.then((response) => {
			return response.json();
		})
		.then((json) => {
			IMAGES = json;
			renderImages(json);
		});
}
//RENDER FUNCTIONS
//this function renders comments by creating the elements and showing them to the page
function renderComments(COMMENTS, imgObj, imageCardBody) {
	//creating the comments div, comment title, and creates card body
	let commentsDiv = document.createElement('div');
	let p = document.createElement('p');
	p.textContent = 'Comments';
	p.id = 'p-comment';
	imageCardBody.append(p);
	commentsDiv.id = 'comments';
	commentsDiv.className = 'card';
	imageCardBody.appendChild(commentsDiv);
	//iterating through the comments and creating each comment div
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
			cDiv.appendChild(comment);
			comment.appendChild(smallUser);
		}
	}
}
//this function will render all images by creating the elements and showing them on the page
function renderImages(IMAGES) {
	let mainCard = document.getElementById('main-card-group');
	// if (i.images.length > 0) {
	for (let image of IMAGES) {
		const card = document.createElement('div');
		card.className = 'card shadow-lg';
		card.id = 'image-main-card';
		const cardBody = document.createElement('div');
		cardBody.className = 'card-body';
		mainCard.appendChild(card);

		let img = document.createElement('img');
		//when you click an image, this will hide all images and show one image
		img.addEventListener('click', () => {
			hideElements('main-card-group');
			renderShowPage(image);
		});
		let p = document.createElement('p');
		p.className = 'card-text';
		img.className = 'card-img-top';
		img.src = image.img_url;
		p.textContent = image.caption;
		p.id = 'main-image-cap';
		card.appendChild(img);
		card.appendChild(cardBody);
		cardBody.appendChild(p);
	}
}

//this function will render a new show page for each image
function renderShowPage(image) {
	hideButton('imageB');
	hideButton('attending');

	//the new card for a single image
	let body = document.body;
	let cardDiv = document.createElement('div');
	cardDiv.className = 'card shadow-lg';
	cardDiv.id = 'show-card';
	cardDiv.style = 'max-width:';

	//this is the divs within the cardDiv
	let showRow = document.createElement('div');
	showRow.className = 'row';
	showRow.id = 'show-row-id';
	let showColOne = document.createElement('div');
	showColOne.className = 'col-md-2';
	let showColTwo = document.createElement('div');
	showColTwo.className = 'col-md-10';

	cardDiv.appendChild(showRow);
	showRow.appendChild(showColOne);
	showRow.appendChild(showColTwo);

	//this is the body's row and divs
	let row = document.createElement('div');
	row.className = 'row';
	let colTwo = document.createElement('div');
	colTwo.className = 'col-md-10';
	let colThree = document.createElement('div');
	colThree.classList = 'col-md-1';
	let cardBody = document.createElement('div');

	//this is the card body that holds the info
	cardBody.className = 'card-body';
	cardBody.id = 'image-cardBody';
	let img = document.createElement('img');
	img.className = 'card-img';
	img.id = 'img-show';
	let cardCaption = document.createElement('h5');
	cardCaption.className = 'card-title';
	cardCaption.id = 'card-caption';
	let colOne = document.createElement('div');
	colOne.className = 'col-md-1';

	//these elements will be on the right side of the single image card
	let userDiv = document.createElement('div');
	userDiv.id = 'user-div';
	let backDiv = document.createElement('div');
	backDiv.id = 'back-div';
	let userName = document.createElement('p');
	userName.id = 'user-name';
	let userImg = document.createElement('img');
	userImg.id = 'user-img';
	let likeButton = document.createElement('button');

	// Adding a back button to the page
	let backButton = document.createElement('button');
	backButton.id = 'back-button';
	backButton.textContent = 'Go Back';
	backButton.className = 'btn';
	//when you click the back button, it removes row(which is the show page) and unhides the main images page
	backButton.addEventListener('click', () => {
		$(row).remove();
		goBack();
	});

	//comment elements
	let form = document.createElement('form');
	let formDivA = document.createElement('div');
	let formDivB = document.createElement('div');
	formDivA.className = 'form-group';
	formDivB.className = 'form-group';
	form.id = 'comment-form';
	let textInput = document.createElement('input');
	textInput.id = 'comment-text-input';
	textInput.placeholder = 'Add a comment!';
	textInput.className = 'form-control';
	let submit = document.createElement('input');
	submit.type = 'submit';
	submit.id = 'comment-submit';
	submit.className = 'btn';
	//submit button will add a new comment
	form.addEventListener('submit', (ev) => {
		ev.preventDefault();
		addNewComment(textInput, image);
		document.getElementById('comment-form').reset();
	});
	//appending the form
	form.appendChild(formDivA);
	form.appendChild(formDivB);
	formDivA.appendChild(textInput);
	formDivB.appendChild(submit);

	//appending new card
	colTwo.appendChild(cardDiv);
	body.appendChild(row);
	row.appendChild(colThree);
	row.appendChild(colTwo);
	cardBody.appendChild(img);
	row.appendChild(colOne);
	showColTwo.appendChild(cardBody);
	cardBody.appendChild(cardCaption);

	//appending comment section
	cardBody.appendChild(form);
	renderComments(COMMENTS, image, cardBody);

	userImg.src = image.user.avatar;
	userName.textContent = ` Posted By: ${image.user.name}`;
	//text fill in
	img.src = image.img_url;
	cardCaption.textContent = `"${image.caption}"`;

	//like button
	likeButton.textContent = `Like this photo: ${image.likes} `;
	likeButton.className = 'btn';
	likeButton.id = 'like-button';
	//like button will add a like unpon click
	likeButton.addEventListener('click', () => {
		addLike(image, likeButton);
	});

	showColOne.appendChild(userDiv);
	showColOne.appendChild(likeButton);
	userDiv.appendChild(userName);
	userDiv.appendChild(userImg);
	showColOne.appendChild(backDiv);
	backDiv.appendChild(backButton);
}
//----END OF SHOW PAGE FUNCTION----

//---HIDE AND SHOW FUNCTIONS---
//this function hides elements and fades them out
function hideElements(element) {
	$('#' + element).fadeOut('slow', function() {
		// Animation complete
	});
}

//this function hides buttons and fades them out
function hideButton(element) {
	$('#' + element).fadeOut();
}

//this function shows the elements and fades them in
function showElements(element) {
	$('#' + element).fadeIn('slow', function() {
		// Animation complete
	});
}

//GO BACK FUNCTION
//shows all the main page elements
function goBack() {
	showElements('main-card-group');
	showElements('imageB');
	showElements('attending');
}

//adds a new comment via post
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
			//adding a new comment on the show page once created
			COMMENTS.push(json);
			let div = document.getElementById('comments');

			let cDiv = document.createElement('div');
			cDiv.className = 'card-body';
			cDiv.id = 'c-div';

			let comment = document.createElement('p');

			let smallUser = document.createElement('small');
			comment.textContent = json.comment;
			comment.id = 'comment-id';
			smallUser.textContent = ` - With Love, ${json.user.name}`;

			cDiv.appendChild(comment);
			comment.appendChild(smallUser);
			div.appendChild(cDiv);
		});
}
//CREATE USERS FUNCTION
//creates the new user form
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
	inputImg.className = 'form-control-file';
	let imgLabel = document.createElement('label');
	imgLabel.textContent = 'Add Your Photo';

	let inputSubmit = document.createElement('button');
	inputSubmit.className = 'btn';
	inputSubmit.id = 'home-submit';
	inputSubmit.type = 'submit';
	inputSubmit.textContent = 'Submit';

	//upon submit, this will create a user and show all the images and buttons on main page while hiding the user form
	homeForm.addEventListener('submit', (ev) => {
		ev.preventDefault();
		createUser(inputEmail, inputImg, inputName);
		showElements('imageB');
		showElements('attending');
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
//creates user via post, sets the local storage, and fetches all
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
			localStorage.setItem('user_id', json.id);
			localStorage.setItem('avatar', json.avatar);
			localStorage.setItem('name', json.name);
			fetchingImages();
			fetchingData();
			fetchingComments();
		});
}

//this adds a like via patch and updates on page
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
			likeButton.textContent = `Like this photo! ${json.likes} `;
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

//creates new image
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

	// creating the form for new image
	let inputCaption = document.createElement('input');
	let captionLabel = document.createElement('label');
	inputCaption.className = 'form-control';
	inputCaption.id = 'input-caption';
	captionLabel.textContent = 'Add a Caption!';

	let inputImg = document.createElement('input');
	inputImg.className = 'form-control-file';
	inputImg.id = 'img-input';
	let imgLabel = document.createElement('label');
	imgLabel.textContent = 'Add Your Photo';

	let inputSubmit = document.createElement('button');
	inputSubmit.className = 'btn';
	inputSubmit.id = 'image-submit';
	inputSubmit.type = 'submit';
	inputSubmit.textContent = 'Submit';
	//upon click, this will create image, and hide the create image form
	imageForm.addEventListener('submit', (ev) => {
		ev.preventDefault();
		createImage();
		hideElements('image-form');
	});

	// appending the form
	captionDiv.appendChild(captionLabel);
	captionDiv.appendChild(inputCaption);
	buttonDiv.appendChild(imgLabel);
	buttonDiv.appendChild(inputImg);
	imageForm.appendChild(inputSubmit);
}

//grabbing the add memory button
let imageB = document.getElementById('imageB');
//upon click it will hide the main images and create an image
imageB.addEventListener('click', () => {
	hideElements('main-card-group');
	createImageForm();
});

//creates an image via post and displays to page
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
			return resp.json();
		})
		.then((json) => {
			showElements('main-card-group');
			createSingleImage(json);
		});
}

//this function will create a single image to show on the page(same as render image)
function createSingleImage(image) {
	let mainCard = document.getElementById('main-card-group');
	const card = document.createElement('div');
	card.className = 'card';
	const cardBody = document.createElement('div');
	cardBody.className = 'card-body';
	mainCard.appendChild(card);
	card.id = 'image-main-card';

	let img = document.createElement('img');
	img.addEventListener('click', () => {
		hideElements('main-card-group');
		renderShowPage(image);
	});
	let p = document.createElement('p');
	p.className = 'card-text';
	img.className = 'card-img-top';
	img.src = document.getElementById('img-input').value;
	p.textContent = document.getElementById('input-caption').value;
	p.id = 'main-image-cap';
	card.appendChild(img);
	card.appendChild(cardBody);
	cardBody.appendChild(p);
}

//ATTENDING BUTTON AND FUNCTION
//adds an see whos attending button
let attending = document.getElementById('attending');
//upon click it will hide the main images page and show whos coming to the event
attending.addEventListener('click', () => {
	hideElements('main-card-group');
	showAttendents(DATAS);
});

//this will create each user image in the whos coming page
function showAttendents(DATAS) {
	hideButton('imageB');
	hideButton('attending');
	let mainBody = document.body;
	let mainFaceDiv = document.createElement('div');
	mainFaceDiv.id = 'main-face-div';
	let faceBackButton = document.createElement('button');
	faceBackButton.id = 'back-button';
	faceBackButton.textContent = 'Go Back';
	faceBackButton.className = 'btn';
	mainBody.appendChild(mainFaceDiv);
	mainFaceDiv.appendChild(faceBackButton);
	faceBackButton.addEventListener('click', () => {
		goBackUsers();
	});
	fetchingData();
	//looping through the 'data' or users
	for (let data of DATAS) {
		let faceDiv = document.createElement('div');
		faceDiv.id = 'face-div';
		let faceName = document.createElement('p');
		faceName.id = 'face-name';
		faceName.textContent = data.name;
		let faceImg = document.createElement('img');
		faceImg.id = 'user-img';
		faceImg.src = data.avatar;
		mainFaceDiv.appendChild(faceDiv);
		faceDiv.appendChild(faceName);
		faceDiv.appendChild(faceImg);
	}
}
//a go back button that will hide the whos coming page and show the main images page
function goBackUsers() {
	$('#main-face-div').remove();
	$('#show-row-id').remove();
	hideElements('main-face-div');
	showElements('main-card-group');
	showElements('imageB');
	showElements('attending');
}

//---CLOCK JS WE FOUND FROM FLIPCLOCK.JS---
function getTimeRemaining(endtime) {
	var t = Date.parse(endtime) - Date.parse(new Date());
	var seconds = Math.floor((t / 1000) % 60);
	var minutes = Math.floor((t / 1000 / 60) % 60);
	var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
	var days = Math.floor(t / (1000 * 60 * 60 * 24));
	return {
		total: t,
		days: days,
		hours: hours,
		minutes: minutes,
		seconds: seconds
	};
}

function initializeClock(id, endtime) {
	var clock = document.getElementById(id);
	var daysSpan = clock.querySelector('.days');
	var hoursSpan = clock.querySelector('.hours');
	var minutesSpan = clock.querySelector('.minutes');
	var secondsSpan = clock.querySelector('.seconds');

	function updateClock() {
		var t = getTimeRemaining(endtime);

		daysSpan.innerHTML = t.days;
		hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
		minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
		secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

		if (t.total <= 0) {
			clearInterval(timeinterval);
		}
	}

	updateClock();
	var timeinterval = setInterval(updateClock, 1000);
}
var deadline = new Date(Date.parse(new Date()) + 90 * 24 * 60 * 60 * 1000);
initializeClock('clockdiv', deadline);
