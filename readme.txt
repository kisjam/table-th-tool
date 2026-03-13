=== Table TH Tool ===
Contributors: kisjam
Tags: table, th, td, gutenberg, block-editor
Requires at least: 5.0
Tested up to: 6.7
Stable tag: 1.1.1
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Toggle first row and first column between TH and TD in WordPress table blocks.

== Description ==

WordPress's standard table block doesn't provide a simple way to convert the first row or first column to header cells. This plugin adds toggle controls in the block inspector sidebar to switch between th and td for the first row and first column.

Key features:

* Toggle first row between TH and TD
* Toggle first column between TH and TD
* Works with thead, tbody, and tfoot sections

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/table-th-tool` directory
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Select a table block in the block editor and use the toggles in the "Table Headers" panel in the sidebar

If you find this plugin useful, consider buying me a coffee: https://buymeacoffee.com/kisjam

== Screenshots ==

1. Toggle controls in the block inspector sidebar — switch first row and first column between TH and TD.
2. Close-up of the "Table Headers" panel showing both toggle controls.

== Frequently Asked Questions ==

= Which WordPress versions are supported? =

WordPress 5.0 and later with the block editor (Gutenberg).

= Do I need to configure anything? =

No configuration needed. Activate the plugin and the controls appear automatically when a table block is selected.

== Changelog ==

= 1.1.1 =
* Updated documentation and README

= 1.1.0 =
* Migrated build environment to @wordpress/scripts
* Improved code structure with JSX and modern tooling

= 1.0.0 =
* Initial release
* First row header toggle
* First column header toggle
* Support for thead/tbody/tfoot sections

== Upgrade Notice ==

= 1.1.1 =
Documentation update. No functional changes.

= 1.1.0 =
Refactored build environment. Functionality is unchanged.

= 1.0.0 =
Initial release.
