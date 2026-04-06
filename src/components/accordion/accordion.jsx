import { useRef, useState } from 'react';
import './accordion.scss';
import { CaretDownIcon } from '@phosphor-icons/react';

const Accordion = ({children, label, initialState}) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const contentsRef = useRef(null);
    const [contentHeight, setContentHeight] = useState(initialState ? 'auto' : 0);

    const handleToggle = () => {
        const height = contentsRef.current.scrollHeight;
        console.log(height);
        if(!isOpen) {
            setContentHeight(height);
        }
        else {
            setContentHeight(0);
        }
        setIsOpen(!isOpen);
    }

    return (
        <div className={`cmp-accordion cmp-accordion--${isOpen ? 'open' : 'closed'}`}>
                <p 
                    className="cmp-accordion__heading"
                    onClick={handleToggle}>{label}<span className='cmp-accordion__arrow'><CaretDownIcon size={32} /></span></p>
                <div 
                    className="cmp-accordion__contents"
                    ref={contentsRef}
                    style={{height: `${contentHeight}px`}}>
                    {children}
                </div>
        </div>
    );
}

export default Accordion;