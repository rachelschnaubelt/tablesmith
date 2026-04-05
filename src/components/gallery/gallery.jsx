import './gallery.scss';
import { useEffect, useState } from "react";
import useTableStore from '../../store/tableStore';
import Button from '../button/button';
import { loadTable } from '../../utils/tableManagement';

const Gallery = () => {
    const [cards, setCards] = useState([]);
    const modalOpen = useTableStore((state) => state.modalOpen); 
    const setModalOpen = useTableStore((state) => state.setModalOpen);

    const handleLoadTable = (jsonEntry) => {
        loadTable(jsonEntry);
        setModalOpen(false);
    }

    useEffect(() => {
        if (modalOpen) {
            const entries = [];
            for (let i = 0; i < localStorage.length; i++) {
                entries.push(localStorage.getItem(localStorage.key(i)));
            }
            const sortedEntries = entries.sort((a, b) => parseInt(localStorage.key(entries.indexOf(a)) - parseInt(localStorage.key(entries.indexOf(b)))));
            const cards = sortedEntries.map((entry, index) => {
                const jsonEntry = JSON.parse(entry);
                return (
                    <div className='table-card' key={`card-${index}`}>
                        <p>{jsonEntry.tableName}</p>
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
                        <Button
                            label='load'
                            onClick={() => handleLoadTable(jsonEntry)} />
                    </div>
                )
            });
            setCards(cards);
        }
    }, [modalOpen])

    return (
        <div className="cmp-gallery">
            {cards}
        </div>
    )
}

export default Gallery;