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

	add_dc_out(outputDiv);
}
function update_unix_outputs() {
	const date = new Date(parseInt(document.getElementById('ms_in').value));
	document.getElementById('date_out').innerText = date.toUTCString();
	update_dc_out(date);
}