import { useMemo } from 'react';
import Carousel from './components/carousel/carousel';
import Table from './components/table/table';
import Sidebar from './components/sidebar/sidebar';
import Modal from './components/modal/modal';
import Gallery from './components/gallery/gallery';
import useTableStore from './store/tableStore';
import { getCombinationObjects, getHints } from './utils/calculations'
import Header from './components/header/header';

function App() {
  const setSidebarOpen = useTableStore((state) => state.setSidebarOpen);
  const entries = useTableStore((state) => state.entries);
  const setEntries = useTableStore((state) => state.setEntries);
  const entryCount = entries.length;
  const selectedOptions = useTableStore((state) => state.selectedOptions);
  const setCarouselIndex = useTableStore((state) => state.setCarouselIndex);
  const setLoadModalOpen = useTableStore((state) => state.setLoadModalOpen);
  const loadModalOpen = useTableStore((state) => state.loadModalOpen);
  const theme = useTableStore((state) => state.theme);
  const headerHeight = useTableStore((state) => state.headerHeight);

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
  const hints = useMemo(() => getHints(comboObjects, selectedOptions), [comboObjects, selectedOptions]);
  const tables = comboObjects.length > 0 ? comboObjects.map((comboObj, index) => (
    <Table
      key={index}
      comboObj={comboObj}
      onEntryChange={handleEntryChange}
      onEntryMove={handleChangeEntryIndex}
      hints={hints}
      comboCount = {comboObjects.length}
    />
  )) : 
  <Table onEntryChange={handleEntryChange}
        onEntryMove={handleChangeEntryIndex} />;

  return (
    <div 
      className={`cmp-app ${theme}`}
      style={{marginTop: `${headerHeight + 16}px`}}>
      <Header />
      <Sidebar
        handleQuickSetup={handleQuickSetup} />
      <Carousel>
        {tables}
      </Carousel>
      <Modal
        className='modal--load'
        modalOpen={loadModalOpen}
        modalHandler={setLoadModalOpen}
        heading={'Load'}>
          <Gallery />
      </Modal>
    </div>
  )
}

export default App