function unix_outputs() {
	const outputDiv = document.getElementById('outputs');

	// title
	outputDiv.appendChild(el('p', 'Output:'));

	// formatted date
	outputDiv.appendChild(el('p', 'Formatted date:'));
	const date_out = el('p');
	date_out.classList.add('output');
	date_out.id = 'date_out';
	outputDiv.appendChild(date_out);

	// copy button
	const date_copy = el('button', 'Copy');
	date_copy.classList.add('option-button');
	date_copy.onclick = e => {
		e.target.classList.add('active');
		copyOutput('date_out');
		setTimeout(() => e.target.classList.remove('active'), 500);
	};
	outputDiv.appendChild(date_copy);

	// discord format
	outputDiv.appendChild(el('p', 'Discord date embedding syntax:'));
	const dc_out = el('p');
	dc_out.classList.add('output');
	dc_out.id = 'dc_out';
	outputDiv.appendChild(dc_out);

	// copy button
	const dc_copy = el('button', 'Copy');
	dc_copy.classList.add('option-button');
	dc_copy.onclick = e => {
		e.target.classList.add('active');
		copyOutput('dc_out');
		setTimeout(() => e.target.classList.remove('active'), 500);
	};
	outputDiv.appendChild(dc_copy);
}
function update_unix_outputs() {
	const date = new Date(parseInt(document.getElementById('ms_in').value));
	document.getElementById('date_out').innerText = date.toUTCString();
	document.getElementById('dc_out').innerText = `<t:${Math.floor(date.getTime() / 1000)}>`
}