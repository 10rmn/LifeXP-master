import HabitItem from './HabitItem';

function HabitList({ habits, completedHabitIds, onComplete, onUncomplete, onEdit, onDelete }) {
  const completionRate = habits.length > 0 
    ? Math.round((habits.filter(h => completedHabitIds.includes(h.id)).length / habits.length) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gradient mb-2">
            🎯 Today's Habits
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
        </div>
        <div className="flex items-center gap-3 glass-effect px-4 py-2 rounded-full">
          <div className={`w-3 h-3 rounded-full ${completionRate === 100 ? 'bg-green-500 pulse' : 'bg-yellow-500'}`}></div>
          <span className="text-sm font-medium text-gray-300">
            {habits.filter(h => completedHabitIds.includes(h.id)).length} / {habits.length} completed
          </span>
        </div>
      </div>
      
      {habits.length === 0 ? (
        <div className="card text-center py-16 glass-effect">
          <div className="text-7xl mb-6 glow">🌱</div>
          <h3 className="text-2xl font-bold text-gray-200 mb-3">
            No habits yet!
          </h3>
          <p className="text-gray-400 mb-8 text-lg">
            Start your journey by creating your first habit. Small steps lead to extraordinary changes! 🚀
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-medium shadow-soft">
              💪 Build consistency
            </span>
            <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm font-medium shadow-soft">
              ⭐ Earn XP points
            </span>
            <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-sm font-medium shadow-soft">
              🔥 Track progress
            </span>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {habits.map((habit, index) => (
            <div 
              key={habit.id} 
              className="fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <HabitItem
                habit={habit}
                onComplete={onComplete}
                onUncomplete={onUncomplete}
                onEdit={onEdit}
                onDelete={onDelete}
                isCompleted={completedHabitIds.includes(habit.id)}
              />
            </div>
          ))}
        </div>
      )}
      
      {habits.length > 0 && (
        <div className="mt-10 p-6 glass-effect rounded-2xl border border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-3xl glow">📊</div>
              <div>
                <p className="font-bold text-gray-200 text-lg">Daily Progress</p>
                <p className="text-sm text-gray-400">
                  {completionRate === 100 ? 'Perfect day! All habits completed! 🎉' : 'Keep going! You\'re doing amazing today.'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold text-gradient ${completionRate === 100 ? 'glow' : ''}`}>
                {completionRate}%
              </div>
              <p className="text-xs text-gray-500">Complete</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HabitList;
