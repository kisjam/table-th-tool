/**
 * Table TH Tool - Block Editor Integration
 * 
 * Adds toggle controls to convert table headers (TD ↔ TH)
 * for first row and first column in WordPress table blocks.
 */

(function() {
    'use strict';

    const { addFilter } = wp.hooks;
    const { Fragment } = wp.element;
    const { InspectorControls } = wp.blockEditor;
    const { PanelBody, FormToggle } = wp.components;
    const { dispatch } = wp.data;

    /**
     * Adds header conversion controls to table blocks
     */
    function addTableHeaderControls(BlockEdit) {
        return function(props) {
            // Only apply to table blocks
            if (props.name !== 'core/table') {
                return wp.element.createElement(BlockEdit, props);
            }

            const { clientId, attributes } = props;

            /**
             * Check if the first row contains all TH elements
             */
            const isFirstRowHeader = () => {
                let firstRow = null;
                
                // Check head section first, then body
                if (Array.isArray(attributes.head) && attributes.head.length > 0) {
                    firstRow = attributes.head[0];
                } else if (Array.isArray(attributes.body) && attributes.body.length > 0) {
                    firstRow = attributes.body[0];
                }
                
                return firstRow && firstRow.cells.every(cell => cell.tag === 'th');
            };

            /**
             * Check if the first column contains all TH elements
             */
            const isFirstColumnHeader = () => {
                const sections = ['head', 'body', 'foot'];
                let hasFirstColumn = false;
                let allTH = true;
                
                sections.forEach(section => {
                    if (Array.isArray(attributes[section])) {
                        attributes[section].forEach(row => {
                            if (row.cells.length > 0) {
                                hasFirstColumn = true;
                                if (row.cells[0].tag !== 'th') {
                                    allTH = false;
                                }
                            }
                        });
                    }
                });
                
                return hasFirstColumn && allTH;
            };

            /**
             * Toggle first row between TH and TD
             */
            const toggleFirstRow = () => {
                const updates = {};
                const targetTag = isFirstRowHeader() ? 'td' : 'th';
                
                // Update head section if exists, otherwise body
                if (Array.isArray(attributes.head) && attributes.head.length > 0) {
                    const newHead = [...attributes.head];
                    newHead[0] = {
                        ...newHead[0],
                        cells: newHead[0].cells.map(cell => ({
                            ...cell,
                            tag: targetTag
                        }))
                    };
                    updates.head = newHead;
                } else if (Array.isArray(attributes.body) && attributes.body.length > 0) {
                    const newBody = [...attributes.body];
                    newBody[0] = {
                        ...newBody[0],
                        cells: newBody[0].cells.map(cell => ({
                            ...cell,
                            tag: targetTag
                        }))
                    };
                    updates.body = newBody;
                }
                
                if (Object.keys(updates).length > 0) {
                    dispatch('core/block-editor').updateBlockAttributes(clientId, updates);
                }
            };

            /**
             * Toggle first column between TH and TD
             */
            const toggleFirstColumn = () => {
                const updates = {};
                const targetTag = isFirstColumnHeader() ? 'td' : 'th';
                
                // Update all sections (head, body, foot)
                ['head', 'body', 'foot'].forEach(section => {
                    if (Array.isArray(attributes[section])) {
                        const newSection = attributes[section].map(row => {
                            if (row.cells.length > 0) {
                                const newCells = [...row.cells];
                                newCells[0] = {
                                    ...newCells[0],
                                    tag: targetTag
                                };
                                return { ...row, cells: newCells };
                            }
                            return row;
                        });
                        updates[section] = newSection;
                    }
                });
                
                if (Object.keys(updates).length > 0) {
                    dispatch('core/block-editor').updateBlockAttributes(clientId, updates);
                }
            };

            return wp.element.createElement(
                Fragment,
                null,
                wp.element.createElement(
                    InspectorControls,
                    null,
                    wp.element.createElement(
                        PanelBody,
                        {
                            title: 'Table Headers',
                            initialOpen: true
                        },
                        wp.element.createElement(
                            'div',
                            { 
                                style: { 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center', 
                                    marginBottom: '16px' 
                                } 
                            },
                            wp.element.createElement(
                                'label',
                                { htmlFor: 'first-row-header' },
                                'First Row as Header'
                            ),
                            wp.element.createElement(
                                FormToggle,
                                {
                                    id: 'first-row-header',
                                    checked: isFirstRowHeader(),
                                    onChange: toggleFirstRow
                                }
                            )
                        ),
                        wp.element.createElement(
                            'div',
                            { 
                                style: { 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center' 
                                } 
                            },
                            wp.element.createElement(
                                'label',
                                { htmlFor: 'first-column-header' },
                                'First Column as Header'
                            ),
                            wp.element.createElement(
                                FormToggle,
                                {
                                    id: 'first-column-header',
                                    checked: isFirstColumnHeader(),
                                    onChange: toggleFirstColumn
                                }
                            )
                        )
                    )
                ),
                wp.element.createElement(BlockEdit, props)
            );
        };
    }

    // Register the filter
    addFilter(
        'editor.BlockEdit',
        'table-th-tool/add-header-controls',
        addTableHeaderControls
    );

})();