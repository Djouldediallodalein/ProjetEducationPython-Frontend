import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Card, Button, Badge, Alert, Spinner, Modal } from '../../components/common';
import { DOMAINS, DIFFICULTY_LEVELS } from '../../constants';
import { getDifficultyColor } from '../../utils/helpers';

const Exercises = () => {
  const { currentUser, updateUser } = useUser();
  const [searchParams] = useSearchParams();
  const [selectedDomain, setSelectedDomain] = useState(searchParams.get('domain') || 'python');
  const [selectedDifficulty, setSelectedDifficulty] = useState('debutant');
  const [currentExercise, setCurrentExercise] = useState(null);
  const [userCode, setUserCode] = useState('');
  const [executionResult, setExecutionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState('');
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    if (searchParams.get('domain')) {
      setSelectedDomain(searchParams.get('domain'));
    }
  }, [searchParams]);

  const generateExercise = async () => {
    setLoading(true);
    setError('');
    setCurrentExercise(null);
    setUserCode('');
    setExecutionResult(null);
    setShowSolution(false);

    try {
      const response = await apiService.exercises.generate(selectedDomain, selectedDifficulty);
      setCurrentExercise(response.data.exercice);
      if (response.data.exercice.code_initial) {
        setUserCode(response.data.exercice.code_initial);
      }
    } catch (err) {
      setError('Erreur lors de la generation de l\'exercice. Verifiez que le backend est lance.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const executeCode = async () => {
    if (!userCode.trim()) {
      setError('Veuillez ecrire du code avant d\'executer');
      return;
    }

    setExecuting(true);
    setError('');
    setExecutionResult(null);

    try {
      const response = await apiService.exercises.execute(userCode);
      const result = response.data;
      setExecutionResult(result);

      if (result.succes) {
        await apiService.progression.update(currentUser.id, selectedDomain, true);
        await apiService.xp.add(
          currentUser.id,
          result.xp_gagne || 10,
          `Exercice ${selectedDomain} reussi`
        );

        const newXp = (currentUser.xp || 0) + (result.xp_gagne || 10);
        updateUser({ xp: newXp });

        await apiService.badges.check(currentUser.id);
      } else {
        await apiService.progression.update(currentUser.id, selectedDomain, false);
      }
    } catch (err) {
      setError('Erreur lors de l\'execution du code');
      console.error(err);
    } finally {
      setExecuting(false);
    }
  };

  const getDomainInfo = () => {
    return DOMAINS.find(d => d.id === selectedDomain) || DOMAINS[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Exercices</h1>
        {currentExercise && (
          <Button variant="secondary" onClick={() => setCurrentExercise(null)}>
            Nouvel exercice
          </Button>
        )}
      </div>

      {!currentExercise ? (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Generer un exercice</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Domaine
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DOMAINS.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => setSelectedDomain(domain.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedDomain === domain.id
                        ? `${domain.color} text-white border-transparent`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">{domain.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulte
              </label>
              <div className="grid grid-cols-3 gap-3">
                {DIFFICULTY_LEVELS.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSelectedDifficulty(level.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedDifficulty === level.value
                        ? 'bg-primary-600 text-white border-transparent'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">{level.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {error && <Alert type="error">{error}</Alert>}

            <Button
              variant="primary"
              onClick={generateExercise}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Generation...' : 'Generer un exercice'}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge color={getDomainInfo().color.replace('bg-', 'bg-') + ' text-white'}>
                    {getDomainInfo().name}
                  </Badge>
                  <Badge color={getDifficultyColor(selectedDifficulty)}>
                    {DIFFICULTY_LEVELS.find(l => l.value === selectedDifficulty)?.label}
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentExercise.titre}
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {currentExercise.description}
                </p>
              </div>
            </div>

            {currentExercise.indices && currentExercise.indices.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <h4 className="font-semibold text-blue-900 mb-2">Indices:</h4>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  {currentExercise.indices.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Votre solution</h3>
              <div className="space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowSolution(true)}
                  disabled={!currentExercise.solution}
                >
                  Voir la solution
                </Button>
                <Button
                  variant="success"
                  onClick={executeCode}
                  disabled={executing || !userCode.trim()}
                >
                  {executing ? 'Execution...' : 'Executer'}
                </Button>
              </div>
            </div>

            <textarea
              value={userCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full h-64 p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              placeholder="Ecrivez votre code ici..."
            />

            {error && <Alert type="error" className="mt-4">{error}</Alert>}

            {executionResult && (
              <div className="mt-4">
                <Alert type={executionResult.succes ? 'success' : 'error'}>
                  <div className="font-semibold mb-2">
                    {executionResult.succes ? 'Bravo! Exercice reussi!' : 'Erreur dans le code'}
                  </div>
                  {executionResult.sortie && (
                    <div className="mt-2">
                      <div className="text-sm font-medium mb-1">Sortie:</div>
                      <pre className="text-sm bg-white bg-opacity-50 p-2 rounded overflow-x-auto">
                        {executionResult.sortie}
                      </pre>
                    </div>
                  )}
                  {executionResult.erreur && (
                    <div className="mt-2">
                      <div className="text-sm font-medium mb-1">Erreur:</div>
                      <pre className="text-sm bg-white bg-opacity-50 p-2 rounded overflow-x-auto">
                        {executionResult.erreur}
                      </pre>
                    </div>
                  )}
                  {executionResult.succes && executionResult.xp_gagne && (
                    <div className="mt-2 font-medium">
                      +{executionResult.xp_gagne} XP gagne!
                    </div>
                  )}
                </Alert>
              </div>
            )}
          </Card>

          <Modal
            isOpen={showSolution}
            onClose={() => setShowSolution(false)}
            title="Solution"
          >
            <div className="space-y-4">
              <p className="text-gray-600">
                Voici une solution possible pour cet exercice:
              </p>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                {currentExercise.solution}
              </pre>
              <Button variant="primary" onClick={() => setShowSolution(false)} className="w-full">
                Fermer
              </Button>
            </div>
          </Modal>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}
    </div>
  );
};

export default Exercises;
