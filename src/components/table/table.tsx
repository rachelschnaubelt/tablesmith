import './table.scss';
import Button from "../button/button.tsx";
import DistributionChart from '../distribution-chart/distribution-chart.tsx';
import React, { useRef, useState } from 'react';
import useTableStore from '../../store/tableStore.ts';
import Accordion from '../accordion/accordion.tsx';
import { ArrowsClockwiseIcon, CopySimpleIcon, DiceOneIcon, DiceSixIcon, DotsThreeIcon, EraserIcon, FilePdfIcon, FloppyDiskIcon, PlusIcon, PrinterIcon, XIcon } from '@phosphor-icons/react';
import Modal from '../modal/modal.tsx';
import { getLeastLikelyRolls, getMostLikelyRolls } from '../../utils/calculations.ts';
import EntryInput from '../entry-input/entry-input.tsx';
import CumulativeProbabilityWidget from '../cumulative-probability-widget/cumulative-probability-widget.tsx';
import TableHeader from '../table-header/table-header.tsx';
import { clearTable, copyTable, printTable, saveTable } from '../../utils/tableManagement.ts';
import { ComboObject, Probability } from '../../types/types.tsx';

interface Hints {
    minDiff?: number
    maxDiff?: number
    closestMin?: number
    closestMax?: number
}

interface TableProps {
    comboObj?: ComboObject,
    hints?: Hints | undefined,
    comboCount?: number,
    tableIndex?: number
}

interface DieResult {
    die: string, 
    result: number
}

interface RollResults {
    results: DieResult[],
    total: number
}

