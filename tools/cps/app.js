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
	const rollingTime = parseFloat(document.getElementById('rollingAverageInput').value);
	document.getElementById('ravgCps').innerText = (clicks.filter(clickTime => clickTime >= Date.now() - rollingTime * 1000).length / rollingTime).toFixed(2) + ' cps';
	requestAnimationFrame(update);
}
update();