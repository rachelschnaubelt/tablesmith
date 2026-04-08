import './card.scss';

const Card = ({ heading, children, cta }) => {

    return (
        <div className='cmp-card'>
            <p className='cmp-card__heading'>{heading}</p>
            <div className='cmp-card__contents'>
                {children}
            </div>
            <div className="cmp-card__ctas">
                {cta}
            </div>
        </div>
    )
}

export default Card;