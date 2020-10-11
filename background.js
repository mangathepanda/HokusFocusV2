var interval,blockedURLs

var socket = io.connect('http://localhost:3001');
socket.on('connect', ()=>{
    socket.emit('extension-connected');
});

socket.on('updateList',(data)=>{
    blockedURLs=data['data'];
});

socket.on('startBlocking',()=>{
    start();
});

socket.on('stopBlocking',()=>{
    clearInterval(interval);
});

socket.on('disconnect',()=>{
    clearInterval(interval);
})

function start(){
    clearInterval(interval)
    interval=setInterval(function(){
        chrome.tabs.query({},function(tabs){
            tabs.forEach(element => {
                tempURL = cleanURL(element.url)
                for(i=0;i<blockedURLs.length;i++){
                    if (tempURL === blockedURLs[i]['url']){
                    chrome.tabs.remove(element.id)
                    //alert('Closed '+tempURL + ' for you. Get back to work')
                    }
                }
                })
            })
        },1000)
}

function cleanURL(url){
    if (url.substring(0,12) === "https://www."){
        url = url.substring(12,url.length);
    } else if (url.substring(0,11) === "http://www."){
        url = url.substring(11,url.length)
    } else if (url.substring(0,8) === "https://"){
        url = url.substring(8,url.length);
    } else if(url.substring(0,7) === "http://"){
        url = url.substring(7,url.length)
    } else{
        return "invalid";
    }
    url = url.substring(0,(url.indexOf("/")))
    return url;
}

