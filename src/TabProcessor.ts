import {chromaticScaleFlatsUpperCase, chromaticScaleSharps, tabLinePattern} from "./Scales";

const SEPARATOR = '-';

/**
 * All lines of the input array must be of the same length
 * Every line must match the tabLinePattern RegExp defined in Scales.ts
 * @param inputLines
 * @param blockLength
 * @param chromaticNoteName
 */
export function processTabBlock(inputLines: string[], blockLength: number, chromaticNoteName: string[]) {
    const keyOffsets = inputLines.map(line => {
        let keyName = line.match(tabLinePattern)![2].toUpperCase().trim();
        if (chromaticScaleFlatsUpperCase.indexOf(keyName) >= 0) {
            return chromaticScaleFlatsUpperCase.indexOf(keyName);
        } else if (chromaticScaleSharps.indexOf(keyName) >= 0) {
            return chromaticScaleSharps.indexOf(keyName);
        } else {
            throw new Error("could not find key for " + keyName);
        }
    });

    let output: string[] = inputLines.map(_ => "");

    let prevRead: (string | null)[] | null = null;
    for (let i = 0; i < blockLength; i++) {
        let latestRead: (string | null)[] | null = [];
        for (let j = 0; j < inputLines.length; j++) {
            const line = inputLines[j];
            if (prevRead && prevRead[j] && prevRead[j]!.length > 1) {
                //the last time we read from this line there was a two digit number
                //ignore this line for this iteration
                latestRead.push(null);
                continue;
            }
            const match = line.slice(i).match(/^\d+/);
            if (match) {
                //if there was a number read directly before the current character
                //treat it like single numbers
                latestRead.push(parseFretNumberString(match[0], !!prevRead && !!prevRead[j]));
            } else {
                latestRead.push(null);
            }
        }

        let latestNotes = latestRead.map((fretNumber, index) =>
            fretNumber ? convertFretNumberToNote(fretNumber, keyOffsets[index], chromaticNoteName) : null)

        const noteWithTwoChars = latestNotes.some(note => note && note.length > 1)
        const prevReadHadTwoDigitNumber = prevRead && prevRead.some(note => note && note.length > 1)

        if (!latestNotes.every(note => note === null) || !prevReadHadTwoDigitNumber) {
        for (let index = 0; index < latestNotes.length; index++) {
            const note = latestNotes[index];
            if (note) {
                output[index] += note;
                if (note.length < 2 && noteWithTwoChars) {
                    output[index] += SEPARATOR;
                }
            } else {
                if (prevRead && prevRead[index] && prevRead[index]!.length > 1) {
                    //the last time we read from this line there was a two digit number
                    //ignore the current character and place a seperatore
                    output[index] += SEPARATOR;
                } else {
                    output[index] += inputLines[index].slice(i, i + 1);
                }
                if (noteWithTwoChars) {
                    output[index] += SEPARATOR;
                }
            }
        }
    }
        prevRead = latestRead;
    }

    //add comments and stuff written after the actual tab back to the output
    inputLines.forEach((line, index) => {
        if(line.length > blockLength) {
            output[index] += line.slice(blockLength);
        }
    })
    return output
}

function parseFretNumberString(fretNumberString: string, lastReadNumber: boolean = false) {
    if (fretNumberString.length > 2 || parseInt(fretNumberString) > 24 || lastReadNumber) {
        //in this case we have multiple numbers right behind each other without separator
        //most guitars no not have more than 24 frets
        //only process first number
        return fretNumberString.slice(0, 1)
    } else {
        return fretNumberString;
    }
}

function convertFretNumberToNote(fretNumberString: string, keyOffset: number, chromaticNoteName: string[]) {
    const fretNumber = parseInt(fretNumberString);
    const note = chromaticNoteName[(keyOffset + fretNumber) % 12]
    return fretNumber >= 12 ? note.toLowerCase() : note;
}