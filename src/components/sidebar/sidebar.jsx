import useTableStore from '../../store/tableStore';
import Button from '../button/button';
import Checkbox from '../checkbox/checkbox';
import './sidebar.scss';
import exampleTables from '../../content/exampleTables.json';
import { loadTable } from '../../utils/tableManagement';

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
            <p>Settings</p>
            <hr/>
            <p>Choose available dice</p>
            <Checkbox
                id="d2"
                name="dice"
                value="2"
                label="d2" 
                isChecked={false}
                onChange={setSelectedOptions} />
            <Checkbox
                id="d4"
                name="dice"
                value="4"
                label="d4"
                isChecked={true}
                onChange={setSelectedOptions} />
            <Checkbox
                id="d6"
                name="dice"
                value="6"
                label="d6"
                isChecked={true}
                onChange={setSelectedOptions} />
            <Checkbox
                id="d8"
                name="dice"
                value="8"
                label="d8"
                isChecked={true}
                onChange={setSelectedOptions} />
            <Checkbox
                id="d10"
                name="dice"
                value="10"
                label="d10"
                isChecked={true}
                onChange={setSelectedOptions} />
            <Checkbox
                id="d12"
                name="dice"
                value="12"
                label="d12"
                isChecked={true}
                onChange={setSelectedOptions} />
            <Checkbox
                id="d20"
                name="dice"
                value="20"
                label="d20"
                isChecked={true}
                onChange={setSelectedOptions} />
            <Checkbox
                id="d100"
                name="dice"
                value="100"
                label="d100"
                isChecked={true}
                onChange={setSelectedOptions} />
            <hr/>
            <p>Quick Setup</p>
            <Button
                label={'1d4'}
                onClick={() => {handleQuickSetup(4, '1d4')}} />
            <Button
                label={'1d6'}
                onClick={() => {handleQuickSetup(6, '1d6')}} />
            <Button
                label={'2d6'}
                onClick={() => {handleQuickSetup(11, '2d6')}} />
            <Button
                label={'3d6'}
                onClick={() => {handleQuickSetup(16, '3d6')}} />
            <Button
                label={'1d8'}
                onClick={() => {handleQuickSetup(8, '1d8')}} />
            <Button
                label={'1d10'}
                onClick={() => {handleQuickSetup(10, '1d10')}} />
            <Button
                label={'2d10'}
                onClick={() => {handleQuickSetup(19, '2d10')}} />
            <Button
                label={'1d12'}
                onClick={() => {handleQuickSetup(12, '1d12')}} />
            <Button
                label={'1d20'}
                onClick={() => {handleQuickSetup(20, '1d20')}} />
            <Button
                label={'1d100'}
                onClick={() => {handleQuickSetup(100, '1d100')}} />
            <hr />
            <p>Example tables</p>
            <Button
                label={'1d6 Pickpocketing Loot'}
                onClick={() => {handleExampleSetup('table1')}} />
            <Button
                label={'2d6 Extreme Weather'}
                onClick={() => {handleExampleSetup('table2')}} />
            <hr />
            <p>Other settings</p>
            <Checkbox
                id="prob-visibility"
                name="settings"
                value="prob-visibility"
                label="Show probability column"
                isChecked={true}
                onChange={setIsProbabilityColumnVisible} />
            <p>Theme</p>
            <Button
                label={'Modern Light'}
                onClick={() => {setTheme('theme--modern--light')}} />
            <Button
                label={'Modern Dark'}
                onClick={() => {setTheme('theme--modern--dark')}} />

            <hr />
            <Button 
                label={'close'} 
                onClick={() => {setSidebarOpen(false)}} />
        </aside>
    );
}

export default Sidebar;