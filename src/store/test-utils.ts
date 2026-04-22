import { DiceOptions } from "../types/types"
import useTableStore from "./tableStore"

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

const resetStore = () => {
    useTableStore.setState({
        entries: Array(6).fill(''),
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
        entryCount: 6,
        focusReturn: null,
    })
}

export {
    resetStore
}