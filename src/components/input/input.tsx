import { ChangeEvent, useRef } from 'react';
import './input.scss';

interface InputProps {
    className: string,
    value: string | number,
    placeholder?: string,
    type?: string, // limit options
    id?: string,
    onChange: (() => void) | ((e: React.ChangeEvent<any>) => void),
    min?: number,
    max?: number,
    label?: string
}

const Input = ({ className, value, placeholder, type = 'text', id, onChange, min, max, label }: InputProps) => {
    const classNameString = `cmp-input__input--${type} ${className}`;
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    // there might be a better way to handle this through dynamic tags based on the type prop

    const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            onChange(e);
            if(textAreaRef?.current) {
                textAreaRef.current.style.height = 'auto';
                textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
            }
        }

    if (type === 'textarea') {
        return (
            <div className='cmp-input'>
                <label htmlFor={id}
                    className='cmp-input__label'>{label}</label>
                <textarea
                    className={classNameString}
                    onChange={handleTextAreaChange}
                    value={value}
                    id={id}
                    placeholder={placeholder}
                    ref={textAreaRef}>
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
            <label htmlFor={id}
                className='cmp-input__label'>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                className={classNameString}
                id={id}
                onChange={onChange} / >
        </div>
    );
}

export default Input;