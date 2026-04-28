import useTableStore from "../../../store/tableStore";
import Modal from "../../modal/modal";

const AboutModal = () => {
    const { setAboutModalOpen } = useTableStore.getState();
    const aboutModalOpen = useTableStore((state) => state.aboutModalOpen);

    return (
        <Modal
            className='modal--about'
            modalOpen={aboutModalOpen}
            modalHandler={setAboutModalOpen}
            heading={'About TableSmith'}>
            <div>
                <p>
                    TableSmith started from a question:
                </p>
                <p>
                    "Is there a way I can roll dice for any random number of items?"
                </p>
                <p>
                    Turns out, the answer is yes!
                </p>
                <p>
                    TableSmith does the math for you to find which combinations cover exactly the number of options you provide and provides insight into the tradeoffs of different combinations. This way, all you have to do is make the table and then roll the dice!
                </p>
                <p>
                    I built this with four core tenets:
                </p>
                <ol>
                    <li>
                        Approachable: the math is done for you, so all you have to do is bring the ideas
                    </li>
                    <li>
                        Physical: the output is always something you can do with real dice
                    </li>
                    <li>
                        Informed: the math and stats are there if you want them
                    </li>
                    <li>
                        Flexible: combinations of dice can be put together to capture any number of options
                    </li>
                </ol>
                <p>
                    I'm a nerd at heart, really into TTRPGs, so that's where this originated. The idea of a loot table for 13 items or an oracle table with 28 options really drove this tool into existence. But as I worked on it, I realized that it could be useful for so many other situations. Families trying to decide where to eat for dinner, teachers choosing activities or students to call on, or anyone who wants to leave a decision to fate.
                </p>
                <p>
                    Use TableSmith to forge your tables, spark ideas, and have fun!
                </p>
            </div>
        </Modal>
    )
}

export default AboutModal;