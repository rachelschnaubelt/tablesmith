import useTableStore from "../../store/tableStore";

const EntryInput = ({index}) => {
    const value = useTableStore((state) => state.entries[index]);
    const { handleEntryChange } = useTableStore.getState();

    return (
        <textarea
            value={value}
            onChange={e => handleEntryChange(index, e.target.value)}
            className='cmp-roll-table__input cmp-roll-table__column--value cmp-roll-table__cell'
        />
    )
}

export default EntryInput;