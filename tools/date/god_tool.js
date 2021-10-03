function el(type, content, contentIsXML = false) {
	const element = document.createElement(type);
	if (content) {
		if (!contentIsXML) {
			const text = document.createTextNode(content);
			element.appendChild(text);
		} else {
			if (Array.isArray(content)) {
				element.innerHTML = content.map(el => el.outerHTML).join('');
			} else element.innerHTML = content.outerHTML;
		}
	}
	return element;
}