const Table = React.memo(({ comboObj, hints, comboCount, tableIndex }: TableProps) => {
    const { addEntry, addEntries, deleteEntry, setSaveModalOpen, handleChangeEntryIndex } = useTableStore.getState();
    const entryCount = useTableStore((store) => store.entryCount);
    const saveModalOpen = useTableStore((store) => store.saveModalOpen);
    const tableKey = useTableStore((store) => store.tableKey);
    const isProbabilityColumnVisible = useTableStore((state) => state.isProbabilityColumnVisible);
    const headerHeight = useTableStore((state) => state.headerHeight);
    const carouselIndex = useTableStore((state) => state.carouselIndex);
    const [isRowSelected, setIsRowSelected] = useState(false);
    const [rollResults, setRollResults] = useState<RollResults | null>(null);
    const diceRollsRef = useRef<HTMLDivElement>(null);
    const tableBody = useRef<HTMLDivElement>(null);
    const isActive = tableIndex === carouselIndex;

    const handleEntryMove = (index1: number, index2: number) => {
        handleChangeEntryIndex(index1, index2);
        if(tableBody.current) {

            const children = tableBody.current.children;
            const row1 = children[index1];
            const row2 = children[index2];
            if (row1 && row2) {
                const textarea1 = row1.querySelector('textarea');
                const textarea2 = row2.querySelector('textarea');
                if(textarea1 && textarea2) {
                    const ta1scrollHeight = textarea1.scrollHeight;
                    const ta2scrollHeight = textarea2.scrollHeight;
                    textarea1.style.height = ta2scrollHeight + 1 + 'px';
                    textarea2.style.height = ta1scrollHeight + 1 + 'px';
                }
            }
        }
    }

    const getProbabilityRows = (probabilities: Probability) => {
        return Object.entries(probabilities).map(([roll, prob], index) => {
            const probAsPercent = (prob * 100).toFixed(2);
            return (
                <div key={roll}
                    className={`cmp-roll-table__row cmp-roll-table__row--${roll}`}>
                    <p className='cmp-roll-table__column--number cmp-roll-table__cell'>{roll}</p>
                    {isProbabilityColumnVisible && <p className='cmp-roll-table__column--probability cmp-roll-table__cell'>{probAsPercent}%</p>}
                    <EntryInput
                        index={index}
                        isActive={isActive} />
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
        const rows = [];
        for (let index = 0; index < entryCount; index++) {
            rows.push(
                <div key={index}
                    className={`cmp-roll-table__row cmp-roll-table__row--${index + 1}`}>
                    <p className='cmp-roll-table__column--number cmp-roll-table__cell'>{index + 1}</p>
                    <EntryInput
                        index={index} />
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
        }
        return rows;
    }

    const handleRoll = () => {
        let total = 0;
        if (comboObj) {
            const combination = comboObj.combination;
            const results: DieResult[] = [];
            combination.map(die => {
                const faces = parseInt(die.substring(1));
                const result = Math.ceil(Math.random() * faces);
                results.push({
                    die,
                    result
                })
                total += result;
            })

            setRollResults({
                results,
                total
            })

            if (diceRollsRef.current) {
                diceRollsRef.current.style.height = `${diceRollsRef.current.scrollHeight}px`;
            }
        }
        else {
            total = Math.ceil(Math.random() * entryCount);
            setRollResults({
                results: [],
                total
            })
        }

        if(tableBody.current) {
            const previousSelect = tableBody.current.querySelectorAll('.cmp-roll-table__row.selected');
            previousSelect.forEach(row => row.classList.remove('selected'));
            
            const row = tableBody.current.querySelector(`.cmp-roll-table__row--${total}`);
            if(row) {
                row.classList.add('selected');
                const rowY = row.getBoundingClientRect().y;
                const windowHeight = window.innerHeight;
                const bufferTop = 125;
                const bufferBottom = 100;
                if (rowY > windowHeight - bufferBottom || rowY < bufferTop) {
                    row.scrollIntoView({ block: 'center', behavior: 'smooth' });
                }
                setIsRowSelected(true);
            }
        }
    }

    const handleCloseRollMenu = () => {
        setRollResults(null);
        handleClearSelection();
    }

    const handleClearSelection = () => {
        if(tableBody.current) {
            const previousSelect = tableBody.current.querySelectorAll('.cmp-roll-table__row.selected');
            previousSelect.forEach(row => row.classList.remove('selected'));
            setIsRowSelected(false);
        }
    }

    const RollLikelihoodEntry = React.memo(({ value, lowestResult }: {value: number, lowestResult: number}) => {
        const entry = useTableStore((state) => state.entries[value - lowestResult]);
        return <li key={value}>{value}{entry ? ` - ${entry}` : ''}</li>;
    });

    const evaluateRollLikelihood = (rolls: string[]) => {
        if(comboObj) {
        const lowestResult = comboObj.combination.length;

        if (rolls.length === comboObj.count) {
            return <p>All outcomes are equally likely</p>
        }

        return <ul>
            {rolls.map((value: string) => {
                const parsedValue = parseInt(value);
                return(
                <RollLikelihoodEntry
                    key={parsedValue}
                    value={parsedValue}
                    lowestResult={lowestResult}
                />
            )})}
        </ul>;
        }
    }

    return (
        <div>
            <div className='cmp-roll-table'>
                <div className='cmp-roll-table__inner'
                    data-table-key={tableKey}>
                    <TableHeader />
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
                                <div className='cmp-roll-table__roll-menu'>
                                    <Button
                                        label={comboObj ? 'roll' : 'get random'}
                                        className={'no-print add-button cmp-roll-table__roll-menu__button'}
                                        onClick={handleRoll}
                                        type="icon"
                                        icon={<DiceSixIcon size={24} />} />
                                    {rollResults && rollResults.results &&
                                        <div className="cmp-roll-table__roll-menu__container">
                                            <Button
                                                className={'cmp-roll-table__roll-menu__close'}
                                                icon={<XIcon size={16} />}
                                                type='icon'
                                                hierarchy={'secondary'}
                                                isWarning={true}
                                                onClick={handleCloseRollMenu} />
                                            <p className='cmp-roll-table__roll-menu__heading'>Result: {rollResults.total}</p>
                                            <div className='cmp-roll-table__roll-menu__dice-rolls'
                                                ref={diceRollsRef}>
                                                {rollResults.results.map(({ die, result }, index) => {
                                                    return (
                                                        <div key={index} className='cmp-roll-table__roll-menu__die-roll'>
                                                            <p className='cmp-roll-table__roll-menu__die'>{die}</p>
                                                            <p className='cmp-roll-table__roll-menu__result'>{result}</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>}
                                </div>
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
                                            onClick={() => { comboObj && copyTable(comboObj) }}
                                            hierarchy={'tertiary'} />
                                        <Button
                                            label={'print/save as pdf'}
                                            className={'no-print'}
                                            icon={<PrinterIcon size={16} />}
                                            type="icon"
                                            onClick={printTable}
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
                                                    comboObj && saveTable(comboObj, tableKey)
                                                }
                                            }}
                                            hierarchy={'tertiary'} />
                                        {isRowSelected && <Button
                                            label={'unmark selected row'}
                                            className={'no-print'}
                                            icon={<DiceOneIcon size={16} />}
                                            type='icon'
                                            onClick={handleClearSelection}
                                            hierarchy={'tertiary'} />}
                                        <Button
                                            label={'clear'}
                                            className={'no-print'}
                                            icon={<EraserIcon size={16} />}
                                            type='icon'
                                            onClick={clearTable}
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
                    <div className='cmp-roll-table__advanced-stats'>
                        <div className='cmp-roll-table__distribution-chart'>
                            <DistributionChart comboObj={comboObj} />
                        </div>
                        <CumulativeProbabilityWidget
                            comboObj={comboObj} />
                        {hints && (Object.keys(hints).length != 0) && <div className='cmp-roll-table__hints'>
                            {comboCount && comboCount > 0 && <p>Want a more even distribution?</p>}
                            {hints.closestMax && hints.maxDiff && <p><span className='action-text' onClick={() => { addEntries(hints.maxDiff) }}>Add another {hints.maxDiff > 1 && hints.maxDiff} option{hints.maxDiff > 1 && 's'}</span> to make a 1d{hints.closestMax} table</p>}
                            {hints.closestMin && hints.minDiff && <p>{hints.closestMax && hints.maxDiff ? 'Or remove' : 'Remove'} {hints.minDiff > 1 ? hints.minDiff : 'an'} option{hints.minDiff > 1 && 's'} to make a 1d{hints.closestMin} table</p>}
                        </div>}
                        <div className='cmp-roll-table__roll-stats'>
                            <div className='cmp-roll-table__most-likely'>
                                <p>Most likely to roll: </p>
                                {evaluateRollLikelihood(getMostLikelyRolls(comboObj))}
                            </div>
                            <div className='cmp-roll-table__least-likely'>
                                <p>Least likely to roll: </p>
                                {evaluateRollLikelihood(getLeastLikelyRolls(comboObj))}
                            </div>
                            <div className='cmp-roll-table__statistical-measurements'>
                                <p className='cmp-roll-table__variance'>Variance: {comboObj.variance.toFixed(2)}</p>
                                <p className='cmp-roll-table__standard-deviation'>Standard Deviation: {comboObj.standardDeviation.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
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
                        onClick={() => { comboObj && saveTable(comboObj, tableKey); setSaveModalOpen(false) }} />
                    <Button
                        label='save as new table'
                        hierarchy={'secondary'}
                        onClick={() => { comboObj && saveTable(comboObj); setSaveModalOpen(false) }} />
                </div>
            </Modal>
        </div>
    )
});

export default Table;