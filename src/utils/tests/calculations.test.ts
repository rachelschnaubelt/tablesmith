import { describe, expect, it } from "vitest";
import { getCombinationDistribution, getCombinationObject, getCombinationObjects, getCombinationProbabilities, getCombinations, getCombinationStandardDeviation, getCombinationVariance, getDiceCounts, getDiceString, getHints, getLeastLikelyRolls, getMostLikelyRolls } from "../calculations";
import useTableStore from "../../store/tableStore";

describe('getCombinations', () => {
    it('calculates valid combinations', () => {
        const count = 13;
        const selectedOptions = {
            "d10": {
                "value": 10,
                "enabled": true
            },
            "d8": {
                "value": 8,
                "enabled": true
            },
            "d6": {
                "value": 6,
                "enabled": true
            },
            "d4": {
                "value": 4,
                "enabled": true
            },
            "d2": {
                "value": 2,
                "enabled": false
            }
        }

        const actualCombinations = getCombinations(count, selectedOptions);
        const expectedCombinations = [['d4', 'd10'], ['d8', 'd6'], ['d4', 'd4', 'd4', 'd4']];
        expect(actualCombinations).toEqual(expectedCombinations);
    });

    it('prevents more than one d2 in a combination', () => {
        const count = 19;
        const selectedOptions = {
            "d2": {
                "value": 2,
                "enabled": true
            }
        }

        const actualCombinations = getCombinations(count, selectedOptions);
        const expectedCombinations: any[] = [];
        expect(actualCombinations).toEqual(expectedCombinations);
    });

    it('prevents overly complex combinations', () => {
        const count = 40;
        const selectedOptions = {
            "d4": {
                "value": 4,
                "enabled": true
            }
        }

        const actualCombinations = getCombinations(count, selectedOptions);
        const expectedCombinations: any[] = [];
        expect(actualCombinations).toEqual(expectedCombinations);
    });

    it("finds no options when selected options are restricted", () => {
        const count = 13;
        const selectedOptions = {
            "d10": {
                "value": 10,
                "enabled": true
            },
            "d8": {
                "value": 8,
                "enabled": true
            },
            "d6": {
                "value": 6,
                "enabled": false
            },
            "d4": {
                "value": 4,
                "enabled": false
            },
            "d2": {
                "value": 2,
                "enabled": false
            }
        }

        const actualCombinations = getCombinations(count, selectedOptions);
        const expectedCombinations: any[] = [];
        expect(actualCombinations).toEqual(expectedCombinations);
    });

    it("finds no options when no options are possible", () => {
        const count = 3;
        const selectedOptions = {
            "d2": {
                "value": 2,
                "enabled": false
            }
        }

        const actualCombinations = getCombinations(count, selectedOptions);
        const expectedCombinations: any[] = [];
        expect(actualCombinations).toEqual(expectedCombinations);
    });
})

describe('getCombinationDistribution', () => {
    it('calculates valid bell curve distribution', () => {
        const combination = ['d4', 'd4', 'd4', 'd4'];
        const selectedOptions = {
            "d4": {
                "value": 4,
                "enabled": true
            }
        }
        const expectedDistribution = {
            '4': 1,
            '5': 4,
            '6': 10,
            '7': 20,
            '8': 31,
            '9': 40,
            '10': 44,
            '11': 40,
            '12': 31,
            '13': 20,
            '14': 10,
            '15': 4,
            '16': 1
        }
        const actualDistribution = getCombinationDistribution(combination, selectedOptions);
        expect(actualDistribution).toEqual(expectedDistribution);
    });

    it('calculates valid flat distribution', () => {
        const combination = ['d4'];
        const selectedOptions = {
            "d4": {
                "value": 4,
                "enabled": true
            }
        }
        const expectedDistribution = {
            '1': 1,
            '2': 1,
            '3': 1,
            '4': 1
        }
        const actualDistribution = getCombinationDistribution(combination, selectedOptions);
        expect(actualDistribution).toEqual(expectedDistribution);
    });

    it('calculates valid distribution, even when selected options are disabled', () => {
        const combination = ['d4'];
        const selectedOptions = {
            "d4": {
                "value": 4,
                "enabled": false
            }
        }
        const expectedDistribution = {
            '1': 1,
            '2': 1,
            '3': 1,
            '4': 1
        }
        const actualDistribution = getCombinationDistribution(combination, selectedOptions);
        expect(actualDistribution).toEqual(expectedDistribution);
    });

    it('handles empty combinations', () => {
        const combination: any[] = [];
        const selectedOptions = {
            "d4": {
                "value": 4,
                "enabled": true
            }
        }
        const expectedDistribution = {
            '0': 1
        }
        const actualDistribution = getCombinationDistribution(combination, selectedOptions);
        expect(actualDistribution).toEqual(expectedDistribution);
    });
})

