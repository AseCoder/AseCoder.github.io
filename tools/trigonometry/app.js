const canvas = document.getElementById('triangle');

let knobPos = [200, 200];
let mousePressed = false;
let mouseInCanvas = false;
let maxHeight = canvas.height - 20;
const leftmargin = 10;
let canvasRect = canvas.getBoundingClientRect();
let canvasPos = [canvasRect.left, canvasRect.top];

function setCanvasSize() {
	canvas.style.width = '100%';
	canvas.style.height = '60vh';
	canvas.width  = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	maxHeight = canvas.height - 20;
	canvasRect = canvas.getBoundingClientRect();
	canvasPos = [canvasRect.left, canvasRect.top];
	updateTriangle();
}
window.onresize = setCanvasSize;
setCanvasSize();

function updateTriangle() {
	const ctx = canvas.getContext('2d');
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.beginPath()
	ctx.lineTo(knobPos[0] + leftmargin, maxHeight - knobPos[1]);
	ctx.lineTo(leftmargin, maxHeight);
	ctx.strokeStyle = '#999';
	ctx.lineWidth = 4;
	ctx.setLineDash([8, 8]);
	ctx.stroke();

	ctx.beginPath();
	ctx.lineTo(leftmargin, maxHeight);
	ctx.lineTo(knobPos[0] + leftmargin, maxHeight);
	ctx.lineTo(knobPos[0] + leftmargin, maxHeight - knobPos[1]);
	ctx.strokeStyle = 'black';
	ctx.setLineDash([]);
	ctx.stroke();

	ctx.fillStyle = 'black';
	const pointR = 5;
	ctx.beginPath();
	ctx.arc(leftmargin, maxHeight, pointR, 0, 2 * Math.PI);
	ctx.fill();

	ctx.beginPath();
	ctx.arc(knobPos[0] + leftmargin, maxHeight, pointR, 0, 2 * Math.PI);
	ctx.fill();

	ctx.fillStyle = '#03f';
	ctx.beginPath();
	ctx.arc(knobPos[0] + leftmargin, maxHeight - knobPos[1], pointR * 1.5, 0, 2 * Math.PI);
	ctx.fill();

	ctx.fillStyle = 'black';
	ctx.font = '11px monospace';
	const lengthOpposite = knobPos[1];
	const lengthAdjacent = knobPos[0];

	const radians = Math.atan(lengthOpposite / lengthAdjacent);
	const angle = Math.atan(lengthOpposite / lengthAdjacent) * (180 / Math.PI);
	ctx.fillText(Math.round(angle) + '°', leftmargin + Math.min(Math.abs(24 / (radians + 0.02)), lengthAdjacent - 40) + 5, maxHeight - 8);

	ctx.fillText((lengthOpposite / 10).toFixed(1), knobPos[0] + 10 + leftmargin, maxHeight - (lengthOpposite / 2));

	const lengthHypotenuse = Math.sqrt(lengthOpposite ** 2 + lengthAdjacent ** 2);
	const lengthHypotenuseText = (lengthHypotenuse / 10).toFixed(1);
	const hypmeasurement = ctx.measureText(lengthHypotenuseText);
	ctx.fillText(
		lengthHypotenuseText,
		leftmargin + (knobPos[0] - hypmeasurement.width) / 2 - 20,
		maxHeight - knobPos[1] / 2 - 5
	);

	const lengthAdjacentText = (lengthAdjacent / 10).toFixed(1);
	const adjcmeasurement = ctx.measureText(lengthAdjacentText);
	ctx.fillText(lengthAdjacentText, leftmargin + ((lengthAdjacent - adjcmeasurement.width) / 2), maxHeight + 20);


	// tables
	document.getElementById('tantitle').innerText = `tan(${angle.toFixed(2)}°)`;
	document.getElementById('sintitle').innerText = `sin(${angle.toFixed(2)}°)`;
	document.getElementById('costitle').innerText = `cos(${angle.toFixed(2)}°)`;
	document.getElementById('arctantitle').innerText = `arctan(${(lengthOpposite / 10).toFixed(1)}/${(lengthAdjacent / 10).toFixed(1)})`;

	document.getElementById('tan').innerText = Math.tan(radians).toFixed(4);
	document.getElementById('sin').innerText = Math.sin(radians).toFixed(4);
	document.getElementById('cos').innerText = Math.cos(radians).toFixed(4);
	document.getElementById('arctan').innerText = angle.toFixed(2) + '°';
}

updateTriangle();

canvas.onmousedown = (e) => {
	mousePressed = true;
};
canvas.ontouchstart = (e) => {
	mousePressed = true;
};
canvas.onmouseup = (e) => {
	mousePressed = false;
}
canvas.ontouchend = (e) => {
	mousePressed = false;
}
canvas.onmouseenter = (e) => {
	mouseInCanvas = true;
}
canvas.onmouseout = (e) => {
	mouseInCanvas = false;
}
const onmove = (e) => {
	if (!mousePressed || !mouseInCanvas) return;
	knobPos = [e.clientX - canvasPos[0] - leftmargin, maxHeight - e.clientY + canvasPos[1] - window.scrollY];
	updateTriangle();
};
canvas.onmousemove = onmove;
canvas.ontouchmove = onmove;

function dimensionChange() {
	const width = parseFloat(document.getElementById('width').value) * 10;
	const height = parseFloat(document.getElementById('height').value) * 10;
	knobPos = [
		isNaN(width) ? knobPos[0] : width,
		isNaN(height) ? knobPos[1] : height
	];
	updateTriangle();
}