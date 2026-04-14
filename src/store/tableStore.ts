import { create } from 'zustand';
import { getCombinationObjects } from '../utils/calculations.ts';
import { DiceOptions } from '../types/types';

const defaultCount: number = 10;

const options: DiceOptions = {
  'd100': {
    value: 100,
    enabled: true
  },
  'd20': {
    value: 20,
    enabled: true
  },
  'd12': {
    value: 12,
    enabled: true
  },
  'd10': {
    value: 10,
    enabled: true
  },
  'd8': {
    value: 8,
    enabled: true
  },
  'd6': {
    value: 6,
    enabled: true
  },
  'd4': {
    value: 4,
    enabled: true
  },
  'd2': {
    value: 2,
    enabled: false
  }
}

enum AvailableThemes {
    ModernLight = "theme--modern--light",
    ModernDark = "theme--modern--dark"
}

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
  setEntries: (entries: string[]) => void,
  setTableKey: (tableKey: string) => void,
  setTheme: (theme: `${AvailableThemes}`) => void,
  setHeaderHeight: (headerHeight: number) => void,
  setIsProbabilityColumnVisible: (checked: boolean) => void,
  addEntry: () => void,
  addEntries: (count: number | undefined) => void,
  deleteEntry: (index: number) => void,
  setSidebarOpen: (sidebarOpen: boolean) => void,
  setLoadModalOpen: (loadModalOpen: boolean) => void,
  setSaveModalOpen: (saveModalOpen: boolean) => void,
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
  selectedOptions: { ...options },
  carouselIndex: 1,
  tableDescription: '',
  loadModalOpen: false,
  saveModalOpen: false,
  tableKey: '',
  isProbabilityColumnVisible: true,
  theme: 'theme--modern--light',
  headerHeight: 0,
  entryCount: defaultCount,

  // actions
  setEntries: (entries: string[]) => set((state) => ({
      entries,
      ...(entries.length !== state.entries.length && { entryCount: entries.length })
  })),
  setTableKey: (tableKey: string) => set({ tableKey }),
  setTheme: (theme) => set({ theme }),
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

  setSidebarOpen: (sidebarState: boolean) => set(() => ({
    sidebarOpen: sidebarState
  })),
  setLoadModalOpen: (modalState: boolean) => set(() => ({
    loadModalOpen: modalState
  })),
  setSaveModalOpen: (modalState: boolean) => set(() => ({
    saveModalOpen: modalState
  })),

  setTableName: (tableName: string) => set({ tableName }),

  setSelectedOptions: (id: string, checked: boolean) => set((state) => {
    const newOptions = { ...state.selectedOptions };
    newOptions[id].enabled = checked;
    return ({ selectedOptions: newOptions })
  }),

  setCarouselIndex: (carouselIndex: number) => set({ carouselIndex }),
  setTableDescription: (tableDescription: string) => set({ tableDescription }),
  handleEntryChange: (index: number, value: string) => set((state) => {
    const newEntries = [...state.entries];
    newEntries[index] = value;
    return ({ entries: newEntries });
  }),
  handleChangeEntryIndex: (originalIndex: number, newIndex: number) => {
    const {entries} = useTableStore.getState();

    const entryCount = entries.length;
    if (newIndex < 0 || newIndex > entryCount - 1) {
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

    set({
      entries: newEntries,
      entryCount: newEntries.length,
      carouselIndex: tableIndex + 1,
      sidebarOpen: false
    })
  }
}))

export default useTableStore;