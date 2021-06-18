let id = 0;

function generateId() {
	id++;
	return 'hex-' + id.toString(16);
}
class PropertyField {
	constructor(options = {}) {
		this.name = options.name;
		this.placeholder = options.placeholder || '';
		this.omittable = options.omittable || false;
		this.type = options.type || 'text';
		this.key = options.key;
		this.undefined = false;
	}
	createElement() {
		const div = document.createElement('div');
		div.classList.add('property');
		const name = document.createElement('p');
		const nameText = document.createTextNode(this.name);
		const input = document.createElement('input');
		name.appendChild(nameText);
		input.placeholder = this.placeholder;
		input.type = this.type;
		input.id = generateId();
		this.inputFieldId = input.id;
		if (this.onchange) input.onchange = this.onchange;
		const warning = document.createElement('p');
		warning.id = generateId();
		this.warningId = warning.id;
		const warningText = document.createTextNode('🠕 This property must not be left empty.');
		warning.appendChild(warningText);
		warning.classList.add('warning');
		warning.classList.add('hidden');
		div.appendChild(name);
		div.appendChild(input);
		if (this.omittable) {
			const button = document.createElement('button');
			const text = document.createTextNode('Toggle N/A');
			button.appendChild(text);
			button.classList.add('red');
			button.onclick = () => {
				if (button.classList.contains('red')) {
					document.getElementById(this.inputFieldId).placeholder = 'N/A';
					this.undefined = true;
					button.classList.remove('red');
					button.classList.add('green');
					document.getElementById(this.warningId).classList.add('hidden');
				} else {
					document.getElementById(this.inputFieldId).placeholder = this.placeholder;
					this.undefined = false;
					button.classList.remove('green');
					button.classList.add('red');
				}
			};
			div.appendChild(button);
		}
		div.appendChild(warning);
		return div;
	}
	getValue() {
		if (this.undefined) {
			return 'N/A';
		} else {
			const value = document.getElementById(this.inputFieldId).value;
			if (this.type === 'number') {
				return parseFloat(value);
			} else {
				return value
			}
		}
	}
	showWarning() {
		document.getElementById(this.warningId).classList.remove('hidden');
	}
}

class gpuImageUrlField {
	constructor(options = {}) {
		this.name = options.name;
		this.imageUrl;
		this.parentId = options.parentId;
		this.imageElementId;
	}
	createElement() {
		// returns a div element containing name and url input
		const div = document.createElement('div');
		div.classList.add('property');
		div.id = generateId();
		this.divId = div.id;
		const name = document.createElement('p');
		const nameText = document.createTextNode(this.name);
		const input = document.createElement('input');
		name.appendChild(nameText);
		input.placeholder = 'Image URL';
		input.id = generateId();
		input.onchange = () => {
			console.log('input changed');
			this.imageUrl = this.getValue();
			this.setImage();
			
		};
		this.inputFieldId = input.id;
		div.appendChild(name);
		div.appendChild(input);
		return div;
	}
	setImage(imageUrl) {
		if (!imageUrl) imageUrl = this.imageUrl || this.getValue();
		if (!imageUrl) {
			if (this.imageElementId) {
				ungreenBg(this.parentId);
				document.getElementById(this.imageElementId).removeAttribute('src');
				return;
			}
		}
		console.log(`setting ${this.name} image to ${imageUrl}`);
		if (this.imageElementId) {
			document.getElementById(this.imageElementId).src = imageUrl;
		} else {
			const img = document.createElement('img');
			img.classList.add('gpuImg');
			img.src = imageUrl;
			img.id = generateId();
			this.imageElementId = img.id;
			document.getElementById(this.divId).appendChild(img);
		}
		const done = this.checkDone();
		console.log('image done?', done);
		if (done) greenBg(this.parentId);
		else ungreenBg(this.parentId);
	}
	getValue() {
		const value = document.getElementById(this.inputFieldId).value;
		return value;
	}
	setValue(newValue) {
		if (!newValue) return;
		document.getElementById(this.inputFieldId).value = newValue;
		document.getElementById(this.inputFieldId).onchange();
	}
	checkDone() {
		return this.imageElementId && this.imageUrl && this.imageUrl.length > 0;
	}
}

class ComponentForm {
	constructor(options = {}) {
		this.title = options.title;
		this.parent = options.parent;
		this.fields = [];
		this.id = generateId();
	}
	addField(options = {}) {
		const field = new PropertyField(options);
		// first input field is always name, so set key also
		if (this.fields.length === 0) {
			field.onchange = () => {
				document.getElementById(this.titleId).innerText = field.getValue().replace(/ /g, '-').toLowerCase() || this.title;

				document.getElementById(field.warningId).classList.add('hidden');
			};
		} else {
			field.onchange = () => {
				document.getElementById(field.warningId).classList.add('hidden');
			};
		}
		this.fields.push(field);
		return this;
	}
	addGpuImageField(options = {}) {
		options.parentId = this.id;
		const field = new gpuImageUrlField(options);
		this.fields.push(field);
		return this;
	}
	visualize() {
		const div = document.createElement('div');
		div.id = this.id;
		div.classList.add('component');
		const title = document.createElement('p');
		const titleText = document.createTextNode(this.title);
		title.id = generateId();
		this.titleId = title.id;
		title.classList.add('component-title');
		title.appendChild(titleText)
		div.appendChild(title);
		this.fields.forEach(field => {
			div.appendChild(field.createElement());
		});
		this.parent.appendChild(div);
		return this;
	}
	getKey() {
		return document.getElementById(this.titleId).innerText;
	}
}

function removeCpu() {
	const element = document.getElementById('components').lastChild;
	delete components[element.id]
	element.remove();
}
function writeJson(manufacturer) {
	const object = { manufacturer };
	Object.values(components).forEach(component => {
		const simplifiedComponent = {};
		component.fields.forEach(field => {
			const value = field.getValue();
			console.log(value);
			if (!value && value !== 0) {
				field.showWarning();
			}
			simplifiedComponent[field.key] = value;
		});
		object[component.getKey()] = simplifiedComponent;
	});
	document.getElementById('json').innerText = JSON.stringify(object);
}
function copyJson() {
	const textArea = document.createElement('input');
	textArea.style.opacity = 0;
	textArea.value = document.getElementById('json').innerText;
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();
	if (document.execCommand('copy')) {
		const button = document.getElementById('copyjsonbutton');
		button.classList.remove('blue');
		button.classList.add('green');
		button.innerText = 'Copied!';
		setTimeout(() => {
			button.classList.remove('green');
			button.classList.add('blue');
			button.innerText = 'Copy Text';
		}, 3000);
	}
	textArea.remove();
}
function greenBg(elementId) {
	const element = document.getElementById(elementId);
	const color = '#deffdb';
	element.style.backgroundColor = color; 
}
function ungreenBg(elementId) {
	const element = document.getElementById(elementId);
	element.style.removeProperty('background-color');
}
window.addEventListener('beforeunload', function (e) {
	// Cancel the event
	e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
	// Chrome requires returnValue to be set
	e.returnValue = '';
});