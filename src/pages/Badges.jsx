import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { apiService } from '../../services/api';
import { Card, Badge, Spinner, Alert } from '../../components/common';

const Badges = () => {
  const { currentUser } = useUser();
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBadges();
  }, [currentUser]);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const response = await apiService.badges.getAll(currentUser.id);
      setBadges(response.data.badges || []);
    } catch (err) {
      setError('Erreur lors du chargement des badges');
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

  const obtainedBadges = badges.filter((b) => b.obtenu);
  const lockedBadges = badges.filter((b) => !b.obtenu);

  const getBadgeIcon = (type) => {
    const icons = {
      debutant: '🌱',
      intermediaire: '⭐',
      expert: '💎',
      maitre: '👑',
      serie: '🔥',
      defi: '🎯',
      progression: '📈',
      vitesse: '⚡',
      perfection: '✨',
    };
    return icons[type] || '🏆';
  };

  const getBadgeColor = (type) => {
    const colors = {
      debutant: 'from-green-400 to-green-600',
      intermediaire: 'from-blue-400 to-blue-600',
      expert: 'from-purple-400 to-purple-600',
      maitre: 'from-yellow-400 to-yellow-600',
      serie: 'from-orange-400 to-orange-600',
      defi: 'from-red-400 to-red-600',
      progression: 'from-pink-400 to-pink-600',
      vitesse: 'from-cyan-400 to-cyan-600',
      perfection: 'from-indigo-400 to-indigo-600',
    };
    return colors[type] || 'from-gray-400 to-gray-600';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Badges</h1>
        <p className="text-gray-600">Collectionnez des badges en accomplissant des defis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-sm text-gray-600 mb-1">Total Badges</div>
          <div className="text-3xl font-bold text-gray-900">{badges.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Obtenus</div>
          <div className="text-3xl font-bold text-green-600">{obtainedBadges.length}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Progression</div>
          <div className="text-3xl font-bold text-primary-600">
            {Math.round((obtainedBadges.length / badges.length) * 100)}%
          </div>
        </Card>
      </div>

      {obtainedBadges.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Badges Obtenus</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {obtainedBadges.map((badge, index) => (
              <Card key={index} className="relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${getBadgeColor(badge.type)} opacity-10 rounded-full -mr-16 -mt-16`} />
                <div className="relative">
                  <div className="text-5xl mb-3">{getBadgeIcon(badge.type)}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{badge.nom}</h3>
                  <p className="text-gray-600 text-sm mb-3">{badge.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge color="bg-green-100 text-green-800">Obtenu</Badge>
                    {badge.date_obtention && (
                      <span className="text-xs text-gray-500">
                        {new Date(badge.date_obtention).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {lockedBadges.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Badges a Debloquer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockedBadges.map((badge, index) => (
              <Card key={index} className="relative overflow-hidden opacity-60">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-400 opacity-10 rounded-full -mr-16 -mt-16" />
                <div className="relative">
                  <div className="text-5xl mb-3 grayscale">{getBadgeIcon(badge.type)}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{badge.nom}</h3>
                  <p className="text-gray-600 text-sm mb-3">{badge.description}</p>
                  <Badge color="bg-gray-200 text-gray-700">Verrouille</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Badges;
