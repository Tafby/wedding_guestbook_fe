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
				console.log(json);
				renderImages(DATAS);
			});
	}

	function renderImages(DATAS) {
		const mainCard = document.getElementById('main-card-group');

		for (let i of DATAS) {
			if (i.images.length > 0) {
				const card = document.createElement('div');
				card.className = 'card';
				const cardBody = document.createElement('div');
				cardBody.className = 'card-body';
				mainCard.appendChild(card);

				for (let imgObj of i.images) {
					let img = document.createElement('img');
					let p = document.createElement('p');
					p.className = 'card-text';
					img.className = 'card-img-top';
					img.src = imgObj.img_url;
					p.textContent = imgObj.caption;
					card.appendChild(img);
					card.appendChild(cardBody);
					cardBody.appendChild(p);
					console.log('img', imgObj.img_url);
				}
			}
		}
	}
});
