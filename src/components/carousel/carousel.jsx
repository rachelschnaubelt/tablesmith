import { useEffect, useState, Children, useRef } from "react";
import './carousel.scss';
import Button from "../button/button";
import useTableStore from "../../store/tableStore";


const Carousel = ({children}) => {
    const [index, setIndex] = useState(1);
    const defaultIndex = useTableStore((store) => store.carouselIndex);
    const buttonContainerRef = useRef(null);

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
                    className={`combo-button-${index+1}`}
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
            <div className="cmp-carousel__header no-print">
                <p>Possible dice combinations</p>
                <div 
                    className="cmp-carousel__buttons"
                    ref={buttonContainerRef}>
                    {getChildrenButtons()}
                </div>
            </div>
            <div className={`cmp-carousel__items selected-${index}`}>
                {children}
            </div>
        </div>
    )
}

export default Carousel;