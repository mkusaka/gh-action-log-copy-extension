# GitHub Actions Log Copy Extension

A Chrome extension that adds a "Copy log" button to each step in GitHub Actions job details page, allowing you to copy the full log content without timestamps to your clipboard with a single click.

![Screenshot showing Copy log buttons on GitHub Actions job page](https://github.com/mkusaka/gh-action-log-copy-extension/assets/1462049/screenshot-placeholder)

## Features

- Adds a "Copy log" button to each step header in GitHub Actions job pages
- Automatically removes timestamps from log lines while preserving indentation
- Handles GitHub's log API redirects (307) automatically
- Shows visual feedback ("Copying...", "Copied!", "Error") on button interaction
- Works with dynamically loaded content using MutationObserver

## Installation

### Developer Mode Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top right)
4. Click **Load unpacked**
5. Select the folder containing this extension

## Usage

1. Navigate to any GitHub Actions job details page:
   - URL pattern: `https://github.com/*/actions/runs/*/jobs/*`
2. Each step will have a "Copy log" button on the right side of the header
3. Click the button to copy the step's full log to your clipboard
4. The button will show "Copied!" on success or "Error" if something goes wrong

## How It Works

1. The extension injects a content script on GitHub Actions job pages
2. It scans for step headers (`.CheckStep-header` elements)
3. For each step, it adds a button that:
   - Fetches the log content using the `data-log-url` attribute
   - Strips ISO8601 timestamps from the beginning of each line
   - Copies the cleaned log to the clipboard using the Clipboard API

## Permissions

- `clipboardWrite`: Required to copy log content to clipboard
- `https://github.com/*`: Required to access GitHub Actions pages and fetch log data

## Development

The extension consists of:
- `manifest.json`: Chrome extension manifest (v3)
- `content-script.js`: Main script that adds buttons and handles log copying

## License

MIT License - see LICENSE file for details