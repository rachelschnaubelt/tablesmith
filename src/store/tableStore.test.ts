import { beforeEach, describe, expect, it } from "vitest";
import { resetStore } from "./test-utils";
import useTableStore from "./tableStore";
import { AvailableThemes } from "../utils/constants";

const booleanSetterTests: { action: string, value: string }[] = [
    {
        action: 'setIsProbabilityColumnVisible',
        value: 'isProbabilityColumnVisible'
    },
    {
        action: 'setSidebarOpen',
        value: 'sidebarOpen'
    },
    {
        action: 'setLoadModalOpen',
        value: 'loadModalOpen'
    },
    {
        action: 'setSaveModalOpen',
        value: 'saveModalOpen'
    }
]

const stringSetterTests: { action: string, value: string, testValues?: string[], defaultValue?: string }[] = [
    {
        action: 'setTableKey',
        value: 'tableKey'
    },
    {
        action: 'setTableName',
        value: 'tableName'
    },
    {
        action: 'setTableDescription',
        value: 'tableDescription'
    },
    {
        action: 'setTheme',
        value: 'theme',
        testValues: Object.values(AvailableThemes),
        defaultValue: 'theme--modern--light'
    }
]

const numberSetterTests: { action: string, value: string }[] = [
    {
        action: 'setHeaderHeight',
        value: 'headerHeight'
    },
    {
        action: 'setCarouselIndex',
        value: 'carouselIndex'
    }
]

