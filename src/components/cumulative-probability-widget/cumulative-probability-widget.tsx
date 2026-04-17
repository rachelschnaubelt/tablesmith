import './cumulative-probability-widget.scss';
import Input from "../input/input.tsx";
import React, { useEffect, useMemo, useState } from 'react';
import { ComboObject } from '../../types/types.tsx';
import { snakeCaseString } from '../../utils/stringUtils.ts';

const CumulativeProbabilityWidget = ({comboObj}: {comboObj: ComboObject}) => {
    const minRange = comboObj.combination.length;
    const maxRange = minRange + comboObj.count - 1;
    const [minValue, setMinValue] = useState<number>(minRange);
    const [maxValue, setMaxValue] = useState<number>(maxRange);
    const id = `cmp-cpw__${snakeCaseString(comboObj.diceString)}`;

    const handleChangeMin = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value);
        if(newValue < maxValue) {
            setMinValue(newValue);
        }
    }
    
    const handleChangeMax = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value);
        if(newValue > minValue) {
            setMaxValue(newValue);
        }
    }

    useEffect(() => {
        setMinValue(minRange);
        setMaxValue(maxRange);
    }, [comboObj])

    const CumulativeProbability = useMemo(() => {
        let cumulativeProbability = 0;
        for(let i = minValue; i <= maxValue; i++) {
            cumulativeProbability += comboObj.probabilities[i];
        }
        cumulativeProbability *= 100;
        cumulativeProbability = parseFloat(cumulativeProbability.toFixed(2));
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
                    onChange={e => handleChangeMin(e)}
                    id={`${id}__min`} /> 
                <Input
                    className={'cmp-cpw__max'}
                    type="number"
                    label="max"
                    min={minValue}
                    max={maxRange}
                    value={maxValue}
                    onChange={e => handleChangeMax(e)}
                    id={`${id}__max`}/> 
                    </div>
                {CumulativeProbability}
            </div>
        </div>
    )

}

export default CumulativeProbabilityWidget;