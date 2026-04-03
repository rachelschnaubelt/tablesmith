import { useMemo } from 'react';
import Carousel from './components/carousel/carousel';
import Table from './components/table/table';
import Sidebar from './components/sidebar/sidebar';
import Button from './components/button/button';
import Modal from './components/modal/modal';
import Gallery from './components/gallery/gallery';
import useTableStore from './store/tableStore';
import { getCombinationObjects, getHints } from './utils/calculations'
import Header from './components/header/header';

function App() {
  const setSidebarOpen = useTableStore((state) => state.setSidebarOpen);
  const entries = useTableStore((state) => state.entries);
  const setEntries = useTableStore((state) => state.setEntries);
  const addEntry = useTableStore((state) => state.addEntry);
  const deleteEntry = useTableStore((state) => state.deleteEntry);
  const entryCount = entries.length;
  const selectedOptions = useTableStore((state) => state.selectedOptions);
  const setCarouselIndex = useTableStore((state) => state.setCarouselIndex);
  const modalOpen = useTableStore((state) => state.modalOpen);
  const theme = useTableStore((state) => state.theme);

  const handleEntryChange = (index, value) => {
    const newEntries = [...entries];
    newEntries[index] = value;
    setEntries(newEntries);
  }

  const handleChangeEntryIndex = (originalIndex, newIndex) => {
    if (newIndex < 0 || newIndex > entryCount - 1) {
      return;
    }
    const item = entries[originalIndex];
    const newEntries = [...entries];

    newEntries.splice(originalIndex, 1);
    newEntries.splice(newIndex, 0, item);
    setEntries(newEntries);
  }

  const handleQuickSetup = (target, diceString) => {
    const delta = entryCount - target; // + is shrinking, - is growing
    if (delta > 0) {
      const newEntries = entries.slice(0, target);
      setEntries(newEntries);
    }
    else {
      const newEntries = [...entries, ...Array(-1 * delta).fill('')];
      setEntries(newEntries);
    }

    const combos = getCombinationObjects(target, selectedOptions); // have to get combo objects since they're not updated at this point
    const findCombo = (combo) => combo.diceString === diceString;
    const tableIndex = combos.findIndex(findCombo);
    setCarouselIndex(tableIndex + 1);
    setSidebarOpen(false);
  }

  const comboObjects = useMemo(() => getCombinationObjects(entryCount, selectedOptions), [entryCount, selectedOptions]);
  const hints = useMemo(() => getHints(comboObjects, selectedOptions), [comboObjects]);

  const tables = comboObjects.map((comboObj, index) => (
    <Table
      key={index}
      comboObj={comboObj}
      onEntryChange={handleEntryChange}
      onEntryMove={handleChangeEntryIndex}
    />
  ));

  const invalidCombination = () => {
    if (comboObjects.length <= 0) {
      return (
        <div>
          <p>There is no way to create a combination of the selected dice for {entryCount} items.</p>
          <p>Change your selected dice or add or remove items from the list.</p>
          <table className={'cmp-roll-table'}>
            <tbody>
              {entries.map((entry, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <input
                        value={entries[index]}
                        onChange={e => handleEntryChange(index, e.target.value)}
                        className='cmp-roll-table__input'
                      />
                    </td>
                    <td>
                      <Button
                        onClick={() => { deleteEntry(index) }}
                        label={'Remove'} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    }
  }

  return (
    <div className={`cmp-app ${theme}`}>
      <Header />
      <Sidebar
        handleQuickSetup={handleQuickSetup} />
      <p className='table-count'>{entryCount} Entries</p>
      {comboObjects.length > 0 && 
      <Carousel>
        {tables}
      </Carousel>}
      {invalidCombination()}
      {hints && <div>
        <p>Want a more even distribution?</p>
        {hints.closestMax && hints.maxDiff && <p>Add another {hints.maxDiff} options to make a 1d{hints.closestMax} table</p>}
        {hints.closestMin && hints.minDiff && <p>{hints.closestMax && hints.maxDiff ? 'Or remove' : 'Remove'} {hints.minDiff} options to make a 1d{hints.closestMin} table</p>}
      </div>}
      <Button
        label={'add'}
        className={'no-print add-button'}
        onClick={() => {addEntry()}} />
      <Modal
        modalOpen={modalOpen}>
          <Gallery/>
      </Modal>
    </div>
  )
}

export default App