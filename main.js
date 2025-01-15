const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // טוען את אפליקציית Angular
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
