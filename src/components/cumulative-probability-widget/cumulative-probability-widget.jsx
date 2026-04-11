import Input from "../input/input";

const CumulativeProbabilityWidget = ({min, max}) => {


    return (
        <div className="cmp-cumulative-probability-widget">
            <Input
                type="number"
                label="min"
                min={min}
                max={max} />

        </div>
    )

}

export default CumulativeProbabilityWidget;