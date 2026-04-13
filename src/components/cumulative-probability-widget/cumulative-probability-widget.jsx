import './cumulative-probability-widget.scss';
import Input from "../input/input.tsx";
import React, { useEffect, useState } from 'react';

const CumulativeProbabilityWidget = ({comboObj}) => {
    const minRange = comboObj.combination.length;
    const maxRange = minRange + comboObj.count - 1;
    const [minValue, setMinValue] = useState(minRange);
    const [maxValue, setMaxValue] = useState(maxRange);

    const handleChangeMin = (e) => {
        const newValue = parseInt(e.target.value);
        if(newValue < maxValue) {
            setMinValue(newValue);
        }
    }
    
    const handleChangeMax = (e) => {
        const newValue = parseInt(e.target.value);
        if(newValue > minValue) {
            setMaxValue(newValue);
        }
    }

    useEffect(() => {
        setMinValue(minRange);
        setMaxValue(maxRange);
    }, [comboObj])

    const CumulativeProbability = React.memo(() => {
        let cumulativeProbability = 0;
        for(let i = minValue; i <= maxValue; i++) {
            cumulativeProbability += comboObj.probabilities[i];
        }
        cumulativeProbability *= 100;
        cumulativeProbability = cumulativeProbability.toFixed(2);
        return (
            <p className='cmp-cpw__cumulative-prob'>{cumulativeProbability}%</p>
        )
    }, [minRange, maxRange, minValue, maxValue, comboObj])


    return (
        <div className="cmp-cpw">
            <p className='cmp-cpw__heading'>Cumulative probability</p>
            <div className='cmp-cpw__results'>
                <p>The odds of rolling a value between</p> 
                <div className='cmp-cpw__inputs'>
                <Input
                    className={'cmp-cpw__min'}
                    type="number"
                    label="min"
                    min={minRange}
                    max={maxRange}
                    value={minValue}
                    onChange={e => handleChangeMin(e)} /> 
                    <Input
                    className={'cmp-cpw__max'}
                    type="number"
                    label="max"
                    min={minValue}
                    max={maxRange}
                    value={maxValue}
                    onChange={e => handleChangeMax(e)} /> 
                    </div>
                <CumulativeProbability />
            </div>
        </div>
    )

}

export default CumulativeProbabilityWidget;