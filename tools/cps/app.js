let startTime = Date.now();
let clicks = [];
const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', () => {
	if (resetButton.classList.contains('greyBackground')) return;
	startTime = Date.now();
	clicks = [];
	resetButton.classList.add('greyBackground');
	setTimeout(() => {
		resetButton.classList.remove('greyBackground');
	}, 3000);
});
document.addEventListener('click', () => {
	clicks.push(Date.now());
});

function update() {
	document.getElementById('timeElapsed').innerText = ((Date.now() - startTime) / 1000).toFixed(2) + ' s';
	document.getElementById('totalClicks').innerText = clicks.length;
	document.getElementById('avgCps').innerText = (1000 * clicks.length / (Date.now() - startTime)).toFixed(2) + ' cps';
	document.getElementById('avgCpm').innerText = (60000 * clicks.length / (Date.now() - startTime)).toFixed(2) + ' cpm';


	const rollingTime = Math.min(parseFloat(document.getElementById('rollingAverageInput').value), (Date.now() - startTime) / 1000);
	let i = 1;
	let fullclicks = 0;
	while (true) {
		// count full clicks within last rolling time
		let thisClick = clicks.at(-i);
		if (thisClick > Date.now() - rollingTime * 1000) {
			fullclicks++;
		} else {
			if (i > 2 && thisClick !== undefined) {
				if (thisClick === undefined) thisClick = Date.now() - rollingTime * 1000;
				// calculate fraction of click
				console.log((clicks.at(-i + 1) - Date.now() + rollingTime * 1000));
				fullclicks += (clicks.at(-i + 1) - Date.now() + rollingTime * 1000) / (clicks.at(-i + 1) - thisClick);
			}
			break;
		}
		i++;
	}
	// console.log(fullclicks);

	document.getElementById('ravgCps').innerText = (fullclicks / rollingTime).toFixed(2) + ' cps';
	document.getElementById('ravgCpm').innerText = (fullclicks * 60 / rollingTime).toFixed(2) + ' cpm';
	setTimeout(() => {
		requestAnimationFrame(update);
	}, 60);
}
update();