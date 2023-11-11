const limitsMap = {
	hay: [0.25, 0.75],
	silage: [0.25, 0.75],
	straw: [0, 0.3]
};

class Loading {
	constructor(options = {}) {
		const { hay, silage, straw, volume } = options;
		this.hay = hay || 0;
		this.silage = silage || 0;
		this.straw = straw || 0;
		this.volume = volume || 0;
	}
	validate(reason) {
		// - any value is too big
		if (this.hay > 750 * this.volume || this.silage > 750 * this.volume || this.straw > 300 * this.volume) return reason ? 1 : false;
		// - the mixer would become too full
		if (this.hay + this.silage + this.straw > 1000 * this.volume) return reason ? 2 : false;
		return reason ? 0 : true;
	}
	validateExtensive() {
		if (!this.validate()) return false;
		const filling = this.hay + this.silage + this.straw;
		if (this.hay < 0.25 * filling || this.silage < 0.25 * filling) return false;
		return true;
	}
	addToMinimum() {
		this.hay = Math.max(this.hay, 250 * this.volume);
		this.silage = Math.max(this.silage, 250 * this.volume);
		this.straw = Math.max(this.straw, 0);
	}
	maximumAvailable(type, minimum) {
		// return the amount of "type" that can be used without exceeding limits
		// its the Math.min of its upper bound and the mixer's max volume, but it cant be more than minimum (usually the amount already in there)
		function TheOthers(a) {
			let total = 0;
			if (type !== 'hay') total += a.hay;
			if (type !== 'silage') total += a.silage;
			if (type !== 'straw') total += a.straw;
			return total;
		}
		return Math.max(Math.min(limitsMap[type][1] * 1000 * this.volume, this.volume * 1000 - TheOthers(this)), minimum ?? this[type]);
	}
	roomLeft() {
		return 1000 * this.volume - (this.hay + this.silage + this.straw);
	}
	set(type, value) {
		this[type] = value;
		return value;
	}
	get(type) {
		return this[type];
	}
	percentage(type) {
		return 100 * this[type] / (this.hay + this.silage + this.straw);
	}
	warningFor(type) {
		if (this[type] - limitsMap[type][0] * volume * 1000 < 300 && type !== 'straw') return '>';
		else if (limitsMap[type][1] * volume * 1000 - this[type] < 300) return '<';
		else return '';
	}
	export() {
		return { hay: this.hay, silage: this.silage, straw: this.straw, volume: this.volume };
	}
}

// handle volume input
const volumeinput = document.getElementById('volumeinput');
let volume = parseInt(localStorage.getItem("volume")) || 0;
volumeinput.value = volume;
volumeinput.oninput = e => {
	const value = parseInt(e.target.value);
	if (isNaN(value) || value < 0) return;
	volume = value;
	localStorage.setItem("volume", volume);
	startingvalues.set('volume', volume);
	calculateResults();
};

const startingvalues = new Loading({ volume });

// handle minmax input
const minmaxinput = document.getElementById('minmax');
const typeinput = document.getElementById('type');
minmaxinput.value = localStorage.getItem('minmax') || '1';
typeinput.value = localStorage.getItem('type') || 'straw';
minmaxinput.oninput = e => {
	localStorage.setItem('minmax', e.target.value);
	calculateResults();
};
typeinput.oninput = e => {
	localStorage.setItem('type', e.target.value);
	calculateResults();
};

// handle starting values and calculate starting percents
const startingvalueinputs = {
	hay: document.getElementById('haystart'),
	silage: document.getElementById('silagestart'),
	straw: document.getElementById('strawstart')
};
function handlestartingvalue(e, type) {
	const value = parseInt(e.target.value);
	if (isNaN(value) || value < 0) {
		e.target.style.backgroundColor = 'red';
		return;
	} else e.target.style.backgroundColor = '';
	startingvalues.set(type, value);
	const total = startingvalues.hay + startingvalues.silage + startingvalues.straw;
	document.getElementById('haystartpercent').textContent = (startingvalues.hay / total * 100 || 0).toFixed(1);
	document.getElementById('silagestartpercent').textContent = (startingvalues.silage / total * 100 || 0).toFixed(1);
	document.getElementById('strawstartpercent').textContent = (startingvalues.straw / total * 100 || 0).toFixed(1);
	calculateResults();
}
startingvalueinputs.hay.oninput = e => handlestartingvalue(e, 'hay');
startingvalueinputs.silage.oninput = e => handlestartingvalue(e, 'silage');
startingvalueinputs.straw.oninput = e => handlestartingvalue(e, 'straw');

