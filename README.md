# Table TH Tool

WordPress plugin to convert table cells between TH and TD elements.

## Features

- First row header toggle
- First column header toggle

## Installation

1. Download the plugin files
2. Upload to your WordPress `/wp-content/plugins/` directory
3. Activate the plugin through the 'Plugins' menu in WordPress
4. Start using the controls in the block editor

## Usage

1. Add a Table block in the block editor
2. Select the table block
3. Use the toggles in the "Table Headers" panel

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

### File Structure

```
table-th-tool/
├── assets/
│   └── js/
│       └── editor.js          # Block editor integration
├── table-th-tool.php          # Main plugin file
├── README.md                   # This file
└── docker-compose.yml         # Development environment
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This plugin is licensed under the GPL v2 or later.

## Changelog

### 1.0.0
- Initial release
- First row header toggle
- First column header toggle
- Support for thead/tbody/tfoot sections