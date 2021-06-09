const components = {};
function newCpu() {
	const component = new ComponentForm({ title: 'Unnamed CPU', parent: document.getElementById('components') })
		.addField({ name: 'name', placeholder: 'CPU Name, eg "Ryzen 9 5900x"', key: 'name' })
		.addField({ name: 'price', placeholder: 'MSRP, xxx.xx USD', omittable: true, type: 'number', key: 'price' })
		.addField({ name: 'cores', omittable: true, type: 'number', key: 'cores' })
		.addField({ name: 'threads', omittable: true, type: 'number', key: 'threads' })
		.addField({ name: 'base clock speed', omittable: true, type: 'number', key: 'base' })
		.addField({ name: 'boost clock speed', omittable: true, type: 'number', key: 'boost' })
		.addField({ name: 'TDP', placeholder: 'TDP in Watts', omittable: true, type: 'number', key: 'tdp' })
		.addField({ name: 'Socket Name', placeholder: 'eg. LGA1151, AM4', omittable: true, key: 'socket' })
		.visualize()
	components[component.id] = component;
}
function removeCpu() {
	const element = document.getElementById('components').lastChild;
	delete components[element.id]
	element.remove();
}
function writeJson() {
	const object = {
		manufacturer: 'AMD'
	};
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