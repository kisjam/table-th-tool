# Table TH Tool

WordPress plugin to convert table cells between TH and TD elements.

WordPressのテーブルブロック（表）で、先頭行・先頭列のセルをTH/TDに切り替えるシンプルなプラグインです。

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
