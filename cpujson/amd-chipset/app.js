const components = {};
function newCpu() {
	const component = new ComponentForm({ title: 'Unnamed Chipset', parent: document.getElementById('components') })
		.addField({ name: 'name', placeholder: 'Chipset name, eg. H110', key: 'name' })
		.addField({ name: 'supported architectures', placeholder: 'list i guess, eg. Skylake', omittable: true, key: 'supported' })
		.addField({ name: 'core overclock', omittable: true, placeholder: 'Yes/No if this supports overclocking cores', key: 'coreOC' })
		.addField({ name: 'memory overclock', omittable: true, placeholder: 'Yes/JEDEC if this supports overclocking memory', key: 'memOC' })
		.addField({ name: 'amount of memory channels?', placeholder: 'eg. 2', omittable: true, type: 'number', key: 'memChan' })
		.addField({ name: 'amount of pcie lanes', placeholder: 'eg. 24', omittable: true, type: 'number', key: 'pcieLanes' })
		.addField({ name: 'supported generation of pcie', placeholder: 'eg. 3', omittable: true, type: 'number', key: 'pcieGen' })
		.addField({ name: 'sockets supported, list', placeholder: 'eg. LGA 1151, AM4', omittable: true, key: 'socket' })
		.visualize()
	components[component.id] = component;
}