describe('getCombinationProbabilities', () => {
    it('calculates valid bell curve probabilities', () => {
        const distribution = {
            "4": 1,
            "5": 4,
            "6": 10,
            "7": 20,
            "8": 31,
            "9": 40,
            "10": 44,
            "11": 40,
            "12": 31,
            "13": 20,
            "14": 10,
            "15": 4,
            "16": 1
        }
        const expectedProbabilities = {
            "4": 0.00390625,
            "5": 0.015625,
            "6": 0.0390625,
            "7": 0.078125,
            "8": 0.12109375,
            "9": 0.15625,
            "10": 0.171875,
            "11": 0.15625,
            "12": 0.12109375,
            "13": 0.078125,
            "14": 0.0390625,
            "15": 0.015625,
            "16": 0.00390625
        }
        const actualProbabilities = getCombinationProbabilities(distribution);
        expect(actualProbabilities).toEqual(expectedProbabilities);
    })

    it('calculates valid equal probabilities', () => {
        const distribution = {
            '1': 1,
            '2': 1,
            '3': 1,
            '4': 1
        }
        const expectedProbabilities = {
            '1': 0.25,
            '2': 0.25,
            '3': 0.25,
            '4': 0.25
        }
        const actualProbabilities = getCombinationProbabilities(distribution);
        expect(actualProbabilities).toEqual(expectedProbabilities);
    })

    it('handles default distributions', () => {
        const distribution = {
            "0": 1
        }
        const expectedProbabilities = {
            "0": 1
        }
        const actualProbabilities = getCombinationProbabilities(distribution);
        expect(actualProbabilities).toEqual(expectedProbabilities);
    })
})

describe('getCombinationVariance', () => {
    it('calculates variance correctly', () => {
        const probabilities = {
            "2": 0.0625,
            "3": 0.125,
            "4": 0.1875,
            "5": 0.25,
            "6": 0.1875,
            "7": 0.125,
            "8": 0.0625
        };
        const expectedVariance = 2.5;
        const actualVariance = getCombinationVariance(probabilities);
        expect(actualVariance).toEqual(expectedVariance);
    });

    it('calculates variance correctly for single dice', () => {
        const probabilities = {
            "1": 0.25,
            "2": 0.25,
            "3": 0.25,
            "4": 0.25
        };
        const expectedVariance = 1.25;
        const actualVariance = getCombinationVariance(probabilities);
        expect(actualVariance).toEqual(expectedVariance);
    })

    it('handles default probabilities', () => {
        const probabilities = {
            "0": 1
        }
        const expectedVariance = 0;
        const actualVariance = getCombinationVariance(probabilities);
        expect(actualVariance).toEqual(expectedVariance);
    })
})

describe('getDiceCounts', () => {
    it('creates valid dice counts object based on combination', () => {
        const combination = [
            "d4",
            "d4",
            "d6"
        ];
        const expectedDiceCounts = {
            "d4": 2,
            "d6": 1
        };
        const actualDiceCounts = getDiceCounts(combination);
        expect(actualDiceCounts).toEqual(expectedDiceCounts);
    })

    it('creates empty dice counts object based on empty combination', () => {
        const combination: any[] = [
        ];
        const expectedDiceCounts = {
        };
        const actualDiceCounts = getDiceCounts(combination);
        expect(actualDiceCounts).toEqual(expectedDiceCounts);
    })

})

