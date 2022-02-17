// function to redraw ingredient amounts
function redraw(number) {
	// get all elements that need changing
	const elList = Array.from(document.getElementsByClassName('quantityDependant'));
	elList.forEach(el => {
		// change content
		const amount = (() => {
			if (!el.id) return 1;
			const formulaEnd = el.id.indexOf('u') > 0 ? el.id.indexOf('u') : el.id.length - 1;
			if (el.id.slice(1, formulaEnd).includes('/')) {
				const evalStr = el.id.slice(1, formulaEnd).replace(/x/g, number.toString());
				if (eval(evalStr) % 1 === 0) return eval(evalStr);
				else return evalStr;
			} else return number * parseFloat(el.id.slice(1));
		})();

		// unit
		// basically it checks what is required
		const unitStart = el.id.indexOf('u') + 1;
		const pluralStart = el.id.slice(unitStart).indexOf('-')
		const longPluralStart = el.id.slice(unitStart).indexOf('-!');
		const unit = (() => {
			if (pluralStart < 0) {
				return ' ' + el.id.slice(unitStart);
			}
			if (amount !== 1) {
				if (longPluralStart >= 0) {
					return ' ' + el.id.slice(unitStart).slice(longPluralStart);
				} else {
					return ' ' + el.id.slice(unitStart, unitStart + pluralStart) + el.id.slice(unitStart).slice(pluralStart + 1);
				}
			} else {
				return ' ' + el.id.slice(unitStart, unitStart + pluralStart);
			}
		})();
		const text = (amount + unit).trim();
		el.textContent = text;
	});
}

// buttons to change amount of recipe
function quantities(number, setUrl) {
	// make sure a button for this quantity exists
	const buttonEl = document.getElementById('quantity' + number);
	if (!buttonEl) throw new Error('could not find quantity button with number ' + number);
	// change active class
	if (buttonEl.classList.contains('active')) return;
	else {
		Array.from(buttonEl.parentElement.children).forEach(btn => btn.classList.remove('active'));
		buttonEl.classList.add('active');
	}
	// redraw
	redraw(number);
	// set query param
	if (setUrl || setUrl === undefined) {
		window.location.href = window.location.origin + window.location.pathname + '?amount=' + number;
	}
}

// init page by drawing (query string amount) units
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
if (params.amount) {
	redraw(params.amount);
	quantities(params.amount, false);
}
else redraw(1);