import { ReactNode, useEffect, useRef } from 'react';
import './tooltip.scss';

const Tooltip = ({children}: {children: ReactNode}) => {
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
            const parent = tooltipRef.current?.parentNode;
            if(parent && parent instanceof HTMLElement) {
                parent.classList.add('cmp-tooltip__parent');
            }
    }, []);

    return (
        <div 
            className="cmp-tooltip"
            ref={tooltipRef}>
            {children}
        </div>
    )
}

export default Tooltip;