const pointCoordinates = [undefined, undefined, undefined, undefined, undefined, undefined];
const canvas = document.getElementById('plot');
const ctx = canvas.getContext('2d');

function redraw() {
	const x_1 = pointCoordinates[0],
		y_1 = pointCoordinates[1],
		x_2 = pointCoordinates[2],
		y_2 = pointCoordinates[3],
		x_3 = pointCoordinates[4],
		y_3 = pointCoordinates[5];
	if (pointCoordinates.some(x => typeof x !== 'number')) throw new Error('Not all point coordinates are numbers.');
	/*
		calculate a, b, c
		formulas are derived from system of equations:
		{
			a*x_1^2+b*x_1+c=y_1
			a*x_2^2+b*x_2+c=y_2
			a*x_3^2+b*x_3+c=y_3
		}
	*/
	const a_exact = (x_1 * (y_3 - y_2) - x_2 * y_3 + x_3 * y_2 + (x_2 - x_3) * y_1) / (x_1 * (x_3 ** 2 - x_2 ** 2) - x_2 * x_3 ** 2 + x_2 ** 2 * x_3 + x_1 ** 2 * (x_2 - x_3));
	let a = (a_exact).toFixed(8);
	while (a.length > 1 && ['0', '.'].includes(a[a.length - 2]) && ['0', '.'].includes(a[a.length - 1])) {
		a = a.slice(0, a.length - 1);
	}
	if (a[a.length - 1] === '.') a = a.slice(0, a.length - 1);
	const b_exact = -(x_1 ** 2 * (y_3 - y_2) - x_2 ** 2 * y_3 + x_3 ** 2 * y_2 + (x_2 ** 2 - x_3 ** 2) * y_1) / (x_1 * (x_3 ** 2 - x_2 ** 2) - x_2 * x_3 ** 2 + x_2 ** 2 * x_3 + x_1 ** 2 * (x_2 - x_3));
	let b = (b_exact).toFixed(8);
	while (b.length > 1 && ['0', '.'].includes(b[b.length - 2]) && ['0', '.'].includes(b[b.length - 1])) {
		b = b.slice(0, b.length - 1);
	}
	if (b[b.length - 1] === '.') b = b.slice(0, b.length - 1);
	const c_exact = (x_1 * (x_3 ** 2 * y_2 - x_2 ** 2 * y_3) + x_1 ** 2 * (x_2 * y_3 - x_3 * y_2) + (x_2 ** 2 * x_3 - x_2 * x_3 ** 2) * y_1) / (x_1 * (x_3 ** 2 - x_2 ** 2) - x_2 * x_3 ** 2 + x_2 ** 2 * x_3 + x_1 ** 2 * (x_2 - x_3));
	let c = (c_exact).toFixed(8);
	while (c.length > 1 && ['0', '.'].includes(c[c.length - 2]) && ['0', '.'].includes(c[c.length - 1])) {
		c = c.slice(0, c.length - 1);
	}
	if (c[c.length - 1] === '.') c = c.slice(0, c.length - 1);
	if ([a, b, c].some(x => x === 'NaN')) throw new Error();
	let plaintext = 'f(x)=';
	let formatted = '\\(f(x)=';
	if (a !== '0') {
		plaintext += `${a}*x^2`;
		formatted += `${a}\\cdot x^2`;
		if (parseFloat(b) > 0) {
			plaintext += '+';
			formatted += '+';
		}
	}
	if (b !== '0') {
		plaintext += `${b}*x`;
		formatted += `${b}\\cdot x`;
		if (parseFloat(c) > 0) {
			plaintext += '+';
			formatted += '+';
		}
	}
	if (c !== '0' || (c === '0' && a === '0' && b === '0')) {
		plaintext += c;
		formatted += c;
	}
	formatted += '\\)';
	document.getElementById('out-formula-plaintext').textContent = plaintext;
	document.getElementById('out-formula-formatted').textContent = formatted;
	MathJax.typeset();

	// plot function
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// figure out scale by including all points in the canvas
	const highestVal = Math.max(...pointCoordinates.filter((x, i) => i % 2 === 0).map(x => Math.abs(x)), ...pointCoordinates.filter((x, i) => i % 2 === 1).map(x => Math.abs(x))) * 1.5;
	const beginningNumber = [1, 2, 5, 10];
	// divide highestval by 8, replace first char with a number from beginningnumber that is greater than first char, round to floor to that accuracy. there you have line interval. draw 8 of them in each direction
	let lineInterval;
	let decimalPlace;
	let firstNumberPlace;
	(highestVal / 8).toString().split('').forEach((char, i) => {
		if (lineInterval) return;
		if (char === '0') return;
		if (char === '.') {
			decimalPlace = i;
			return;
		}
		lineInterval = beginningNumber.find(x => x > parseInt(char));
		firstNumberPlace = i;
	});
	if (!decimalPlace) decimalPlace = Math.floor(Math.log10(highestVal / 8)) + 1; // division returns whole number, has no decimal, decimal is after last letter
	if (firstNumberPlace < decimalPlace) decimalPlace--;
	lineInterval = lineInterval * 10 ** (decimalPlace - firstNumberPlace);

	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;

	// draw lines
	// remember to input negative when calculating y
	function px_to_coord(px) {
		return (2 * px - canvas.width) / (canvas.width - 60) * 8 * lineInterval;
	}
	function coord_to_px(coord) {
		return (coord / (8 * lineInterval) * (canvas.width - 60) + canvas.width) / 2;
	}

	ctx.strokeStyle = "#bbb";
	ctx.fillStyle = "#777";
	ctx.lineWidth = 1.5; 
	ctx.font = "16px Consolas";
	ctx.textAlign = "center";
	for (let i = 1; i < 17; i++) {
		const x = coord_to_px(lineInterval * ((i + (i % 2)) / 2) * (-1) ** i);
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvas.height / 2);
		ctx.moveTo(x, canvas.height / 2 + 20);
		ctx.lineTo(x, canvas.height);
		ctx.fillText((lineInterval * ((i + (i % 2)) / 2) * (-1) ** i).toFixed(Math.max(0, firstNumberPlace - decimalPlace)), x, canvas.height / 2 + 18);
	}
	ctx.textAlign = "left";

	for (let i = 1; i < 17; i++) {
		const text = (-lineInterval * ((i + (i % 2)) / 2) * (-1) ** i).toFixed(Math.max(0, firstNumberPlace - decimalPlace));
		const y = coord_to_px(-lineInterval * ((i + (i % 2)) / 2) * (-1) ** i);

		ctx.moveTo(0, y);
		ctx.lineTo(canvas.width / 2, y);
		ctx.moveTo(canvas.width / 2 + text.length * 12 + 4, y);
		ctx.lineTo(canvas.width, y);
		ctx.fillText(text, canvas.width / 2 + 4, y + 4);
	}
	ctx.stroke();
	
	ctx.beginPath();
	ctx.strokeStyle = "black";
	ctx.lineWidth = 2;
	ctx.moveTo(canvas.width / 2, 0);
	ctx.lineTo(canvas.width / 2, canvas.height);
	ctx.moveTo(0, canvas.height / 2);
	ctx.lineTo(canvas.width, canvas.height / 2);
	ctx.stroke();

	// draw function
	ctx.strokeStyle = 'red';
	ctx.lineWidth = 2;
	ctx.lineCap = 'round';
	let lastPoint;
	for (let x_px = 0; x_px < canvas.width; x_px++) {
		ctx.beginPath();
		// map i to x-coordinate
		const x_coord = px_to_coord(x_px);

		// using a, b, c (defined in this scope), calculate y
		const y_coord = a_exact * x_coord ** 2 + b_exact * x_coord + c_exact;
		// map y to pixels
		const y_px = coord_to_px(-y_coord);

		// draw line from last point to here, or set this as the last point
		if (!lastPoint || y_px < -200 || y_px > canvas.height + 200) {
			lastPoint = [x_px, y_px];
			continue;
		}
		ctx.moveTo(...lastPoint);
		ctx.lineTo(x_px, y_px);
		ctx.stroke();
		lastPoint = [x_px, y_px];
	}

	// draw points
	ctx.font = "900 16px Consolas";
	for (let i = 0; i < 3; i++) {
		const x = coord_to_px(pointCoordinates[i * 2]);
		const y = coord_to_px(-pointCoordinates[i * 2 + 1]);
		ctx.fillStyle = 'blue';
		ctx.beginPath();
		ctx.arc(x, y, 5, 0, 2 * Math.PI);
		ctx.fill();
		ctx.fillStyle = '#000';
		ctx.fillText(['A', 'B', 'C'][i], x + 4, y - 6);
	}
}

function input(event) {
	// event.target.id
	const lookup = {
		"1x": 0,
		"1y": 1,
		"2x": 2,
		"2y": 3,
		"3x": 4,
		"3y": 5
	};
	if (event.target.value.length === 0) {
		pointCoordinates.splice(lookup[event.target.id.slice(5)], 1, undefined);
		document.getElementById(event.target.id).classList.remove('red');
		document.getElementById(event.target.id).classList.remove('active');
		return;
	} else if (isNaN(parseFloat(event.target.value))) {
		document.getElementById(event.target.id).classList.add('red');
		return;
	} else {
		document.getElementById(event.target.id).classList.add('active');
	}
	pointCoordinates.splice(lookup[event.target.id.slice(5)], 1, parseFloat(event.target.value));
	try {
		redraw();
	} catch (error) {
		console.error('Couldn\'t redraw on input!', error);
	}
}

document.getElementById('point1x').addEventListener('input', input);
document.getElementById('point2x').addEventListener('input', input);
document.getElementById('point3x').addEventListener('input', input);
document.getElementById('point1y').addEventListener('input', input);
document.getElementById('point2y').addEventListener('input', input);
document.getElementById('point3y').addEventListener('input', input);