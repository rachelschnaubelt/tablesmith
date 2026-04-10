import './gallery.scss';
import { useEffect, useState } from "react";
import useTableStore from '../../store/tableStore';
import Button from '../button/button';
import { loadTable } from '../../utils/tableManagement';
import Card from '../card/card';

const Gallery = ({ }) => {
    const [cards, setCards] = useState([]);
    const loadModalOpen = useTableStore((state) => state.loadModalOpen);
    const setLoadModalOpen = useTableStore((state) => state.setLoadModalOpen);
    const [entryDeleted, setEntryDeleted] = useState(false);

    const handleLoadTable = (jsonEntry) => {
        loadTable(jsonEntry);
        setLoadModalOpen(false);
    }

    const handleDeleteTable = (key) => {
        localStorage.removeItem(key);
        setEntryDeleted(true);
    }

    useEffect(() => {
        if (loadModalOpen) {
            if (localStorage.length === 0) {
                setCards([<p>No tables saved yet. Create a table and save it for it to appear here!</p>]);
            } else {
                const entries = [];
                for (let i = 0; i < localStorage.length; i++) {
                    entries.push(localStorage.getItem(localStorage.key(i)));
                }
                const sortedEntries = entries.sort((a, b) => parseInt(localStorage.key(entries.indexOf(a)) - parseInt(localStorage.key(entries.indexOf(b)))));
                const cardList = sortedEntries.map((entry, index) => {
                    const jsonEntry = JSON.parse(entry);
                    return (
                        <Card
                            key={`card-${index}`}
                            heading={jsonEntry.tableName}
                            cta={[<Button
                                label='load'
                                onClick={() => handleLoadTable(jsonEntry)} />,
                            <Button
                                label='delete'
                                onClick={() => handleDeleteTable(jsonEntry.id)} />]}>
                            <p>{jsonEntry?.comboObj?.diceString}</p>
                            <p>{jsonEntry.tableDescription}</p>
                            <ul>
                                {/* optimize this to not continue after the fourth entry */}
                                {jsonEntry.entries.map((entry, index) => {
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