/* eslint-disable */
import { app, BrowserWindow, ipcMain, Menu, MenuItem } from 'electron'
import unhandled from 'electron-unhandled'
import { is } from 'electron-util'
/* eslint-enable */

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true

let mainWindow
let winURL = 'http://localhost:9080'

if (process.env.NODE_ENV === 'development') {
  try {
    // eslint-disable-next-line
    require('electron-debug')({
      showDevTools: true,
      devToolsMode: "bottom"
    })
  } catch (err) {
    console.log('Failed to install `electron-debug`: Please set `NODE_ENV=production` before build to avoid installing debugging packages. ')
  }
} else {
  winURL = `file://${__dirname}/index.html`

  /**
   * Set `__static` path to static files in production
   * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
   */
  // eslint-disable-next-line
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\') // eslint-disable-line
}

function installDevTools() {
  try {
    require('devtron').install() //eslint-disable-line
    require('vue-devtools').install() //eslint-disable-line
  } catch (err) {
    console.log('Failed to install `devtron` & `vue-devtools`: Please set `NODE_ENV=production` before build to avoid installing debugging packages. ')
  }
}

const template = [
  {
    label: 'Edit',
    submenu: [
      {role: 'undo'},
      {role: 'redo'},
      {type: 'separator'},
      {role: 'cut'},
      {role: 'copy'},
      {role: 'paste'},
      {role: 'pasteandmatchstyle'},
      {role: 'delete'},
      {role: 'selectall'}
    ]
  },
  {
    label: 'View',
    submenu: [
      {role: 'reload'},
      {role: 'forcereload'},
      {role: 'toggledevtools'},
      {type: 'separator'},
      {role: 'resetzoom'},
      {role: 'zoomin'},
      {role: 'zoomout'},
      {type: 'separator'},
      {role: 'togglefullscreen'}
    ]
  },
  {
    role: 'window',
    submenu: [
      {role: 'minimize'},
      {role: 'close'}
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('https://electronjs.org') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  template.unshift({
    label: app.getName(),
    submenu: [
      {role: 'about'},
      {type: 'separator'},
      {role: 'services', submenu: []},
      {type: 'separator'},
      {role: 'hide'},
      {role: 'hideothers'},
      {role: 'unhide'},
      {type: 'separator'},
      {role: 'quit'}
    ]
  })

  // Edit menu
  template[1].submenu.push(
    {type: 'separator'},
    {
      label: 'Speech',
      submenu: [
        {role: 'startspeaking'},
        {role: 'stopspeaking'}
      ]
    }
  )

  // Window menu
  template[3].submenu = [
    {
      label: 'New Window',
      click: createWindow
    },
    {type: 'separator'},
    {role: 'close'},
    {role: 'minimize'},
    {role: 'zoom'},
    {type: 'separator'},
    {role: 'front'}
  ]
}
const menu = Menu.buildFromTemplate(template)

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    autoHideMenuBar: is.macos,
    frame: !is.windows,
    fullscreenWindowTitle: true,
    minWidth: 320,
    minHeight: 500,
    titleBarStyle: 'hiddenInset',
    show: false
  })

  mainWindow.setMenu(null)
  mainWindow.loadURL(winURL)

  // Show when loaded
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()

    if (
      process.env.ELECTRON_ENV === 'development' ||
      process.argv.indexOf('--debug') !== -1
    ) {
      mainWindow.webContents.openDevTools()
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  unhandled()
  Menu.setApplicationMenu(menu)
  createWindow()

  if (process.env.NODE_ENV === 'development') {
    installDevTools()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('window-id', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  event.returnValue = window.id;
});
