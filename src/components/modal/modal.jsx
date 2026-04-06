import './modal.scss';
import Button from '../button/button';
import useTableStore from '../../store/tableStore';
import { XIcon } from '@phosphor-icons/react';

const Modal = ({children, modalOpen}) => {
    const setModalOpen = useTableStore((state) => state.setModalOpen);
    return(
        <div className={`cmp-modal cmp-modal--${modalOpen ? 'open' : 'closed'}`}>
            <Button
                className={'cmp-modal__close'}
                label={'close'}
                onClick={() => {setModalOpen(false)}}
                type='icon'
                icon={<XIcon size={32} />} />
            {children}
        </div>
    )
}

export default Modal;