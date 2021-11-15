
export const chromaticScaleSharps = ["C", "C#", "D" , "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
export const chromaticScaleFlats  = ["C", "Db", "D" , "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
export const chromaticScaleFlatsUpperCase  = chromaticScaleFlats.map(key => key.toUpperCase());

const chromaticNoteNames = Array.from(new Set([...chromaticScaleSharps, ...chromaticScaleFlats]));
//export const tabLineBeginPattern = new RegExp(`^(${chromaticNoteNames.join("|")}) ?\\|`, "i");
export const tabLinePattern = new RegExp(`^((${chromaticNoteNames.join("|")}) ?\\|.+\\|)`, "i");