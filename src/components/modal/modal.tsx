import './modal.scss';
import Button from '../button/button.tsx';
import { XIcon } from '@phosphor-icons/react';
import { ReactNode, useEffect, useRef } from 'react';
import { returnFocusToId } from '../../utils/focusUtils.ts';
import useTableStore from '../../store/tableStore.ts';

interface ModalProps {
    children: ReactNode,
    modalOpen: boolean,
    heading: string,
    className: string,
    modalHandler: (input: boolean) => void
}

const Modal = ({ children, modalOpen, heading, className, modalHandler }: ModalProps) => {
    const { focusReturn } = useTableStore.getState();
    const modalRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const escapeHandler = (e: KeyboardEvent) => {
            if(e.key === 'Escape') {
                modalHandler(false);
                console.log('escape');
            }
        }

        if (modalOpen && modalRef?.current) {
            modalRef.current.focus();
            document.addEventListener('keydown', escapeHandler)
        }

        return () => {
            returnFocusToId(focusReturn);
            document.removeEventListener('keydown', escapeHandler)
        };
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