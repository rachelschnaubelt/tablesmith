import { DiceOptions } from "../types/types";

enum AvailableThemes {
    ModernLight = "theme--modern--light",
    ModernDark = "theme--modern--dark"
}

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

export {
    AvailableThemes,
    options,
    defaultCount
}