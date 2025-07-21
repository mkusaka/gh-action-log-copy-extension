# Permission Explanations

## clipboardWrite Permission

**Why needed:** To copy the cleaned log text to your clipboard.

Without this permission, the extension cannot use `navigator.clipboard.writeText()` to copy logs.

## github.com Host Permission

**Why needed:** To fetch the raw log data from GitHub's API endpoints.

GitHub Actions stores logs at internal API URLs (e.g., `/mkusaka/repo/commit/.../checks/.../logs/1`). The extension needs permission to make `fetch()` requests to these GitHub URLs to retrieve the log content.