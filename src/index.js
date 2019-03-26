'use strict';
let DATAS = [];
const DATA_URL = 'http://localhost:3000/api/v1/users';
window.addEventListener('DOMContentLoaded', (event) => {
	console.log('DOM fully loaded and parsed');

	fetchingData();

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

	function renderShowPage(imgObj, data) {
		document.getElementById('main-card-group').style.visibility = 'hidden';

		//the new card for a single image
		let body = document.body;
		let cardMb = document.createElement('div');
		cardMb.className = 'card mb-3';
		let row = document.createElement('div');
		row.className = 'row no-gutters';
		let colOne = document.createElement('div');
		colOne.className = 'col-md-4';
		let colTwo = document.createElement('div');
		colTwo.classList = 'col-md-8';
		let cardBody = document.createElement('div');
		cardBody.className = 'card-body';
		let img = document.createElement('img');
		img.className = 'card-img';
		let cardCaption = document.createElement('h5');
		cardCaption.className = 'card-title';

		//these elements will be on the right side of the single image card
		let userImg = document.createElement('img');
		let userName = document.createElement('p');
		let time = document.createElement('p');
		let likeButton = document.createElement('button');

		//comment elements
		let form = document.createElement('form');
		form.id = 'comment-form';
		let textInput = document.createElement('input');
		let submit = document.createElement('input');
		submit.type = 'submit';

		//appending new card
		body.appendChild(cardMb);
		cardMb.appendChild(row);
		row.appendChild(colOne);
		colOne.appendChild(img);
		row.appendChild(colTwo);
		colTwo.appendChild(cardBody);
		cardBody.appendChild(cardCaption);

		//text fill in
		img.src = imgObj.img_url;
		cardCaption.textInput = imgObj.caption;

		userImg = data.avatar;
		userName = data.name;
		time = imgObj.created_at;
		likeButton.textContent = `Like: ${imgObj.likes}`;
	}
});
