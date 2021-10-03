function add_dc_out(outputDiv) {
	// title
	outputDiv.appendChild(el('p', 'Discord timestamp formatting:'));

	// style chooser
	const label = el('label', 'Style:');
	label.setAttribute('for', 'style');
	label.style.marginRight = '10px';
	outputDiv.appendChild(label);
	const values = ['t', 'T', 'd', 'D', 'f', 'F', 'R'];
	const select = el(
		'select',
		[
			el('option', '(t) Short Time'),
			el('option', '(T) Long Time'),
			el('option', '(d) Short Date'),
			el('option', '(D) Long Date'),
			el('option', '(f) Short Date/Time'),
			el('option', '(F) Long Date/Time'),
			el('option', '(R) Relative Time'),
		].map((x, i) => {
			if (values[i] === 'f') {
				x.setAttribute('selected', 'selected');
			}
			x.setAttribute('value', values[i]);
			return x;
		}),
		true
	);
	select.classList.add('large-input');
	select.setAttribute('onchange', 'inputChanged()');
	select.id = 'dc_out_style';
	outputDiv.appendChild(select);

	// output
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
function update_dc_out(date) {
	const dc_out_style = document.getElementById('dc_out_style').value;
	let style = dc_out_style === 'f' ? '' : ':' + dc_out_style;
	document.getElementById('dc_out').innerText = `<t:${Math.floor(date.getTime() / 1000)}${style}>`
}