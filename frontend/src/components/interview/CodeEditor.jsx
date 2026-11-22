import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiTerminal, FiX } from 'react-icons/fi';
import Editor from '@monaco-editor/react';
const LANG_OPTIONS = [
  "cpp",
  "java",
  "c",
  "javascript",
  "python",
];

const DEFAULT_CODE = {
  cpp: `// Write your C++ code here
#include <iostream>
using namespace std;

int main() {
    // Your code
    return 0;
}
`,

  java: `// Write your Java code here
public class Main {
    public static void main(String[] args) {
        // Your code
    }
}
`,

  c: `// Write your C code here
#include <stdio.h>

int main() {
    // Your code
    return 0;
}
`,

  javascript: `// Write your JavaScript code here
function solve() {
    // Your code
}

solve();
`,

  python: `# Write your Python code here
def solve():
    # Your code
    pass

if __name__ == "__main__":
    solve()
`,
};
const CodeEditor = ({onClose,onSubmitCode}) => {
    const [lang, setLang]=useState("cpp");

    const [code, setCode]=useState(DEFAULT_CODE[lang]);
  return (
    <>
      <AnimatePresence>
        <motion.div className="bg-gray-800" onClick={onClose} />
        <motion.div>
          //glass screen
          <div className="" />
          <div className="">
            <div>
              <FiTerminal />
              <span>Code Editor</span>
            </div>
            <div className="">
              {LANG_OPTIONS.map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLang(l);
                    setCode(DEFAULT_CODE[l]);
                  }}
                  className=""
                >
                  {l}
                </button>
              ))}
            </div>
            <button onClick={onClose}>
              <FiX />
            </button>
          </div>
          {/* editor  */}
          <div>
            <Editor
              height="100%"
              language={lang}
              value={code}
              onChange={(v) => setCode(v || "")}
              theme="vs-dark"
            />
          </div>
          <div>
            <button onClick={() => onSubmitCode?.(code)}>Add To Answer</button>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default CodeEditor