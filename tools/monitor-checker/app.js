const el = document.getElementById('a');
document.onmousemove = (e) => {
	console.log('a');
	el.style.marginTop = e.pageY + 'px';
	el.style.marginLeft = e.pageX + 'px';
};