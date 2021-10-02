function el(type, content) {
	const element = document.createElement(type);
	if (content) {
		const text = document.createTextNode(content);
		element.appendChild(text);
	}
	return element;
}