function getOptimumPercent() {
	return limitsMap[typeinput.value][parseInt(minmaxinput.value)];
}
function getOptimumAmount() {
	return volume * 1000 * getOptimumPercent();
}
function paintTheTownRed() {
	document.getElementById('starts').style.backgroundColor = 'red';
	document.getElementById('results').style.backgroundColor = 'red';
}
function cleanTheTown() {
	document.getElementById('starts').style.backgroundColor = '';
	document.getElementById('results').style.backgroundColor = '';
}
// calculate suggested loading
function calculateResults() {
	console.log('%ccalculating results', 'font-weight: bold; color: red; font-size: 15px;');
	// duplicate starting values loading
	const exported = startingvalues.export();
	const suggestedLoading = new Loading(exported);
	console.log(suggestedLoading);
	// validate
	if (!suggestedLoading.validate()) {
		console.log('validation failed');
		if (suggestedLoading.validate(true) === 1) return paintTheTownRed();
	}
	// add to minimum
	suggestedLoading.addToMinimum();
	console.log('added to minimum, now:', suggestedLoading);
	// validate
	if (!suggestedLoading.validate()) {
		console.log('validation failed');
		return paintTheTownRed();
	}
	// start to optimise
	// ask the Loading to calculate the optimum optimisation
	// only do this if minmaxtype is max
	if (minmaxinput.value === '1') {
		const optimumOptimisation = suggestedLoading.maximumAvailable(typeinput.value, exported[typeinput.value]);
		console.log(`optimum optimisation would be ${optimumOptimisation} l of ${typeinput.value}`);
		suggestedLoading.set(typeinput.value, optimumOptimisation);
		console.log(`set ${typeinput.value} to ${optimumOptimisation}, now:`, suggestedLoading);
		// validate
		if (!suggestedLoading.validate()) {
			console.log('validation failed');
			paintTheTownRed();
			throw new Error('this validation should not have failed');
		}
	}
	// if space is left, fill two others to as similar amounts as possible
	// calculate space left
	let spaceLeft = suggestedLoading.roomLeft();
	if (spaceLeft <= 0) return displayResults(suggestedLoading);
	// add half of it to both
	// if either goes over max percent, limit it
	// the two types left:
	const typesLeft = new Set(['hay', 'silage', 'straw']);
	typesLeft.delete(typeinput.value);
	const newTypesLeft = Array.from(typesLeft);
	let emptierType;
	let emptierTypeValue;
	let fullerType;
	let fullerTypeValue;
	const firstnewtypevalue = suggestedLoading.get(newTypesLeft[0]);
	const secondnewtypevalue = suggestedLoading.get(newTypesLeft[1]);
	if (firstnewtypevalue > secondnewtypevalue) {
		emptierType = newTypesLeft[1];
		emptierTypeValue = secondnewtypevalue;
		fullerType = newTypesLeft[0];
		fullerTypeValue = firstnewtypevalue;
	} else {
		emptierType = newTypesLeft[0];
		emptierTypeValue = firstnewtypevalue;
		fullerType = newTypesLeft[1];
		fullerTypeValue = secondnewtypevalue;
	}
	const max_emptierType = suggestedLoading.maximumAvailable(emptierType);
	const max_fullerType = suggestedLoading.maximumAvailable(fullerType);
	// take the emptier one. fill it to its limit or so that it is as full as the other one.
	console.log(suggestedLoading, { emptierType, emptierTypeValue, max_emptierType, fullerType, fullerTypeValue, max_fullerType});
	emptierTypeValue = suggestedLoading.set(emptierType, Math.min(fullerTypeValue, max_emptierType, emptierTypeValue + spaceLeft));
	spaceLeft = suggestedLoading.roomLeft();
	if (spaceLeft <= 0) return displayResults(suggestedLoading);
	// has a limit been reached? yes if
	if (max_emptierType < fullerTypeValue) {
		console.log('a limit has been reached');
		fullerTypeValue = suggestedLoading.set(fullerType, Math.min(max_fullerType, fullerTypeValue + spaceLeft))
	} else {
		// if neither is at limit, fill both until one hits their limit.
		console.log('they should now be equal');
		console.log(suggestedLoading);
		
		emptierTypeValue = suggestedLoading.set(emptierType, Math.min(max_emptierType, max_fullerType, emptierTypeValue + Math.round(spaceLeft / 2)));

		spaceLeft = suggestedLoading.roomLeft();
		if (spaceLeft <= 0) return displayResults(suggestedLoading);
		fullerTypeValue = suggestedLoading.set(fullerType, Math.min(max_emptierType, max_fullerType, fullerTypeValue + spaceLeft))
		console.log('funny business happened');
		console.log(suggestedLoading);
	}
	// once a limit has been reached, there is only one option: fill the remaining one as much as possible
	spaceLeft = suggestedLoading.roomLeft();
	console.log('oh boy', spaceLeft);
	if (spaceLeft <= 0) return displayResults(suggestedLoading);
	if (max_emptierType > max_fullerType) console.log(emptierType, suggestedLoading.set(emptierType, Math.min(max_emptierType, emptierTypeValue + spaceLeft)));
	else console.log(fullerType, suggestedLoading.set(fullerType, Math.min(max_fullerType, fullerTypeValue + spaceLeft)));
	displayResults(suggestedLoading);
}
function displayResults(loadingInstance) {
	cleanTheTown();
	const warningforhay = loadingInstance.warningFor('hay');
	const warningforsilage = loadingInstance.warningFor('silage');
	const warningforstraw = loadingInstance.warningFor('straw');
	const hayamount = document.getElementById('hayamount')
	const silageamount = document.getElementById('silageamount')
	const strawamount = document.getElementById('strawamount')
	hayamount.textContent = warningforhay + loadingInstance.get('hay');
	silageamount.textContent = warningforsilage + loadingInstance.get('silage');
	strawamount.textContent = warningforstraw + loadingInstance.get('straw');
	const haypercentage = loadingInstance.percentage('hay');
	const silagepercentage = loadingInstance.percentage('silage');
	const strawpercentage = loadingInstance.percentage('straw');
	document.getElementById('hayprogress').style.width = haypercentage + '%';
	document.getElementById('silageprogress').style.width = silagepercentage + '%';
	document.getElementById('strawprogress').style.width = strawpercentage + '%';
	const haypercent = document.getElementById('haypercent')
	const silagepercent = document.getElementById('silagepercent')
	const strawpercent = document.getElementById('strawpercent')
	haypercent.textContent = Math.round(haypercentage);
	silagepercent.textContent = Math.round(silagepercentage);
	strawpercent.textContent = Math.round(strawpercentage);
	haypercent.style.color = warningforhay ? '#ff4400' : '';
	silagepercent.style.color = warningforsilage ? '#ff4400' : '';
	strawpercent.style.color = warningforstraw ? '#ff4400' : '';
}

