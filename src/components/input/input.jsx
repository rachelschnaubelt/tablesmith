import './input.scss';

const Input = ({ className, value, placeholder, type = 'text', id, onChange }) => {
    const classNameString = `cmp-input__input--${type} ${className}`

    // there might be a better way to handle this through dynamic tags based on the type prop

    if (type === 'textarea') {
        return (
            <div className='cmp-input'>
                <textarea
                    className={classNameString}
                    onChange={onChange}
                    value={value}
                    id={id}
                    placeholder={placeholder}>
                </textarea>
            </div>
        )
    }

    return (
        <div className='cmp-input'>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                className={classNameString}
                id={id}
                onChange={onChange} />
        </div>

    );
}

export default Input;