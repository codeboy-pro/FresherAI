import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiTerminal, FiX, FiCode } from "react-icons/fi";
import Editor from "@monaco-editor/react";

const LANG_OPTIONS = ["cpp", "java", "c", "javascript", "python"];

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

const CodeEditor = ({ onClose, onSubmitCode }) => {
  const [lang, setLang] = useState("cpp");
  const [code, setCode] = useState(DEFAULT_CODE.cpp);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.25 }}
        onClick={(event) => event.stopPropagation()}
        className="fixed left-1/2 top-1/2 z-[101] flex h-[90dvh] max-h-[850px] w-[95%] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111319] shadow-2xl shadow-black/50"
      >
        {/* Header */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] bg-[#171920] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
              <FiTerminal className="text-lg" />
            </div>

            <div>
              <h2 className="text-sm font-bold text-white sm:text-base">
                Code Editor
              </h2>
              <p className="text-[10px] text-slate-500">Write your solution</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {LANG_OPTIONS.map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => {
                  setLang(language);
                  setCode(DEFAULT_CODE[language]);
                }}
                className={`rounded-lg px-3 py-2 text-xs font-semibold capitalize transition-all ${
                  lang === language
                    ? "bg-indigo-500/20 text-indigo-300 ring-1 ring-indigo-500/30"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {language}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close editor"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Editor */}
        <div className="min-h-0 flex-1 bg-[#1e1e1e]">
          <Editor
            height="100%"
            language={lang}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              wordWrap: "on",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 16 },
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-col-reverse items-center justify-between gap-3 border-t border-white/[0.08] bg-[#171920] px-4 py-3 sm:flex-row sm:px-5">
          <p className="text-xs text-slate-500">
            Language:{" "}
            <span className="font-semibold capitalize text-slate-300">
              {lang}
            </span>
          </p>

          <button
            type="button"
            onClick={() => onSubmitCode?.(code)}
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-950/30 transition hover:from-indigo-500 hover:to-violet-500 sm:w-auto"
          >
            <FiCode />
            Add To Answer
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CodeEditor;
