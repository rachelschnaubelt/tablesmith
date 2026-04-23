import { useEffect, useRef } from "react";
import useTableStore from "../../store/tableStore";
import Button from "../button/button.tsx";
import './header.scss';
import { GearIcon, TableIcon } from "@phosphor-icons/react";

const Header = () => {
    const setLoadModalOpen = useTableStore((state) => state.setLoadModalOpen);
    const setSidebarOpen = useTableStore((state) => state.setSidebarOpen);
    const setHeaderHeight = useTableStore((state) => state.setHeaderHeight);
    const headerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const updateHeight = () => {
            if (headerRef?.current) {
                const height = headerRef.current.clientHeight;
                if (height) {
                    setHeaderHeight(height);
                }
            }
        }
        updateHeight();

        window.addEventListener('resize', updateHeight);

        return () => window.removeEventListener('resize', updateHeight);
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
                        id="sidebar__trigger-button--settings"
                        onClick={() => { setSidebarOpen(true, 'sidebar__trigger-button--settings') }}
                        type="icon"
                        icon={<GearIcon size={24} />} />
                    <Button
                        label={'load'}
                        className={'no-print load-button'}
                        id="modal__trigger-button--load"
                        onClick={() => { setLoadModalOpen(true, "modal__trigger-button--load") }}
                        type="icon"
                        icon={<TableIcon size={24} />} />
                </div>
            </div>
        </header>
    )
}

export default Header;