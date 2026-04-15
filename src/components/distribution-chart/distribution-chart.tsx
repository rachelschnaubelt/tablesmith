import './distribution-chart.scss';
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";
import { RechartsDevtools } from '@recharts/devtools';
import React from 'react';
import { ComboObject } from '../../types/types';

const DistributionChart = React.memo(({ comboObj }: {comboObj: ComboObject}) => {

    const data = Object.keys(comboObj.probabilities).map((key) => {
        if(key) {}
        return {
            name: key,
            uv: (comboObj.probabilities[key] * 100).toFixed(2)
        };
    });

    const customTooltip = ({ payload, label, active }: any) => {
        if (active && payload && payload.length) {
            return (
                <div
                    className="custom-tooltip">
                    <p className="desc">
                        Probability: {payload[0].value}%
                    </p>
                    <p className="desc">
                        Number of ways to roll: {label && comboObj.distribution[label]}
                    </p>
                </div>
            );
        }

        return null;
    }

    return (
        <BarChart
            style={{ width: '100%', maxWidth: '300px', aspectRatio: 1.618 }}
            responsive
            data={data}
            className="cmp-distribution-chart"
        >
            <XAxis dataKey="name" />
            <YAxis dataKey="uv" />
            <Tooltip content={customTooltip} />
            <Bar dataKey="uv" fill="#8884d8" />
            <RechartsDevtools />
        </BarChart>
    )
})

export default DistributionChart;