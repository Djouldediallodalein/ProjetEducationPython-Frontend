import { useState, useEffect, useRef } from "react";
import { Play, Terminal as TerminalIcon } from "lucide-react";
import "./Terminal.css";

export default function Terminal({ code, onExecute }) {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pyodide, setPyodide] = useState(null);
  const outputRef = useRef(null);

  // Charger Pyodide au montage
  useEffect(() => {
    loadPyodide();
  }, []);

  // Auto-scroll du terminal
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

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

      setPyodide(pyodideModule);
      setOutput((prev) => prev + "✅ Prêt à exécuter du code Python !\n\n");
      setOutput((prev) => prev + "⚠️  Note : input() n'est pas disponible dans ce terminal.\n");
      setOutput((prev) => prev + "💡 Utilisez print() pour afficher des résultats.\n\n");
    } catch (error) {
      setOutput(
        "❌ Erreur lors du chargement de Python : " + error.message + "\n"
      );
    }
  };

  const clearTerminal = () => {
    setOutput("");
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
      </div>
    </div>
  );
}
