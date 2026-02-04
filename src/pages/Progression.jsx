import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { apiService } from '../../services/api';
import { Card, Badge, ProgressBar, Spinner, Alert } from '../../components/common';
import { DOMAINS } from '../../constants';
import { getSuccessRate } from '../../utils/helpers';

const Progression = () => {
  const { currentUser } = useUser();
  const [progressionData, setProgressionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProgression();
  }, [currentUser]);

  const fetchProgression = async () => {
    try {
      setLoading(true);
      const promises = DOMAINS.map(async (domain) => {
        try {
          const response = await apiService.domains.getProgress(currentUser.id, domain.id);
          return { domain: domain.id, data: response.data };
        } catch (err) {
          return { domain: domain.id, data: null };
        }
      });

      const results = await Promise.all(promises);
      const progressionMap = {};
      results.forEach((result) => {
        progressionMap[result.domain] = result.data;
      });

      setProgressionData(progressionMap);
    } catch (err) {
      setError('Erreur lors du chargement de la progression');
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

  const getTotalStats = () => {
    let totalExercises = 0;
    let totalSuccess = 0;

    Object.values(progressionData).forEach((data) => {
      if (data) {
        totalExercises += data.total || 0;
        totalSuccess += data.succes || 0;
      }
    });

    return { totalExercises, totalSuccess };
  };

  const { totalExercises, totalSuccess } = getTotalStats();
  const globalSuccessRate = getSuccessRate(totalExercises, totalSuccess);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Progression</h1>
        <p className="text-gray-600">Suivez vos progres par domaine</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-sm text-gray-600 mb-1">Total Exercices</div>
          <div className="text-3xl font-bold text-gray-900">{totalExercises}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Exercices Reussis</div>
          <div className="text-3xl font-bold text-green-600">{totalSuccess}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600 mb-1">Taux Global</div>
          <div className="text-3xl font-bold text-primary-600">{globalSuccessRate}%</div>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Progression par domaine</h2>
        
        {DOMAINS.map((domain) => {
          const data = progressionData[domain.id];
          const total = data?.total || 0;
          const succes = data?.succes || 0;
          const echecs = data?.echecs || 0;
          const successRate = getSuccessRate(total, succes);
          const niveau = data?.niveau || 1;

          return (
            <Card key={domain.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-16 h-16 ${domain.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-2xl font-bold">
                      {domain.name.charAt(0)}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{domain.name}</h3>
                      <Badge color={`${domain.color} text-white`}>
                        Niveau {niveau}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-gray-600">Total</div>
                        <div className="text-lg font-semibold text-gray-900">{total}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Reussis</div>
                        <div className="text-lg font-semibold text-green-600">{succes}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600">Echecs</div>
                        <div className="text-lg font-semibold text-red-600">{echecs}</div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Taux de reussite</span>
                        <span className="font-medium text-gray-900">{successRate}%</span>
                      </div>
                      <ProgressBar progress={successRate} color={domain.color.replace('bg-', 'bg-')} />
                    </div>

                    {data?.dernier_exercice && (
                      <div className="mt-3 text-xs text-gray-500">
                        Dernier exercice: {new Date(data.dernier_exercice).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Progression;
