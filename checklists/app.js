let checklists;
const params = new URLSearchParams(window.location.search);
const airplane = params.get('airplane');
if (!airplane) throw new Error('no airplane found');
fetch(airplane + '.json').then(async response => {
	const data = await response.json();
	document.title = data.title;
	document.getElementById('copyright').innerHTML = data.copyright;
	checklists = data.checklists;
	init();
});


function load(checklist, depth = 0) {
	// load wanted checklist
	let parent;
	if (depth === 0) parent = document.createElement('div'); else {
		if (checklist[0].ul) parent = document.createElement('ul');
		else parent = document.createElement('ol');
	}

	if (checklist[0].start) parent.start = checklist[0].start;

	if (checklist[0].type) {
		if (parent.nodeName === 'UL') {
			console.log('here');
			parent.style.listStyleType = '"' + checklist[0].type + '"';
			
		}
		else parent.type = checklist[0].type;
	} else if (depth === 2) {
		if (parent.nodeName === 'UL') parent.style.listStyleType = 'square';
		else parent.type = 'a';
	}

	

	if (checklist[0].indent !== undefined) {
		parent.style.paddingLeft = (checklist[0].indent * 20) + 'px';
	}

	checklist.forEach(item => {
		if (typeof item === 'string' && depth === 0) {
			const text = document.createElement('p');
			text.textContent = item;
			parent.appendChild(text);
		} else if (typeof item === 'string' && depth !== 0) {
			const text = document.createElement('li');
			text.textContent = item;
			parent.appendChild(text);
		} else if (Array.isArray(item)) {
			const text = load(item, depth + 1);
			if (depth === 0) parent.appendChild(text); else parent.lastChild.appendChild(text);
		}
	});
	if (depth === 0) {
		const div = document.getElementById('checklist');
		div.innerHTML = parent.innerHTML;
	} else {
		return parent;
	}
}

const listname = document.getElementById('listname');

function init() {
	// make buttons and load first checlist
	console.log(checklists);
	const select = document.getElementById('listname');
	checklists.forEach((checklist, i) => {
		const option = document.createElement('option');
		option.value = i;
		option.textContent = checklist[0];
		select.appendChild(option);
	});
	const wantedChecklist = params.get('checklist');
	if (wantedChecklist) {
		const wantedChecklistInt = parseInt(wantedChecklist);
		if (isNaN(wantedChecklistInt)) return;
		listname.value = wantedChecklistInt;
		load(checklists[wantedChecklistInt]);
	}
}

function setParam(i) {
	const url = new URL(window.location);
	url.searchParams.set('checklist', i);
	window.history.replaceState(null, '', url.toString());
}

function loadCurrent() {
	if (!checklists) return;
	const current = parseInt(listname.value);
	if (isNaN(current)) return;
	if (current >= checklists.length || current < 0) return;
	setParam(current);
	load(checklists[current]);
}

function previous() {
	if (!checklists) return;
	let current = parseInt(listname.value);
	if (isNaN(current)) current = checklists.length;
	const previousI = current - 1;
	if (previousI < 0) return;
	listname.value = previousI;
	loadCurrent();
}

function next() {
	if (!checklists) return;
	let current = parseInt(listname.value);
	if (isNaN(current)) current = -1;
	const nextI = current + 1;
	if (nextI >= checklists.length) return;
	listname.value = nextI;
	loadCurrent();
}