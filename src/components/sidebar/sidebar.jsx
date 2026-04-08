import useTableStore from '../../store/tableStore';
import Button from '../button/button';
import Checkbox from '../checkbox/checkbox';
import './sidebar.scss';
import exampleTables from '../../content/exampleTables.json';
import { loadTable } from '../../utils/tableManagement';
import { NumberEightIcon, NumberFourIcon, NumberOneIcon, NumberSixIcon, NumberTwoIcon, NumberZeroIcon, XIcon } from '@phosphor-icons/react';

const Sidebar = ({ handleQuickSetup }) => {
    const sidebarOpen = useTableStore((state) => state.sidebarOpen);
    const setSidebarOpen = useTableStore((state) => state.setSidebarOpen);
    const setSelectedOptions = useTableStore((state) => state.setSelectedOptions);
    const setIsProbabilityColumnVisible = useTableStore((state) => state.setIsProbabilityColumnVisible);
    const setTheme = useTableStore((state) => state.setTheme);

    const handleExampleSetup = (key) => {
        const table = exampleTables[key];
        loadTable(table);
        setSidebarOpen(false);
    }

    return (
        <aside className={`cmp-sidebar cmp-sidebar--${sidebarOpen ? 'open' : 'closed'}`}>
            <Button
                label={'close'}
                className={'cmp-sidebar__close'}
                onClick={() => { setSidebarOpen(false) }}
                type="icon"
                icon={<XIcon size={32} />} />
            <div className='settings-menu'>
                <div className='settings-menu__heading'>
                    <p>Settings</p>
                </div>
                <div className='settings-menu__dice settings-menu__section'>
                    <p className='settings-menu__section__heading'>Available dice</p>
                    <div className='settings-menu__options'>
                        <Checkbox
                            id="d2"
                            name="dice"
                            value="2"
                            label="d2"
                            isChecked={false}
                            onChange={setSelectedOptions}
                            type="icon"
                            icon={<NumberTwoIcon size={32} />} />
                        <Checkbox
                            id="d4"
                            name="dice"
                            value="4"
                            label="d4"
                            isChecked={true}
                            onChange={setSelectedOptions}
                            type="icon"
                            icon={<NumberFourIcon size={32} />} />
                        <Checkbox
                            id="d6"
                            name="dice"
                            value="6"
                            label="d6"
                            isChecked={true}
                            onChange={setSelectedOptions}
                            type="icon"
                            icon={<NumberSixIcon size={32} />} />
                        <Checkbox
                            id="d8"
                            name="dice"
                            value="8"
                            label="d8"
                            isChecked={true}
                            onChange={setSelectedOptions}
                            type="icon"
                            icon={<NumberEightIcon size={32} />} />
                        <Checkbox
                            id="d10"
                            name="dice"
                            value="10"
                            label="d10"
                            isChecked={true}
                            onChange={setSelectedOptions}
                            type="icon"
                            icon={<><NumberOneIcon size={32} /><NumberZeroIcon size={32} /></>} />
                        <Checkbox
                            id="d12"
                            name="dice"
                            value="12"
                            label="d12"
                            isChecked={true}
                            onChange={setSelectedOptions}
                            type="icon"
                            icon={<><NumberOneIcon size={32} /><NumberTwoIcon size={32} /></>} />
                        <Checkbox
                            id="d20"
                            name="dice"
                            value="20"
                            label="d20"
                            isChecked={true}
                            onChange={setSelectedOptions}
                            type="icon"
                            icon={<><NumberTwoIcon size={32} /><NumberZeroIcon size={32} /></>} />
                        <Checkbox
                            id="d100"
                            name="dice"
                            value="100"
                            label="d100"
                            isChecked={true}
                            onChange={setSelectedOptions}
                            type="icon"
                            icon={<><NumberOneIcon size={32} /><NumberZeroIcon size={32} /><NumberZeroIcon size={32} /></>} />
                    </div>
                </div>
                <div className='settings-menu__quick-setup settings-menu__section'>
                    <p className='settings-menu__section__heading'>Quick Setup</p>
                    <div className='settings-menu__options'>

                        <Button
                            label={'1d4'}
                            onClick={() => { handleQuickSetup(4, '1d4') }}
                            hierarchy={'secondary'} />
                        <Button
                            label={'1d6'}
                            onClick={() => { handleQuickSetup(6, '1d6') }}
                            hierarchy={'secondary'} />
                        <Button
                            label={'2d6'}
                            onClick={() => { handleQuickSetup(11, '2d6') }}
                            hierarchy={'secondary'} />
                        <Button
                            label={'3d6'}
                            onClick={() => { handleQuickSetup(16, '3d6') }}
                            hierarchy={'secondary'} />
                        <Button
                            label={'1d8'}
                            onClick={() => { handleQuickSetup(8, '1d8') }}
                            hierarchy={'secondary'} />
                        <Button
                            label={'1d10'}
                            onClick={() => { handleQuickSetup(10, '1d10') }}
                            hierarchy={'secondary'} />
                        <Button
                            label={'2d10'}
                            onClick={() => { handleQuickSetup(19, '2d10') }}
                            hierarchy={'secondary'} />
                        <Button
                            label={'1d12'}
                            onClick={() => { handleQuickSetup(12, '1d12') }}
                            hierarchy={'secondary'} />
                        <Button
                            label={'1d20'}
                            onClick={() => { handleQuickSetup(20, '1d20') }}
                            hierarchy={'secondary'} />
                        <Button
                            label={'1d100'}
                            onClick={() => { handleQuickSetup(100, '1d100') }}
                            hierarchy={'secondary'} />
                    </div>
                </div>
                <div className='settings-menu__examples settings-menu__section'>
                    <p className='settings-menu__section__heading'>Example tables</p>
                    <div className='settings-menu__options'>

                        <Button
                            label={'1d6 Pickpocketing Loot'}
                            onClick={() => { handleExampleSetup('table1') }}
                            hierarchy={'secondary'} />
                        <Button
                            label={'2d6 Extreme Weather'}
                            onClick={() => { handleExampleSetup('table2') }}
                            hierarchy={'secondary'} />
                    </div>
                </div>
                <div className='settings-menu__misc settings-menu__section'>
                    <p className='settings-menu__section__heading'>Other settings</p>
                    <div className='settings-menu__options'>
                        <Checkbox
                            id="prob-visibility"
                            name="settings"
                            value="prob-visibility"
                            label="Show probability column"
                            isChecked={true}
                            onChange={setIsProbabilityColumnVisible} />
                    </div>
                </div>
                <div className='settings-menu__theme settings-menu__section'>
                    <p className='settings-menu__section__heading'>Theme</p>
                    <div className='settings-menu__options'>
                        <Button
                            label={'Modern Light'}
                            onClick={() => { setTheme('theme--modern--light') }}
                            hierarchy={'secondary'} />
                        <Button
                            label={'Modern Dark'}
                            onClick={() => { setTheme('theme--modern--dark') }}
                            hierarchy={'secondary'} />
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;