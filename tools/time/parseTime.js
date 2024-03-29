const parseTime = (string) => {
	if (!string) return 0;
	const expressions = string.split(' ');
	let milliseconds = 0;
	expressions.forEach(expression => {
		const int = parseFloat(expression);
		const identifier = expression.match(/[A-Z]/gi)?.join('').toLowerCase();
		if (!int) return;
		if (!identifier) {
			return milliseconds += int;
		}
		const bestMatch = timeNames.find(x => x.name.startsWith(identifier));
		if (bestMatch) { // indentifier is a partial or whole timeName
			if (identifier === 'm') { // month and minute both start with m, if m is provided, prefer minutes
				milliseconds += int * timeNames.find(x => x.name === 'minute').length;
			} else milliseconds += int * bestMatch.length;
		}
		return;
	});
	return milliseconds;
}