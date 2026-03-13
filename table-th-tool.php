<?php
/**
 * Plugin Name: Table TH Tool
 * Plugin URI: https://github.com/kisjam/table-th-tool
 * Description: Simple table header conversion tool for WordPress block editor. Toggle first row and first column between TH and TD elements.
 * Version: 1.1.1
 * Requires at least: 5.0
 * Requires PHP: 7.4
 * Author: kisjam
 * Author URI: https://kisjam.com
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: table-th-tool
 * Domain Path: /languages
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

define('TABLE_TH_TOOL_VERSION', '1.1.1');
define('TABLE_TH_TOOL_PLUGIN_URL', plugin_dir_url(__FILE__));
define('TABLE_TH_TOOL_PLUGIN_DIR', plugin_dir_path(__FILE__));

/**
 * Enqueue block editor assets
 */
function table_th_tool_enqueue_block_editor_assets() {
    $asset_file = TABLE_TH_TOOL_PLUGIN_DIR . 'build/index.asset.php';

    if (!file_exists($asset_file)) {
        return;
    }

    $asset = include $asset_file;

    wp_enqueue_script(
        'table-th-tool-editor',
        TABLE_TH_TOOL_PLUGIN_URL . 'build/index.js',
        $asset['dependencies'],
        $asset['version'],
        true
    );
}
add_action('enqueue_block_editor_assets', 'table_th_tool_enqueue_block_editor_assets');