describe('getDiceString', () => {
    it('handles valid dice count object', () => {
        const diceCounts = {
            "d4": 2,
            "d6": 1
        };
        const expectedDiceString = '1d6 + 2d4';
        const actualDiceString = getDiceString(diceCounts);
        expect(actualDiceString).toEqual(expectedDiceString);
    })

    it('handles unsorted dice count object', () => {
        const diceCounts = {
            "d10": 1,
            "d4": 2,
            "d6": 1
        };
        const expectedDiceString = '1d10 + 1d6 + 2d4'; // expect highest sided die to be first
        const actualDiceString = getDiceString(diceCounts);
        expect(actualDiceString).toEqual(expectedDiceString);
    })

    it('returns empty string for empty object', () => {
        const diceCounts = {};
        const expectedDiceString = '';
        const actualDiceString = getDiceString(diceCounts);
        expect(actualDiceString).toEqual(expectedDiceString);
    })
})

describe('getCombinationObject', () => {
    it('gets expected combination object from combination, count(n), and selectedOptions', () => {
        const combination = [
            "d4",
            "d4",
            "d6"
        ];
        const count = 12;
        const selectedOptions = {
            "d6": {
                "value": 6,
                "enabled": true
            },
            "d4": {
                "value": 4,
                "enabled": true
            },
            "d2": {
                "value": 2,
                "enabled": false
            }
        };
        const expectedCombinationObject = {
            "count": 12,
            "diceCounts": {
                "d6": 1,
                "d4": 2
            },
            "diceString": "1d6 + 2d4",
            "combination": [
                "d4",
                "d4",
                "d6"
            ],
            "distribution": {
                "3": 1,
                "4": 3,
                "5": 6,
                "6": 10,
                "7": 13,
                "8": 15,
                "9": 15,
                "10": 13,
                "11": 10,
                "12": 6,
                "13": 3,
                "14": 1
            },
            "probabilities": {
                "3": 0.010416666666666666,
                "4": 0.03125,
                "5": 0.0625,
                "6": 0.10416666666666667,
                "7": 0.13541666666666666,
                "8": 0.15625,
                "9": 0.15625,
                "10": 0.13541666666666666,
                "11": 0.10416666666666667,
                "12": 0.0625,
                "13": 0.03125,
                "14": 0.010416666666666666
            },
            "variance": 5.416666666666667,
            "standardDeviation": 2.327373340628157,
            "selectedOptions": {
                "d6": {
                    "value": 6,
                    "enabled": true
                },
                "d4": {
                    "value": 4,
                    "enabled": true
                },
                "d2": {
                    "value": 2,
                    "enabled": false
                }
            }
        };
        const actualCombinationObject = getCombinationObject(combination, count, selectedOptions);
        expect(actualCombinationObject).toEqual(expectedCombinationObject);
    });

    // future test scenarios
    // what if count is invalid for combination?
    // what if selectedOptions are invalid for combination?
})

