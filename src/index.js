import { addFilter } from '@wordpress/hooks';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

const SECTIONS = ['head', 'body', 'foot'];

function isFirstRowHeader(attributes) {
    let firstRow = null;

    if (Array.isArray(attributes.head) && attributes.head.length > 0) {
        firstRow = attributes.head[0];
    } else if (Array.isArray(attributes.body) && attributes.body.length > 0) {
        firstRow = attributes.body[0];
    }

    return firstRow ? firstRow.cells.every(cell => cell.tag === 'th') : false;
}

function isFirstColumnHeader(attributes) {
    let hasFirstColumn = false;
    let allTH = true;

    SECTIONS.forEach(section => {
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
}

function getFirstRowUpdates(attributes, targetTag) {
    if (Array.isArray(attributes.head) && attributes.head.length > 0) {
        const newHead = [...attributes.head];
        newHead[0] = {
            ...newHead[0],
            cells: newHead[0].cells.map(cell => ({ ...cell, tag: targetTag })),
        };
        return { head: newHead };
    }

    if (Array.isArray(attributes.body) && attributes.body.length > 0) {
        const newBody = [...attributes.body];
        newBody[0] = {
            ...newBody[0],
            cells: newBody[0].cells.map(cell => ({ ...cell, tag: targetTag })),
        };
        return { body: newBody };
    }

    return {};
}

function getFirstColumnUpdates(attributes, targetTag) {
    const updates = {};

    SECTIONS.forEach(section => {
        if (Array.isArray(attributes[section])) {
            updates[section] = attributes[section].map(row => {
                if (row.cells.length === 0) return row;
                const newCells = [...row.cells];
                newCells[0] = { ...newCells[0], tag: targetTag };
                return { ...row, cells: newCells };
            });
        }
    });

    return updates;
}

function withTableHeaderControls(BlockEdit) {
    return function TableHeaderControlsWrapper(props) {
        if (props.name !== 'core/table') {
            return <BlockEdit {...props} />;
        }

        const { clientId, attributes } = props;
        const { updateBlockAttributes } = useDispatch('core/block-editor');

        const handleFirstRowToggle = () => {
            const targetTag = isFirstRowHeader(attributes) ? 'td' : 'th';
            const updates = getFirstRowUpdates(attributes, targetTag);
            if (Object.keys(updates).length > 0) {
                updateBlockAttributes(clientId, updates);
            }
        };

        const handleFirstColumnToggle = () => {
            const targetTag = isFirstColumnHeader(attributes) ? 'td' : 'th';
            const updates = getFirstColumnUpdates(attributes, targetTag);
            if (Object.keys(updates).length > 0) {
                updateBlockAttributes(clientId, updates);
            }
        };

        return (
            <>
                <InspectorControls>
                    <PanelBody title={ __( 'Table Headers', 'table-th-tool' ) } initialOpen>
                        <ToggleControl
                            label={ __( 'First Row as Header', 'table-th-tool' ) }
                            checked={isFirstRowHeader(attributes)}
                            onChange={handleFirstRowToggle}
                        />
                        <ToggleControl
                            label={ __( 'First Column as Header', 'table-th-tool' ) }
                            checked={isFirstColumnHeader(attributes)}
                            onChange={handleFirstColumnToggle}
                        />
                    </PanelBody>
                </InspectorControls>
                <BlockEdit {...props} />
            </>
        );
    };
}

addFilter(
    'editor.BlockEdit',
    'table-th-tool/add-header-controls',
    withTableHeaderControls
);
