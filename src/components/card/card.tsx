import { ReactNode } from 'react';
import './card.scss';

interface CardProps {
    heading: string,
    children: ReactNode,
    cta: ReactNode
}

const Card = ({ heading, children, cta }: CardProps) => {

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