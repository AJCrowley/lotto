const config = {
    drawType: 'draw',
    minConsecutive: 6,
    low: 1,
    high: 59,
    numPicks: 6,
    numDraws: 5000000000,
    accumFactor: 100,
    presets: [
        {
            id: 'lotto',
            name: 'UK Lotto Draw',
            draws: [
                {
                    drawType: 'draw',
                    low: 1,
                    high: 59,
                    numPicks: 6,
                    numDraws: 500000000
                }
            ]
        },
        {
            id: 'lottomc',
            name: 'UK Lotto Minimum Consecutive Draws',
            draws: [
                {
                    drawType: 'mincon',
                    low: 1,
                    high: 59,
                    numPicks: 6,
                    minConsecutive: 6
                }
            ]
        },
        {
            id: 'sfl',
            name: 'Set For Life Draw',
            draws: [
                {
                    drawType: 'draw',
                    low: 1,
                    high: 47,
                    numPicks: 5,
                    numDraws: 500000000
                },
                {
                    drawType: 'draw',
                    low: 1,
                    high: 10,
                    numPicks: 1,
                    numDraws: 500000000
                }
            ]
        },
        {
            id: 'sflmc',
            name: 'Set For Life Minimum Consecutive Draws',
            draws: [
                {
                    drawType: 'mincon',
                    low: 1,
                    high: 47,
                    numPicks: 5,
                    minConsecutive: 6
                },
                {
                    drawType: 'mincon',
                    low: 1,
                    high: 10,
                    numPicks: 1,
                    minConsecutive: 6
                }
            ]
        },
        {
            id: 'euro',
            name: 'EuroMillions Draw',
            draws: [
                {
                    drawType: 'draw',
                    low: 1,
                    high: 50,
                    numPicks: 5,
                    numDraws: 500000000
                },
                {
                    drawType: 'draw',
                    low: 1,
                    high: 12,
                    numPicks: 2,
                    numDraws: 500000000
                }
            ]
        },
        {
            id: 'euromc',
            name: 'EuroMillions Minimum Consecutive Draws',
            draws: [
                {
                    drawType: 'mincon',
                    low: 1,
                    high: 50,
                    numPicks: 5,
                    minConsecutive: 6
                },
                {
                    drawType: 'mincon',
                    low: 1,
                    high: 12,
                    numPicks: 2,
                    minConsecutive: 6
                }
            ]
        }
    ]
};

export default config;
