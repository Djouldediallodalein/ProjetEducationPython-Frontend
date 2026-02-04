import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { apiService } from '../../services/api';
import { Card, Badge, ProgressBar, Spinner, Alert } from '../../components/common';

const Quests = () => {
  const { currentUser } = useUser();
  const [activeQuests, setActiveQuests] = useState([]);
  const [completedQuests, setCompletedQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuests();
  }, [currentUser]);

  const fetchQuests = async () => {
    try {
      setLoading(true);
      const [activeRes, completedRes] = await Promise.all([
        apiService.quests.getActive(currentUser.id),
        apiService.quests.getCompleted(currentUser.id),
      ]);

      setActiveQuests(activeRes.data.quetes || []);
      setCompletedQuests(completedRes.data.quetes || []);
    } catch (err) {
      setError('Erreur lors du chargement des quetes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <Alert type="error">{error}</Alert>;
  }

  const getQuestIcon = (type) => {
    const icons = {
      exploration: '🗺️',
      mastery: '🎓',
      speed: '⚡',
      endurance: '💪',
      precision: '🎯',
      collection: '🏆',
    };
    return icons[type] || '📜';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      facile: 'bg-green-100 text-green-800',
      moyen: 'bg-yellow-100 text-yellow-800',
      difficile: 'bg-red-100 text-red-800',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quetes</h1>
        <p className="text-gray-600">Accomplissez des quetes pour gagner des recompenses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-sm text-gray-600 mb-1">Quetes Actives</div>
          <div className="text-3xl font-bold text-primary-600">{activeQuests.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Quetes Terminees</div>
          <div className="text-3xl font-bold text-green-600">{completedQuests.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Total XP Gagne</div>
          <div className="text-3xl font-bold text-yellow-600">
            {completedQuests.reduce((sum, q) => sum + (q.recompense_xp || 0), 0)}
          </div>
        </Card>
      </div>

      {activeQuests.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quetes en Cours</h2>
          <div className="space-y-4">
            {activeQuests.map((quest, index) => {
              const progress = quest.progression || 0;
              const objective = quest.objectif || 1;
              const progressPercent = Math.min((progress / objective) * 100, 100);

              return (
                <Card key={index} className="border-l-4 border-primary-500">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{getQuestIcon(quest.type)}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{quest.nom}</h3>
                          <p className="text-gray-600 text-sm">{quest.description}</p>
                        </div>
                        {quest.difficulte && (
                          <Badge color={getDifficultyColor(quest.difficulte)}>
                            {quest.difficulte}
                          </Badge>
                        )}
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progression</span>
                          <span className="font-medium text-gray-900">
                            {progress}/{objective}
                          </span>
                        </div>
                        <ProgressBar progress={progressPercent} />
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-gray-600">Recompense</span>
                        <Badge color="bg-yellow-100 text-yellow-800">
                          +{quest.recompense_xp} XP
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {completedQuests.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quetes Terminees</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedQuests.map((quest, index) => (
              <Card key={index} className="border-l-4 border-green-500 bg-green-50">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{getQuestIcon(quest.type)}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{quest.nom}</h3>
                    <p className="text-gray-600 text-sm mb-3">{quest.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge color="bg-green-200 text-green-800">Terminee</Badge>
                      <Badge color="bg-yellow-100 text-yellow-800">
                        +{quest.recompense_xp} XP
                      </Badge>
                    </div>
                    {quest.date_completion && (
                      <div className="text-xs text-gray-500 mt-2">
                        Completee le {new Date(quest.date_completion).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeQuests.length === 0 && completedQuests.length === 0 && (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📜</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune quete disponible</h3>
          <p className="text-gray-600">
            Commencez a faire des exercices pour debloquer des quetes!
          </p>
        </Card>
      )}
    </div>
  );
};

export default Quests;
