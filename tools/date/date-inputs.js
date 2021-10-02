function date_inputs() {
	const inputsDiv = document.getElementById('inputs')

	// input title
	inputsDiv.appendChild(el('p', 'Input a date:'));

	// tables
	const tablecontainer = el('div');
	tablecontainer.classList.add('tablecontainer');
	
	// large inputs table
	const table = el('table');

	// table data
	const headerRow = el('tr');
	const inputsRow = el('tr');
	const names = ['year', 'month', 'day'];
	const defaultvalues = [1970, 1, 1];

	for (let i = 0; i < 3; i++) {
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
	tablecontainer.appendChild(table);

	// small table
	// large inputs table
	const smalltable = el('table');

	// table data
	const smallheaderRow = el('tr');
	const smallinputsRow = el('tr');
	const smallnames = ['hour', 'minute', 'second'];

	for (let i = 0; i < 3; i++) {
		// name
		const th = el('th', smallnames[i][0].toUpperCase() + smallnames[i].slice(1));
		smallheaderRow.appendChild(th);

		// input field
		const td = el('td');
		const input = el('input');
		input.setAttribute('type', 'number');
		input.setAttribute('oninput', 'inputChanged()');
		input.classList.add('large-input');
		input.value = 0;
		input.id = smallnames[i] + '-input';
		td.appendChild(input);
		smallinputsRow.appendChild(td);
	}
	smalltable.appendChild(smallheaderRow);
	smalltable.appendChild(smallinputsRow);
	tablecontainer.appendChild(smalltable);

	inputsDiv.appendChild(tablecontainer);
}