import { ReactNode } from 'react';
import './button.scss';

interface ButtonProps {
    label?: string,
    onClick?: () => void,
    className?: string,
    icon?: string | ReactNode
    type?: string, // limit options here
    hierarchy?: string, //same
    isWarning?: boolean
}

const Button = ({ label, onClick, className, type, icon, hierarchy, isWarning }: ButtonProps) => {
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
            onClick={onClick}>
                <span className='cmp-button__icon'>{icon}</span>
                {label && <span className='cmp-button__label'>
                    {label}
                </span>}
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