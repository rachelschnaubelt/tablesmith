import useTableStore from '../../store/tableStore';
import Button from '../button/button';
import Checkbox from '../checkbox/checkbox';
import './sidebar.scss';
import exampleTables from '../../content/exampleTables.json';
import { loadTable } from '../../utils/tableManagement';
import D2Icon from '../../assets/icons/dice/d2.svg?react';
import D4Icon from '../../assets/icons/dice/d4.svg?react';
import D6Icon from '../../assets/icons/dice/d6.svg?react';
import D8Icon from '../../assets/icons/dice/d8.svg?react';
import D10Icon from '../../assets/icons/dice/d10.svg?react';
import D12Icon from '../../assets/icons/dice/d12.svg?react';
import D20Icon from '../../assets/icons/dice/d20.svg?react';
import D100Icon from '../../assets/icons/dice/d100.svg?react';

import { XIcon } from '@phosphor-icons/react';
import React from 'react';

const Sidebar = React.memo(() => {
    const { handleQuickSetup, setSidebarOpen, setSelectedOptions, setIsProbabilityColumnVisible, setTheme } = useTableStore.getState();
    const sidebarOpen = useTableStore((state) => state.sidebarOpen);
    const theme = useTableStore((state) => state.theme);

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
                            onChange={(e) => setSelectedOptions("d2", e.target.checked)}
                            type="icon"
                            icon={<D2Icon />} />
                        <Checkbox
                            id="d4"
                            name="dice"
                            value="4"
                            label="d4"
                            isChecked={true}
                            onChange={(e) => setSelectedOptions("d4", e.target.checked)}
                            type="icon"
                            icon={<D4Icon />} />
                        <Checkbox
                            id="d6"
                            name="dice"
                            value="6"
                            label="d6"
                            isChecked={true}
                            onChange={(e) => setSelectedOptions("d6", e.target.checked)}
                            type="icon"
                            icon={<D6Icon />} />
                        <Checkbox
                            id="d8"
                            name="dice"
                            value="8"
                            label="d8"
                            isChecked={true}
                            onChange={(e) => setSelectedOptions("d8", e.target.checked)}
                            type="icon"
                            icon={<D8Icon />} />
                        <Checkbox
                            id="d10"
                            name="dice"
                            value="10"
                            label="d10"
                            isChecked={true}
                            onChange={(e) => setSelectedOptions("d10", e.target.checked)}
                            type="icon"
                            icon={<D10Icon />} />
                        <Checkbox
                            id="d12"
                            name="dice"
                            value="12"
                            label="d12"
                            isChecked={true}
                            onChange={(e) => setSelectedOptions("d12", e.target.checked)}
                            type="icon"
                            icon={<D12Icon />} />
                        <Checkbox
                            id="d20"
                            name="dice"
                            value="20"
                            label="d20"
                            isChecked={true}
                            onChange={(e) => setSelectedOptions("d20", e.target.checked)}
                            type="icon"
                            icon={<D20Icon />} />
                        <Checkbox
                            id="d100"
                            name="dice"
                            value="100"
                            label="d100"
                            isChecked={true}
                            onChange={(e) => setSelectedOptions("d100", e.target.checked)}
                            type="icon"
                            icon={<D100Icon />} />
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
                            onChange={(e) => setIsProbabilityColumnVisible(e.target.checked)} />
                    </div>
                </div>
                <div className='settings-menu__theme settings-menu__section'>
                    <p className='settings-menu__section__heading'>Theme</p>
                    <div className='settings-menu__options'>
                        <Button
                            label={'Modern Light'}
                            onClick={() => { setTheme('theme--modern--light') }}
                            hierarchy={'secondary'}
                            className={theme === 'theme--modern--light' ? 'active' : ''} />
                        <Button
                            label={'Modern Dark'}
                            onClick={() => { setTheme('theme--modern--dark') }}
                            hierarchy={'secondary'}
                            className={theme === 'theme--modern--dark' ? 'active' : ''} />
                    </div>
                </div>
            </div>
        </aside>
    );
})

export default Sidebar;