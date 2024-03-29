function date_outputs() {
	const outputDiv = document.getElementById('outputs');

	// title
	outputDiv.appendChild(el('p', 'Output:'));

	// unix epoch
	outputDiv.appendChild(el('p', 'Milliseconds elapsed since the UNIX epoch:'));
	const ms_out = el('p');
	ms_out.classList.add('output');
	ms_out.id = 'ms_out';
	outputDiv.appendChild(ms_out);

	// copy button
	const ms_copy = el('button', 'Copy');
	ms_copy.classList.add('option-button');
	ms_copy.onclick = e => {
		e.target.classList.add('active');
		copyOutput('ms_out');
		setTimeout(() => e.target.classList.remove('active'), 500);
	};
	outputDiv.appendChild(ms_copy);

	// format date
	outputDiv.appendChild(el('p', 'Date formatted to current locale:'));
	const formatted_date = el('p');
	formatted_date.classList.add('output');
	formatted_date.id = 'formatted_date';
	outputDiv.appendChild(formatted_date);

	add_dc_out(outputDiv);
}
function update_date_outputs() {
	// construct date
	const date = new Date();
	date.setUTCFullYear(
		parseInt(document.getElementById('year-input').value) || 1970,
		parseInt(document.getElementById('month-input').value) - 1 || 0,
		parseInt(document.getElementById('day-input').value) || 1
	);
	date.setUTCHours(
		parseInt(document.getElementById('hour-input').value) || 0,
		parseInt(document.getElementById('minute-input').value) || 0,
		parseInt(document.getElementById('second-input').value) || 0
	);
	document.getElementById('ms_out').innerText = Math.floor(date.getTime() / 1000) * 1000;
	document.getElementById('formatted_date').innerText = date.toString();
	update_dc_out(date);
}