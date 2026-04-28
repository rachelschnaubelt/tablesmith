import { useEffect, useMemo } from 'react';
import Carousel from './components/carousel/carousel.tsx';
import Table from './components/table/table.tsx';
import Sidebar from './components/sidebar/sidebar.tsx';
import Modal from './components/modal/modal.tsx';
import Gallery from './components/gallery/gallery.tsx';
import useTableStore from './store/tableStore.ts';
import { getCombinationObjects, getHints } from './utils/calculations.ts'
import Header from './components/header/header.tsx';
import AboutModal from './components/modals/about/about.tsx';
import LoadModal from './components/modals/load/load.tsx';

function App() {
  const entryCount = useTableStore((state) => state.entryCount);
  const selectedOptions = useTableStore((state) => state.selectedOptions);
  const headerHeight = useTableStore((state) => state.headerHeight);
  const theme = useTableStore((state) => state.theme);

  const comboObjects = useMemo(() => getCombinationObjects(entryCount, selectedOptions), [entryCount, selectedOptions]);
  const hints = useMemo(() => getHints(comboObjects, selectedOptions), [comboObjects, selectedOptions]);
  const tables = comboObjects.length > 0 ?
    comboObjects.map((comboObj, index) => (
      <Table
        key={index}
        comboObj={comboObj}
        hints={hints}
        tableIndex={index + 1}
        comboCount={comboObjects.length}
      />
    )) :
    <Table />;

  useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      const classList = html.classList;
      const classesArray = Array.from(classList);
      classesArray.forEach((cls) => {
        if (cls.startsWith('theme')) {
          classList.remove(cls);
        }
      })
      classList.add(theme);
    }

  }, [theme])

  return (
    <div
      className={`cmp-app`}
      style={{ marginTop: `${headerHeight + 16}px` }}>
      <title>TableSmith | Dice Table Maker</title>
      <h1 className="sr-only">Dice Table Maker</h1>
      <Header />
      <Sidebar />
      <h2 className="sr-only">Tables</h2>
      <Carousel>
        {tables}
      </Carousel>
      <LoadModal />
      <AboutModal />      
    </div>
  )
}

export default App