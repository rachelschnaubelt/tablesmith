import { useEffect, useRef, useState } from 'react';
import './accordion.scss';
import { CaretDownIcon } from '@phosphor-icons/react';

const Accordion = ({children, label, initialState}) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const contentsRef = useRef(null);
    const [contentStyle, setContentStyle] = useState({
        height: initialState ? 'auto' : 0
    })

    const handleToggle = () => {
        const height = contentsRef.current.scrollHeight;
        if(!isOpen) {
            setContentStyle({
                minHeight: `${height}px`
            })
        }
        else {
            setContentStyle({
                height: 0
            });
        }
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        if(isOpen) {
            const height = contentsRef.current.scrollHeight;
            setContentStyle({
                minHeight: `${height}px`
            });
        }
    }, [children])

    return (
        <div className={`cmp-accordion cmp-accordion--${isOpen ? 'open' : 'closed'}`}>
                <p 
                    className="cmp-accordion__heading"
                    onClick={handleToggle}>{label}<span className='cmp-accordion__arrow'><CaretDownIcon size={32} /></span></p>
                <div 
                    className="cmp-accordion__contents"
                    ref={contentsRef}
                    style={contentStyle}>
                    {children}
                </div>
        </div>
    );
}

export default Accordion;