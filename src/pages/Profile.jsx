import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Card, Button, Badge } from '../../components/common';
import { calculateLevel, getProgressPercentage, formatNumber } from '../../utils/helpers';

const Profile = () => {
  const { currentUser, logoutUser } = useUser();
  const { themes, currentTheme, changeTheme } = useTheme();

  const userLevel = calculateLevel(currentUser.xp || 0);
  const progressToNext = getProgressPercentage(currentUser.xp || 0);

  const handleLogout = () => {
    if (confirm('Voulez-vous vraiment vous deconnecter?')) {
      logoutUser();
      window.location.href = '/';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil</h1>
        <p className="text-gray-600">Gerez vos informations et preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informations</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom d'utilisateur
                </label>
                <div className="text-lg font-semibold text-gray-900">{currentUser.nom}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau
                </label>
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold text-gray-900">Niveau {userLevel}</div>
                  <Badge color="bg-primary-100 text-primary-800">
                    {formatNumber(currentUser.xp || 0)} XP
                  </Badge>
                </div>
              </div>

              {currentUser.titre && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Titre
                  </label>
                  <Badge color="bg-purple-100 text-purple-800 text-base px-4 py-2">
                    {currentUser.titre}
                  </Badge>
                </div>
              )}

              {currentUser.date_creation && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Membre depuis
                  </label>
                  <div className="text-gray-600">
                    {new Date(currentUser.date_creation).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Theme</h2>
            <div className="grid grid-cols-5 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => changeTheme(theme.id)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    currentTheme === theme.id
                      ? 'border-primary-600 ring-2 ring-primary-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex gap-1 mb-2">
                    {theme.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="text-xs font-medium text-gray-700 text-center">
                    {theme.name}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="border-2 border-red-200 bg-red-50">
            <h2 className="text-xl font-bold text-red-900 mb-2">Zone Dangereuse</h2>
            <p className="text-red-700 text-sm mb-4">
              La deconnexion supprimera vos donnees locales. Assurez-vous que votre progression est sauvegardee.
            </p>
            <Button variant="danger" onClick={handleLogout}>
              Se deconnecter
            </Button>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Statistiques Rapides</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">XP Total</span>
                <span className="font-bold text-primary-600">
                  {formatNumber(currentUser.xp || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Niveau</span>
                <span className="font-bold text-gray-900">{userLevel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Progression</span>
                <span className="font-bold text-gray-900">{Math.round(progressToNext)}%</span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Liens Rapides</h2>
            <div className="space-y-2">
              <a href="/exercises" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                Faire des exercices
              </a>
              <a href="/progression" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                Voir la progression
              </a>
              <a href="/badges" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                Mes badges
              </a>
              <a href="/leaderboard" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                Classement
              </a>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
