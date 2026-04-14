import { useMemo } from 'react';
import Carousel from './components/carousel/carousel.tsx';
import Table from './components/table/table.tsx';
import Sidebar from './components/sidebar/sidebar.tsx';
import Modal from './components/modal/modal.tsx';
import Gallery from './components/gallery/gallery.tsx';
import useTableStore from './store/tableStore.ts';
import { getCombinationObjects, getHints } from './utils/calculations.js'
import Header from './components/header/header.tsx';

function App() {
  const { setLoadModalOpen } = useTableStore.getState();
  const entryCount = useTableStore((state) => state.entryCount);
  const selectedOptions = useTableStore((state) => state.selectedOptions);
  const loadModalOpen = useTableStore((state) => state.loadModalOpen);
  const theme = useTableStore((state) => state.theme);
  const headerHeight = useTableStore((state) => state.headerHeight);

  const comboObjects = useMemo(() => getCombinationObjects(entryCount, selectedOptions), [entryCount, selectedOptions]);
  const hints = useMemo(() => getHints(comboObjects, selectedOptions), [comboObjects, selectedOptions]);
  const tables = comboObjects.length > 0 ? 
  comboObjects.map((comboObj, index) => (
    <Table
      key={index}
      comboObj={comboObj}
      hints={hints}
      tableIndex={index + 1}
      comboCount = {comboObjects.length}
    />
  )) : 
  <Table />;

  return (
    <div 
      className={`cmp-app ${theme}`}
      style={{marginTop: `${headerHeight + 16}px`}}>
      <Header />
      <Sidebar />
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