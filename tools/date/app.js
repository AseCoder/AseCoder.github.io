let currentInputType = 'date';

function refreshIo(inputType) {
	document.getElementById('inputs').innerHTML = '';
	document.getElementById('outputs').innerHTML = '';
	if (inputType === 'unix') {
		unix_inputs();
		unix_outputs();
	} else if (inputType === 'date') {
		date_inputs();
		date_outputs();
	}

	inputChanged();
}

function inputType(newType) {
	const types = ['date', 'unix'];
	const oldType = newType === 'date' ? 'unix' : 'date';
	const active = document.querySelectorAll('.inputchooser button.active').item(0);

	// return if no change
	if (active.id.includes(newType)) return;

	// unactivate old
	document.getElementById(oldType + 'Input').classList.remove('active');

	// activate new
	document.getElementById(newType + 'Input').classList.add('active');

	currentInputType = newType;
	
	refreshIo(newType);
}

refreshIo('date');

function inputChanged() {
	if (currentInputType === 'date') update_date_outputs();
	else if (currentInputType === 'unix') update_unix_outputs();
}

function copyOutput(id) {
	const content = document.getElementById(id).innerText;
	if (content) {
		navigator.clipboard.writeText(content);
	}
}