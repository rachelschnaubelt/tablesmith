import './distribution-chart.scss';
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";
import { RechartsDevtools } from '@recharts/devtools';
import React from 'react';

const DistributionChart = React.memo(({ comboObj }) => {

    const data = Object.keys(comboObj.probabilities).map(key => {
        return {
            name: key,
            uv: (comboObj.probabilities[key] * 100).toFixed(2)
        };
    });

    const customTooltip = ({ payload, label, active }) => {
        if (active && payload && payload.length) {
            return (
                <div
                    className="custom-tooltip"
                    style={{
                        border: '1px solid #d88488',
                        backgroundColor: '#fff2e0',
                        padding: '10px',
                        borderRadius: '5px',
                        boxShadow: '1px 1px 2px #d88488',
                    }}
                >
                    <p className="desc" style={{ margin: '0', borderTop: '1px dashed #f5f5f5' }}>
                        Probability: {payload[0].value}%
                    </p>
                    <p className="desc" style={{ margin: '0', borderTop: '1px dashed #f5f5f5' }}>
                        Number of ways to roll: {comboObj.distribution[label]}
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