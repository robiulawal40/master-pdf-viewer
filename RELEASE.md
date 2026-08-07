# Plugin Release Process

This document describes the complete release workflow for deploying a WordPress plugin from GitHub to WordPress.org.

## Prerequisites

1. WordPress.org plugin approved and SVN credentials obtained
2. GitHub repository created with the plugin code
3. SVN username and password added as GitHub Secrets:
   - `SVN_USERNAME`
   - `SVN_PASSWORD`

## Project Structure Requirements

```
plugin-root/
+-- .github/
¦   +-- workflows/
¦       +-- deploy.yml          # GitHub Actions workflow
+-- .wordpress-org/             # Assets for WordPress.org directory
¦   +-- banner-772x250.png
¦   +-- icon-128x128.png
¦   +-- icon-256x256.png
¦   +-- screenshot-*.png
+-- dist/                       # Built plugin files (committed to git)
¦   +-- master-pdf-viewer.php
¦   +-- functions.php
¦   +-- readme.txt
¦   +-- sample.pdf
¦   +-- build/
¦   +-- pdf-js/
+-- prepare-dist.js             # Script to build dist/ folder
+-- package.json
+-- master-pdf-viewer.php
+-- functions.php
+-- readme.txt
+-- ...
```

## Version Management

Update version in all files before releasing:

| File | Field | Example |
|------|-------|---------|
| `package.json` | `"version"` | `"0.0.2"` |
| `master-pdf-viewer.php` | `Version:` header and `MVP_VERSION` constant | `0.0.2` |
| `readme.txt` | `Stable tag:` and changelog | `0.0.2` |

## Local Build Steps

Run these commands locally before committing:

```bash
# 1. Clean and rebuild
npm run dist

# 2. Verify dist/ contents
ls dist/

# 3. Commit dist/ folder
git add -A
git commit -m "Build dist for v0.0.2"
git push
```

## GitHub Release Steps

1. Go to https://github.com/OWNER/REPO/releases/new
2. **Tag version**: create a new tag matching the plugin version (e.g., `0.0.2`)
3. **Release title**: same as tag (e.g., `0.0.2`)
4. **Description**: changelog or release notes
5. Click **Publish release**

## GitHub Actions Workflow

The workflow (`.github/workflows/deploy.yml`) triggers on release publish and:

1. Checks out the repository
2. Uses `10up/action-wordpress-plugin-deploy@stable` with:
   - `BUILD_DIR: dist` — deploys built files to SVN trunk
   - `ASSETS_DIR: .wordpress-org` — deploys banner, icons, screenshots
   - `VERSION: ${{ github.event.release.tag_name }}` — sets the plugin version
   - SVN credentials from secrets

```yaml
name: Deploy to WordPress.org

on:
  release:
    types: [published]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v5

      - name: Deploy to WordPress.org
        uses: 10up/action-wordpress-plugin-deploy@stable
        env:
          SVN_PASSWORD: ${{ secrets.SVN_PASSWORD }}
          SVN_USERNAME: ${{ secrets.SVN_USERNAME }}
          BUILD_DIR: dist
          ASSETS_DIR: .wordpress-org
          VERSION: ${{ github.event.release.tag_name }}
```

## How It Works

- `BUILD_DIR` — directory containing built plugin files. All files in this directory are deployed to the WordPress.org SVN trunk. `.distignore` or `.gitattributes` are ignored when using `BUILD_DIR`.
- `ASSETS_DIR` — directory containing WordPress.org plugin assets (banner, icons, screenshots). These are automatically moved to the `assets/` directory in SVN.
- `VERSION` — defaults to the Git tag name. Explicitly set to the release tag for consistency.
- The action commits the Git tag contents to the WordPress.org SVN repository using the same tag name.

## Post-Deployment

- WordPress.org automatically generates the plugin zip
- The plugin appears at `https://wordpress.org/plugins/SLUG/`
- SVN tags are created automatically
- Assets appear in the plugin directory

## Releasing a New Version

1. Update version numbers in all files
2. Make code changes and test
3. Run `npm run dist` to rebuild `dist/`
4. Commit and push changes
5. Create a new GitHub Release with the matching tag
6. Wait for GitHub Actions to complete
7. Verify on WordPress.org

## Troubleshooting

- **Tag already exists**: Delete the tag locally and remotely, then recreate
  ```bash
  git tag -d 0.0.2
  git push origin :refs/tags/0.0.2
  ```
- **Workflow fails**: Check GitHub Actions logs for specific errors
- **SVN auth fails**: Verify `SVN_USERNAME` and `SVN_PASSWORD` secrets are correct
- **npm ci fails**: Use `npm install` instead of `npm ci` if lockfile is out of sync
- **Node.js deprecation warning**: Use `actions/setup-node@v5` with `node-version: '24'` and `actions/checkout@v5`
