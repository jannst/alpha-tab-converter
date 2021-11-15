import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {Box, Flex} from "./Layout";
import {convertToAlphaTab} from "./Parser";
import {chromaticScaleFlats, chromaticScaleSharps} from "./Scales";

const GitHubBadgeBox = styled(Box)`
  position: absolute;
  right: 0;
  top: 0;
  z-index: 10;
`;

const Background = styled(Box)`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

const NoPrintBox = styled(Box)`
  @media print {
    display: none !important;
  }
`;

const InputTextArea = styled.textarea`
  width: 100%;
  height: 30vh;
  color: black;
  font-family: monospace;
  font-size: 13px;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: scroll;
`;

const OutputTextBox = styled(Box)`
  background-color: white;
  width: 100%;
  color: black;
  font-family: monospace;
  font-size: 13px;
  padding: 3px;
  overflow: auto;
  @media print {
    div {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  }
`;

const OutputText = styled.pre`
  padding: 0;
  margin: 0;
`;

const demoInput = "This is a utility for converting regular tab to AlphaTab, a format suggested by StudyBass.\n" +
    "See https://www.studybass.com/lessons/reading-music/alpha-tab/ for more information.\n" +
    "Just paste you tab right in here :)\n" +
    "\n" +
    "Formatting: Every line which should be interpreted as tablature should start with the root note of the string, \n" +
    "then a pipe (|), then the actual tablature and at the end another pipe.\n" +
    "\n" +
    "Demo:\n" +
    "G|---------------------------------------------|\n" +
    "D|------------------5----------------------17--|\n" +
    "A|--------2----5--------------14----17---------|\n" +
    "E|---3-------------------15--------------------|\n" +
    "\n" +
    "Demo in Drop D:\n" +
    "F|---------------------------------------------|\n" +
    "C|------------------5----------------------17--|\n" +
    "G|--------2----5--------------14----17---------|\n" +
    "D|---3-------------------15--------------------|";

function App() {
    const [inputText, setInputText] = useState<string>(demoInput);
    const [outputText, setOutputText] = useState<(string | string[])[]>([]);
    const [signature, setSignature] = useState("flats");

    useEffect(() => {
        setInputText(inputText);
        const alphaTab = convertToAlphaTab(inputText,
            signature === "flats" ? chromaticScaleFlats : chromaticScaleSharps);

        //group lines with are non empty together for better printability (no page breaks in tab)
        const textChunks: (string | string[])[] = [];
        let currentChunk = [];
        for (let i = 0; i < alphaTab.length; i++) {
            if (alphaTab[i].length > 0) {
                currentChunk.push(alphaTab[i]);
            } else {
                if (currentChunk.length > 0) {
                    textChunks.push(currentChunk);
                    currentChunk = [];
                }
                textChunks.push(alphaTab[i]);
            }
        }
        if (currentChunk.length > 0) {
            textChunks.push(currentChunk);
        }
        setOutputText(textChunks);
    }, [inputText, signature])

    return (
        <Box>
            <GitHubBadgeBox>
                <a href="https://github.com/jannst/alpha-tab-converter">
                    <img loading="lazy" width="149" height="149"
                         src="https://github.blog/wp-content/uploads/2008/12/forkme_right_green_007200.png?resize=149%2C149"
                         className="attachment-full size-full" alt="Fork me on GitHub"
                         data-recalc-dims="1"/>
                </a>
            </GitHubBadgeBox>
            <Background>
                <h4 style={{marginBottom: "0px"}}>Alpha Tab Converter</h4>
                <Box fontSize={10} p={0} m={0}>
                    Made By Jannik Sturhann
                </Box>
                <Box width="80%">
                    <NoPrintBox>
                        <p>Input</p>
                        <InputTextArea
                            onInput={e => setInputText((e.target as HTMLTextAreaElement).value || "")}
                            value={inputText}
                        />
                    </NoPrintBox>
                    <Box>
                        <NoPrintBox>
                            <Flex alignItems="center">
                                <p>Output</p>
                                <Flex flexDirection="column" fontSize={20} ml="30px">
                                    <span>Key Signature Sign</span>
                                    <select value={signature} onChange={e => setSignature(e.target.value)}>
                                        <option value="flats">Flats (b)</option>
                                        <option value="sharps">Sharps (#)</option>
                                    </select>
                                </Flex>
                            </Flex>
                        </NoPrintBox>
                        <OutputTextBox>
                            {outputText.map((chunk, index) => {
                                if (Array.isArray(chunk)) {
                                    return (<Box><OutputText key={index}>
                                        {chunk.join("\n")}
                                    </OutputText></Box>);
                                } else {
                                    return (<React.Fragment key={index}>
                                        {chunk}<br/>
                                    </React.Fragment>);
                                }
                            })}
                        </OutputTextBox>
                    </Box>
                </Box>
            </Background>
        </Box>
    );
}

export default App;
