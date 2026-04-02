import { useEffect, useState, Children } from "react";
import './carousel.scss';
import Button from "../button/button";
import useTableStore from "../../store/tableStore";


const Carousel = ({children}) => {
    const [index, setIndex] = useState(1);
    const defaultIndex = useTableStore((store) => store.carouselIndex);
    // const childrenCount = Children.count(children);

    // const updateIndex = (change) => {
    //     if(change > 0) {
    //         setIndex(prevIndex => {return Math.min(childrenCount, prevIndex + change)});
    //     }
    //     else {
    //         setIndex(prevIndex => {return Math.max(1, prevIndex + change)});
    //     }
    // }

    const getChildrenButtons = () => {
        const buttons = [];
        Children.forEach(children, (child, index) => {
            buttons.push(
                <Button
                    label={child.props.comboObj.diceString}
                    className={'no-print'}
                    onClick={() => setIndex(index+1)} 
                    key={index} />
            )
        })
        if(buttons.length < index) {
            setIndex(buttons.length);
        }
        return buttons;
    }

    useEffect(() => {
        setIndex(defaultIndex);
    }, [defaultIndex])

    return(
        <div className="cmp-carousel">
            <p>Options</p>
            <div className="cmp-carousel__buttons">
                {getChildrenButtons()}
            </div>
            {/* <p className="no-print">{index}/{childrenCount}</p> */}
            <div className={`cmp-carousel__items selected-${index}`}>
                {children}
            </div>
        </div>
    )
}

export default Carousel;