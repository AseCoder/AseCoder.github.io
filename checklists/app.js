let checklists;
const params = new URLSearchParams(window.location.search);
const airplane = params.get('airplane');
if (!airplane) throw new Error('no airplane found');
fetch(airplane + '.json').then(async response => {
	const data = await response.json();
	document.title = data.title;
	document.getElementById('copyright').innerHTML = data.copyright;
	data.checklists.forEach((x, i) => load(x, 0, i, data.checklists.length));
});

function load(checklist, depth = 0, index, total) {
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

	checklist.forEach((item, i) => {
		if (typeof item === 'string' && depth === 0) {
			const text = document.createElement('p');
			text.textContent = (i === 0 ? `${index + 1}/${total}: ` : '') + item;
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
		document.getElementById('container').appendChild(parent);
	} else {
		return parent;
	}
}
