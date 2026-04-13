import { useEffect, useState, Children, useRef } from "react";
import './carousel.scss';
import Button from "../button/button.tsx";
import useTableStore from "../../store/tableStore";


const Carousel = ({ children }) => {
    const { setSidebarOpen, addEntry, setCarouselIndex } = useTableStore.getState();
    const carouselIndex = useTableStore((store) => store.carouselIndex);
    const buttonContainerRef = useRef(null);
    const entryCount = useTableStore((state) => state.entryCount);

    const setActiveButton = async (index) => {
        const buttonsContainer = buttonContainerRef.current;
        if (buttonsContainer) {
            const buttons = await buttonsContainer.children;
            for (const button of buttons) {
                if (button.classList.contains(`combo-button-${index}`)) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            }
        }
    }

    const handleUpdateIndex = (idx) => {
        setCarouselIndex(idx);
        setActiveButton(idx);
    }

    const getChildrenButtons = () => {
        const buttons = [];
        Children.forEach(children, (child, index) => {
            if (child.props.comboObj) {
                buttons.push(
                    <Button
                        label={child.props.comboObj.diceString}
                        className={`combo-button-${index + 1}`}
                        onClick={() => handleUpdateIndex(index + 1)}
                        key={index} />
                )
            }
        })
        let buttonIndex = carouselIndex;
        if (buttons.length < carouselIndex) {
            buttonIndex = buttons.length;
            setCarouselIndex(buttonIndex);
        }
        setActiveButton(buttonIndex || 1);
        if (buttons.length <= 0) {
            return <div className="cmp-carousel__warning">
                <p>There is no way to create a combination of the selected dice for {entryCount} items.</p>
            <p><span className='action-text' onClick={() => {setSidebarOpen(true)}}>Change your selected dice</span>,&nbsp; 
            <span className="action-text" onClick={() => {addEntry()}}>add an item</span>, or remove an from the list.</p>
            </div>
        }
        return buttons;
    }

    useEffect(() => {
        setActiveButton(carouselIndex);
    }, [carouselIndex]);

    return (
        <div className="cmp-carousel">
            <div className="cmp-carousel__header no-print">
                <p className="cmp-carousel__heading">Possible dice combinations</p>
                <div
                    className="cmp-carousel__buttons"
                    ref={buttonContainerRef}>
                    {getChildrenButtons()}
                </div>
            </div>
            <div className={`cmp-carousel__items selected-${carouselIndex || 1}`}>
                {children}
            </div>
        </div>
    )
}

export default Carousel;