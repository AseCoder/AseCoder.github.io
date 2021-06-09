const components = {};
function newCpu() {
	const component = new ComponentForm({ title: 'Unnamed GPU', parent: document.getElementById('components') })
		.addField({ name: 'name', placeholder: 'GPU Name, eg "Strix 2060", "RX 6700XT"', key: 'name' })
		.addField({ name: 'price', placeholder: 'MSRP, xxx.xx USD', omittable: true, type: 'number', key: 'price' })
		.addField({ name: 'Memory Interface', placeholder: 'Amount of bits (i have no idea)', omittable: true, type: 'number', key: 'memoryInterface' })
		.addField({ name: 'Video Memory', placeholder: 'VRAM in megabytes', omittable: true, type: 'number', key: 'vram' })
		.addField({ name: 'Memory Type', placeholder: 'eg. "GDDR6X"', omittable: true, key: 'vramType' })
		.addField({ name: 'Power Connectors', placeholder: 'eg. "6+6" or "8+8+8"', omittable: true, key: 'powerConnectors' })
		.addField({ name: 'TDP', placeholder: 'TDP in Watts', omittable: true, type: 'number', key: 'tdp' })
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
		manufacturer: document.getElementById('manufacturer').value
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