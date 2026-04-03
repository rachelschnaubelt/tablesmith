import './table.scss';
import Button from "../button/button";
import DistributionChart from '../distribution-chart/distribution-chart';
import React from 'react';
import useTableStore from '../../store/tableStore';
import html2canvas from 'html2canvas';
import { snakeCaseString } from '../../utils/stringUtils';

const Table = React.memo(({ comboObj, onEntryChange, onEntryMove }) => {
    const entries = useTableStore((store) => store.entries);
    const deleteEntry = useTableStore((store) => store.deleteEntry);
    const tableName = useTableStore((store) => store.tableName);
    const setTableName = useTableStore((store) => store.setTableName);
    const tableDescription = useTableStore((store) => store.tableDescription);
    const setTableDescription = useTableStore((store) => store.setTableDescription);
    const tableKey = useTableStore((store) => store.tableKey);
    const setTableKey = useTableStore((store) => store.setTableKey);
    const setEntries = useTableStore((store) => store.setEntries);
    const isProbabilityColumnVisible = useTableStore((state) => state.isProbabilityColumnVisible);

    const getProbabilityRows = (probabilities) => {
        return Object.entries(probabilities).map(([roll, prob], index) => {
            const probAsPercent = (prob * 100).toFixed(2);
            return (
                <div key={roll}
                    className='cmp-roll-table__row'>
                    <p className='cmp-roll-table__column--number'>{roll}</p>
                    {isProbabilityColumnVisible && <p className='cmp-roll-table__column--probability'>{probAsPercent}%</p>}
                    <textarea
                        value={entries[index]}
                        onChange={e => onEntryChange(index, e.target.value)}
                        className='cmp-roll-table__input cmp-roll-table__column--value'
                    />
                    <div className='no-print cmp-roll-table__column--move-buttons'>
                        <Button
                            onClick={() => { onEntryMove(index, index - 1) }}
                            label={'Move up'} />
                        <Button
                            onClick={() => { onEntryMove(index, index + 1) }}
                            label={'Move down'} />
                    </div>
                    <div className='no-print cmp-roll-table__column--delete-button'>
                        <Button
                            onClick={() => { deleteEntry(index) }}
                            label={'Remove'} />
                    </div>
                </div>
            );
        });
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
                        <th>Roll ${comboObj.diceString}</th>
                        ${isProbabilityColumnVisible ? `<th>Probability</th>`: ''}
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.entries(comboObj.probabilities).map(([roll, prob], index) => {
                        return (`<tr>
                            <td>${roll}</td>
                            ${isProbabilityColumnVisible ? `<td>${(prob * 100).toFixed(2)}</td>`: ''}
                            <td>${entries[index]}</td>
                        </tr>`)
                    }).join('')}
                </tbody>
            </table>`;

        try {
            const type = "text/html";
            const clipboardItemData = {
                [type]: new Blob([html], { type }),
            };
            const clipboardItem = new ClipboardItem(clipboardItemData);
            await navigator.clipboard.write([clipboardItem]);
        }
        catch (e) {
            console.log(e);
        }
    }

    const handlePrint = () => {
        window.print();
    }

    const handleSaveAsImage = () => {
        const element = document.querySelector('.cmp-roll-table');
        html2canvas(element, {backgroundColor: '#ffffff'})
            .then(canvas => {
                const link = document.createElement('a');
                const fileName = tableName ? snakeCaseString(tableName) : 'dice-table';
                console.log(fileName);
                link.download = `${fileName}.png`;
                link.href = canvas.toDataURL();
                link.click();
                URL.revokeObjectURL(link.href);
            })
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
            <div className='cmp-roll-table'
                data-table-key={tableKey}>
                <div className='cmp-roll-table__heading'>
                    <input
                        type="text"
                        placeholder='Table name'
                        value={tableName}
                        className='cmp-roll-table__title'
                        id='table-name'
                        onChange={(e) => { setTableName(e.target.value) }} />
                    <textarea
                        className='cmp-roll-table__description'
                        onChange={(e) => { setTableDescription(e.target.value) }}
                        value={tableDescription}
                        id='table-description'
                        placeholder='Table description'>
                    </textarea>
                </div>
                <div className='cmp-roll-table__row cmp-roll-table__row--header'>
                    <p className='cmp-roll-table__column--number'>Roll {comboObj.diceString}</p>
                    {isProbabilityColumnVisible && <p className='cmp-roll-table__column--probability'>Probability</p>}
                    <p className='cmp-roll-table__column--value'>Value</p>
                    <p className='cmp-roll-table__column--move-buttons'></p>
                    <p className='cmp-roll-table__column--delete-button'></p>
                </div>
                <div className='cmp-roll-table__body'>
                    {getProbabilityRows(comboObj.probabilities)}
                </div>
                <Button
                    label={'copy'}
                    className={'no-print'}
                    onClick={handleCopyTable} />
                <Button
                    label={'print'}
                    className={'no-print'}
                    onClick={handlePrint} />
                <Button
                    label={tableKey ? 'save changes' : 'save'}
                    className={'no-print'}
                    onClick={() => { handleSave(tableKey) }} />
                <Button
                    label={'save as image'}
                    className={'no-print'}
                    onClick={handleSaveAsImage} />
                <Button
                    label={'clear'}
                    className={'no-print'}
                    onClick={handleClear} />
                {tableKey &&
                    <Button
                        label={'save as new'}
                        className={'no-print'}
                        onClick={() => { handleSave() }} />
                }
            </div>
            <hr />
            <div>
                <p>Table info</p>
                <dl>
                    <dt>Variance: {comboObj.variance.toExponential(2)}</dt>
                    {/* <dd>How evenly spread the probabilities are. A variance of 0 means every option is equally likely. The higher the number, the middle options will be more likely than the top or bottom of the table.</dd> */}
                </dl>
                <DistributionChart comboObj={comboObj} />
            </div>
        </div>
    )
});

export default Table;