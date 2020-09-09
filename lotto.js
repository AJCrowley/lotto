import notifier from 'node-notifier';

const runLotto = (low, high, numPicks, numDraws, drawType) => {
    const results = [high],
    displayResults = [],
    accumFactor = 100,
    lastNum = {
        num: 0,
        score: 1
    };

    let draw;

    console.log(`\n${(drawType == 'accum' ? 'Accumulator' : 'Draw')}\nLow ball: ${low}\nHigh ball: ${high}\nNumber of picks: ${numPicks}\nNumber of draws: ${numDraws}`);

    for (let count = 0; count < high; count++) {
        results[count] = {ball: count + parseInt(low), score: 0};
    }

    if (drawType == 'accum') {
        for (let count = 0; count < numDraws; count++) {
            draw = Math.round(Math.random() * (high - low));
            if (draw == lastNum.num) {
                results[draw].score += lastNum.score;
                lastNum.score *= accumFactor;
            } else {
                lastNum.num = draw;
                lastNum.score = 1;
            }
        }
    } else {
        for (let count = 0; count < numDraws; count++) {
            draw = Math.round(Math.random() * (high - low));
            results[draw].score++;
        }
    }

    results.sort((a, b) => b.score - a.score);

    for (let count = 0; count < numPicks; count++) {
        displayResults.push(results[count]);
    }

    displayResults.sort((a, b) => a.ball - b.ball);

    console.log(displayResults);
};

const showHelp = () => {
    console.log(
        'Usage: node lotto.js {low ball} {high ball} {number of picks} {number of draws} {drawType: draw|accum}\n',
        'Defaults: {low ball: 1} {high ball: 59} {number of picks: 6} {number of draws: 1000000000} {draw}'
    );
};

const inputError = (low, high, numPicks, numDraws, drawType) => {
    if(parseInt(low) < 0 ||
        parseInt(high) < 0 ||
        parseInt(numPicks) < 0 ||
        parseInt(numDraws) < 0
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
    const low = process.argv[2] || 1,
        high = process.argv[3] || 59,
        numPicks = process.argv[4] || 6,
        numDraws = process.argv[5] || 1000000000, // takes about 16 secs per 1000000000 on draw or 1:07 accumulator
        drawType = process.argv[6] || 'draw';
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
                results = runLotto(low, high, numPicks, numDraws, drawType),
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
