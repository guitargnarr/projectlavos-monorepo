import { useState, useEffect, useMemo } from 'react';
import catalogData from '../../data/catalog.json';

/**
 * ProgressDashboard - Analytics dashboard showing user learning progress
 *
 * Features:
 * - Statistics cards (completed, favorites, completion %, remaining)
 * - Circular progress ring visualization
 * - Bar charts for difficulty and tier breakdowns
 * - Category progress visualization
 * - Responsive layout with Tailwind v3
 */
export default function ProgressDashboard() {
  // Load data from localStorage
  const [favorites, setFavorites] = useState([]);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem('guitar-favorites');
      const storedProgress = localStorage.getItem('guitar-progress');

      setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
      setCompleted(storedProgress ? JSON.parse(storedProgress) : []);
    } catch (e) {
      console.error('Failed to load data from localStorage:', e);
    }
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalLessons = catalogData.total_files;
    const completedCount = completed.length;
    const favoriteCount = favorites.length;
    const completionPercentage = Math.round((completedCount / totalLessons) * 100);
    const remaining = totalLessons - completedCount;

    // Calculate breakdown by difficulty
    const difficultyBreakdown = {
      beginner: { completed: 0, total: 0 },
      intermediate: { completed: 0, total: 0 },
      advanced: { completed: 0, total: 0 },
    };

    // Calculate breakdown by tier
    const tierBreakdown = {
      free: { completed: 0, total: 0 },
      premium: { completed: 0, total: 0 },
      pro: { completed: 0, total: 0 },
    };

    // Calculate category breakdown
    const categoryBreakdown = {};

    catalogData.files.forEach(file => {
      // Difficulty
      if (difficultyBreakdown[file.difficulty]) {
        difficultyBreakdown[file.difficulty].total++;
        if (completed.includes(file.filename)) {
          difficultyBreakdown[file.difficulty].completed++;
        }
      }

      // Tier
      if (tierBreakdown[file.tier]) {
        tierBreakdown[file.tier].total++;
        if (completed.includes(file.filename)) {
          tierBreakdown[file.tier].completed++;
        }
      }

      // Category
      if (!categoryBreakdown[file.category]) {
        categoryBreakdown[file.category] = { completed: 0, total: 0 };
      }
      categoryBreakdown[file.category].total++;
      if (completed.includes(file.filename)) {
        categoryBreakdown[file.category].completed++;
      }
    });

    return {
      totalLessons,
      completedCount,
      favoriteCount,
      completionPercentage,
      remaining,
      difficultyBreakdown,
      tierBreakdown,
      categoryBreakdown,
    };
  }, [completed, favorites]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Progress Analytics
        </h1>
        <p className="text-gray-400">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Lessons Completed"
          value={stats.completedCount}
          subtitle={`of ${stats.totalLessons} total`}
          color="green"
          icon="✓"
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completionPercentage}%`}
          subtitle={`${stats.remaining} remaining`}
          color="blue"
          icon="📊"
        />
        <StatCard
          title="Favorites"
          value={stats.favoriteCount}
          subtitle="lessons saved"
          color="red"
          icon="♥"
        />
        <StatCard
          title="Average Progress"
          value={`${Math.round(stats.completionPercentage)}%`}
          subtitle="across all tiers"
          color="purple"
          icon="🎯"
        />
      </div>

      {/* Main Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Circular Progress Ring */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-gray-100">Overall Progress</h2>
          <div className="flex justify-center items-center">
            <CircularProgress
              percentage={stats.completionPercentage}
              size={200}
              strokeWidth={20}
            />
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              You&apos;ve completed <span className="text-green-400 font-semibold">{stats.completedCount}</span> out of{' '}
              <span className="text-blue-400 font-semibold">{stats.totalLessons}</span> lessons
            </p>
          </div>
        </div>

        {/* Difficulty Breakdown */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-gray-100">Progress by Difficulty</h2>
          <div className="space-y-4">
            {Object.entries(stats.difficultyBreakdown).map(([difficulty, data]) => (
              <ProgressBarWithLabel
                key={difficulty}
                label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                completed={data.completed}
                total={data.total}
                color={getDifficultyColor(difficulty)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Tier and Category Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Tier Breakdown */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-gray-100">Progress by Tier</h2>
          <div className="space-y-4">
            {Object.entries(stats.tierBreakdown).map(([tier, data]) => (
              <ProgressBarWithLabel
                key={tier}
                label={tier.charAt(0).toUpperCase() + tier.slice(1)}
                completed={data.completed}
                total={data.total}
                color={getTierColor(tier)}
              />
            ))}
          </div>
        </div>

        {/* Category Breakdown - Top 6 */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-gray-100">Top Categories</h2>
          <div className="space-y-4">
            {Object.entries(stats.categoryBreakdown)
              .sort((a, b) => b[1].total - a[1].total)
              .slice(0, 6)
              .map(([category, data]) => (
                <ProgressBarWithLabel
                  key={category}
                  label={category.charAt(0).toUpperCase() + category.slice(1)}
                  completed={data.completed}
                  total={data.total}
                  color="purple"
                />
              ))}
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-6 text-gray-100">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Achievement
            title="First Steps"
            description="Complete your first lesson"
            unlocked={stats.completedCount >= 1}
            icon="🎸"
          />
          <Achievement
            title="Getting Started"
            description="Complete 10 lessons"
            unlocked={stats.completedCount >= 10}
            icon="🎵"
          />
          <Achievement
            title="Dedicated Learner"
            description="Complete 25 lessons"
            unlocked={stats.completedCount >= 25}
            icon="🌟"
          />
          <Achievement
            title="Halfway There"
            description="Complete 50% of all lessons"
            unlocked={stats.completionPercentage >= 50}
            icon="🏆"
          />
          <Achievement
            title="Favorite Collector"
            description="Save 10 favorites"
            unlocked={stats.favoriteCount >= 10}
            icon="💖"
          />
          <Achievement
            title="Master Student"
            description="Complete all lessons"
            unlocked={stats.completionPercentage === 100}
            icon="👑"
          />
        </div>
      </div>
    </div>
  );
}

// StatCard Component
function StatCard({ title, value, subtitle, color, icon }) {
  const colorClasses = {
    green: 'from-green-500 to-emerald-400',
    blue: 'from-blue-500 to-cyan-400',
    red: 'from-red-500 to-pink-400',
    purple: 'from-purple-500 to-pink-400',
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className={`text-3xl font-bold bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
          {value}
        </span>
      </div>
      <h3 className="text-sm font-medium text-gray-300 mb-1">{title}</h3>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

