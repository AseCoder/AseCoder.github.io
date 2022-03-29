const pointCoordinates = [ undefined, undefined, undefined, undefined, undefined, undefined];

function redraw() {
	console.log(pointCoordinates);
	const x_1 = pointCoordinates[0],
		y_1 = pointCoordinates[1],
		x_2 = pointCoordinates[2],
		y_2 = pointCoordinates[3],
		x_3 = pointCoordinates[4],
		y_3 = pointCoordinates[5];
	if (pointCoordinates.some(x => typeof x !== 'number')) throw new Error();
	// calculate a, b, c
	// a=(x_1*(y_3-y_2)-x_2*y_3+x_3*y_2+(x_2-x_3)*y_1)/(x_1*(x_3^2-x_2^2)-x_2*x_3^2+x_2^2*x_3+x_1^2*(x_2-x_3))
	let a = ((x_1 * (y_3 - y_2) - x_2 * y_3 + x_3 * y_2 + (x_2 - x_3) * y_1) / (x_1 * (x_3 ** 2 - x_2 ** 2) - x_2 * x_3 ** 2 + x_2 ** 2 * x_3 + x_1 ** 2 * (x_2 - x_3))).toFixed(8);
	while (a.length > 1 && ['0', '.'].includes(a[a.length - 2]) && ['0', '.'].includes(a[a.length - 1])) {
		a = a.slice(0, a.length - 1);
	}
	if (a[a.length - 1] === '.') a = a.slice(0, a.length - 1);
	let b = (-(x_1 ** 2 * (y_3 - y_2) - x_2 ** 2 * y_3 + x_3 ** 2 * y_2 + (x_2 ** 2 - x_3 ** 2) * y_1) / (x_1 * (x_3 ** 2 - x_2 ** 2) - x_2 * x_3 ** 2 + x_2 ** 2 * x_3 + x_1 ** 2 * (x_2 - x_3))).toFixed(8);
	while (b.length > 1 && ['0', '.'].includes(b[b.length - 2]) && ['0', '.'].includes(b[b.length - 1])) {
		b = b.slice(0, b.length - 1);
	}
	if (b[b.length - 1] === '.') b = b.slice(0, b.length - 1);
	let c = ((x_1 * (x_3 ** 2 * y_2 - x_2 ** 2 * y_3) + x_1 ** 2 * (x_2 * y_3 - x_3 * y_2) + (x_2 ** 2 * x_3 - x_2 * x_3 ** 2) * y_1) / (x_1 * (x_3 ** 2 - x_2 ** 2) - x_2 * x_3 ** 2 + x_2 ** 2 * x_3 + x_1 ** 2 * (x_2 - x_3))).toFixed(8);
	while (c.length > 1 && ['0', '.'].includes(c[c.length - 2]) && ['0', '.'].includes(c[c.length - 1])) {
		c = c.slice(0, c.length - 1);
	}
	if (c[c.length - 1] === '.') c = c.slice(0, c.length - 1);
	console.log({a,b,c});
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
	console.log(event);
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