describe('getCombinationObjects', () => {
    it('gets correct combination objects for a given count and selectedOptions', () => {
        const count = 12;
        const selectedOptions = {
            "d12": {
                "value": 12,
                "enabled": true
            },
            "d6": {
                "value": 6,
                "enabled": true
            },
            "d4": {
                "value": 4,
                "enabled": true
            },
            "d2": {
                "value": 2,
                "enabled": false
            }
        }
        const expectedCombinationObjects: any[] = [
            {
                "count": 12,
                "diceCounts": {
                    "d12": 1
                },
                "diceString": "1d12",
                "combination": [
                    "d12"
                ],
                "distribution": {
                    "1": 1,
                    "2": 1,
                    "3": 1,
                    "4": 1,
                    "5": 1,
                    "6": 1,
                    "7": 1,
                    "8": 1,
                    "9": 1,
                    "10": 1,
                    "11": 1,
                    "12": 1
                },
                "probabilities": {
                    "1": 0.08333333333333333,
                    "2": 0.08333333333333333,
                    "3": 0.08333333333333333,
                    "4": 0.08333333333333333,
                    "5": 0.08333333333333333,
                    "6": 0.08333333333333333,
                    "7": 0.08333333333333333,
                    "8": 0.08333333333333333,
                    "9": 0.08333333333333333,
                    "10": 0.08333333333333333,
                    "11": 0.08333333333333333,
                    "12": 0.08333333333333333
                },
                "variance": 11.916666666666664,
                "standardDeviation": 3.452052529534663,
                "selectedOptions": {
                    "d12": {
                        "value": 12,
                        "enabled": true
                    },
                    "d6": {
                        "value": 6,
                        "enabled": true
                    },
                    "d4": {
                        "value": 4,
                        "enabled": true
                    },
                    "d2": {
                        "value": 2,
                        "enabled": false
                    }
                }
            },
            {
                "count": 12,
                "diceCounts": {
                    "d6": 1,
                    "d4": 2
                },
                "diceString": "1d6 + 2d4",
                "combination": [
                    "d6",
                    "d4",
                    "d4"
                ],
                "distribution": {
                    "3": 1,
                    "4": 3,
                    "5": 6,
                    "6": 10,
                    "7": 13,
                    "8": 15,
                    "9": 15,
                    "10": 13,
                    "11": 10,
                    "12": 6,
                    "13": 3,
                    "14": 1
                },
                "probabilities": {
                    "3": 0.010416666666666666,
                    "4": 0.03125,
                    "5": 0.0625,
                    "6": 0.10416666666666667,
                    "7": 0.13541666666666666,
                    "8": 0.15625,
                    "9": 0.15625,
                    "10": 0.13541666666666666,
                    "11": 0.10416666666666667,
                    "12": 0.0625,
                    "13": 0.03125,
                    "14": 0.010416666666666666
                },
                "variance": 5.416666666666667,
                "standardDeviation": 2.327373340628157,
                "selectedOptions": {
                    "d12": {
                        "value": 12,
                        "enabled": true
                    },
                    "d6": {
                        "value": 6,
                        "enabled": true
                    },
                    "d4": {
                        "value": 4,
                        "enabled": true
                    },
                    "d2": {
                        "value": 2,
                        "enabled": false
                    }
                }
            },
        ];
        const actualCombinationObjects = getCombinationObjects(count, selectedOptions);
        expect(actualCombinationObjects).toEqual(expectedCombinationObjects);
    })

    it('returns empty array when selectedOptions do not match count', () => {
        const selectedOptions = {
            "d4": {
                "value": 4,
                "enabled": false
            },
        }
        const count = 4;
        const expectedCombinationObjects: any[] = [];
        const actualCombinationObjects = getCombinationObjects(count, selectedOptions);
        expect(actualCombinationObjects).toEqual(expectedCombinationObjects);
    })

    it('returns empty array when selectedOptions are incompatible with count', () => {
        const selectedOptions = {
            "d4": {
                "value": 4,
                "enabled": true
            },
            "d2": {
                "value": 2,
                "enabled": false
            }

        }
        const count = 5;
        const expectedCombinationObjects: any[] = [];
        const actualCombinationObjects = getCombinationObjects(count, selectedOptions);
        expect(actualCombinationObjects).toEqual(expectedCombinationObjects);
    })
})