// CircularProgress Component
function CircularProgress({ percentage, size = 200, strokeWidth = 20 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#374151"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-100">{percentage}%</div>
          <div className="text-sm text-gray-400">Complete</div>
        </div>
      </div>
    </div>
  );
}

// ProgressBarWithLabel Component
function ProgressBarWithLabel({ label, completed, total, color }) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-sm text-gray-400">
          {completed}/{total} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className={`${colorClasses[color] || 'bg-purple-500'} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Achievement Component
function Achievement({ title, description, unlocked, icon }) {
  return (
    <div className={`p-4 rounded-lg border ${
      unlocked
        ? 'bg-gray-700 border-green-500 border-opacity-50'
        : 'bg-gray-800 border-gray-700 opacity-50'
    }`}>
      <div className="text-3xl mb-2 text-center">{icon}</div>
      <h3 className="text-sm font-semibold text-gray-100 mb-1 text-center">{title}</h3>
      <p className="text-xs text-gray-400 text-center">{description}</p>
      {unlocked && (
        <div className="mt-2 text-center">
          <span className="text-xs text-green-400 font-medium">Unlocked!</span>
        </div>
      )}
    </div>
  );
}

// Helper functions
function getDifficultyColor(difficulty) {
  const colors = {
    beginner: 'green',
    intermediate: 'yellow',
    advanced: 'orange',
  };
  return colors[difficulty] || 'purple';
}

function getTierColor(tier) {
  const colors = {
    free: 'green',
    premium: 'blue',
    pro: 'purple',
  };
  return colors[tier] || 'purple';
}
