import './card.scss';
import Button from "../button/button";

const Card = ({heading, children, id}) => {
    const handleDelete = () => {
\        localStorage.removeItem(id);
    };

    return(
        <div className="cmp-card">
            <p>{heading}</p>
            {children}
            <Button 
                label={'delete'}
                onClick={handleDelete} />
        </div>
    )
}

export default Card;