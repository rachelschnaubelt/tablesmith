import useTableStore from "../../store/tableStore";
import Input from "../input/input.tsx";

const TableHeader = () => {
    const { setTableName, setTableDescription } = useTableStore.getState();
    const tableName = useTableStore((store) => store.tableName);
    const tableDescription = useTableStore((store) => store.tableDescription);


    return (
        <div className='cmp-roll-table__heading'>
            <Input
                className='cmp-roll-table__title'
                value={tableName}
                placeholder={'Name'}
                id='table-name'
                onChange={(e) => { setTableName(e.target.value) }} />
            <Input
                className='cmp-roll-table__description'
                value={tableDescription}
                placeholder={'Description'}
                type='textarea'
                id='table-description'
                onChange={(e) => { setTableDescription(e.target.value) }} />
        </div>
    );
}

export default TableHeader;