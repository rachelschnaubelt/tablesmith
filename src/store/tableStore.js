import { useMemo } from 'react';
import { create } from 'zustand';

const defaultCount = 6;

const options = {
  'd100': {
    value: 100,
    enabled: true},
  'd20': {
    value: 20,
    enabled: true},
  'd12': {
    value: 12,
    enabled: true},
  'd10': {
    value: 10,
    enabled: true},
  'd8': {
    value: 8,
    enabled: true},
  'd6': {
    value: 6,
    enabled: true},
  'd4': {
    value: 4,
    enabled: true},
  'd2': {
    value: 2,
    enabled: false}
}

const useTableStore = create((set) => ({
    // state
    entries: Array(defaultCount).fill(''),
    sidebarOpen: false,
    tableName: '',
    selectedOptions: {...options},
    carouselIndex: 1,
    tableDescription: '',
    modalOpen: '',
    tableKey: '',
    isProbabilityColumnVisible: true,
    theme: '',
    headerHeight: 0,

    // actions
    setEntries: (entries) => set({entries}),
    setTableKey: (tableKey) => set({tableKey}),
    setTheme: (theme) => set({theme}),
    setHeaderHeight: (headerHeight) => set({headerHeight}),
    setIsProbabilityColumnVisible: (event) => set(() => {
        return({isProbabilityColumnVisible: event.target.checked})
    }),
    addEntry: () => set((state) => ({
        entries: [...state.entries, '']
    })),
    deleteEntry: (index) => set((state) => {
        const newEntries = [...state.entries];
        newEntries.splice(index, 1);
        return({ entries: newEntries});
    }),

    setSidebarOpen: (sidebarState) => set(() => ({
        sidebarOpen: sidebarState
    })),
    setModalOpen: (modalState) => set(() => ({
        modalOpen: modalState
    })),

    setTableName: (tableName) => set({tableName}),

    setSelectedOptions: (event) => set((state) => {
        const id = event.target.id;
        const checked = event.target.checked;
        const newOptions = {...state.selectedOptions};
        newOptions[id].enabled = checked;
        return({selectedOptions: newOptions})
    }),

    setCarouselIndex: (carouselIndex) => set({carouselIndex}),
    setTableDescription: (tableDescription) => set({tableDescription})
}))

export default useTableStore;