import { ReactNode } from 'react';
import './button.scss';

interface ButtonProps {
    label?: string,
    onClick?: () => void | ((event: MouseEvent) => void),
    className?: string,
    icon?: string | ReactNode
    type?: string, // limit options here
    hierarchy?: string, //same
    isWarning?: boolean
    ariaLabel?: string,
    ariaControls?: string,
    ariaExpanded?: boolean
}

const Button = ({ label, onClick, className, type, icon, hierarchy, isWarning, ariaLabel, ariaExpanded, ariaControls }: ButtonProps) => {
    const propClasses = className ? className.split(' ') : [];
    const classNameArray = [
        'cmp-button',
        ...propClasses,
    ];

    hierarchy && classNameArray.push(`cmp-button--${hierarchy}`);
    isWarning && classNameArray.push(`cmp-button--warning`);
    
    const hasIcon = type === 'icon' && icon !== undefined;
    if (hasIcon) {
        classNameArray.push(`cmp-button--icon`);

        return (
            <button
            className={classNameArray.join(' ')}
            onClick={onClick}
            aria-label={ariaLabel}>
                <span className='cmp-button__icon'>{icon}</span>
                {label && <span className='cmp-button__label'>
                    {label}
                </span>}
            </button>
        );
    }

    const isAccordion = type === 'accordion';
    if(isAccordion) {
        classNameArray.push('cmp-button--accordion')
        return (
            <button
            className={classNameArray.join(' ')}
            onClick={onClick}
            aria-label={ariaLabel}
            aria-expanded={ariaExpanded}
            aria-controls={ariaControls}>
                {label && <span className='cmp-button__label'>
                    {label}
                </span>}
                <span className='cmp-button__icon'>{icon}</span>
            </button>
        );
    }

    return (
        <button
            className={classNameArray.join(' ')}
            onClick={onClick}>
            <span className='cmp-button__label'>
                {label}
            </span>
        </button>)
}

export default Button;