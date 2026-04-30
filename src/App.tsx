import { useEffect, useMemo } from 'react';
import Carousel from './components/carousel/carousel.tsx';
import Table from './components/table/table.tsx';
import Sidebar from './components/sidebar/sidebar.tsx';
import useTableStore from './store/tableStore.ts';
import { getCombinationObjects, getHints } from './utils/calculations.ts'
import Header from './components/header/header.tsx';
import AboutModal from './components/modals/about/about.tsx';
import LoadModal from './components/modals/load/load.tsx';
import MetaTags from './components/meta-tags/meta-tags.tsx';

function App() {
  const { setTheme } = useTableStore.getState();
  const entryCount = useTableStore((state) => state.entryCount);
  const selectedOptions = useTableStore((state) => state.selectedOptions);
  const headerHeight = useTableStore((state) => state.headerHeight);
  const theme = useTableStore((state) => state.theme);
  const usesDyslexicFont = useTableStore((state) => state.usesDyslexicFont);

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
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      setTheme('theme--modern--dark');
    }
  }, [])

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

  useEffect(() => {
    const html = document.querySelector('html');
    if (html && usesDyslexicFont) {
      html.classList.add('font--open-dyslexic');
    } else if (html) {
      html.classList.remove('font--open-dyslexic');
    }
  }, [usesDyslexicFont])

  return (
    <div
      className={`cmp-app`}
      style={{ marginTop: `${headerHeight + 16}px` }}>
      <MetaTags
        title="TableSmith | Dice Table Maker"
        description="TableSmith finds the right dice combinations for any number of items, so you can roll the dice for anything."
        canonicalUrl="" // TODO: figure these out once the site is hosted
        ogTitle="TableSmith - Dice Table Maker"
        ogUrl="" // TODO: figure these out once the site is hosted
        ogDescription="TableSmith finds the right dice combinations for any number of items, so you can roll the dice for anything."
        ogImage="" // TODO: figure these out once the site is hosted
        />
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