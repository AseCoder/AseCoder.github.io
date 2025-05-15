function createInput(country, type) {
	return `<td><input type="text" id="${country.toLowerCase().replace(' ', '') }-${type}" class="${type}in" inputmode="numeric" oninput="onUserInput(event)"></td>`;
}

const points = new Map();

// generate table
const to_be_removed = localStorage.getItem("removed_countries")?.split(",").map(x => x.trim().toLowerCase()) || [];
const countries = [
	["Albania", "logos/ALBANIA/ESC-HEART-ALBANIA-WHITE@2000px.png"],
	["Armenia"],
	// ["Australia"],
	["Austria"],
	// ["Azerbaijan", "logos/AZERBAIJAN/ESC-HEART-AZERBAIJAN-WHITE-v2.png"],
	// ["Belgium"],
	// ["Croatia"],
	// ["Cyprus"],
	// ["Czechia"],
	["Denmark"],
	["Estonia"],
	["Finland"],
	["France"],
	// ["Georgia"],
	["Germany"],
	["Greece"],
	["Iceland", "logos/ICELAND/ESC-HEART-ICELAND-WHITE-v2.png"],
	// ["Ireland"],
	["Israel"],
	["Italy"],
	["Latvia"],
	["Lithuania"],
	["Luxembourg"],
	["Malta"],
	// ["Montenegro"],
	["Netherlands"],
	["Norway"],
	["Poland"],
	["Portugal"],
	["San Marino"],
	// ["Serbia"],
	// ["Slovenia"],
	["Spain"],
	["Sweden"],
	["Switzerland"],
	["Ukraine"],
	["United Kingdom"],
].filter(n => !to_be_removed.includes(n[0].toLowerCase())); // prune countries array

// set stats
document.getElementById("stats").innerText = `0/${countries.length} countries' televote points counted, 2204 televote points remaining.`;

// set textarea content to last saved
document.getElementById("toremove").innerText = localStorage.getItem("removed_countries") || "";

const table = document.getElementById("table");

countries.forEach((double, i) => {
	const n = double[0];

	// make map entry
	points.set(n.toLowerCase().replace(' ', ''), { jury: NaN, tele: NaN, sum: NaN, jury_pred: NaN, tele_pred_h: NaN, tele_pred_v: NaN, sum_pred: NaN });

	// take special url or construct default
	const url = double[1] || `logos/${n.toUpperCase()}/ESC-HEART-${n.toUpperCase().replace(' ', '')}-WHITE.png`;

	// new row
	const row = table.insertRow(-1);
	row.id = n.toLowerCase().replace(' ', '') + "-row";

	row.innerHTML = `<td><img src="${url}" alt=""><span> ${n}</span></td>` + createInput(n, "jury") + createInput(n, "tele") + createInput(n, "sum");
});

let lastpredictioncountry;

