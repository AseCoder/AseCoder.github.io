function load(checklist, depth = 0) {
	// load wanted checklist
	let parent;
	if (depth === 0) parent = document.createElement('div'); else parent = document.createElement('ol');

	if (depth === 2) parent.type = 'a';
	checklist.forEach(item => {
		if (typeof item === 'string' && depth === 0) {
			const text = document.createElement('p');
			text.textContent = item;
			parent.appendChild(text);
		} else if (typeof item === 'string' && depth !== 0) {
			const text = document.createElement('li');
			text.textContent = item;
			parent.appendChild(text);
		} else {
			const text = load(item, depth + 1);
			if (depth === 0) parent.appendChild(text); else parent.lastChild.appendChild(text);
		}
	});
	if (depth === 0) {
		const div = document.getElementById('loaded_checklist');
		div.innerHTML = parent.innerHTML;
	} else {
		return parent;
	}
}

function init() {
	// make buttons and load first checlist
	console.log(checklists);
	const navbar = document.createElement('div');
	navbar.classList.add('navbar');
	checklists.forEach((checklist, i) => {
		const button = document.createElement('button');
		button.classList.add('checlist_button');
		button.textContent = checklist[0];
		button.onclick = (e) => {
			load(checklists[i]);
			document.getElementsByClassName('active_checklist').item(0)?.classList.remove('active_checklist');
			e.target.classList.add('active_checklist');
		}
		navbar.appendChild(button);
	});
	document.body.appendChild(navbar);
	const loaded_checklist = document.createElement('div');
	loaded_checklist.id = 'loaded_checklist';
	const text = document.createElement('p');
	text.textContent = copyright;
	loaded_checklist.appendChild(text);
	document.body.appendChild(loaded_checklist);
};