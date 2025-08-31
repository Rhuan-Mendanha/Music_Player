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

*** Technologies Used ***
- Electron
- HTML5, CSS3, JavaScript
- Node.js

*** Packaging ***
To build the desktop application for distribution:
npm run build

*** License ***

`docs/testing-methodology.md`

This document outlines the testing strategy for MyMusicApp, ensuring reliability, stability, and a smooth user experience.

*** Test Types ***

### 1. Unit Testing

Unit tests validate individual components and modules of the app:

- **Tools Used:** Jest
- **Location:** `tests/unit/`
- **Scope:**
  - `player.js`: Play, pause, seek, load audio
  - `renderer.js`: UI event bindings and updates
  - Utility functions

### 2. End-to-End (E2E) Testing

E2E tests validate complete workflows from user input to playback:

- **Tools Used:** Spectron (Electron's E2E testing library)
- **Location:** `tests/e2e/`
- **Scope:**
  - Launching the application
  - Loading a file and initiating playback
  - Playback controls (play, pause, seek)
  - UI responsiveness

*** Test Strategy ***

### Unit Tests
- Mock DOM or file system when necessary
- Test edge cases: unsupported formats, empty files, corrupted files
- npm test


### E2E Tests
- Simulate full user interactions
- Check window rendering, file dialogs, audio feedback
- npm run test:e2e

*** Test Coverage Goals ***

| Module        | Target Coverage |
| ------------- | --------------- |
| `player.js`   | 90%             |
| `renderer.js` | 80%             |
| UI Tests      | Key flows       |


*** Example Commands ***

Run all unit tests:
```bash
npm run test:unit