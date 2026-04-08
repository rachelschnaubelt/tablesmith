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

    const handleLoadTable = (jsonEntry) => {
        loadTable(jsonEntry);
        setLoadModalOpen(false);
    }

    useEffect(() => {
        if (loadModalOpen) {
            const entries = [];
            for (let i = 0; i < localStorage.length; i++) {
                entries.push(localStorage.getItem(localStorage.key(i)));
            }
            const sortedEntries = entries.sort((a, b) => parseInt(localStorage.key(entries.indexOf(a)) - parseInt(localStorage.key(entries.indexOf(b)))));
            const cards = sortedEntries.map((entry, index) => {
                const jsonEntry = JSON.parse(entry);
                return (
                    <Card 
                        key={`card-${index}`}
                        heading={jsonEntry.tableName}
                        cta={<Button
                                label='load'
                                onClick={() => handleLoadTable(jsonEntry)} />}>
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
            setCards(cards);
        }
    }, [loadModalOpen])

    return (
        <div className="cmp-gallery">
            <div className="cmp-gallery__contents">
                {cards}
            </div>
        </div>
    )
}

export default Gallery;