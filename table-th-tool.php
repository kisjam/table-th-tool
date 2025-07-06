<?php
/**
 * Plugin Name: Table TH Tool
 * Plugin URI: https://github.com/kisjam/table-th-tool
 * Description: Simple table header conversion tool for WordPress block editor. Toggle first row and first column between TH and TD elements.
 * Version: 1.0.0
 * Requires at least: 5.0
 * Requires PHP: 7.4
 * Author: kisjam
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: table-th-tool
 * Domain Path: /languages
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants
define('TABLE_TH_TOOL_VERSION', '1.0.0');
define('TABLE_TH_TOOL_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * Enqueue block editor assets
 */
function table_th_tool_enqueue_block_editor_assets() {
    wp_enqueue_script(
        'table-th-tool-editor',
        TABLE_TH_TOOL_PLUGIN_URL . 'assets/js/editor.js',
        array(
            'wp-hooks',
            'wp-element', 
            'wp-block-editor',
            'wp-components',
            'wp-data'
        ),
        TABLE_TH_TOOL_VERSION,
        true
    );
}
add_action('enqueue_block_editor_assets', 'table_th_tool_enqueue_block_editor_assets');