import './modal.scss';
import Button from '../button/button';
import useTableStore from '../../store/tableStore';

const Modal = ({children, modalOpen}) => {
    const setModalOpen = useTableStore((state) => state.setModalOpen);
    return(
        <div className={`cmp-modal cmp-modal--${modalOpen ? 'open' : 'closed'}`}>
            <Button
                label={'close'}
                onClick={() => {setModalOpen(false)}} />
            {children}
        </div>
    )
}

export default Modal;