import './table.scss';
import Button from "../button/button";
import DistributionChart from '../distribution-chart/distribution-chart';
import React, { useRef } from 'react';
import useTableStore from '../../store/tableStore';
import { snakeCaseString } from '../../utils/stringUtils';
import Input from '../input/input';
import Accordion from '../accordion/accordion';
import Tooltip from '../tooltip/tooltip';
import { ArrowsClockwiseIcon, CopySimpleIcon, DotsThreeIcon, EraserIcon, FilePdfIcon, FloppyDiskIcon, PlusIcon, PrinterIcon, XIcon } from '@phosphor-icons/react';
import Modal from '../modal/modal';

const Table = React.memo(({ comboObj, onEntryChange, onEntryMove, hints, comboCount }) => {
    const entries = useTableStore((store) => store.entries);
    const entryCount = entries.length;
    const addEntry = useTableStore((state) => state.addEntry);
    const deleteEntry = useTableStore((store) => store.deleteEntry);
    const tableName = useTableStore((store) => store.tableName);
    const setTableName = useTableStore((store) => store.setTableName);
    const tableDescription = useTableStore((store) => store.tableDescription);
    const setTableDescription = useTableStore((store) => store.setTableDescription);
    const saveModalOpen = useTableStore((store) => store.saveModalOpen);
    const setSaveModalOpen = useTableStore((store) => store.setSaveModalOpen);
    const tableKey = useTableStore((store) => store.tableKey);
    const setTableKey = useTableStore((store) => store.setTableKey);
    const setEntries = useTableStore((store) => store.setEntries);
    const isProbabilityColumnVisible = useTableStore((state) => state.isProbabilityColumnVisible);
    const headerHeight = useTableStore((state) => state.headerHeight);
    const tableBody = useRef(null);

    const handleInputChange = (event, index) => {
        event.target.style.height = 'auto';
        event.target.style.height = event.target.scrollHeight + 3 + 'px';
        onEntryChange(index, event.target.value);
    }

    const handleEntryMove = (index1, index2) => {
        onEntryMove(index1, index2);
        const children = tableBody.current.children;
        const row1 = children[index1];
        const row2 = children[index2];
        if (row1 && row2) {
            const textarea1 = row1.querySelector('textarea');
            const textarea2 = row2.querySelector('textarea');
            const ta1scrollHeight = textarea1.scrollHeight;
            const ta2scrollHeight = textarea2.scrollHeight;
            textarea1.style.height = ta2scrollHeight + 1 + 'px';
            textarea2.style.height = ta1scrollHeight + 1 + 'px';
        }
    }

    const getProbabilityRows = (probabilities) => {
        return Object.entries(probabilities).map(([roll, prob], index) => {
            const probAsPercent = (prob * 100).toFixed(2);
            return (
                <div key={roll}
                    className='cmp-roll-table__row'>
                    <p className='cmp-roll-table__column--number cmp-roll-table__cell'>{roll}</p>
                    {isProbabilityColumnVisible && <p className='cmp-roll-table__column--probability cmp-roll-table__cell'>{probAsPercent}%</p>}
                    <textarea
                        value={entries[index]}
                        onChange={e => handleInputChange(e, index)}
                        className='cmp-roll-table__input cmp-roll-table__column--value cmp-roll-table__cell'
                    />
                    {index !== 0 && <Button
                        className='no-print cmp-roll-table__button--move-up'
                        onClick={() => { handleEntryMove(index, index - 1) }}
                        label='swap'
                        type="icon"
                        icon={<ArrowsClockwiseIcon size={16} />}
                        hierarchy="secondary" />}
                    {index !== entryCount - 1 && <Button
                        className='no-print cmp-roll-table__button--move-down'
                        onClick={() => { handleEntryMove(index, index + 1) }}
                        label='swap'
                        type="icon"
                        icon={<ArrowsClockwiseIcon size={16} />}
                        hierarchy="secondary" />}
                    <Button
                        className='no-print cmp-roll-table__button--delete'
                        onClick={() => { deleteEntry(index) }}
                        label={'Remove'}
                        type='icon'
                        icon={<XIcon size={16} />}
                        hierarchy="secondary"
                        isWarning={true} />
                </div>
            );
        });
    }

    const getListRows = () => {
        return entries.map((entry, index) => {
            return (
                <div key={index}
                    className='cmp-roll-table__row'>
                    <p className='cmp-roll-table__column--number cmp-roll-table__cell'>{index + 1}</p>
                    <textarea
                        value={entries[index]}
                        onChange={e => handleInputChange(e, index)}
                        className='cmp-roll-table__input cmp-roll-table__column--value cmp-roll-table__cell'
                    />
                    {index !== 0 && <Button
                        className='no-print cmp-roll-table__button--move-up'
                        onClick={() => { handleEntryMove(index, index - 1) }}
                        label='swap'
                        type="icon"
                        icon={<ArrowsClockwiseIcon size={16} />}
                        hierarchy="secondary" />}
                    {index !== entryCount - 1 && <Button
                        className='no-print cmp-roll-table__button--move-down'
                        onClick={() => { handleEntryMove(index, index + 1) }}
                        label='swap'
                        type="icon"
                        icon={<ArrowsClockwiseIcon size={16} />}
                        hierarchy="secondary" />}
                    {entryCount > 2 && <Button
                        className='no-print cmp-roll-table__button--delete'
                        onClick={() => { deleteEntry(index) }}
                        label={'Remove'}
                        type='icon'
                        icon={<XIcon size={16} />}
                        hierarchy="secondary"
                        isWarning={true} />}
                </div>
            )
        })
    }

    const handleCopyTable = async () => {
        const html = `
            <style>
                table, th, td {
                    border: 1px solid black;
                    border-collapse: collapse;
                }
                th, td { padding: 0 15px; }
            </style>
            <h1>${tableName}</h1>
            <p>${tableDescription}</p>
            <table>
                <thead>
                    <tr>
                        ${comboObj && comboObj.diceString ? `<th>Roll ${comboObj.diceString}</th>` : '<th>Item</th>'}
                        ${comboObj && isProbabilityColumnVisible ? `<th>Probability</th>` : ''}
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    ${comboObj ? Object.entries(comboObj.probabilities).map(([roll, prob], index) => {
            return (`<tr>
                            <td>${roll}</td>
                            ${isProbabilityColumnVisible ? `<td>${(prob * 100).toFixed(2)}%</td>` : ''}
                            <td>${entries[index]}</td>
                        </tr>`)
        }).join('')
                :
                entries.map((entry, index) => {
                    return (`<tr>
        <td>${index + 1}</td>
        <td>${entry}</td>
        </tr>`
                    )
                }).join('')}
                </tbody>
            </table>`;

            const markdown = `
**${tableName}**
${tableDescription}
| **${comboObj && comboObj.diceString ? `Roll ${comboObj.diceString}` : 'Item'}** | **${comboObj && isProbabilityColumnVisible ? `Probability` : ''}** | **Value** |
| ------------ | ${comboObj && isProbabilityColumnVisible ? `--------------- |` : ''} ----------------- |
${comboObj ? Object.entries(comboObj.probabilities).map(([roll, prob], index) => {
return (`| ${roll} | ${isProbabilityColumnVisible ? `${(prob * 100).toFixed(2)}% |` : ''} ${entries[index]} |`)
}).join('')
:
entries.map((entry, index) => {
return (`| ${index + 1} | ${entry} |  `)
}).join('')}
            `;
        try {
            const clipboardItemData = {
                ['text/html']: new Blob([html], { type: 'text/html' }),
                [ 'text/plain' ]: new Blob([markdown], {type: 'text/plain'})
            };
            const clipboardItem = new ClipboardItem(clipboardItemData);
            await navigator.clipboard.write([clipboardItem]);
        }
        catch (e) {
            console.log(e);
        }
    }

    const handlePrint = () => {
        window.scrollTo(0, 0);
        window.print();
    }

    const handleSaveAsPDF = () => {
        return;
    }

    const handleSave = (storageKey) => {
        const id = Date.now();
        const timestamp = new Date().toISOString();
        const saveObj = {
            id: storageKey || id,
            tableName,
            tableDescription,
            comboObj,
            entries,
            savedAt: localStorage.getItem(storageKey)?.savedAt || timestamp,
            updatedAt: timestamp
        }

        localStorage.setItem(storageKey || id, JSON.stringify(saveObj));
        setTableKey(storageKey || id);
    }

    const handleClear = () => {
        setTableKey('');
        setEntries(Array(entries.length).fill(''));
        setTableName('');
        setTableDescription('');
    }

    return (
        <div>
            <div className='cmp-roll-table'>
                <div className='cmp-roll-table__inner'
                    data-table-key={tableKey}>
                    <div className='cmp-roll-table__heading'>
                        <Input
                            className='cmp-roll-table__title'
                            value={tableName}
                            placeholder={'Name'}
                            id='table-name'
                            onChange={(e) => { setTableName(e.target.value) }} />
                        <Input
                            className='cmp-roll-table__description'
                            value={tableDescription}
                            placeholder={'Description'}
                            type='textarea'
                            id='table-description'
                            onChange={(e) => { setTableDescription(e.target.value) }} />
                    </div>

                    <div className="cmp-roll-table__table">
                        <div className='cmp-roll-table__row cmp-roll-table__row--header' style={{ 'top': `${headerHeight}px` }}>
                            <p className='cmp-roll-table__column--number cmp-roll-table__cell'>{comboObj ? `Roll ${comboObj?.diceString}` : 'Item'}</p>
                            {comboObj && isProbabilityColumnVisible && <p className='cmp-roll-table__column--probability cmp-roll-table__cell'>Probability</p>}
                            <p className='cmp-roll-table__column--value cmp-roll-table__cell'>Value</p>
                            <div className='cmp-roll-table__actions'>
                                <p className='cmp-roll-table__entry-count no-print'>{entryCount} Entries</p>
                                <Button
                                    label={'add'}
                                    className={'no-print add-button'}
                                    onClick={() => { addEntry() }}
                                    type="icon"
                                    icon={<PlusIcon size={24} />} />
                                <div className='cmp-roll-table__actions__menu' >
                                    <Button
                                        className={'cmp-roll-table__actions__menu-button no-print'}
                                        label={'menu'}
                                        type='icon'
                                        icon={<DotsThreeIcon size={24} />}
                                        hierarchy="secondary" />
                                    <div className='cmp-roll-table__actions__menu__dropdown'>
                                        <Button
                                            label={'copy'}
                                            className={'no-print'}
                                            icon={<CopySimpleIcon size={16} />}
                                            type="icon"
                                            onClick={handleCopyTable}
                                            hierarchy={'tertiary'} />
                                        <Button
                                            label={'print'}
                                            className={'no-print'}
                                            icon={<PrinterIcon size={16} />}
                                            type="icon"
                                            onClick={handlePrint}
                                            hierarchy={'tertiary'} />
                                        <Button
                                            label={'save'}
                                            className={'no-print'}
                                            icon={<FloppyDiskIcon size={16} />}
                                            type="icon"
                                            onClick={() => {
                                                if (tableKey) {
                                                    setSaveModalOpen(true);
                                                }
                                                else {
                                                    handleSave(tableKey)
                                                }
                                            }}
                                            hierarchy={'tertiary'} />
                                        <Button
                                            label={'save as pdf'}
                                            className={'no-print'}
                                            icon={<FilePdfIcon size={16} />}
                                            type='icon'
                                            onClick={handleSaveAsPDF}
                                            hierarchy={'tertiary'} />
                                        <Button
                                            label={'clear'}
                                            className={'no-print'}
                                            icon={<EraserIcon size={16} />}
                                            type='icon'
                                            onClick={handleClear}
                                            hierarchy={'tertiary'} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='cmp-roll-table__body'
                            ref={tableBody}>
                            {comboObj ?
                                getProbabilityRows(comboObj.probabilities)
                                : getListRows()}
                        </div>
                    </div>
                </div>

                {comboObj && <Accordion
                    label={'Advanced stats'}
                    initialState={false} >
                    <DistributionChart comboObj={comboObj} />
                    <div className='cmp-roll-table__variance'>
                        <p>Variance: {comboObj.variance.toExponential(2)}</p>
                        <Tooltip>
                            <p>How evenly spread the probabilities are. A variance of 0 means every option is equally likely. The higher the number, the middle options will be more likely than the top or bottom of the table.</p>
                        </Tooltip>
                    </div>
                    {hints && <div className='hints'>
                        {comboCount > 0 && <p>Want a more even distribution?</p>}
                        {hints.closestMax && hints.maxDiff && <p>Add another {hints.maxDiff > 1 && hints.maxDiff} option{hints.maxDiff > 1 && 's'} to make a 1d{hints.closestMax} table</p>}
                        {hints.closestMin && hints.minDiff && <p>{hints.closestMax && hints.maxDiff ? 'Or remove' : 'Remove'} {hints.minDiff > 1 ? hints.minDiff : 'an'} option{hints.minDiff > 1 && 's'} to make a 1d{hints.closestMin} table</p>}
                    </div>}
                </Accordion>}
            </div>
            <Modal
                className='modal--save'
                modalOpen={saveModalOpen}
                modalHandler={setSaveModalOpen}
                heading={'Save'}>
                <p>This table is already saved. Would you like to overwrite the existing save?</p>
                <div className='cmp-modal__button-group'>
                    <Button
                        label='overwrite existing save'
                        onClick={() => { handleSave(tableKey); setSaveModalOpen(false) }} />
                    <Button
                        label='save as new table'
                        hierarchy={'secondary'}
                        onClick={() => { handleSave(); setSaveModalOpen(false) }} />
                </div>
            </Modal>
        </div>
    )
});

export default Table;