import './entry-input.scss';
import React, { useEffect, useRef } from "react";
import useTableStore from "../../store/tableStore";

interface EntryInputProps {
    index: number,
    isActive?: boolean,
    id: string,
    role?: string
}

const EntryInput = ({ index, isActive, id, role }: EntryInputProps) => {
    const value = useTableStore((state) => state.entries[index]);
    const { handleEntryChange } = useTableStore.getState();
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleEntryChange(index, e.target.value);
        if (inputRef?.current) {
            inputRef.current.style.height = 'auto';
            inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
        }
    }

    useEffect(() => {
        if (!inputRef.current) return;
        if (inputRef.current.offsetParent === null) return; // element not visible
        inputRef.current.style.height = 'auto';
        inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }, [isActive, value])

    return (
        <>
            <label htmlFor={id}
                className='cmp-entry-input__label'>{id}</label>
            <textarea
                value={value}
                id={id}
                onChange={e => handleChange(index, e)}
                className='cmp-entry-input cmp-roll-table__input cmp-roll-table__column--value cmp-roll-table__cell'
                ref={inputRef}
                role="cell"
            />
        </>
    )
}

export default EntryInput;