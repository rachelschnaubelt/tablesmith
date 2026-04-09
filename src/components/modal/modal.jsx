import './modal.scss';
import Button from '../button/button';
import { XIcon } from '@phosphor-icons/react';
import { useEffect, useRef } from 'react';

const Modal = ({ children, modalOpen, heading, className, modalHandler }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        if (modalOpen) {
            modalRef.current.focus();
        }
    }, [modalOpen]);

    return (
        <>
            <dialog className={`cmp-modal cmp-modal--${modalOpen ? 'open' : 'closed'} ${className}`}
                ref={modalRef}>
                <div className='cmp-modal__heading'>
                    <p className='cmp-modal__title'>
                        {heading}
                    </p>
                    <Button
                        className={'cmp-modal__close'}
                        label={'close'}
                        onClick={() => { modalHandler(false) }}
                        type='icon'
                        icon={<XIcon size={24} />} />
                </div>
                <div className="cmp-modal__contents">
                    {children}
                </div>
            </dialog>
            <div className={`cmp-modal__backdrop cmp-modal__backdrop--${modalOpen ? 'open' : 'closed'}`}
                onClick={() => { modalHandler(false) }}></div>
        </>
    )
}

export default Modal;