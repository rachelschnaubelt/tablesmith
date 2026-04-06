import { useState } from "react";

const Checkbox = ({id, name, value, label, isChecked, onChange}) => {
    const [checked, setChecked] = useState(isChecked);

    const handleChange = (e) => {
        setChecked(e.target.checked);
        onChange(e);
    }

    return (
        <div className="cmp-checkbox">
            <input type='checkbox' id={id} name={name} value={value} checked={checked} onChange={(handleChange)} />
            <label htmlFor={id}>{label}</label>
        </div>
    )
}

export default Checkbox;