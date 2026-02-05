import { useState, useRef, useEffect } from "react";
import { Play, Trash2, Terminal as TerminalIcon } from "lucide-react";
import { apiService } from "../../services/api";
import "./Terminal.css";

export default function Terminal({ code }) {
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const outputRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const executeCode = async () => {
    if (!code.trim()) {
      setOutput((prev) => prev + "⚠️  Aucun code à exécuter\n\n");
      return;
    }

    setIsRunning(true);
    setOutput((prev) => prev + "▶️  Exécution du code...\n");

    try {
      const response = await apiService.terminal.execute(code);
      
      if (response.data?.success) {
        const result = response.data.data;
        
        if (result.success) {
          setOutput((prev) => prev + result.output + "\n");
          setOutput((prev) => prev + "✅ Exécution terminée avec succès\n\n");
        } else {
          setOutput((prev) => prev + "❌ Erreur d'exécution :\n");
          setOutput((prev) => prev + result.error + "\n\n");
        }
      } else {
        setOutput((prev) => prev + "❌ Erreur serveur\n\n");
      }
    } catch (error) {
      setOutput((prev) => prev + `❌ Erreur : ${error.message}\n\n`);
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
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
            onClick={clearOutput}
            className="terminal-btn terminal-btn-clear"
            disabled={isRunning}
            title="Effacer le terminal"
          >
            <Trash2 size={16} />
            Effacer
          </button>
          <button
            onClick={executeCode}
            className="terminal-btn terminal-btn-run"
            disabled={isRunning}
            title="Exécuter le code (pour tester)"
          >
            <Play size={16} />
            {isRunning ? "Exécution..." : "Exécuter"}
          </button>
        </div>
      </div>

      <div className="terminal-output" ref={outputRef}>
        {output ? (
          <pre>{output}</pre>
        ) : (
          <div className="terminal-empty">
            <TerminalIcon size={48} opacity={0.3} />
            <p>Le résultat de l'exécution apparaîtra ici</p>
            <p className="terminal-hint">
              💡 Utilisez "Exécuter" pour tester votre code
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
