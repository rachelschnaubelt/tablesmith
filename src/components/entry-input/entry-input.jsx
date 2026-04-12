import './entry-input.scss';
import { useEffect, useRef } from "react";
import useTableStore from "../../store/tableStore";

const EntryInput = ({index, isActive}) => {
    const value = useTableStore((state) => state.entries[index]);
    const { handleEntryChange } = useTableStore.getState();
    const inputRef = useRef(null);

    const handleChange = (index, e) => {
        handleEntryChange(index, e.target.value);
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }

    useEffect(() => {
        if(!inputRef.current) return;
        if(inputRef.current.offsetParent === null) return; // element not visible
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }, [isActive, value])

    return (
        <textarea
            value={value}
            onChange={e => handleChange(index, e)}
            className='cmp-entry-input cmp-roll-table__input cmp-roll-table__column--value cmp-roll-table__cell'
            ref={inputRef}
        />
    )
}

export default EntryInput;