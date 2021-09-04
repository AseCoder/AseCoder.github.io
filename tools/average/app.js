let inputFieldcount = -1;

function moveToNextInput(event) {
	if (event.code === 'Enter') {
		const arr = Array.from(document.querySelectorAll('.input-container input'));
		const nextEl = arr[arr.findIndex(x => x.isSameNode(event.target)) + 2];
		if (nextEl) nextEl.select();
		else addInputField().select();
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

	// get all the number values from all input fields
	const inputFieldValues = Array.from(document.querySelectorAll('.input-container input')).map(x => parseFloat(x.value))
	console.log(inputFieldValues);
	
	// mean

	// get all values and apply weights. values are mapped -> value * weight (weight is the input field after this one)
	const meanValues = inputFieldValues.map((x, i, a) => a[i + 1] !== 1 ? Array(isNaN(Math.floor(a[i + 1])) ? 1 : Math.floor(a[i + 1])).fill(x) : x).filter((x, i) => i % 2 === 0).flat().filter(x => !isNaN(x + 1))
	console.log(meanValues);

	const meanoutel = document.getElementById('meanout');
	const mean = meanValues.reduce((a, b) => a + b, 0) / (meanValues.length || 1);
	meanoutel.innerText = mean.toFixed(4);

	// absolute deviation

	// get all values by removing half
	const absdevValues = inputFieldValues.filter((x, i) => i % 2 === 0 && !isNaN(parseInt(x)));
	console.log(absdevValues);
	// calculate absolute deviation
	const absdev = absdevValues.map(x => Math.abs(x - mean)).reduce((a, b) => a + b, 0) / (absdevValues.length || 1);
	console.log(absdev);
	const absdevel = document.getElementById('absdev');
	absdevel.innerText = '±' + absdev.toFixed(4);

	// relative deviation
	const reldevel = document.getElementById('reldev');
	const reldev = absdev / (mean || 1);
	reldevel.innerText = (reldev * 100).toFixed(2) + '%';
}

function removeInputField(id) {
	document.getElementById(id).remove();

	inputChanged();
	return;
}

addInputField();