function loadArt() {
	let canvas = document.querySelector('canvas');

	canvas.width = $(document).width();
	canvas.height = $(document).height();
	// canvas.width = window.innerWidth;
	// canvas.height = window.innerHeight;

	const c = canvas.getContext('2d');

	// const debounce = (func) => {
	// 	let timer;
	// 	return (event) => {
	// 		if (timer) {
	// 			clearTimeout(timer);
	// 		}
	// 		timer = setTimeout(func, 100, event);
	// 	};
	// };

	// window.addEventListener(
	// 	'resize',
	// 	debounce(() => {
	// 		canvas.width = $(document).width();
	// 		canvas.height = $(document).height();
	// 	})
	// );

	for (let i = 0; i < 500; i++) {
		for (let j = 0; j < 500; j++) {
			c.fillStyle = `rgb(${i * 5}, ${j * 5}, ${(i + j) * 50})`;
			c.fillRect(j * 20, i * 20, 10, 10);
		}
	}

	$('body').css({ 'background-image': 'url(' + canvas.toDataURL('image/png') + ')' });
}

window.addEventListener('DOMContentLoaded', (event) => {
	console.log('DOM fully loaded and parsed');
	loadArt();
});

// let img = new Image();

// img.src = 'https://newevolutiondesigns.com/images/freebies/galaxy-wallpaper-31.jpg';
// window.onload = function() {
// 	// the initial image height
// 	var imgHeight = 0;

// 	// the scroll speed
// 	// an important thing to ensure here is that can.height
// 	// is divisible by scrollSpeed
// 	var scrollSpeed = 10;

// 	// this is the primary animation loop that is called 60 times
// 	// per second
// 	function loop() {
// 		// draw image 1
// 		ctx.drawImage(img, 0, imgHeight);

// 		// draw image 2
// 		ctx.drawImage(img, 0, imgHeight - can.height);

// 		// update image height
// 		imgHeight += scrollSpeed;

// 		// reseting the images when the first image entirely exits the screen
// 		if (imgHeight == can.height) imgHeight = 0;

// 		// this function creates a 60fps animation by scheduling a
// 		// loop function call before the
// 		// next redraw every time it is called
// 		window.requestAnimationFrame(loop);
// 	}

// 	// this initiates the animation by calling the loop function
// 	// for the first time
// 	loop();
// };
