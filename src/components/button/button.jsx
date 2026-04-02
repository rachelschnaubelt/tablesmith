import './button.scss';

const Button = ({ label, onClick, className }) => {
    return (
        <button
            className={`cmp-button ${className}`}
            onClick={() => {onClick()}}>
            {label}
        </button>)
}

export default Button;