describe('getHints', () => {
    it('returns an empty hints object when an even distribution is already an option', () => {
        const comboObjects: any[] = [
            {
                "count": 12,
                "diceCounts": {
                    "d12": 1
                },
                "diceString": "1d12",
                "combination": [
                    "d12"
                ],
                "distribution": {
                    "1": 1,
                    "2": 1,
                    "3": 1,
                    "4": 1,
                    "5": 1,
                    "6": 1,
                    "7": 1,
                    "8": 1,
                    "9": 1,
                    "10": 1,
                    "11": 1,
                    "12": 1
                },
                "probabilities": {
                    "1": 0.08333333333333333,
                    "2": 0.08333333333333333,
                    "3": 0.08333333333333333,
                    "4": 0.08333333333333333,
                    "5": 0.08333333333333333,
                    "6": 0.08333333333333333,
                    "7": 0.08333333333333333,
                    "8": 0.08333333333333333,
                    "9": 0.08333333333333333,
                    "10": 0.08333333333333333,
                    "11": 0.08333333333333333,
                    "12": 0.08333333333333333
                },
                "variance": 11.916666666666664,
                "standardDeviation": 3.452052529534663,
                "selectedOptions": {
                    "d100": {
                        "value": 100,
                        "enabled": true
                    },
                    "d20": {
                        "value": 20,
                        "enabled": true
                    },
                    "d12": {
                        "value": 12,
                        "enabled": true
                    },
                    "d10": {
                        "value": 10,
                        "enabled": true
                    },
                    "d8": {
                        "value": 8,
                        "enabled": true
                    },
                    "d6": {
                        "value": 6,
                        "enabled": true
                    },
                    "d4": {
                        "value": 4,
                        "enabled": true
                    },
                    "d2": {
                        "value": 2,
                        "enabled": false
                    }
                }
            }
        ];
        const selectedOptions = {
            "d100": {
                "value": 100,
                "enabled": true
            },
            "d20": {
                "value": 20,
                "enabled": true
            },
            "d12": {
                "value": 12,
                "enabled": true
            },
            "d10": {
                "value": 10,
                "enabled": true
            },
            "d8": {
                "value": 8,
                "enabled": true
            },
            "d6": {
                "value": 6,
                "enabled": true
            },
            "d4": {
                "value": 4,
                "enabled": true
            },
            "d2": {
                "value": 2,
                "enabled": false
            }
        };
        useTableStore.setState({
            entries: Array(12).fill('')
        })
        const expectedHints = {};
        const actualHints = getHints(comboObjects, selectedOptions);
        expect(actualHints).toEqual(expectedHints);
    })

    it('returns valid hints object when an even distribution is accessible', () => {
        const comboObjects: any[] = [
            {
                "count": 7,
                "diceCounts": {
                    "d4": 2
                },
                "diceString": "2d4",
                "combination": [
                    "d4",
                    "d4"
                ],
                "distribution": {
                    "2": 1,
                    "3": 2,
                    "4": 3,
                    "5": 4,
                    "6": 3,
                    "7": 2,
                    "8": 1
                },
                "probabilities": {
                    "2": 0.0625,
                    "3": 0.125,
                    "4": 0.1875,
                    "5": 0.25,
                    "6": 0.1875,
                    "7": 0.125,
                    "8": 0.0625
                },
                "variance": 2.5,
                "standardDeviation": 1.5811388300841898,
                "selectedOptions": {
                    "d100": {
                        "value": 100,
                        "enabled": true
                    },
                    "d20": {
                        "value": 20,
                        "enabled": true
                    },
                    "d12": {
                        "value": 12,
                        "enabled": true
                    },
                    "d10": {
                        "value": 10,
                        "enabled": true
                    },
                    "d8": {
                        "value": 8,
                        "enabled": true
                    },
                    "d6": {
                        "value": 6,
                        "enabled": false
                    },
                    "d4": {
                        "value": 4,
                        "enabled": true
                    },
                    "d2": {
                        "value": 2,
                        "enabled": false
                    }
                }
            }
        ];
        const selectedOptions = {
            "d100": {
                "value": 100,
                "enabled": true
            },
            "d20": {
                "value": 20,
                "enabled": true
            },
            "d12": {
                "value": 12,
                "enabled": true
            },
            "d10": {
                "value": 10,
                "enabled": true
            },
            "d8": {
                "value": 8,
                "enabled": true
            },
            "d6": {
                "value": 6,
                "enabled": false
            },
            "d4": {
                "value": 4,
                "enabled": true
            },
            "d2": {
                "value": 2,
                "enabled": false
            }
        };
        useTableStore.setState({
            entries: Array(7).fill('')
        })
        const expectedHints = {
            "closestMax": 8,
            "closestMin": 4,
            "maxDiff": 1,
            "minDiff": 3,
        };
        const actualHints = getHints(comboObjects, selectedOptions);
        expect(actualHints).toEqual(expectedHints);
    })

    it('returns an empty hints object when an even distribution is not accessible', () => {
        const comboObjects: any[] = [
            {
                "count": 29,
                "diceCounts": {
                    "d20": 1,
                    "d10": 1
                },
                "diceString": "1d20 + 1d10",
                "combination": [
                    "d20",
                    "d10"
                ],
                "distribution": {
                    "2": 1,
                    "3": 2,
                    "4": 3,
                    "5": 4,
                    "6": 5,
                    "7": 6,
                    "8": 7,
                    "9": 8,
                    "10": 9,
                    "11": 10,
                    "12": 10,
                    "13": 10,
                    "14": 10,
                    "15": 10,
                    "16": 10,
                    "17": 10,
                    "18": 10,
                    "19": 10,
                    "20": 10,
                    "21": 10,
                    "22": 9,
                    "23": 8,
                    "24": 7,
                    "25": 6,
                    "26": 5,
                    "27": 4,
                    "28": 3,
                    "29": 2,
                    "30": 1
                },
                "probabilities": {
                    "2": 0.005,
                    "3": 0.01,
                    "4": 0.015,
                    "5": 0.02,
                    "6": 0.025,
                    "7": 0.03,
                    "8": 0.035,
                    "9": 0.04,
                    "10": 0.045,
                    "11": 0.05,
                    "12": 0.05,
                    "13": 0.05,
                    "14": 0.05,
                    "15": 0.05,
                    "16": 0.05,
                    "17": 0.05,
                    "18": 0.05,
                    "19": 0.05,
                    "20": 0.05,
                    "21": 0.05,
                    "22": 0.045,
                    "23": 0.04,
                    "24": 0.035,
                    "25": 0.03,
                    "26": 0.025,
                    "27": 0.02,
                    "28": 0.015,
                    "29": 0.01,
                    "30": 0.005
                },
                "variance": 41.49999999999999,
                "standardDeviation": 6.442049363362562,
                "selectedOptions": {
                    "d100": {
                        "value": 100,
                        "enabled": true
                    },
                    "d20": {
                        "value": 20,
                        "enabled": true
                    },
                    "d12": {
                        "value": 12,
                        "enabled": true
                    },
                    "d10": {
                        "value": 10,
                        "enabled": true
                    },
                    "d8": {
                        "value": 8,
                        "enabled": false
                    },
                    "d6": {
                        "value": 6,
                        "enabled": false
                    },
                    "d4": {
                        "value": 4,
                        "enabled": false
                    },
                    "d2": {
                        "value": 2,
                        "enabled": false
                    }
                }
            }
        ];
        const selectedOptions = {
            "d100": {
                "value": 100,
                "enabled": true
            },
            "d20": {
                "value": 20,
                "enabled": true
            },
            "d12": {
                "value": 12,
                "enabled": true
            },
            "d10": {
                "value": 10,
                "enabled": true
            },
            "d8": {
                "value": 8,
                "enabled": false
            },
            "d6": {
                "value": 6,
                "enabled": false
            },
            "d4": {
                "value": 4,
                "enabled": false
            },
            "d2": {
                "value": 2,
                "enabled": false
            }
        };
        useTableStore.setState({
            entries: Array(29).fill('')
        })
        const expectedHints = {
        };
        const actualHints = getHints(comboObjects, selectedOptions);
        expect(actualHints).toEqual(expectedHints);
    })
})

