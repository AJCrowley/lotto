import config from './config.js';

const runLotto = (low, high, numPicks, numDraws, drawType, minConsecutive) => {
    const results = [high],
        displayResults = [],
        accumFactor = config.accumFactor,
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
    },

    showHelp = (low, high, numPicks, numDraws, drawType, minConsecutive) => {
        console.log(
            `\nUsage: node lotto.js [-p] {low ball} {high ball} {number of picks} {number of draws} {drawType: draw|accum|accumax|mincon} {min consecutive picks}\n`,
            `\nDefaults: {low ball: ${low}} {high ball: ${high}} {number of picks: ${numPicks}} {number of draws: ${numDraws}} {drawType: ${drawType}} {minConsecutive: ${minConsecutive}}`,
            `\nDraw (draw) mode just picks a number and increments the score of the associated ball each time it is picked`,
            `\nAccumulator (accum) mode applies a multiplier to consecutive picks, giving a higher score to balls that show up multipled times in a row`,
            `\nMax Accumulator (accumax) mode is the same as accumulator, but ranks results by concurrent draws, not by score`,
            `\nIn Minimum Consecutive (mincon) mode number of draws is irrelevant, as draws will continue until the desired number of picks has been met in concurrent draws`,
            `\nIn other draw modes, min consecutive picks is not a required param, as the draws will continue until the specified number of draws`,
            `\nIf the -p flag has been added, the only other param required is the id word from the config file for the desired draw format`,
            `\ne.g. node lotto.js -p presetId`
        );
    },

    inputError = (low, high, numPicks, numDraws, drawType, minConsecutive) => {
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
    },

    formatTime = (duration) => {
        let milliseconds = parseInt((duration % 1000)),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    },

    runPreset = (preset) => {
        const presets = config.presets.find(element => element.id == preset),
            startTime = new Date().getTime(),
            runCount = parseInt(process.argv[4]);
        let results,
            message = `\nRunning preset script for ${presets.name}`;
        if (!isNaN(runCount)) {
            message += ` ${runCount} times`;
            console.log(message);
            for (let runTimes = 0; runTimes < runCount; runTimes++) {
                for (let count = 0; count < presets.draws.length; count++) {
                    results = runLotto(presets.draws[count].low, presets.draws[count].high, presets.draws[count].numPicks, presets.draws[count].numDraws, presets.draws[count].drawType, presets.draws[count].minConsecutive);
                }
            }
        } else {
            console.log(message);
            for (let count = 0; count < presets.draws.length; count++) {
                results = runLotto(presets.draws[count].low, presets.draws[count].high, presets.draws[count].numPicks, presets.draws[count].numDraws, presets.draws[count].drawType, presets.draws[count].minConsecutive);
            }
        }

        const endTime = formatTime(parseInt(new Date().getTime()) - parseInt(startTime));
        console.log(`Execution time: ${endTime}`);
    },

    lotto = () => {
        const low = process.argv[2] || config.low || 1,
            high = process.argv[3] || config.high || 59,
            numPicks = process.argv[4] || config.numPicks || 6,
            numDraws = process.argv[5] || config.numDraws || 1000000000, // takes about 16 secs per 1000000000 on draw or 1:07 accumulator
            drawType = process.argv[6] || config.drawType || 'draw',
            minConsecutive = process.argv[7] || config.minConsecutive || 5; // minimum consecutive draws in mincon mode
        if (process.argv[2] == '-p') {
            runPreset(process.argv[3]);
            return;
        } else {
            if (process.argv[2] == '--help' || process.argv[2] == '--h' || process.argv[2] == '-h' || process.argv[2] == '-?') {
                showHelp(low, high, numPicks, numDraws, drawType, minConsecutive);
                return;
            } else {
                if (inputError(low, high, numPicks, numDraws, drawType)) {
                    showHelp(low, high, numPicks, numDraws, drawType, minConsecutive);
                    return;
                }
                const startTime = new Date().getTime(),
                    results = runLotto(low, high, numPicks, numDraws, drawType, minConsecutive),
                    endTime = formatTime(parseInt(new Date().getTime()) - parseInt(startTime));

                console.log(`Execution time: ${endTime}`);
            }
        }
    };

lotto();
