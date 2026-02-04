import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { apiService } from '../../services/api';
import { Card, Badge, ProgressBar, Spinner, Alert } from '../../components/common';
import { DOMAINS } from '../../constants';
import { calculateLevel, getProgressPercentage, formatNumber } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, updateUser } = useUser();
  const [stats, setStats] = useState(null);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [activeQuests, setActiveQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, [currentUser]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [statsRes, questsRes] = await Promise.all([
        apiService.progression.getStats(currentUser.id),
        apiService.quests.getActive(currentUser.id).catch(() => ({ data: { quetes: [] } })),
      ]);

      setStats(statsRes.data);
      setActiveQuests(questsRes.data.quetes || []);

      try {
        const challengeRes = await apiService.challenges.getDaily();
        setDailyChallenge(challengeRes.data);
      } catch (err) {
        console.log('No daily challenge available');
      }

      if (statsRes.data.xp_total !== undefined) {
        updateUser({
          xp: statsRes.data.xp_total,
          niveau: calculateLevel(statsRes.data.xp_total),
        });
      }
    } catch (err) {
      setError('Erreur lors du chargement des donnees');
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

  const userXp = currentUser.xp || 0;
  const userLevel = calculateLevel(userXp);
  const progressToNext = getProgressPercentage(userXp);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bienvenue, {currentUser.nom}!</h1>
          <p className="text-gray-600 mt-1">Continuez votre apprentissage</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">{formatNumber(userXp)} XP</div>
          <div className="text-sm text-gray-600">Niveau {userLevel}</div>
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progression niveau</span>
          <span className="text-sm text-gray-600">{Math.round(progressToNext)}%</span>
        </div>
        <ProgressBar progress={progressToNext} />
      </Card>

      {dailyChallenge && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Defi Quotidien</h3>
              <p className="text-gray-700">{dailyChallenge.description}</p>
              <Badge color="bg-yellow-200 text-yellow-800" className="mt-2">
                +{dailyChallenge.bonus_xp} XP Bonus
              </Badge>
            </div>
            <Link to="/exercises" className="btn-primary whitespace-nowrap">
              Commencer
            </Link>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="text-sm text-gray-600 mb-1">Total Exercices</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats?.total_exercices || 0}
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Taux de Reussite</div>
          <div className="text-2xl font-bold text-green-600">
            {stats?.taux_reussite ? Math.round(stats.taux_reussite) : 0}%
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Serie Actuelle</div>
          <div className="text-2xl font-bold text-orange-600">
            {stats?.serie_actuelle || 0} jours
          </div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Badges Obtenus</div>
          <div className="text-2xl font-bold text-purple-600">
            {stats?.badges_obtenus || 0}
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Domaines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DOMAINS.map((domain) => {
            const domainStats = stats?.domaines?.[domain.id] || {};
            const total = domainStats.total || 0;
            const succes = domainStats.succes || 0;
            const successRate = total > 0 ? Math.round((succes / total) * 100) : 0;

            return (
              <Link to={`/exercises?domain=${domain.id}`} key={domain.id}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className={`w-12 h-12 ${domain.color} rounded-lg flex items-center justify-center mb-3`}>
                    <span className="text-white text-xl font-bold">
                      {domain.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{domain.name}</h3>
                  <div className="text-sm text-gray-600 mb-2">{total} exercices</div>
                  <ProgressBar progress={successRate} color={domain.color.replace('bg-', 'bg-')} />
                  <div className="text-xs text-gray-500 mt-1">{successRate}% reussite</div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {activeQuests && activeQuests.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quetes Actives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeQuests.slice(0, 4).map((quest, index) => (
              <Card key={index}>
                <h3 className="font-semibold text-gray-900 mb-2">{quest.nom}</h3>
                <p className="text-sm text-gray-600 mb-3">{quest.description}</p>
                <div className="flex items-center justify-between">
                  <Badge color="bg-purple-100 text-purple-800">
                    {quest.progression || 0}/{quest.objectif}
                  </Badge>
                  <span className="text-sm font-medium text-primary-600">
                    +{quest.recompense_xp} XP
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