describe('getMostLikelyRolls and getLeastLikelyRolls', () => {
    it('gets expected least and most likely rolls', () => {
        const distribution = {
            "2": 1,
            "3": 2,
            "4": 3,
            "5": 4,
            "6": 4,
            "7": 4,
            "8": 4,
            "9": 4,
            "10": 3,
            "11": 2,
            "12": 1
        }
        const expectedMostLikelyRolls: string[] = ["5", "6", "7", "8", "9"];
        const actualMostLikelyRolls = getMostLikelyRolls(distribution);
        expect(actualMostLikelyRolls).toEqual(expectedMostLikelyRolls);

        const expectedLeastLikelyRolls: string[] = ["2", "12"];
        const actualLeastLikelyRolls = getLeastLikelyRolls(distribution);
        expect(actualLeastLikelyRolls).toEqual(expectedLeastLikelyRolls);
    })

    it('handles default distribution', () => {
        const distribution = {
            '0': 1
        }
        const expectedMostLikelyRolls: string[] = ["0"];
        const actualMostLikelyRolls = getMostLikelyRolls(distribution);
        expect(actualMostLikelyRolls).toEqual(expectedMostLikelyRolls);

        const expectedLeastLikelyRolls: string[] = ["0"];
        const actualLeastLikelyRolls = getLeastLikelyRolls(distribution);
        expect(actualLeastLikelyRolls).toEqual(expectedLeastLikelyRolls);
    })
})

describe('getCombinationStandardDeviation', () => {
    it('calculates standard deviation based on variance', () => {
        const variance = 9;
        const expectedStandardDeviation = 3;
        const actualStandardDeviation = getCombinationStandardDeviation(variance);
        expect(actualStandardDeviation).toEqual(expectedStandardDeviation);
    })
})