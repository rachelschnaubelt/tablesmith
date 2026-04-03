import { useEffect, useState, Children, useRef } from "react";
import './carousel.scss';
import Button from "../button/button";
import useTableStore from "../../store/tableStore";


const Carousel = ({children}) => {
    const [index, setIndex] = useState(1);
    const defaultIndex = useTableStore((store) => store.carouselIndex);
    const buttonContainerRef = useRef(null);
    // const childrenCount = Children.count(children);

    // const updateIndex = (change) => {
    //     if(change > 0) {
    //         setIndex(prevIndex => {return Math.min(childrenCount, prevIndex + change)});
    //     }
    //     else {
    //         setIndex(prevIndex => {return Math.max(1, prevIndex + change)});
    //     }
    // }

    const setActiveButton = (index) => {
        const buttonsContainer = buttonContainerRef.current;
        if (buttonsContainer) {
            const buttons = buttonsContainer.children;
            for(const button of buttons) {
                if(button.classList.contains(`combo-button-${index}`)) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            }
        }
    }

    const handleUpdateIndex = (idx) => {
        setIndex(idx);
        setActiveButton(idx);
    }

    const getChildrenButtons = () => {
        const buttons = [];
        Children.forEach(children, (child, index) => {
            buttons.push(
                <Button
                    label={child.props.comboObj.diceString}
                    className={`no-print combo-button-${index+1}`}
                    onClick={() => handleUpdateIndex(index+1)} 
                    key={index} />
            )
        })
        if(buttons.length < index) {
            setIndex(buttons.length);
            setActiveButton(buttons.length);
        }
        return buttons;
    }

    useEffect(() => {
        setIndex(defaultIndex);
        setActiveButton(defaultIndex);
    }, [defaultIndex])

    return(
        <div className="cmp-carousel">
            <p>Options</p>
            <div 
                className="cmp-carousel__buttons"
                ref={buttonContainerRef}>
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