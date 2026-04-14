import './entry-input.scss';
import React, { useEffect, useRef } from "react";
import useTableStore from "../../store/tableStore";

interface EntryInputProps {
    index: number,
    isActive?: boolean
}

const EntryInput = ({index, isActive}: EntryInputProps) => {
    const value = useTableStore((state) => state.entries[index]);
    const { handleEntryChange } = useTableStore.getState();
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleEntryChange(index, e.target.value);
        if(inputRef?.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
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