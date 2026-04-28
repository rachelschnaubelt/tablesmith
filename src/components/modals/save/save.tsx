import useTableStore from "../../../store/tableStore";
import { ComboObject } from "../../../types/types";
import { saveTable } from "../../../utils/tableManagement";
import Button from "../../button/button";
import Modal from "../../modal/modal";

interface saveModalProps {
    comboObj: ComboObject
}

const SaveModal = ({ comboObj }: saveModalProps) => {
    const saveModalOpen = useTableStore((store) => store.saveModalOpen);
    const { setSaveModalOpen } = useTableStore.getState();
    const tableKey = useTableStore((store) => store.tableKey);


    return (
        <Modal
            className='modal--save'
            modalOpen={saveModalOpen}
            modalHandler={setSaveModalOpen}
            heading={'Save'}>
            <p>This table is already saved. Would you like to overwrite the existing save?</p>
            <div className='cmp-modal__button-group'>
                <Button
                    label='overwrite existing save'
                    onClick={() => { comboObj && saveTable(comboObj, tableKey); setSaveModalOpen(false) }} />
                <Button
                    label='save as new table'
                    hierarchy={'secondary'}
                    onClick={() => { comboObj && saveTable(comboObj); setSaveModalOpen(false) }} />
            </div>
        </Modal>
    )
}

export default SaveModal;