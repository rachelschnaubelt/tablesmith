import useTableStore from "../../../store/tableStore";
import Gallery from "../../gallery/gallery";
import Modal from "../../modal/modal";

const LoadModal = () => {
    const loadModalOpen = useTableStore((state) => state.loadModalOpen);
    const { setLoadModalOpen } = useTableStore.getState();

    return (
        <Modal
            className='modal--load'
            modalOpen={loadModalOpen}
            modalHandler={setLoadModalOpen}
            heading={'Load'}>
            <Gallery />
        </Modal>
    )
}

export default LoadModal;