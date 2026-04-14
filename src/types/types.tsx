export interface JSONEntry {
    id: string,
    tableName: string,
    tableDescription: string,
    comboObj: ComboObject,
    entries: string[],
    savedAt: string,
    updatedAt: string
}

export interface DiceCount {
    [key: string]: number
}

export interface Distribution {
    [key: string | number]: number
}

export interface Probability {
    [key: string]: number
}

interface DiceOption {
    value: number,
    enabled: boolean
}

export interface DiceOptions {
    [key: string]: DiceOption
}

export interface ComboObject {
    count: number,
    diceCounts: DiceCount | {},
    diceString: string,
    combination: string[],
    distribution: Distribution | {},
    probabilities: Probability | {},
    variance: number,
    standardDeviation: number,
    selectedOptions: DiceOptions
}