function onUserInput(ev) {
	const id = ev.target.id; // "finland-jury"
	const [country, type] = id.split('-');
	const num = parseInt(ev.target.value);
	console.log("user input at", id, "new value", num);

	
	// add to database
	const entry = points.get(country);
	entry[type] = num;

	entry.jury_pred = NaN;
	entry.tele_pred_h = NaN;
	entry.sum_pred = NaN;
	// remove all neighboring placeholders
	document.getElementById(country + "-jury").removeAttribute("placeholder");
	document.getElementById(country + "-tele").removeAttribute("placeholder");
	document.getElementById(country + "-sum").removeAttribute("placeholder");
	// remove neighboring redcells
	document.getElementById(country + "-jury").classList.remove("redcell");
	document.getElementById(country + "-tele").classList.remove("redcell");
	document.getElementById(country + "-sum").classList.remove("redcell");

	// if 2 values exist, calculate third
	let placeholder;
	if (!isNaN(entry.jury) && !isNaN(entry.tele)) {
		const result = entry.jury + entry.tele;
		if (type === "sum") placeholder = result; // cache result for redcell logic
		document.getElementById(country + "-sum").placeholder = result;
		entry.sum_pred = result; // calculated from horizontal neighbors
		console.log("added placeholder of jury + tele (", result, ") to sum");
	} else if (!isNaN(entry.jury) && !isNaN(entry.sum)) {
		const result = entry.sum - entry.jury;
		if (type === "tele") placeholder = result;
		document.getElementById(country + "-tele").placeholder = result;
		entry.tele_pred_h = result; // calculated from horizontal neighbors
		console.log("added placeholder of sum - jury (", result, ") to tele");
	} else if (!isNaN(entry.tele) && !isNaN(entry.sum)) {
		const result = entry.sum - entry.tele;
		if (type === "jury") placeholder = result;
		document.getElementById(country + "-jury").placeholder = result;
		entry.jury_pred = result; // calculated from horizontal neighbors
		console.log("added placeholder of sum - tele (", result, ") to jury");
	}

	// if the sum of jury points given out is greater than it should be
	const jurysum = points.values().toArray()
		.filter(x => !isNaN(x.jury) || !isNaN(x.jury_pred))
		.reduce((a, b) => a + (isNaN(b.jury) ? b.jury_pred : b.jury), 0);
	document.getElementById("jurystats").innerText = 37 * 58 - jurysum + " jury points remaining."
	if (jurysum > 37 * 58) {
		console.error("sum of jury points given:", jurysum, "exceeds max:", 37 * 58);
		// redcell the jury cell
		document.getElementById(country + "-jury").classList.add("redcell");
	}
	
	
	// color country if it has a tele value and decolor if not
	colorDecolor(country, entry);
	
	// update stats
	console.log(points);
	
	// prediction
	const televotes = points.values().filter(x => !isNaN(x.tele) || !isNaN(x.tele_pred_h)).map(x => isNaN(x.tele) ? x.tele_pred_h : x.tele).toArray(); // how many televote points each country received (meaning entered or calculated from horizontal neighbors)
	const remaining = (37 + 1) * 58 - televotes.reduce((a, b) => a + b, 0); // not affected by number of countries in the final
	document.getElementById("stats").innerText = `${televotes.length}/${countries.length} countries' televote points counted, ${remaining} televote points remaining.`;
	console.log("current televoting situation:", televotes, "and remaining televotes:", remaining);

	// if all countries but one have received televote (meaning entered or calculated from horizontal neighbors. this code will calculate a vertical neighbor, which must be differentiated)
	if (televotes.length === countries.length - 1) {
		// what is the last country? its the one with neither tele nor tele_pred_h
		let lastcountry = points.entries().find(x => isNaN(x[1].tele) && isNaN(x[1].tele_pred_h));
		console.log(`predicting last televote, because ${countries.length - 1} countries have received their televote. giving the remaining ${remaining} televote points to the last country, ${lastcountry[0]}`);
		
		// find this country in points and give it points
		const lastcountry_entry = points.get(lastcountry[0])
		lastcountry_entry.tele_pred_v = remaining;

		// update ui with placeholder
		document.getElementById(lastcountry[0] + "-tele").placeholder = remaining;

		// if possible, sum also
		if (!isNaN(lastcountry_entry.jury)) {
			const sum = lastcountry_entry.jury + remaining;
			document.getElementById(lastcountry[0] + "-sum").placeholder = sum;
			lastcountry_entry.sum_pred = sum;

			// is this the winner? others could have a higher sum
			// is there even a winner? ~~only if all countries have a sum or sum pred~~ only between the countries that have a sum or sum pred
			const winner = points.entries().toArray()
				.filter(x => !isNaN(x[1].sum) || !isNaN(x[1].sum_pred))
				.sort((a, b) => {
					const a_sum = isNaN(a[1].sum) ? a[1].sum_pred : a[1].sum;
					const b_sum = isNaN(b[1].sum) ? b[1].sum_pred : b[1].sum;
					return b_sum - a_sum;
				})
				[0];
			console.log("the winner is", winner);
			
			// winner text
			const countryobj = countries.find(x => x[0].toLowerCase().replace(' ', '') === winner[0]);
			const n = countryobj[0];
			const url = countryobj[1] || `logos/${n.toUpperCase()}/ESC-HEART-${n.toUpperCase().replace(' ', '')}-WHITE.png`;
			const winner_sum = isNaN(winner[1].sum) ? winner[1].sum_pred : winner[1].sum;
			document.getElementById("winner").innerHTML = `<img src="${url}" alt=""><span> ${n} is the winner with ${winner_sum} overall points.</span>`;
		}

		colorDecolor(lastcountry[0], lastcountry_entry);

		lastpredictioncountry = lastcountry[0];
	} else if (lastpredictioncountry) {
		console.log("a winner was predicted last time");
		// remove tele and sum placeholder
		document.getElementById(lastpredictioncountry + "-tele").removeAttribute("placeholder");
		document.getElementById(lastpredictioncountry + "-sum").removeAttribute("placeholder");
		// and from entry too (i wish i had used react)
		points.get(lastpredictioncountry).tele_pred_v = NaN;

		colorDecolor(lastpredictioncountry, points.get(lastpredictioncountry));

		// remove winner text
		document.getElementById("winner").innerHTML = "";

		lastpredictioncountry = undefined;
	}

	// REDCELL LOGIC

	// its never an error to remove a value. from here on num exists.
	if (isNaN(num)) return;

	// if this value is negative
	if (num < 0) {
		console.error(id, num, "is negative");
		return ev.target.classList.add("redcell");
	}

	// if the calculation is negative (requires sum and at least one other)
	if (!isNaN(entry.jury) && !isNaN(entry.sum) && entry.sum - entry.jury < 0) {
		console.error(id, "sum - jury < 0");
		return ev.target.classList.add("redcell");
	} else if (!isNaN(entry.tele) && !isNaN(entry.sum) && entry.sum - entry.tele < 0) {
		console.error(id, "sum - tele < 0");
		return ev.target.classList.add("redcell");
	}

	// if placeholder exists (so the two other values exist) and the user enters an unexpected value (!= placeholder)
	if (!isNaN(placeholder) && num !== placeholder) {
		console.error(id, "placeholder disagree. calculated", placeholder, "received", num);
		return ev.target.classList.add("redcell");
	}

	if (isNaN(entry.sum)) return; // (sum exists now) (necessary for the following cases)

	// if a value is changed such that its in disagreement with (the calculation from) the other two:

	// jury was changed and tele exists (and sum exists) and the calculation disagrees, or
	if (type === "jury" && !isNaN(entry.tele) && entry.sum - entry.tele !== num) {
		console.error(id, "sum - tele != jury");
		return ev.target.classList.add("redcell");
	}

	// tele was changed and jury exists (and sum exists) and the calculation disagrees
	if (type === "tele" && !isNaN(entry.jury) && entry.sum - entry.jury !== num) {
		console.error(id, "sum - jury != tele");
		return ev.target.classList.add("redcell");
	}
}

function colorDecolor(country, obj) {
	// color country if it has a tele value and decolor if not
	if (!isNaN(obj.tele) || !isNaN(obj.tele_pred_h) || !isNaN(obj.tele_pred_v)) {
		document.getElementById(country + "-row").firstChild.classList.add("greyedout");
	} else {
		document.getElementById(country + "-row").firstChild.classList.remove("greyedout");
	}
}

function toremoveChanged(ev) {
	localStorage.setItem("removed_countries", ev.target.value);
}