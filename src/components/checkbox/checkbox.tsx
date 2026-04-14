import { CheckFatIcon } from '@phosphor-icons/react';
import './checkbox.scss';
import React, { ReactNode, useState } from "react";

interface CheckboxProps {
    id: string,
    name: string,
    value: string,
    label: string,
    isChecked: boolean,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    type?: string,
    icon?: string | ReactNode
}

const Checkbox = ({ id, name, value, label, isChecked, onChange, type, icon }: CheckboxProps) => {
    const [checked, setChecked] = useState(isChecked);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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