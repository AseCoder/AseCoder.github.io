window.onresize = () => {
	resizeCanvas(windowWidth, windowHeight);
}
let points;
const bezres = 300;
const guidelineres = 50;
function setup() {
	createCanvas(windowWidth, windowHeight);
	points = [
		[windowWidth / 2, windowHeight / 8],
		[windowWidth / 4, windowHeight / 2],
		[windowWidth / 4 * 3, windowHeight / 2],
		[windowWidth / 2, windowHeight / 8 * 7],
	].map(point => point.map(coord => Math.round(coord / guidelineres) * guidelineres));
	colorMode(HSB, 100);
}
let mouseDown = false;
let pointBeingMoved;
let ptouch = [];
function draw() {
	resizeCanvas(windowWidth, windowHeight);
	clear();
	// guidelines
	strokeWeight(2.3);
	stroke(0);
	let currentGuidelineX = guidelineres;
	let currentGuidelineY = guidelineres;
	while (currentGuidelineX < windowWidth) {
		line(currentGuidelineX, 0, currentGuidelineX, windowHeight);
		currentGuidelineX += guidelineres;
	}
	while (currentGuidelineY < windowHeight) {
		line(0, currentGuidelineY, windowWidth, currentGuidelineY);
		currentGuidelineY += guidelineres;
	}
	// lines between points
	stroke(28);
	strokeWeight(3.8);
	line(...points[0], ...points[1]);
	line(...points[2], ...points[3]);
	// bez
	strokeWeight(4.5);
	let prevBezPoint;
	for (let i = 0; i <= bezres; i++) {
		const t = i / bezres;
		const x = points[0][0] + (t ** 3 - 3 * t ** 2 + 3 * t) * (points[1][0] - points[0][0]) + (3 * t ** 2 - 2 * t ** 3) * (points[2][0] - points[1][0]) + t ** 3 * (points[3][0] - points[2][0]);
		const y = points[0][1] + (t ** 3 - 3 * t ** 2 + 3 * t) * (points[1][1] - points[0][1]) + (3 * t ** 2 - 2 * t ** 3) * (points[2][1] - points[1][1]) + t ** 3 * (points[3][1] - points[2][1]);
		if (prevBezPoint) {
			stroke(100 * t, 100, 100);
			line(...prevBezPoint, x, y);
		}
		prevBezPoint = [x, y];
	}
	// points
	textSize(12);
	textAlign(CENTER);
	textFont('sans-serif')
	noStroke();
	points.forEach((point, i) => {
		fill(75);
		circle(...point, 12);
		fill(100)
		text('(' + point.join(', ') + ')', point[0], point[1] + 21)
	});
	movedX = mouseX - pmouseX;
	movedY = mouseY - pmouseY;
	if (mouseDown) {
		function movePoint() {
			let mousecoords;
			let moved;
			if (touches[0]?.x) {
				// define pos and moved by touch
				mousecoords = [touches[0].x, touches[0].y];
				ptouch[0] ??= touches[0].x;
				ptouch[1] ??= touches[0].y;
				moved = [touches[0].x - ptouch[0], touches[0].y - ptouch[1]];
			} else if (movedX !== 0 || movedY !== 0) {
				// define pos and moved by mouse
				mousecoords = [mouseX, mouseY];
				moved = [movedX, movedY];
			} else return;
			// get closest point, if any
			if (isNaN(pointBeingMoved)) {
				const closest = points.map((point, i) => [Math.sqrt( (point[0] - mousecoords[0]) ** 2 + (point[1] - mousecoords[1]) ** 2 ), i]).sort((a, b) => a[0] - b[0])[0];
				if (closest[0] > (touches[0]?.x === undefined ? 30 : 50)) return;
				pointBeingMoved = closest[1];
			}; 
			// move it according to mouse movement since last frame
			points[pointBeingMoved][0] = Math.max(Math.min(windowWidth, points[pointBeingMoved][0] + moved[0]), 0);
			points[pointBeingMoved][1] = Math.max(Math.min(windowHeight, points[pointBeingMoved][1] + moved[1]), 0);
		}
		movePoint();

	}
	if (mouseIsPressed || touches.length > 0) mouseDown = true; else {
		mouseDown = false;
		pointBeingMoved = undefined;
		ptouch = [];
	}
	if (touches.length > 0) {
		ptouch = [touches[0].x, touches[0].y];
	}
}
function touchStarted() {
	mouseDown = true;
}