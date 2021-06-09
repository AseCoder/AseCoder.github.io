let id = 0;

function generateId() {
	id++;
	return 'hex-' + id.toString(16);
}

function inputChange() {

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