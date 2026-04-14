import useTableStore from "../store/tableStore.ts";
import { ComboObject, JSONEntry } from "../types/types.tsx";
import { getCombinationObjects } from "./calculations.ts";

const loadTable = (tableData: JSONEntry) => {
    const { setTableName, setTableDescription, setEntries, setCarouselIndex, setTableKey } = useTableStore.getState();
    setTableName(tableData.tableName);
    setTableDescription(tableData.tableDescription);
    setEntries(tableData.entries);
    const comboObjects = getCombinationObjects(tableData.entries.length, tableData.comboObj.selectedOptions);
    const findCombo = (combo: ComboObject) => combo.diceString === tableData.comboObj.diceString;
    const tableIndex = comboObjects.findIndex(findCombo);
    setCarouselIndex(tableIndex + 1);
    setTableKey(tableData.id);
}


    const copyTable = async (comboObj: ComboObject) => {
        const {entries, tableName, tableDescription, isProbabilityColumnVisible} = useTableStore.getState();
                const html = `
                    <style>
                        table, th, td {
                            border: 1px solid black;
                            border-collapse: collapse;
                        }
                        th, td { padding: 0 15px; }
                    </style>
                    <h1>${tableName}</h1>
                    <p>${tableDescription}</p>
                    <table>
                        <thead>
                            <tr>
                                ${comboObj && comboObj.diceString ? `<th>Roll ${comboObj.diceString}</th>` : '<th>Item</th>'}
                                ${comboObj && isProbabilityColumnVisible ? `<th>Probability</th>` : ''}
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${comboObj ? Object.entries(comboObj.probabilities).map(([roll, prob], index) => {
                    return (`<tr>
                                    <td>${roll}</td>
                                    ${isProbabilityColumnVisible ? `<td>${(prob * 100).toFixed(2)}%</td>` : ''}
                                    <td>${entries[index]}</td>
                                </tr>`)
                }).join('')
                        :
                        entries.map((entry, index) => {
                            return (`<tr>
                <td>${index + 1}</td>
                <td>${entry}</td>
                </tr>`
                            )
                        }).join('')}
                        </tbody>
                    </table>`;

                const markdown = `
        **${tableName}**
        ${tableDescription}
        | **${comboObj && comboObj.diceString ? `Roll ${comboObj.diceString}` : 'Item'}** | **${comboObj && isProbabilityColumnVisible ? `Probability` : ''}** | **Value** |
        | ------------ | ${comboObj && isProbabilityColumnVisible ? `--------------- |` : ''} ----------------- |
        ${comboObj ? Object.entries(comboObj.probabilities).map(([roll, prob], index) => {
                    return (`| ${roll} | ${isProbabilityColumnVisible ? `${(prob * 100).toFixed(2)}% |` : ''} ${entries[index]} |`)
                }).join('')
                        :
                        entries.map((entry, index) => {
                            return (`| ${index + 1} | ${entry} |  `)
                        }).join('')}
                    `;
                try {
                    const clipboardItemData = {
                        ['text/html']: new Blob([html], { type: 'text/html' }),
                        ['text/plain']: new Blob([markdown], { type: 'text/plain' })
                    };
                    const clipboardItem = new ClipboardItem(clipboardItemData);
                    await navigator.clipboard.write([clipboardItem]);
                }
                catch (e) {
                    console.log(e);
                }
    }

    const printTable = () => {
        window.scrollTo(0, 0);
        window.print();
    }

    const saveTable = (comboObj: ComboObject, storageKey?: string) => {
        const { tableName, tableDescription, entries, setTableKey } = useTableStore.getState();
        let id = Date.now().toString();
        const timestamp = new Date().toISOString();
        const item = storageKey && localStorage.getItem(storageKey);
        let savedAt = timestamp;
        if(item) {
            savedAt = JSON.parse(item)?.savedAt;
        }
        const saveObj = {
            id: storageKey || id,
            tableName,
            tableDescription,
            comboObj,
            entries,
            savedAt,
            updatedAt: timestamp
        }

        if(storageKey) {
            id = storageKey;
        }

        localStorage.setItem(id, JSON.stringify(saveObj));
        setTableKey(storageKey || id);
    }

    const clearTable = () => {
        const { setTableKey, setEntries, entryCount, setTableName, setTableDescription } = useTableStore.getState();
        setTableKey('');
        setEntries(Array(entryCount).fill(''));
        setTableName('');
        setTableDescription('');
    }

export {
    loadTable,
    copyTable,
    printTable,
    saveTable,
    clearTable
}