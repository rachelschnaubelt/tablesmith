import './cumulative-probability-widget.scss';
import Input from "../input/input";
import React, { useState } from 'react';

const CumulativeProbabilityWidget = ({comboObj}) => {
    const minRange = comboObj.combination.length;
    const maxRange = minRange + comboObj.count - 1;
    const [minValue, setMinValue] = useState(minRange);
    const [maxValue, setMaxValue] = useState(maxRange);

    const handleChangeMin = (e) => {
        const newValue = e.target.value;
        if(newValue < maxValue) {
            setMinValue(e.target.value);
        }
    }
    
    const handleChangeMax = (e) => {
        const newValue = e.target.value;
        if(newValue > minValue) {
            setMaxValue(e.target.value);
        }
    }

    const CumulativeProbability = React.memo(() => {
        let cumulativeProbability = 0;
        for(let i = minValue; i <= maxValue; i++) {
            cumulativeProbability += comboObj.probabilities[i];
        }
        cumulativeProbability *= 100;
        cumulativeProbability = cumulativeProbability.toFixed(2);
        return (
            <p>{cumulativeProbability}%</p>
        )
    }, [minValue, maxValue, comboObj])


    return (
        <div className="cmp-cpw">
            <div className='cmp-cpw__inputs'>
                <Input
                    className={'cmp-cpw__min'}
                    type="number"
                    label="min"
                    min={minRange}
                    max={maxRange}
                    value={minValue}
                    onChange={handleChangeMin} />
                <Input
                    className={'cmp-cpw__max'}
                    type="number"
                    label="max"
                    min={minValue}
                    max={maxRange}
                    value={maxValue}
                    onChange={(handleChangeMax)} />
            </div>
            <div className='cmp-cpw__results'>
                <p>The odds of rolling a value between {minValue} and {maxValue} are</p>
                <CumulativeProbability />
            </div>
        </div>
    )

}

export default CumulativeProbabilityWidget;