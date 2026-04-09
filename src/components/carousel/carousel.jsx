import { useEffect, useState, Children, useRef } from "react";
import './carousel.scss';
import Button from "../button/button";
import useTableStore from "../../store/tableStore";


const Carousel = ({ children }) => {
    const [index, setIndex] = useState(1);
    const carouselIndex = useTableStore((store) => store.carouselIndex);
    const buttonContainerRef = useRef(null);
    const entries = useTableStore((state) => state.entries);
    const setSidebarOpen = useTableStore((state) => state.setSidebarOpen);
    const addEntry = useTableStore((state) => state.addEntry);

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
        setIndex(idx);
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
        let buttonIndex = index;
        if (buttons.length < index) {
            buttonIndex = buttons.length;
            setIndex(buttonIndex);
        }
        setActiveButton(buttonIndex || 1);
        if (buttons.length <= 0) {
            return <div className="cmp-carousel__warning">
                <p>There is no way to create a combination of the selected dice for {entries.length} items.</p>
            <p><span className='action-text' onClick={() => {setSidebarOpen(true)}}>Change your selected dice</span>,&nbsp; 
            <span className="action-text" onClick={() => {addEntry()}}>add an item</span>, or remove an from the list.</p>
            </div>
        }
        return buttons;
    }

    useEffect(() => {
        console.log('loaded');
        setIndex(carouselIndex);
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
            <div className={`cmp-carousel__items selected-${index || 1}`}>
                {children}
            </div>
        </div>
    )
}

export default Carousel;