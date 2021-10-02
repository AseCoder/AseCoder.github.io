function unix_inputs() {
	const inputsDiv = document.getElementById('inputs');

	// input title
	inputsDiv.appendChild(el('p', 'Input milliseconds elapsed since the UNIX epoch:'));

	// field
	const inputfield = el('input');
	inputfield.setAttribute('type', 'number');
	inputfield.setAttribute('oninput', 'inputChanged()');
	inputfield.classList.add('large-input');
	inputfield.defaultValue = Date.now();
	inputfield.id = 'ms_in';
	inputsDiv.appendChild(inputfield);
}