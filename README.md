*** MyMusicApp ***

MyMusicApp is a lightweight, Electron-based desktop application that 
allows users to play their local music files 
with a clean and responsive interface. 
It is designed for speed, simplicity, and a smooth user experience.

*** Project Structure ***

MyMusicApp/
├── app/
│   ├── index.html
│   ├── styles.css
│   ├── renderer.js
│   ├── main.js
│   ├── preload.js
│   ├── player.js
│   └── assets/
│       └── icons/
├── docs/
│   ├── README.md
│   ├── UserManual.pdf
│   └── testing-methodology.md
├── tests/
│   ├── unit/
│   └── e2e/
├── reflections/
│   └── Individual Reflections.docx
├── team-report/
│   └── Team_Report.docx
├── .gitignore
├── package.json
└── package-lock.json

*** Prerequisites ***

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Electron](https://www.electronjs.org/)

*** Features ***
- Intuitive music file loading and playback
- Play/Pause, Seek, and Progress bar
- Equalizer & Visualizations
- Lightweight and cross-platform
- Clean UI built with HTML, CSS, and JavaScript

*** REFERENCES ***

electronjs.org. Introduction | Electron. [online] Available at: https://www.electronjs.org/docs/latest.
developer.mozilla.org. (2023). HTMLAudioElement - Web APIs | MDN. [online] Available at: https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement.
MDN Web Docs. (2019). Web Audio API. [online] Available at: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API.
developer.mozilla.org. KeyboardEvent - Web APIs | MDN. [online] Available at: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent.
Coyier, C. (2018). A Complete Guide to Flexbox | CSS-Tricks. [online] CSS-Tricks. Available at: https://css-tricks.com/snippets/css/a-guide-to-flexbox/.
MDN Web Docs. (2019). Canvas API. [online] Available at: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API.
MDN Web Docs. BiquadFilterNode. [online] Available at: https://developer.mozilla.org/en-US/docs/Web/API/BiquadFilterNode.
Electronjs.org. (2025). Tray | Electron. [online] Available at: https://www.electronjs.org/docs/latest/api/tray.
MDN Web Docs. CSS Grid Layout. [online] Available at: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout.
developer.mozilla.org. Using Promises - JavaScript | MDN. [online] Available at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises.
Electronjs.org. (2023). Quick Start | Electron. [online] Available at: https://www.electronjs.org/docs/latest/tutorial/quick-start#using-ipc.
electronjs.org. dialog | Electron. [online] Available at: https://www.electronjs.org/docs/latest/api/dialog.
developer.mozilla.org. AudioContext - Web APIs | MDN. [online] Available at: https://developer.mozilla.org/en-US/docs/Web/API/AudioContext.

*** Installation ***

```bash
git clone https://github.com/CCT-Dublin/music-player-ca1-the-cria.git
cd MyMusicApp
npm install
npm start