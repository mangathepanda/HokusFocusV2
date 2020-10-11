var blocker = document.getElementById('blocker');
var settings = document.getElementById('settings');
var calendar = document.getElementById('calendar');
var modules = document.getElementsByClassName('content');
blocker.addEventListener('click', ()=>{
    showModule('blocker-wrapper');
})

settings.addEventListener('click', ()=>{
    showModule('settings-wrapper');
})

calendar.addEventListener('click', ()=>{
    showModule('calendar-wrapper');
})

async function showModule(module){
    for(i = 0;i < modules.length;i++){

        if(modules[i].classList[0] == module){
            modules[i].classList.add('is-shown');
        } else{
            modules[i].classList.remove('is-shown')
        }
    }
}

function retard (){
    console.log('a')
}