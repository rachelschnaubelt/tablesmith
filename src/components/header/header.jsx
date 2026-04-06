import { useEffect, useRef } from "react";
import useTableStore from "../../store/tableStore";
import Button from "../button/button";
import './header.scss';
import { GearIcon, TableIcon } from "@phosphor-icons/react";

const Header = () => {
    const setModalOpen = useTableStore((state) => state.setModalOpen);
    const setSidebarOpen = useTableStore((state) => state.setSidebarOpen);
    const setHeaderHeight = useTableStore((state) => state.setHeaderHeight);
    const headerRef = useRef(null);

    useEffect(() => {
        const height = headerRef.current?.clientHeight;
        if(height) {
            setHeaderHeight(height);
        }
    }, []);

    return (
        <header 
            className="cmp-header no-print"
            ref={headerRef}>
            <div className="cmp-header__inner">
                <p className="cmp-header__heading">Table Maker</p>
                <div className="cmp-header__menu">
                    <Button
                        label={'Settings'}
                        className={'no-print settings-button'}
                        onClick={() => { setSidebarOpen(true) }}
                        type="icon"
                        icon={<GearIcon size={32} />} />
                    <Button
                        label={'load'}
                        className={'no-print load-button'}
                        onClick={() => { setModalOpen(true) }}
                        type="icon"
                        icon={<TableIcon size={32} />} />
                </div>
            </div>
        </header>
    )
}

export default Header;