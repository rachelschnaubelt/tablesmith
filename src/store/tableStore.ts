import { create } from 'zustand';
import { getCombinationObjects } from '../utils/calculations.ts';
import { DiceOptions } from '../types/types';
import { AvailableThemes, options, defaultCount } from '../utils/constants.ts';

interface TableState {
  entries: string[],
  sidebarOpen: boolean,
  tableName: string,
  selectedOptions: DiceOptions,
  carouselIndex: number,
  tableDescription: string,
  loadModalOpen: boolean,
  saveModalOpen: boolean,
  tableKey: string,
  isProbabilityColumnVisible: boolean,
  theme: `${AvailableThemes}`,
  headerHeight: number,
  entryCount: number,
  focusReturn: string | null,
  setEntries: (entries: string[]) => void,
  setTableKey: (tableKey: string) => void,
  setTheme: (theme: `${AvailableThemes}`) => void,
  setHeaderHeight: (headerHeight: number) => void,
  setIsProbabilityColumnVisible: (checked: boolean) => void,
  addEntry: () => void,
  addEntries: (count: number | undefined) => void,
  deleteEntry: (index: number) => void,
  setSidebarOpen: (sidebarOpen: boolean, triggerId?: string) => void,
  setLoadModalOpen: (loadModalOpen: boolean, triggerId?: string) => void,
  setSaveModalOpen: (saveModalOpen: boolean, triggerId?: string) => void,
  setTableName: (tableName: string) => void,
  setSelectedOptions: (id: string, checked: boolean) => void,
  setCarouselIndex: (carouselIndex: number) => void,
  setTableDescription: (tableDescription: string) => void,
  handleEntryChange: (index: number, value: string) => void,
  handleChangeEntryIndex: (originalIndex: number, newIndex: number) => void,
  handleQuickSetup: (target: number, diceString: string) => void,
}

const useTableStore = create<TableState>((set) => ({
  // state
  entries: Array(defaultCount).fill(''),
  sidebarOpen: false,
  tableName: '',
  selectedOptions: structuredClone(options),
  carouselIndex: 1,
  tableDescription: '',
  loadModalOpen: false,
  saveModalOpen: false,
  tableKey: '',
  isProbabilityColumnVisible: true,
  theme: 'theme--modern--light',
  headerHeight: 0,
  entryCount: defaultCount,
  focusReturn: null,

  // actions
  setEntries: (entries: string[]) => set((state) => ({
      entries,
      ...(entries.length !== state.entries.length && { entryCount: entries.length })
  })),
  setTableKey: (tableKey: string) => set({ tableKey }),
  setTheme: (theme) => {
    if(Object.values(AvailableThemes).includes(theme)) {
      set({ theme })
    }
  },
  setHeaderHeight: (headerHeight: number) => set({ headerHeight }),
  setIsProbabilityColumnVisible: (checked: boolean) => set(() => {
    return ({ isProbabilityColumnVisible: checked })
  }),
  addEntry: () => set((state) => ({
    entries: [...state.entries, ''],
    entryCount: state.entries.length + 1
  })),
  addEntries: (count: number | undefined) => {
    if (count) {
      set((state) => ({
        entries: [...state.entries, ...Array(count).fill('')],
        entryCount: state.entries.length + count
      }))
    }
  },
  deleteEntry: (index: number) => set((state) => {
    const newEntries = [...state.entries];
    newEntries.splice(index, 1);
    return ({ entries: newEntries,
      entryCount: newEntries.length
     });
  }),

  setSidebarOpen: (sidebarState, triggerId) => set((state) => {
    return ({
    sidebarOpen: sidebarState,
    focusReturn: triggerId || null
  })}),
  setLoadModalOpen: (modalState, triggerId) => set(() => ({
    loadModalOpen: modalState,
    focusReturn: triggerId || null
  })),
  setSaveModalOpen: (modalState, triggerId) => set(() => ({
    saveModalOpen: modalState,
    focusReturn: triggerId || null
  })),

  setTableName: (tableName: string) => set({ tableName }),

  setSelectedOptions: (id: string, checked: boolean) => set((state) => {
    const newOptions = { ...state.selectedOptions };
    if(newOptions[id]) {
      newOptions[id].enabled = checked;
      return ({ selectedOptions: newOptions })
    }
    return ({selectedOptions: newOptions})
  }),

  setCarouselIndex: (carouselIndex: number) => set({ carouselIndex }),
  setTableDescription: (tableDescription: string) => set({ tableDescription }),
  handleEntryChange: (index: number, value: string) => set((state) => {
    const newEntries = [...state.entries];
    if(index < state.entryCount) {
      newEntries[index] = value;
      return ({ entries: newEntries });
    }
    return ({entries: newEntries});
  }),
  handleChangeEntryIndex: (originalIndex: number, newIndex: number) => {
    const {entries} = useTableStore.getState();

    const entryCount = entries.length;
    if (newIndex < 0 || newIndex > entryCount - 1 || originalIndex < 0 || originalIndex > entryCount - 1) {
      return;
    }
    const item = entries[originalIndex];
    const newEntries = [...entries];

    newEntries.splice(originalIndex, 1);
    newEntries.splice(newIndex, 0, item);
    set({entries: newEntries});
  },
  handleQuickSetup: (target: number, diceString: string) => {
    const {entries, selectedOptions, entryCount} = useTableStore.getState();
    const delta = entryCount - target; // + is shrinking, - is growing
    const newEntries = (delta > 0) ? entries.slice(0, target) : [...entries, ...Array(-1 * delta).fill('')];

    const combos = getCombinationObjects(target, selectedOptions);
    const tableIndex = combos.findIndex((combo) => combo.diceString === diceString);
    let carouselIndex = tableIndex;
    if(tableIndex < 0) {
      carouselIndex = 0;
    }

    set({
      entries: newEntries,
      entryCount: newEntries.length,
      carouselIndex: carouselIndex + 1,
      sidebarOpen: false
    })
  }
}))

export default useTableStore;