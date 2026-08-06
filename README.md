# Master PDF Viewer

A WordPress plugin that embeds PDF files directly into posts and pages using a Gutenberg block powered by Mozilla's PDF.js library.

## Description

Master PDF Viewer allows you to upload PDF files and immediately embed them into your WordPress posts and pages — as easy as adding a photograph. Your PDF files automatically resize to their proper dimensions, and the embedded viewer is fully responsive across all devices.

The plugin uses only JavaScript and serves all files from your own server, giving you complete control over appearance and performance with no third-party dependencies.

## Features

- **Gutenberg Block** — Insert PDFs directly into the block editor by dragging and dropping a PDF file or selecting one from your media library.
- **Customizable Viewer** — Toggle toolbar options such as download, print, search, sidebar, presentation mode, and hand cursor tool.
- **Responsive Dimensions** — Set width and height in pixels or percentages. The viewer auto-adjusts to fit your layout.
- **Zoom Controls** — Choose from automatic zoom, actual size, page fit, page width, or specific zoom levels (50%–400%).
- **Page Navigation** — Set a default landing page and choose between vertical scrolling, horizontal scrolling, wrapped scrolling, or page scrolling modes.
- **Mobile Friendly** — Intelligent fullscreen mode with a large "View in Full Screen" button for smaller screens.
- **Theme Color** — Customize the viewer's appearance with a theme color setting.
- **Self-Hosted** — All JavaScript and assets are served from your own server — no external CDNs or third-party services.

## Installation

### From the WordPress Admin

1. Go to **Plugins > Add New** in your WordPress admin panel.
2. Search for **Master PDF Viewer**.
3. Click **Install Now**, then **Activate**.

### Manual Installation

1. Upload the `master-pdf-viewer` directory to the `/wp-content/plugins/` directory.
2. Go to **Plugins** in your WordPress admin and activate **Master PDF Viewer**.

## Usage

1. Navigate to any post or page and click **Add Block**.
2. Select the **Master PDF Viewer** block (found in the **Media** category).
3. Drag a PDF file into the block or select a PDF from your media library.
4. Use the **Inspector Controls** panel in the editor to customize:
   - **PDF General Settings** — Enable/disable download, print, search, sidebar, presentation mode, and other toolbar features.
   - **PDF Dimensions** — Set width and height (append `%` for percentage values).
   - **PDF Zoom Level** — Choose the default zoom behavior.
   - **PDF Page Number** — Set the default landing page.
   - **Page View Mode** — Choose the scrolling behavior.

## Block Attributes

| Attribute            | Type    | Default       | Description                     |
| -------------------- | ------- | ------------- | ------------------------------- |
| `id`                 | integer | 0             | Attachment ID of the PDF        |
| `file`               | string  | `""`          | URL of the PDF file             |
| `title`              | string  | `""`          | Title of the PDF                |
| `externalUrl`        | string  | `""`          | External URL to a PDF           |
| `download`           | boolean | `false`       | Show download button            |
| `print`              | boolean | `false`       | Show print button               |
| `search`             | boolean | `false`       | Show search bar                 |
| `sidebar`            | boolean | `false`       | Show sidebar                    |
| `presentationMode`   | boolean | `false`       | Enable presentation mode        |
| `openFile`           | boolean | `false`       | Show open file button           |
| `editButton`         | boolean | `false`       | Show edit button                |
| `cursorHandTool`     | boolean | `false`       | Default to hand cursor tool     |
| `documentProperties` | boolean | `false`       | Show document properties button |
| `themeColor`         | string  | `#333`        | Viewer theme color              |
| `width`              | string  | `100%`        | Width of the viewer             |
| `height`             | string  | `400`         | Height of the viewer            |
| `zoomLevel`          | string  | `page-actual` | Default zoom level              |
| `defaultLandingPage` | string  | `1`           | Default page to open            |
| `pageViewMode`       | string  | `default`     | Page scrolling mode             |

## Settings

Go to **Settings -> Master PDF Viewer** in the WordPress admin to change site-wide defaults for the PDF viewer. You can also override individual embeds by modifying the Gutenberg Block settings.

## Requirements

- WordPress 5.0 or higher
- PHP 6.0 or higher

## Screenshots

1. Uploaded PDF is displayed within your page/post at the correct size to fit.
2. General Settings for the PDF viewer.
3. Extra settings for the PDF viewer.

## Changelog

### 0.0.3

- Save only file path in block attributes for portable storage
- Maintain backward compatibility with existing blocks
- Remove external URL input from media placeholder
- Add auto-reload development workflow
- Update WordPress tested version to 7.0

### 0.1.0

- Initial release

## License

GNU General Public License v2.0 or later

## Contributors

- robiulawal40
- fuad40
