import './button.scss';

const Button = ({ label, onClick, className, type, icon }) => {
    const propClasses = className ? className.split(' ') : [];
    const classNameArray = [
        'cmp-button',
        ...propClasses,
    ];
    const hasIcon = type === 'icon' && icon !== undefined;
    if (hasIcon) {
        classNameArray.push(`cmp-button--icon`);

        return (
            <button
            className={classNameArray.join(' ')}
            onClick={() => { onClick() }}>
                <span className='cmp-button__icon'>{icon}</span>
                <span className='cmp-button__label'>
                    {label}
                </span>
            </button>
        );

    }

    return (
        <button
            className={classNameArray.join(' ')}
            onClick={() => { onClick() }}>
            <span className='cmp-button__label'>
                {label}
            </span>
        </button>)
}

export default Button;