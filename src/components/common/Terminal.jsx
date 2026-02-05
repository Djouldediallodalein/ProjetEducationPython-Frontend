import { useState, useEffect, useRef } from "react";
import { Play, Terminal as TerminalIcon } from "lucide-react";
import "./Terminal.css";

export default function Terminal({ code, onExecute }) {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pyodide, setPyodide] = useState(null);
  const [inputs, setInputs] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [waitingForInput, setWaitingForInput] = useState(false);
  const outputRef = useRef(null);
  const inputRef = useRef(null);
  const inputResolveRef = useRef(null);

  // Charger Pyodide au montage
  useEffect(() => {
    loadPyodide();
  }, []);

  // Auto-scroll du terminal
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, waitingForInput]);

  // Focus sur l'input quand on attend une saisie
  useEffect(() => {
    if (waitingForInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [waitingForInput]);

  const loadPyodide = async () => {
    try {
      setOutput("🔄 Chargement de l'environnement Python...\n");
      const pyodideModule = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
      });

      // Rediriger stdout
      pyodideModule.setStdout({
        batched: (text) => {
          setOutput((prev) => prev + text);
        },
      });

      // Rediriger stderr
      pyodideModule.setStderr({
        batched: (text) => {
          setOutput((prev) => prev + "❌ " + text);
        },
      });

      // Créer une fonction input() interactive
      pyodideModule.globals.set("__input_callback__", () => {
        return new Promise((resolve) => {
          inputResolveRef.current = resolve;
          setWaitingForInput(true);
        });
      });

      await pyodideModule.runPythonAsync(`
import sys
from js import __input_callback__

async def input(prompt=""):
    if prompt:
        print(prompt, end="", flush=True)
    result = await __input_callback__()
    print(result)
    return result

# Remplacer la fonction input globale
__builtins__.input = input
      `);

      setPyodide(pyodideModule);
      setOutput((prev) => prev + "✅ Prêt à exécuter du code Python !\n\n");
    } catch (error) {
      setOutput(
        "❌ Erreur lors du chargement de Python : " + error.message + "\n"
      );
    }
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    if (inputResolveRef.current) {
      inputResolveRef.current(currentInput);
      setInputs([...inputs, currentInput]);
      inputResolveRef.current = null;
      setCurrentInput("");
      setWaitingForInput(false);
    }
  };

  const runCode = async () => {
    if (!pyodide || !code.trim()) {
      setOutput((prev) => prev + "⚠️  Aucun code à exécuter\n");
      return;
    }

    setIsLoading(true);
    setOutput((prev) => prev + "▶️  Exécution du code...\n");
    setInputs([]);

    try {
      // Exécuter le code de manière asynchrone pour supporter input()
      await pyodide.runPythonAsync(code);
      setOutput((prev) => prev + "\n✅ Exécution terminée avec succès !\n");
      if (onExecute) {
        onExecute({ success: true, output: outputRef.current.textContent });
      }
    } catch (error) {
      const errorMessage = `❌ Erreur : ${error.message}\n`;
      setOutput((prev) => prev + errorMessage);
      if (onExecute) {
        onExecute({ success: false, error: error.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearTerminal = () => {
    setOutput("");
    setInputs([]);
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-title">
          <TerminalIcon size={18} />
          <span>Terminal Python</span>
        </div>
        <div className="terminal-actions">
          <button
            onClick={clearTerminal}
            className="terminal-btn terminal-btn-clear"
            disabled={isLoading}
          >
            Effacer
          </button>
          <button
            onClick={runCode}
            className="terminal-btn terminal-btn-run"
            disabled={isLoading || !pyodide}
          >
            <Play size={16} />
            {isLoading ? "Exécution..." : "Exécuter"}
          </button>
        </div>
      </div>

      <div className="terminal-output" ref={outputRef}>
        <pre>{output}</pre>
        {waitingForInput && (
          <form onSubmit={handleInputSubmit} className="terminal-input-form">
            <span className="terminal-prompt">&gt; </span>
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              className="terminal-input"
              autoFocus
              disabled={!waitingForInput}
            />
          </form>
        )}
      </div>
    </div>
  );
}
