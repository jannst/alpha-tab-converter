import {tabLinePattern} from "./Scales";
import {processTabBlock} from "./TabProcessor";

export function convertToAlphaTab(inputText: string, chromaticNoteName: string[]) {
    let outArray: string[] = [];
    const inputLines = inputText.split('\n').map(line => line.trim());

    //find text lines which describe 'tab' and group them together
    let currentBlock: string[] = [];
    let currentBlockLength = 0;
    for (let i = 0; i < inputLines.length; i++) {
        const match = inputLines[i].match(tabLinePattern);
        if (match) {
            if (currentBlock.length) {
                if (match[0].length === currentBlockLength) {
                    //append a line to the current block
                    currentBlock.push(inputLines[i]);
                } else {
                    //the line does not match the length of the current block.
                    //process the current block and create a new one
                    outArray.push(...processTabBlock(currentBlock, currentBlockLength, chromaticNoteName));
                    currentBlock= [inputLines[i]];
                    currentBlockLength = match[0].length;
                }
            } else {
                currentBlock= [inputLines[i]];
                currentBlockLength = match[0].length;
            }
        } else {
            if(currentBlock.length) {
                //the current line does not match the regexp for tab lines but there is an active block
                //process the block and then append the text line
                outArray.push(...processTabBlock(currentBlock, currentBlockLength, chromaticNoteName));
                currentBlock = [];
                currentBlockLength = 0;
            }
            outArray.push(inputLines[i])
        }
    }

    //if there is and active block after loop finish add it to the output
    if(currentBlock.length) {
        outArray.push(...processTabBlock(currentBlock, currentBlockLength, chromaticNoteName));
    }
    return outArray;
}