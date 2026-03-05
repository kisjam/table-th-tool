# Table TH Tool

WordPress plugin to convert table cells between TH and TD elements.

## Features

- First row header toggle / 先頭行をTH/TDに切り替え
- First column header toggle / 先頭列をTH/TDに切り替え

## Installation

1. Download the plugin files
2. Upload to your WordPress `/wp-content/plugins/` directory
3. Activate the plugin through the 'Plugins' menu in WordPress

## Usage

1. Add a Table block in the block editor
2. Select the table block
3. Use the toggles in the "Table Headers" panel in the sidebar

## Requirements

- WordPress 5.0 or higher
- PHP 7.4 or higher
- Block editor (Gutenberg)

## Development

### Local Development Setup

1. Clone this repository
2. Run `docker-compose up -d` to start WordPress locally
3. Visit `http://localhost:8082` to access the development site
4. Activate the plugin and test your changes

```bash
npm install   # Install dependencies
npm run build # Build
npm start     # Watch mode for development
```

### File Structure

```
table-th-tool/
├── src/
│   └── index.js               # Block editor integration (JSX source)
├── build/                     # Build output (auto-generated)
├── table-th-tool.php          # Main plugin file
├── package.json               # npm config
├── README.md                  # This file
└── docker-compose.yml         # Development environment
```

## License

GPL v2 or later

## Changelog

### 1.1.0
- Refactored to use @wordpress/scripts build process
- Migrated to JSX with React hooks
- Replaced deprecated FormToggle with ToggleControl
- Removed manual dependency management

### 1.0.0
- Initial release
- First row header toggle
- First column header toggle
- Support for thead/tbody/tfoot sections
