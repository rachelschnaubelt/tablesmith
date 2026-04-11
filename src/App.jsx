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