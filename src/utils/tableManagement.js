import useTableStore from "../store/tableStore";
import { getCombinationObjects } from "./calculations";

const loadTable = (tableData) => {
    const { setTableName, setTableDescription, setEntries, setCarouselIndex, setTableKey } = useTableStore.getState();
    setTableName(tableData.tableName);
    setTableDescription(tableData.tableDescription);
    setEntries(tableData.entries);
    const comboObjects = getCombinationObjects(tableData.entries.length, tableData.comboObj.selectedOptions);
    const findCombo = (combo) => combo.diceString === tableData.comboObj.diceString;
    const tableIndex = comboObjects.findIndex(findCombo);
    setCarouselIndex(tableIndex + 1);
    setTableKey(tableData.id);
}

export {
    loadTable
}