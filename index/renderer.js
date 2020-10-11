const {ipcRenderer} = require('electron')

var close = document.getElementById('close');
close.addEventListener('click',()=>{
    ipcRenderer.send('close-button');
})

var maximize = document.getElementById('maximize');
maximize.addEventListener('click',()=>{
    ipcRenderer.send('maximize-button');
})

var minimize = document.getElementById('minimize');
minimize.addEventListener('click', ()=>{
    ipcRenderer.send('minimize-button')
})

/*var startBlocker = document.getElementById('blocker-start');
startBlocker.addEventListener('click',()=>{
    ipcRenderer.send('startBlocker')
})*/

/*var a = document.getElementById('blocker');
a.addEventListener('click',()=>{
    document.getElementsByClassName('blocker-clock')[0].classList.add('cent')
    document.getElementsByClassName('blocker-settings')[0].classList.add('display-none')
})*/