import { useEffect, useRef } from 'react';
import './tooltip.scss';

const Tooltip = ({children}) => {
    const tooltipRef = useRef(null);

    useEffect(() => {
        const parent = tooltipRef.current?.parentNode;
        if(parent) {
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