import { ReactNode, useEffect, useRef, useState } from 'react';
import './accordion.scss';
import { CaretDownIcon } from '@phosphor-icons/react';
import Button from '../button/button';

interface AccordionProps {
    children: ReactNode,
    label: string,
    initialState: boolean,
    state?: boolean,
    stateHandler?: (accordionState: boolean | undefined) => void
}

interface ContentStyle {
    height?: string | number,
    minHeight?: string | number,
    visibility?: 'hidden' | 'visible'
}

const Accordion = ({children, label, initialState, state, stateHandler}: AccordionProps) => {
    const [isOpen, setIsOpen] = useState<boolean | undefined>(initialState);
    const contentsRef = useRef<HTMLDivElement>(null);
    const [contentStyle, setContentStyle] = useState<ContentStyle>({
        height: initialState ? 'auto' : 0
    })

    const updateContentStyle = (isFullHeight: boolean | undefined) => {
        if(isFullHeight && contentsRef.current) {
            const height = contentsRef.current.scrollHeight;
            setContentStyle({
                minHeight: `${height}px`,
                visibility: 'visible'
            })
        } else if((typeof isFullHeight === 'boolean') && !isFullHeight) {
            setContentStyle({
                height: 0,
                visibility: 'hidden'
            });
        }
    }

    const handleToggle = () => {
        if((!isOpen) && contentsRef.current) {
            updateContentStyle(true);
        }
        else {
            updateContentStyle(false);
        }
        if(stateHandler && (typeof state === 'boolean')) {
            setIsOpen(!state);
            stateHandler(!state);
        } else {
            setIsOpen(!isOpen);
        }
    }

    useEffect(() => {
        if((isOpen || state) && contentsRef.current) {
            const height = contentsRef.current.scrollHeight;
            setContentStyle({
                minHeight: `${height}px`
            });
        }
    }, [children])

    useEffect(() => {
        setIsOpen(state);
        updateContentStyle(state);
    }, [state])

    return (
        <div className={`cmp-accordion cmp-accordion--${(isOpen || state) ? 'open' : 'closed'}`}>
            <h2 className='sr-only'>{label}</h2>
                <Button
                    label={label}
                    type="accordion"
                    className="cmp-accordion__heading"
                    onClick={handleToggle}
                    icon={<CaretDownIcon size={32} />}
                    ariaControls={`${label}-accordion-contents`}
                    ariaExpanded={isOpen} />
                <div 
                    className="cmp-accordion__contents"
                    ref={contentsRef}
                    style={contentStyle}
                    id={`${label}-accordion-contents`}>
                    {children}
                </div>
        </div>
    );
}

export default Accordion;