// preset values
const now = new Date();
document.getElementById('year').value = now.getUTCFullYear();
document.getElementById('month').value = now.getUTCMonth() + 1;
document.getElementById('day').value = now.getUTCDate();
document.getElementById('hour').value = now.getUTCHours();
document.getElementById('minute').value = now.getUTCMinutes();
document.getElementById('second').value = now.getUTCSeconds();
document.getElementById('ms_epoch').value = now.getTime();
setOutputs(now);


// function called when a change happens in date inputs
function date_update() {
	// parse input date
	const date = new Date();
	date.setUTCFullYear(
		document.getElementById('year').value || 1970,
		document.getElementById('month').value - 1 || 0,
		document.getElementById('day').value || 0
	);
	date.setUTCHours(
		document.getElementById('hour').value || 0,
		document.getElementById('minute').value || 0,
		document.getElementById('second').value || 0
	);
	date.setUTCMilliseconds(0);
	// pass to output setter
	setOutputs(date, 'date');
}

// function called when a change happens in epoch inputs
function epoch_update() {
	// parse input ms
	const date = new Date(parseInt(document.getElementById('ms_epoch').value));
	// pass to output setter
	setOutputs(date, 'epoch');
}

// function to set the text contents of the outputs based on a Date
function setOutputs(date, mode = undefined) {
	// date-mode
	if (mode !== 'epoch') {
		document.getElementById('ms_date').textContent = date.getTime();
		document.getElementById('format_date').textContent = date.toString();
		const style = document.getElementById('style_date').value;
		document.getElementById('dc_date').textContent = `<t:${Math.round(date.getTime() / 1000)}${style === 'f' ? '' : ':' + style}>`;
	}
	// epoch-mode
	if (mode !== 'date') {
		document.getElementById('format_epoch').textContent = date.toString();
		const style = document.getElementById('style_epoch').value;
		document.getElementById('dc_epoch').textContent = `<t:${Math.round(date.getTime() / 1000)}${style === 'f' ? '' : ':' + style}>`;
	}
}

// function called when a copy button is clicked
function copy(elementId) {
	const text = document.getElementById(elementId).textContent;
	if (!text) throw new Error("no content to copy");
	console.log(text);
	navigator.clipboard.writeText(text);
}

// switch to epoch mode
function epochMode() {
	document.getElementById('datepage').hidden = true;
	document.getElementById('epochpage').hidden = false;
	document.getElementById('epochMode').classList.add('active');
	document.getElementById('dateMode').classList.remove('active');
}

// switch to date mode
function dateMode() {
	document.getElementById('datepage').hidden = false;
	document.getElementById('epochpage').hidden = true;
	document.getElementById('epochMode').classList.remove('active');
	document.getElementById('dateMode').classList.add('active');
}