describe('tableStore', () => {
    beforeEach(() => {
        resetStore();
    })

    for (const test of booleanSetterTests) {
        describe(test.action, () => {
            it('handles setting true', () => {
                useTableStore.getState()[test.action](true);
                const expected = true;
                expect(useTableStore.getState()[test.value]).toEqual(expected);
            })
            it('handles setting false', () => {
                useTableStore.getState()[test.action](false);
                const expected = false;
                expect(useTableStore.getState()[test.value]).toEqual(expected);
            })
        })
    }

    for (const test of stringSetterTests) {
        describe(test.action, () => {
            if (test.testValues) {
                for (const testVal in test.testValues) {
                    it(`handles setting ${test.testValues[testVal]}`, () => {
                        const testString = test.testValues[testVal];
                        useTableStore.getState()[test.action](testString);
                        const expected = testString;
                        expect(useTableStore.getState()[test.value]).toEqual(expected);
                    })
                }
                it(`handles setting an invalid value`, () => {
                    const testString = "invalid string that shouldn't match any enum options";
                    useTableStore.getState()[test.action](testString);
                    expect(useTableStore.getState()[test.value]).toEqual(test.defaultValue);
                })
            }
            else {
                it('handles setting a test value', () => {
                    useTableStore.getState()[test.action]('test value');
                    const expected = 'test value';
                    expect(useTableStore.getState()[test.value]).toEqual(expected);
                })

                it('handles setting an empty value', () => {
                    useTableStore.getState()[test.action]('');
                    const expected = '';
                    expect(useTableStore.getState()[test.value]).toEqual(expected);
                })
            }
        })
    }

    for (const test of numberSetterTests) {
        describe(test.action, () => {
            it('handles setting a test value', () => {
                useTableStore.getState()[test.action]('10');
                const expected = '10';
                expect(useTableStore.getState()[test.value]).toEqual(expected);
            })
            it('handles setting an empty value', () => {
                useTableStore.getState()[test.action](0);
                const expected = 0;
                expect(useTableStore.getState()[test.value]).toEqual(expected);
            })
        })
    }

    describe('setEntries', () => {
        it('updates entries and entry count correctly', () => {
            useTableStore.getState().setEntries(['a', 'b', 'c']);
            const expectedEntries = ['a', 'b', 'c'];
            const currentState = useTableStore.getState();
            expect(currentState.entries).toEqual(expectedEntries);
            expect(currentState.entryCount).toEqual(3);
        });

        it('updates entries and entry count correctly', () => {
            useTableStore.getState().setEntries(['a', 'b', 'c', 'd', 'e', 'f']);
            const expectedEntries = ['a', 'b', 'c', 'd', 'e', 'f'];
            const currentState = useTableStore.getState();
            expect(currentState.entries).toEqual(expectedEntries);
            expect(currentState.entryCount).toEqual(6);
        });

        it('handles empty array input', () => {
            useTableStore.getState().setEntries([]);
            const expectedEntries: string[] = [];
            const currentState = useTableStore.getState();
            expect(currentState.entries).toEqual(expectedEntries);
            expect(currentState.entryCount).toEqual(0);
        });
    })

    describe('addEntry', () => {
        it('correctly adds an empty entry', () => {
            useTableStore.getState().addEntry();
            const expectedEntryCount = 7;
            const expectedEntries = Array(7).fill('');
            const currentState = useTableStore.getState();
            expect(currentState.entryCount).toEqual(expectedEntryCount);
            expect(currentState.entries).toEqual(expectedEntries);
        })
    })

    describe('addEntries', () => {
        it('correctly adds multiple empty entries', () => {
            useTableStore.getState().addEntries(3);
            const expectedEntryCount = 9;
            const expectedEntries = Array(9).fill('');
            const currentState = useTableStore.getState();
            expect(currentState.entryCount).toEqual(expectedEntryCount);
            expect(currentState.entries).toEqual(expectedEntries);
        })

        it('correctly handles undefined input', () => {
            useTableStore.getState().addEntries(undefined);
            const expectedEntryCount = 6;
            const expectedEntries = Array(6).fill('');
            const currentState = useTableStore.getState();
            expect(currentState.entryCount).toEqual(expectedEntryCount);
            expect(currentState.entries).toEqual(expectedEntries);
        })
    })

    describe('deleteEntry', () => {
        it('deletes valid entries and updates count', () => {
            useTableStore.setState({
                entries: ['a', 'b', 'c', 'd', 'e', 'f']
            })
            useTableStore.getState().deleteEntry(3);
            const expectedEntries = ['a', 'b', 'c', 'e', 'f'];
            const currentState = useTableStore.getState();
            expect(currentState.entries).toEqual(expectedEntries);
            expect(currentState.entryCount).toEqual(5);
        });

        it('handles out of bound indexes (by doing nothing)', () => {
            useTableStore.setState({
                entries: ['a', 'b', 'c', 'd', 'e', 'f']
            })
            useTableStore.getState().deleteEntry(6);
            const expectedEntries = ['a', 'b', 'c', 'd', 'e', 'f'];
            const currentState = useTableStore.getState();
            expect(currentState.entries).toEqual(expectedEntries);
            expect(currentState.entryCount).toEqual(6);
        })
    })

    describe('setSelectedOptions', () => {
        it('updates selected options', () => {
            useTableStore.getState().setSelectedOptions('d10', false);
            const expectedD10 = { value: 10, enabled: false };
            expect(useTableStore.getState().selectedOptions['d10']).toEqual(expectedD10);
        });

        it('ignores invalid options', () => {
            resetStore();
            useTableStore.getState().setSelectedOptions('d11', true);
            expect(useTableStore.getState().selectedOptions['d11']).toBeUndefined;
        });
    })

    describe('handleEntryChange', () => {
        it('updates entries', () => {
            useTableStore.getState().handleEntryChange(1, 'hello');
            const expectedEntries = ['', 'hello', '', '', '', ''];
            expect(useTableStore.getState().entries).toEqual(expectedEntries);
        })

        it('ignores out of bounds indexes', () => {
            useTableStore.getState().handleEntryChange(6, 'hello');
            const expectedEntries = ['', '', '', '', '', ''];
            expect(useTableStore.getState().entries).toEqual(expectedEntries);
        })
    })

    describe('handleChangeEntryIndex', () => {
        it('moves entries up', () => {
            useTableStore.setState({ entries: ['a', 'b', 'c', 'd', 'e', 'f'] })
            useTableStore.getState().handleChangeEntryIndex(4, 3);
            const expectedEntries = ['a', 'b', 'c', 'e', 'd', 'f'];
            expect(useTableStore.getState().entries).toEqual(expectedEntries);
        })

        it('moves entries down', () => {
            useTableStore.setState({ entries: ['a', 'b', 'c', 'd', 'e', 'f'] })
            useTableStore.getState().handleChangeEntryIndex(3, 5);
            const expectedEntries = ['a', 'b', 'c', 'e', 'f', 'd'];
            expect(useTableStore.getState().entries).toEqual(expectedEntries);
        })

        it('does not change if same index', () => {
            useTableStore.setState({ entries: ['a', 'b', 'c', 'd', 'e', 'f'] })
            useTableStore.getState().handleChangeEntryIndex(4, 4);
            const expectedEntries = ['a', 'b', 'c', 'd', 'e', 'f'];
            expect(useTableStore.getState().entries).toEqual(expectedEntries);
        })

        it('handles out of bounds target', () => {
            useTableStore.setState({ entries: ['a', 'b', 'c', 'd', 'e', 'f'] })
            useTableStore.getState().handleChangeEntryIndex(4, 6);
            const expectedEntries = ['a', 'b', 'c', 'd', 'e', 'f'];
            expect(useTableStore.getState().entries).toEqual(expectedEntries);

        })

        it('handles out of bounds source', () => {
            useTableStore.setState({ entries: ['a', 'b', 'c', 'd', 'e', 'f'] })
            useTableStore.getState().handleChangeEntryIndex(6, 3);
            const expectedEntries = ['a', 'b', 'c', 'd', 'e', 'f'];
            expect(useTableStore.getState().entries).toEqual(expectedEntries);

        })
    })

    describe('handleQuickSetup', () => {
        it('handles empty entry array and updates all expected state values', () => {
            useTableStore.getState().handleQuickSetup(10, "3d4");
            const expectedEntries = Array(10).fill('');
            const expectedEntryCount = 10;
            const expectedCarouselIndex = 2;
            const expectedSidebarState = false;
            const currentState = useTableStore.getState();
            expect(currentState.entries).toEqual(expectedEntries);
            expect(currentState.entryCount).toEqual(expectedEntryCount);
            expect(currentState.carouselIndex).toEqual(expectedCarouselIndex);
            expect(currentState.sidebarOpen).toEqual(expectedSidebarState);
        })

        it('handles increasing a filled entry array and updates all expected state values', () => {
            useTableStore.setState({ entries: Array(6).fill('hello') });
            useTableStore.getState().handleQuickSetup(10, "1d10");
            const expectedEntries = [...Array(6).fill('hello'), ...Array(4).fill('')];
            const expectedEntryCount = 10;
            const expectedCarouselIndex = 1;
            const expectedSidebarState = false;
            const currentState = useTableStore.getState();
            expect(currentState.entries).toEqual(expectedEntries);
            expect(currentState.entryCount).toEqual(expectedEntryCount);
            expect(currentState.carouselIndex).toEqual(expectedCarouselIndex);
            expect(currentState.sidebarOpen).toEqual(expectedSidebarState);
        })

        it('handles descreasing a filled entry array and updates all expected state values', () => {
            useTableStore.setState({ entries: ['a', 'b', 'c', 'd', 'e', 'f'] });
            useTableStore.getState().handleQuickSetup(4, "1d4");
            const expectedEntries = ['a', 'b', 'c', 'd'];
            const expectedEntryCount = 4;
            const expectedCarouselIndex = 1;
            const expectedSidebarState = false;
            const currentState = useTableStore.getState();
            expect(currentState.entries).toEqual(expectedEntries);
            expect(currentState.entryCount).toEqual(expectedEntryCount);
            expect(currentState.carouselIndex).toEqual(expectedCarouselIndex);
            expect(currentState.sidebarOpen).toEqual(expectedSidebarState);
        })

        it('handles invalid dice string', () => {
            useTableStore.getState().handleQuickSetup(10, "1d12");
            const expectedCarouselIndex = 1;
            const currentState = useTableStore.getState();
            expect(currentState.carouselIndex).toEqual(expectedCarouselIndex);
        })
    })
})