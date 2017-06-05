window.setInterval( function() {
    let wait = document.getElementById("loadmessage");
    if ( wait.innerHTML.length > 9 ) 
        wait.innerHTML = "LOADING.";
    else 
        wait.innerHTML += ".";
}, 500);

function setProgress(x) {
	let bar = document.getElementById("bar");
	bar.style.width = x + '%';
}

function unfade(ele) {
    ele.style.transition = 'opacity ease-in 5s';
    ele.style.opacity = 1;
}

document.getElementById('welcome').style.background = 'url(css/bg/1.jpg) 0 0'
setProgress(0)