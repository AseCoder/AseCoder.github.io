function date_inputs() {
	const inputsDiv = document.getElementById('inputs')

	// input title
	inputsDiv.appendChild(el('p', 'Input a date:'));

	// inputs table
	const table = el('table');

	// table data
	const headerRow = el('tr');
	const inputsRow = el('tr');
	const names = ['year', 'month', 'day', 'hour', 'minute', 'second'];
	const defaultvalues = [1970, 1, 1, 0, 0, 0];

	for (let i = 0; i < 6; i++) {
		// name
		const th = el('th', names[i][0].toUpperCase() + names[i].slice(1));
		headerRow.appendChild(th);

		// input field
		const td = el('td');
		const input = el('input');
		input.setAttribute('type', 'number');
		input.setAttribute('oninput', 'inputChanged()');
		input.classList.add('large-input');
		input.value = defaultvalues[i];
		input.id = names[i] + '-input';
		td.appendChild(input);
		inputsRow.appendChild(td);
	}
	table.appendChild(headerRow);
	table.appendChild(inputsRow);
	inputsDiv.appendChild(table);
}