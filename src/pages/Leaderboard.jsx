import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { apiService } from '../../services/api';
import { Card, Spinner, Alert } from '../../components/common';

const Leaderboard = () => {
  const { currentUser } = useUser();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await apiService.leaderboard.get();
      setLeaderboard(response.data.classement || []);
    } catch (err) {
      setError('Erreur lors du chargement du classement');
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

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    if (rank === 2) return 'bg-gray-100 text-gray-800 border-gray-300';
    if (rank === 3) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-white text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Classement</h1>
        <p className="text-gray-600">Comparez vos performances avec les autres apprenants</p>
      </div>

      {leaderboard.length > 0 ? (
        <div className="space-y-3">
          {leaderboard.map((user, index) => {
            const rank = index + 1;
            const isCurrentUser = user.id === currentUser.id || user.nom === currentUser.nom;

            return (
              <Card
                key={index}
                className={`border-2 ${getRankColor(rank)} ${
                  isCurrentUser ? 'ring-2 ring-primary-500 ring-offset-2' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold w-16 text-center">
                    {getRankIcon(rank)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{user.nom}</h3>
                      {isCurrentUser && (
                        <span className="text-xs bg-primary-600 text-white px-2 py-1 rounded">
                          Vous
                        </span>
                      )}
                      {user.titre && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {user.titre}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Niveau {user.niveau || 1}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">
                      {user.xp_total || 0}
                    </div>
                    <div className="text-xs text-gray-600">XP Total</div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-semibold text-gray-900">
                      {user.exercices_reussis || 0}
                    </div>
                    <div className="text-xs text-gray-600">Exercices</div>
                  </div>

                  {user.taux_reussite !== undefined && (
                    <div className="text-right">
                      <div className="text-xl font-semibold text-green-600">
                        {Math.round(user.taux_reussite)}%
                      </div>
                      <div className="text-xs text-gray-600">Reussite</div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aucun classement disponible
          </h3>
          <p className="text-gray-600">
            Soyez le premier a completer des exercices!
          </p>
        </Card>
      )}
    </div>
  );
};

export default Leaderboard;
