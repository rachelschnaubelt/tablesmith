import { CheckFatIcon, CheckIcon, ChecksIcon } from '@phosphor-icons/react';
import './checkbox.scss';
import { useState } from "react";

const Checkbox = ({ id, name, value, label, isChecked, onChange, type, icon }) => {
    const [checked, setChecked] = useState(isChecked);

    const handleChange = (e) => {
        setChecked(e.target.checked);
        onChange(e);
    }

    return (
        <div className={`cmp-checkbox ${type ? `cmp-checkbox--${type}` : ''}`}>
            <input
                className='cmp-checkbox__checkbox'
                type='checkbox' id={id} name={name} value={value} checked={checked} onChange={(handleChange)} />
            <label
                className='cmp-checkbox__label'
                htmlFor={id}>
                <CheckFatIcon className="cmp-checkbox__checked-icon" weight='fill' size={16} />
                {icon}
                <p>
                    {label}
                </p>
            </label>
        </div>
    )
}

export default Checkbox;