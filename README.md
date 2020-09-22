# Lotto Number Chooser

## By [Kris McCann - kris@8pi.ca](mailto:kris@8pi.ca)

This program requires a version of Node.js that supports ES6. It is provided free for use, if you make any enhancements, please feel free to issue a PR and I will integrate any changes that improve the software.
## Usage:
```
node lotto.js [-h] [-p {preset} {times to run preset}] {low ball} {high ball} {number of picks} {number of draws} {drawType: draw|accum|accumax|mincon} {min consecutive picks}
```

```
node lotto.js -h
```
Will display the built in help without running a draw.

```
node lotto.js
```
Will run a draw with the default parameters as specified in the ```config.js``` file. The default settings contained therein include: low ball, high ball, number of balls to pick, draw type, and number of draws or minimum consecutive hits respectively.

The draw types are:

## Draw (```draw```)
Runs a number of random picks within the specified ranges to the number specified in numPicks. Each time a ball is picked, the score is incremented.

## Accumulator (```accum```)
As above, but each consecutive time a ball is picked the point value goes up by a factor of 100 (default specified in ```config.js``` can be easily changed to your personal tastes), so if 13 were to be picked 4 times, the score would work as follows:
1 + 100 + 10000 + 1000000

The next ball picked resets the score to 1.

## Max Accumulator (```accumax```)
Same as the accumulator mode, but instead of sorting the results by points, the results are picked primarily based on which balls received the most consecutive draws, with score as the secondary category, so if a ball has the same number of points, the one that had the most consecutive draws will win, if they have the same number of consecutive draws, the one with the most points will win.

## Minimum Consecutive (```mincon```)
In this mode a minimum consecutive is specified instead of a number of draws. Draws will take place at random until a ball has been picked the same number of times in a row as the mincon value, this ball is then considered chosen, and the process is repeated until the desired number of balls have been chosen.

## Presets in the ```config.js``` file
To run a preset, use the ```-p``` flag and the id of the preset that you wish to use, e.g.:
```
node lotto.js -p lottomc
```
You can also get the program to run the preset program multiple times by adding an integer after the name of the preset, e.g. to run the lottomc preset 3 times use the command:
```
node lotto.js -p lottomc 3
```
Because many draw types require multiple specifications (eg 5 balls from a main selection, then 2 from a lower bonus range), these draws can be programmed into the config.js file. There are plenty of examples in there to get you started based upon the UK Lottery. I have created them so that they run a good number of permutations without taking more than a minute or two to run, you can start with some low numbers on your machine to get a baseline, and multiply as you see fit to get the script to run for the approximate amount of time that you want. For most modes, this will be a straight up multiplication, but for the Minimum Consecutive mode, it will be exponential, so if there's 50 balls, the time taken for 7 consecutive will typically be around 50 times the amount required for 6 consecutive. Edit any and all parameters as you see fit.
