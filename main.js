const {app,BrowserWindow, ipcMain} = require('electron');
const Store = require('electron-store');
//const setupPug = require('electron-pug')
const setupPug =require('./pugLinker');
const store = new Store();

var mainWindow;
var firstTime,blockerURLs;
var isBlockerON = false;
//Functions

function createMainWindow() {
    mainWindow = new BrowserWindow({
       show : false,
       frame : false,
       resizable : true,
       width : 1280,
       height : 720,
       webPreferences : {
           nodeIntegration : true
       } 
    })

    mainWindow.setMenu(null);
    mainWindow.loadFile('index/index.pug');
    mainWindow.on('ready-to-show', () => {
        mainWindow.show();
    })
    mainWindow.webContents.openDevTools()
}

async function createStoreConfig(){
    store.set('firstTime','0');
    store.set('blocker-urls', [
        {"url" : "youtube.com"},
        {"url" : "facebook.com"},
        {"url" : "instagram.com"},
        {"url" : "twitter.com"}
    ]);
}

async function loadStoreConfig(){
    firstTime = store.get('firstTime');
    blockerURLs = store.get('blocker-urls');
}

// Ready

app.on('ready', async() => {
    try {
        let pug = await setupPug({pretty: true})
        pug.on('error', err => console.error('electron-pug error', err))
      } catch (err) {
        // Could not initiate 'electron-pug'
      }

    if (store.has('firstTime') == false){
        await createStoreConfig();
        await loadStoreConfig();
    } else {
        await loadStoreConfig();
    }
    createMainWindow();
})

ipcMain.on('close-button', (event) =>{
    app.quit();
})

ipcMain.on('minimize-button',(event) =>{
    mainWindow.minimize();
})

ipcMain.on('maximize-button',(event)=>{
    if(mainWindow.isMaximized()){
        mainWindow.unmaximize();
    }else{
        mainWindow.maximize();
    }
})

ipcMain.on('startBlocker',(event)=>{
    isBlockerON = true;
    startBlocker();
})

const io = require('socket.io')();
var extension_id;
io.on('connection', socket=>{
    extension_id = socket.id
    socket.on('extension-connected',()=>{
        UpdateBlockList();
    })
})

function UpdateBlockList(){
    io.to(extension_id).emit('updateList', {
        "data" : blockerURLs
    });
}

function startBlocker(){
    io.to(extension_id).emit('startBlocking')
}

io.listen(3001)