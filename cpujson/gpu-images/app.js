const components = {};
let json;
let manufacturer;
function initJson() {
	while (Object.values(components).length > 0) {
		removeCpu();
	}
	json = JSON.parse(document.getElementById('jsonInput').value);
	const gpus = Object.entries(json);
	manufacturer = gpus.find(x => !x[1].name)[1];
	document.getElementById('manufacturer').innerText = 'Manufacturer: ' + manufacturer;
	gpus.filter(x => x[1].name).forEach((gpu) => {
		const component = new ComponentForm({ title: gpu[0], parent: document.getElementById('components') }).addGpuImageField({ name: manufacturer + ' ' + gpu[1].name }).visualize();
		components[component.id] = component;
		component.fields[0].setValue(gpu[1].imageUrl)
	});
}
function writeGpuImageJson() {
	const object = { manufacturer }
	const componentsArray = Object.entries(components);
	console.log('componentsarray titles', componentsArray.map(x => x[1].title));
	Object.entries(json).filter(x => x[1].name).map(gpu => {
		console.log('gpu key', gpu[0]);
		const imageUrl = componentsArray.find(x => x[1].title === gpu[0])[1].fields[0].getValue();
		if (imageUrl && imageUrl.length > 0) {
			gpu[1].imageUrl = imageUrl;
		}
		object[gpu[0]] = gpu[1];
	});
	document.getElementById('json').innerText = JSON.stringify(object);
}