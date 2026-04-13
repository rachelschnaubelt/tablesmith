import './input.scss';

interface InputProps {
    className: string,
    value: string,
    placeholder: string,
    type: string, // limit options
    id: string,
    onChange: () => void,
    min: number,
    max: number,
    label: string
}

const Input = ({ className, value, placeholder, type = 'text', id, onChange, min, max, label }: InputProps) => {
    const classNameString = `cmp-input__input--${type} ${className}`;

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

    if (type === 'number') {
        return (
            <div className='cmp-input cmp-input--number'>
                <label htmlFor={id}>{label}</label>
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    className={classNameString}
                    id={id}
                    min={min}
                    max={max}
                    onInput={onChange} />
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