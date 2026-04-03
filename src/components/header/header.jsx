import useTableStore from "../../store/tableStore";
import Button from "../button/button";
import './header.scss';

const Header = () => {
    const setModalOpen = useTableStore((state) => state.setModalOpen);
    const setSidebarOpen = useTableStore((state) => state.setSidebarOpen);

    return (
        <header className="cmp-header">
            <div className="cmp-header__inner">
                <p className="cmp-header__heading">Table Maker</p>
                <div>
                    <Button
                        label={'Settings'}
                        className={'no-print settings-button'}
                        onClick={() => { setSidebarOpen(true) }} />
                    <Button
                        label={'load'}
                        className={'no-print load-button'}
                        onClick={() => { setModalOpen(true) }} />
                </div>
            </div>
        </header>
    )
}

export default Header;