let inputFieldcount = -1;

function moveToNextInput(event) {
	if (!['Enter', 'KeyA'].includes(event.code)) return;

	const arr = Array.from(document.querySelectorAll('.input-container input'));
	const directions = {
		'up': -2,
		'down': 2,
		'right': 1,
		'left': -1
	};
	function moveTowards(direction) {
		const desiredEl = arr[arr.findIndex(x => x.isSameNode(event.target)) + directions[direction]]
		if (desiredEl) {
			desiredEl.select();
			return true;
		} else return false;
	};

	if (event.code === 'Enter') {
		if (event.shiftKey) {
			moveTowards('up');
		} else {
			const res = moveTowards('down');
			if (!res) addInputField().select();
		}
	} else if (event.code === 'KeyA') {
		event.preventDefault();
		event.target.select();
	}
}

function addInputField() {
	// adds a new input field to the site

	inputFieldcount++;

	// div to house remove button, value, and weight input
	const div = document.createElement('div');

	div.classList.add('flex-container', 'input-container');
	div.setAttribute('id', inputFieldcount);

	// remove button
	const removdiv = document.createElement('div');

	const remov = document.createElement('button');
	const removText = document.createTextNode('X');

	remov.classList.add('red');
	remov.appendChild(removText);
	remov.setAttribute('onclick', `removeInputField('${div.id}')`);

	removdiv.appendChild(remov);
	div.appendChild(removdiv);

	// value
	const fielddiv = document.createElement('div');

	const field = document.createElement('input');
	
	field.setAttribute('type', 'number');
	field.setAttribute('placeholder', '1');
	field.setAttribute('oninput', 'inputChanged()');

	// when enter is pressed, move on
	field.addEventListener("keydown", moveToNextInput);

	fielddiv.appendChild(field);
	div.appendChild(fielddiv);

	// weight input
	const weightfielddiv = document.createElement('div');

	const weightfield = document.createElement('input');

	weightfield.setAttribute('type', 'number');
	weightfield.setAttribute('value', '1');
	weightfield.setAttribute('oninput', 'inputChanged()');

	// when enter is pressed, move on
	weightfield.addEventListener("keydown", moveToNextInput);

	weightfielddiv.appendChild(weightfield);
	div.appendChild(weightfielddiv);

	document.getElementById('inputs').appendChild(div);

	inputChanged();
	return field;
}

function inputChanged() {
	// when any input changes, is removed, is added, or has its weight modified
	// the outputs are recalculated

	// get output format
	const format = document.getElementById('format').value;

	// get all the number values from all input fields
	const inputFieldValues = Array.from(document.querySelectorAll('.input-container input')).map(x => parseFloat(x.value))
	
	// mean

	// get all values and apply weights. values are mapped -> value * weight (weight is the input field after this one)
	let denominator = 0;
	const meanValues = inputFieldValues.map((x, i, a) => {
		// only do this for value inputs, not weights
		if (i % 2 !== 0) return;

		const weight = a[i + 1];
		if (weight !== 1 && !isNaN(weight)) {
			denominator += weight;
			return x * weight;
		} else {
			// default weight is 1
			denominator += 1;

			if (!isNaN(x)) return x;
			else return 0;
		}
	}).filter((x, i) => i % 2 === 0);

	const meanoutel = document.getElementById('meanout');
	const meanSum = meanValues.reduce((a, b) => a + b, 0);
	const meanDenominator = (denominator || 1);
	const mean = meanSum / meanDenominator;

	if (format === 'apprx') meanoutel.innerText = mean.toFixed(4);
	else meanoutel.innerText = meanSum + '/' + meanDenominator;


	// absolute deviation

	// get all values by removing half
	const absdevValues = inputFieldValues.filter((x, i) => i % 2 === 0 && !isNaN(parseInt(x)));
	const absdevel = document.getElementById('absdev');

	// calculate absolute deviation
	const deviationsSum = absdevValues.map(x => Math.abs(x - mean)).reduce((a, b) => a + b, 0);
	const inputsCount = (absdevValues.length || 1);
	const absdev = deviationsSum / inputsCount;
	const exactDeviations = absdevValues.map(x => Math.abs((x * meanDenominator) - meanSum)).reduce((a, b) => a + b, 0);
	const absdevDenominator = inputsCount * meanDenominator;
	if (format === 'apprx') {
		absdevel.innerText = '±' + absdev.toFixed(4);
	} else {
		absdevel.innerText = '±' + exactDeviations + '/' + absdevDenominator;
	}


	

	// relative deviation
	const reldevel = document.getElementById('reldev');
	const rel_denom = mean || 1;
	const reldev = absdev / rel_denom;

	// exact reldev = absdev / mean
	// = (exactDeviations / absdevDenominator) / (meanSum / meanDenominator)
	const exactReldev = (exactDeviations / absdevDenominator) / (meanSum / meanDenominator);
	// = (exactDeviations / absdevDenominator) * (meanDenominator / meanSum)
	// = (exactDeviations * meanDenominator) / (absdevDenominator * meanSum)
	
	console.table({ meanSum, meanDenominator, mean, deviationsSum, exactDeviations, inputsCount, absdev, absdevDenominator, exactReldev, reldev });
	
	if (format === 'apprx') {
		reldevel.innerText = (reldev * 100).toFixed(2) + '%';
	} else {
		if (Number.isInteger(exactReldev)) reldevel.innerText = exactReldev;
		else reldevel.innerText = exactDeviations * meanDenominator + '/' + absdevDenominator * meanSum;
	}

}

function removeInputField(id) {
	document.getElementById(id).remove();

	inputChanged();
	return;
}

addInputField();