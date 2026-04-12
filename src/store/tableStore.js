import { create } from 'zustand';
import { getCombinationObjects } from '../utils/calculations';

const defaultCount = 10;

const options = {
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

const useTableStore = create((set) => ({
  // state
  entries: Array(defaultCount).fill(''),
  sidebarOpen: false,
  tableName: '',
  selectedOptions: { ...options },
  carouselIndex: 1,
  tableDescription: '',
  loadModalOpen: '',
  saveModalOpen: '',
  tableKey: '',
  isProbabilityColumnVisible: true,
  theme: '',
  headerHeight: 0,
  entryCount: defaultCount,

  // actions
  setEntries: (entries) => set((state) => ({
      entries,
      ...(entries.length !== state.entries.length && { entryCount: entries.length })
  })),
  setTableKey: (tableKey) => set({ tableKey }),
  setTheme: (theme) => set({ theme }),
  setHeaderHeight: (headerHeight) => set({ headerHeight }),
  setIsProbabilityColumnVisible: (event) => set(() => {
    return ({ isProbabilityColumnVisible: event.target.checked })
  }),
  addEntry: () => set((state) => ({
    entries: [...state.entries, ''],
    entryCount: state.entries.length + 1
  })),
  addEntries: (count) => set((state) => ({
    entries: [...state.entries, ...Array(count).fill('')],
    entryCount: state.entries.length + count
  })),
  deleteEntry: (index) => set((state) => {
    const newEntries = [...state.entries];
    newEntries.splice(index, 1);
    return ({ entries: newEntries,
      entryCount: newEntries.length
     });
  }),

  setSidebarOpen: (sidebarState) => set(() => ({
    sidebarOpen: sidebarState
  })),
  setLoadModalOpen: (modalState) => set(() => ({
    loadModalOpen: modalState
  })),
  setSaveModalOpen: (modalState) => set(() => ({
    saveModalOpen: modalState
  })),

  setTableName: (tableName) => set({ tableName }),

  setSelectedOptions: (event) => set((state) => {
    const id = event.target.id;
    const checked = event.target.checked;
    const newOptions = { ...state.selectedOptions };
    newOptions[id].enabled = checked;
    return ({ selectedOptions: newOptions })
  }),

  setCarouselIndex: (carouselIndex) => set({ carouselIndex }),
  setTableDescription: (tableDescription) => set({ tableDescription }),
  handleEntryChange: (index, value) => set((state) => {
    const newEntries = [...state.entries];
    newEntries[index] = value;
    return ({ entries: newEntries });
  }),
  handleChangeEntryIndex: (originalIndex, newIndex) => set((state) => {
    const entryCount = state.entries.length;
    if (newIndex < 0 || newIndex > entryCount - 1) {
      return;
    }
    const item = state.entries[originalIndex];
    const newEntries = [...state.entries];

    newEntries.splice(originalIndex, 1);
    newEntries.splice(newIndex, 0, item);
    return({entries: newEntries});
  }),
  handleQuickSetup: (target, diceString) => {
    const {entries, selectedOptions, entryCount} = useTableStore.getState();
    const delta = entryCount - target; // + is shrinking, - is growing
    const newEntries = (delta > 0) ? entries.slice(0, target) : [...entries, ...Array(-1 * delta).fill('')];

    const combos = getCombinationObjects(target, selectedOptions); // have to get combo objects since they're not updated at this point
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