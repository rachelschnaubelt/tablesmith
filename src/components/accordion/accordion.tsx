import { ReactNode, useEffect, useRef, useState } from 'react';
import './accordion.scss';
import { CaretDownIcon } from '@phosphor-icons/react';
import Button from '../button/button';

interface AccordionProps {
    children: ReactNode,
    label: string,
    initialState: boolean
}

interface ContentStyle {
    height?: string | number,
    minHeight?: string | number,
    visibility?: 'hidden' | 'visible'
}

const Accordion = ({children, label, initialState}: AccordionProps) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const contentsRef = useRef<HTMLDivElement>(null);
    const [contentStyle, setContentStyle] = useState<ContentStyle>({
        height: initialState ? 'auto' : 0
    })

    const handleToggle = () => {
        if(!isOpen && contentsRef.current) {
            const height = contentsRef.current.scrollHeight;
            setContentStyle({
                minHeight: `${height}px`,
                visibility: 'visible'
            })
        }
        else {
            setContentStyle({
                height: 0,
                visibility: 'hidden'
            });
        }
        setIsOpen(!isOpen);
    }

    useEffect(() => {
        if(isOpen && contentsRef.current) {
            const height = contentsRef.current.scrollHeight;
            setContentStyle({
                minHeight: `${height}px`
            });
        }
    }, [children])

    return (
        <div className={`cmp-accordion cmp-accordion--${isOpen ? 'open' : 'closed'}`}>
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