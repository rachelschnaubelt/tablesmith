import './gallery.scss';
import { ReactNode, useEffect, useState } from "react";
import useTableStore from '../../store/tableStore.ts';
import Button from '../button/button.tsx';
import { loadTable } from '../../utils/tableManagement.ts';
import Card from '../card/card.tsx';
import { JSONEntry } from '../../types/types.tsx';



const Gallery = () => {
    const [cards, setCards] = useState<ReactNode>([]);
    const loadModalOpen = useTableStore((state) => state.loadModalOpen);
    const setLoadModalOpen = useTableStore((state) => state.setLoadModalOpen);
    const [entryDeleted, setEntryDeleted] = useState(false);

    const handleLoadTable = (jsonEntry: JSONEntry) => {
        loadTable(jsonEntry);
        setLoadModalOpen(false);
    }

    const handleDeleteTable = (key: string) => {
        localStorage.removeItem(key);
        setEntryDeleted(true);
    }

    useEffect(() => {
        if (loadModalOpen) {
            if (localStorage.length === 0) {
                setCards([<p>No tables saved yet. Create a table and save it for it to appear here!</p>]);
            } else {
                const entries: string[] = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key) {
                        const storedItem = localStorage.getItem(key);
                        if (storedItem) {
                            entries.push(storedItem);
                        }
                    }
                }
                const sortedEntries = [...entries].sort((a, b) => {
                    const tableA = JSON.parse(localStorage.getItem(a) ?? '{}');
                    const tableB = JSON.parse(localStorage.getItem(b) ?? '{}');
                    return new Date(tableA.createdAt).getTime() - new Date(tableB.createdAt).getTime();
                });
                const cardList = sortedEntries.map((entry, index) => {
                    const jsonEntry = JSON.parse(entry);
                    return (
                        <Card
                            key={`card-${index}`}
                            heading={jsonEntry.tableName}
                            cta={[<Button
                                label='load'
                                onClick={() => handleLoadTable(jsonEntry)}
                                />,
                            <Button
                                label='delete'
                                onClick={() => handleDeleteTable(jsonEntry.id)}
                                hierarchy='secondary'
                                isWarning={true} />
                                ]}>
                            <p className='load-table-card__dice-count'>Dice: {jsonEntry?.comboObj?.diceString}</p>
                            <p className='load-table-card__entry-count'>{jsonEntry?.comboObj?.count} entries</p>
                            <p className="load-table-card__description">{jsonEntry.tableDescription}</p>
                            <ul className='load-table-card__entry-list'>
                                {/* optimize this to not continue after the fourth entry */}
                                {jsonEntry.entries.map((entry: string[], index: number) => {
                                    if (index < 3) {
                                        return <li key={index}>{entry}</li>
                                    } else if (index === 3) {
                                        return <li key={index}>...</li>
                                    }
                                })}
                            </ul>
                        </Card>
                    )
                });
                setCards(cardList);
            }
        }
        setEntryDeleted(false);
    }, [loadModalOpen, entryDeleted])

    return (
        <div className="cmp-gallery">
            <div className="cmp-gallery__contents">
                {cards}
            </div>
        </div>
    )
}

export default Gallery;