import notifier from 'node-notifier';
import config from './config.js';

const runLotto = (low, high, numPicks, numDraws, drawType, minConsecutive) => {
    const results = [high],
    displayResults = [],
    accumFactor = 10,
    lastNum = {
        num: 0,
        curInRow: 1
    };

    let draw,
        drawsMet = 0,
        drawTypeText = "Draw";

    switch (drawType) {
        case 'accum':
            drawTypeText = "Accumulator";
            break;
        case 'accumax':
            drawTypeText = "Max Accumulator";
            break;
        case 'mincon':
            drawTypeText = "Minimum Consecutive";
            break;
    }

    for (let count = 0; count < high; count++) {
        results[count] = {ball: count + parseInt(low)};
        if (drawType != 'mincon') {
            results[count].score = 0;
        }
        if (drawType == 'accumax' || drawType == 'mincon') {
            results[count].maxInRow = 1;
        }
    }

    if (drawType != 'mincon') {
        console.log(`\n${drawTypeText}\nLow ball: ${low}\nHigh ball: ${high}\nNumber of picks: ${numPicks}\nNumber of draws: ${numDraws}`);
    } else {
        console.log(`\n${drawTypeText}\nLow ball: ${low}\nHigh ball: ${high}\nNumber of picks: ${numPicks}\nMin consecutive draws: ${minConsecutive}`);
    }


    switch (drawType) {
        case 'draw':
            for (let count = 0; count < numDraws; count++) {
                draw = Math.round(Math.random() * (high - low));
                results[draw].score++;
            }
            break;
        case 'accum':
        case 'accumax':
            for (let count = 0; count < numDraws; count++) {
                draw = Math.round(Math.random() * (high - low));
                if (draw == lastNum.num) {
                    results[draw].score += lastNum.score;
                    lastNum.score *= accumFactor;
                    if (drawType == 'accumax') {
                        lastNum.curInRow ++;
                        if (results[draw].maxInRow < lastNum.curInRow) {
                            results[draw].maxInRow = lastNum.curInRow;
                        }
                    }
                } else {
                    lastNum.curInRow = 1;
                    lastNum.num = draw;
                    lastNum.score = 1;
                }
            }
            break;
        case 'mincon':
            lastNum.curInRow = 1;
            while (drawsMet < numPicks) {
                draw = Math.round(Math.random() * (high - low));
                if (draw == lastNum.num) {
                    if (results[draw].maxInRow < minConsecutive) {
                        lastNum.curInRow++;
                        results[draw].maxInRow = lastNum.curInRow;
                        if (results[draw].maxInRow == minConsecutive) {
                            drawsMet++;
                            console.log(`\nPicked ${drawsMet} of ${numPicks} numbers`);
                            lastNum.curInRow = 1;
                        }
                    }
                } else {
                    lastNum.num = draw;
                    lastNum.curInRow = 1;
                }
            }
            break;
        }

    results.sort((a, b) => b.score - a.score);

    if (drawType == 'accumax') {
        results.sort((a, b) => b.maxInRow - a.maxInRow);
    }

    if (drawType == 'mincon') {
        results.sort((a, b) => b.maxInRow - a.maxInRow);
    }

    for (let count = 0; count < numPicks; count++) {
        displayResults.push(results[count]);
    }

    if (drawType != 'mincon') {
        displayResults.sort((a, b) => a.ball - b.ball);
    }

    console.log(displayResults);
};

const showHelp = () => {
    console.log(
        `\nUsage: node lotto.js {low ball} {high ball} {number of picks} {number of draws} {drawType: draw|accum|accumax|mincon} {min consecutive picks}\n`,
        `\nDefaults: {low ball: ${config.low}} {high ball: ${config.high}} {number of picks: ${config.numPicks}} {number of draws: ${config.numDraws}} {drawType: ${config.drawType}} {minConsecutive: ${config.minConsecutive}}`,
        `\nDraw (draw) mode just picks a number and increments the score of the associated ball each time it is picked`,
        `\nAccumulator (accum) mode applies a multiplier to consecutive picks, giving a higher score to balls that show up multipled times in a row`,
        `\nMax Accumulator (accumax) mode is the same as accumulator, but ranks results by concurrent draws, not by score`,
        `\nIn Minimum Consecutive (mincon) mode number of draws is irrelevant, as draws will continue until the desired number of picks has been met in concurrent draws`,
        `\nIn other draw modes, min consecutive picks is not a required param, as the draws will continue until the specified number of draws`
    );
};

const inputError = (low, high, numPicks, numDraws, drawType, minConsecutive) => {
    if(parseInt(low) < 0 ||
        parseInt(high) < 0 ||
        parseInt(numPicks) < 0 ||
        parseInt(numDraws) < 0 ||
        parseInt(minConsecutive) < 0
    ) {
        return true;
    }
    if (parseInt(low) > parseInt(high)) {
        console.log('Low ball cannot be higher than high ball');
        return true;
    }
    return false;
};

const formatTime = (duration) => {
    let milliseconds = parseInt((duration % 1000)),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
};

const lotto = () => {
    const low = process.argv[2] || config.low || 1,
        high = process.argv[3] || config.high || 59,
        numPicks = process.argv[4] || config.numPicks || 6,
        numDraws = process.argv[5] || config.numDraws || 1000000000, // takes about 16 secs per 1000000000 on draw or 1:07 accumulator
        drawType = process.argv[6] || config.drawType || 'draw',
        minConsecutive = process.argv[7] || config.minConsecutive || 5; // minimum consecutive draws in mincon mode
    if (process.argv[2] == '--help' || process.argv[2] == '--h' || process.argv[2] == '-h' || process.argv[2] == '-?') {
        showHelp();
    } else {
        if (inputError(low, high, numPicks, numDraws, drawType)) {
            notifier.notify(
                {
                    title: 'Error',
                    message: 'Invalid input params',
                    timeout: 3,
                    icon: 'Terminal Icon',
                    sound: 'Hero',
                }
            );
            showHelp();
        } else {
            const startTime = new Date().getTime(),
                results = runLotto(low, high, numPicks, numDraws, drawType, minConsecutive),
                endTime = formatTime(parseInt(new Date().getTime()) - parseInt(startTime));

            notifier.notify(
                {
                    title: 'Complete',
                    message: 'Completed in: ' + endTime,
                    timeout: 3,
                    icon: 'Terminal Icon',
                    sound: 'Glass',
                }
            );

            console.log(`Execution time: ${endTime}`);
        }
    }
};

lotto();
