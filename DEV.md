# Development Workflow

This document describes the local development workflow for the Master PDF Viewer plugin, including the `npm run wp` command and automatic browser reload.

## The `wp` Command

The `wp` npm script starts the full local development environment with a single command:

```bash
npm run wp
```

### What it does

The `wp` script chains the following steps:

1. **Starts Apache** in the background (`apache_start.bat`)
2. **Starts MySQL** in the background (`mysql_start.bat`)
3. **Waits 3 seconds** for services to initialize
4. **Opens the browser** to `http://localhost/wp-admin/post.php?post=6&action=edit`
5. **Starts webpack dev server** in the background (`wp-scripts start --webpack-copy-php`)
6. **Starts the file watcher** in the foreground (`node watch-reload.js`)

### package.json definition

```json
"wp": "cmd /c start /B C:/xampp/apache_start.bat & start /B C:/xampp/mysql_start.bat & timeout /t 3 /nobreak >nul & start \"\" \"http://localhost/wp-admin/post.php?post=6&action=edit\" & start /B npm run start & node watch-reload.js"
```

## Auto-Reload Mechanism

The auto-reload system watches for file changes and automatically refreshes the WordPress admin page in the browser.

### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `watch-reload.js` | Project root | Node.js file watcher using `fs.watch` and `http` |
| `auto-reload.php` | `wp-content/mu-plugins/` | WordPress must-use plugin that injects polling JS |
| HTTP endpoint | `http://localhost:35729/reload` | Returns `{ reload: true }` when files change |

### How it works

1. **`watch-reload.js`** runs an HTTP server on port 35729 and watches the project directory for file changes using `fs.watch`.
2. When a `.php`, `.js`, `.jsx`, `.ts`, `.tsx`, `.scss`, `.css`, `.html`, `.json`, or `.md` file is saved, the watcher sets a reload flag.
3. **`auto-reload.php`** injects a JavaScript snippet into the WordPress admin footer that polls `http://localhost:35729/reload` every second.
4. When the poll detects `{ reload: true }`, it calls `location.reload()` to refresh the page.

### Watch-reload configuration

The watcher ignores these directories:
- `node_modules/`
- `.git/`
- `build/`
- `pdf-js/`
- `master-pdf-viewer/`

Debounce delay: 300ms (prevents multiple reloads from rapid saves).

## VS Code Task

You can also run the `wp` command from VS Code using the built-in task:

1. Press `Ctrl+Shift+B` (default build task shortcut)
2. Or press `Ctrl+Shift+P` ? type **Tasks: Run Task** ? select **Start WordPress Dev**

Task definition is in `.vscode/tasks.json`:

```json
{
  "label": "Start WordPress Dev",
  "type": "shell",
  "command": "npm run wp",
  "group": {
    "kind": "build",
    "isDefault": true
  }
}
```

## Stopping the Dev Environment

To stop all services:

1. Close the VS Code terminal running `npm run wp`
2. Or manually stop Apache and MySQL from the XAMPP control panel

## Troubleshooting

- **Port 35729 already in use**: Another instance of `watch-reload.js` is running. Stop it or change the `PORT` constant in `watch-reload.js`.
- **Browser doesn't reload**: Ensure `wp-content/mu-plugins/auto-reload.php` exists and Apache is running.
- **File changes not detected**: Verify the file extension is in the watched list in `watch-reload.js`.
- **Apache/MySQL won't start**: Check XAMPP control panel for port conflicts (ports 80, 443, 3306).

## Files Involved

| File | Purpose |
|------|---------|
| `package.json` | Defines the `wp` npm script |
| `watch-reload.js` | Node.js file watcher and HTTP server |
| `wp-content/mu-plugins/auto-reload.php` | WordPress must-use plugin for browser polling |
| `.vscode/tasks.json` | VS Code task definition |