// checker
const checkingvalueinputs = {
	hay: document.getElementById('haycheck'),
	silage: document.getElementById('silagecheck'),
	straw: document.getElementById('strawcheck')
};
const checkingvalues = new Loading({ volume });
function handlecheckingvalue(e, type) {
	const value = parseInt(e.target.value);
	if (isNaN(value) || value < 0) {
		e.target.style.backgroundColor = 'red';
		return;
	} else e.target.style.backgroundColor = '';
	checkingvalues.set(type, value);
	const total = checkingvalues.hay + checkingvalues.silage + checkingvalues.straw;
	document.getElementById('haycheckpercent').textContent = (checkingvalues.hay / total * 100 || 0).toFixed(1);
	document.getElementById('silagecheckpercent').textContent = (checkingvalues.silage / total * 100 || 0).toFixed(1);
	document.getElementById('strawcheckpercent').textContent = (checkingvalues.straw / total * 100 || 0).toFixed(1);
	
	const checkresult = document.getElementById('checkresult');
	if (checkingvalues.validateExtensive()) {
		checkresult.textContent = 'Valid loading!';
		checkresult.style.color = '#00ff00';
	} else {
		checkresult.textContent = 'Invalid loading. yuck';
		checkresult.style.color = 'red';
	}
}
checkingvalueinputs.hay.oninput = e => handlecheckingvalue(e, 'hay');
checkingvalueinputs.silage.oninput = e => handlecheckingvalue(e, 'silage');
checkingvalueinputs.straw.oninput = e => handlecheckingvalue(e, 'straw');