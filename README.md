# Table TH Tool

A simple WordPress plugin that adds table header conversion controls to the block editor.

## Description

Table TH Tool provides an intuitive way to convert table cells between TH (header) and TD (data) elements in WordPress table blocks. Perfect for creating accessible tables with proper semantic structure.

## Features

- **First Row Headers**: Toggle the entire first row between TH and TD elements
- **First Column Headers**: Toggle the entire first column between TH and TD elements  
- **Visual Toggle Controls**: Easy-to-use form toggles in the block sidebar
- **Semantic HTML**: Promotes proper table structure for accessibility
- **thead/tbody/tfoot Support**: Works with all table sections

## Installation

1. Download the plugin files
2. Upload to your WordPress `/wp-content/plugins/` directory
3. Activate the plugin through the 'Plugins' menu in WordPress
4. Start using the controls in the block editor

## Usage

1. Create or edit a post/page with the block editor
2. Add a Table block
3. Select the table block
4. In the block sidebar, find the "Table Headers" panel
5. Use the toggles to convert:
   - **First Row as Header**: Convert the first row to/from header cells
   - **First Column as Header**: Convert the first column to/from header cells

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