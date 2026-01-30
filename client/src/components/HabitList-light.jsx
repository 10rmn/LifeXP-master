import HabitItem from './HabitItem';

function HabitList({ habits, completedHabitIds, onComplete, onUncomplete, onEdit, onDelete }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gradient">
          🎯 Today's Habits
        </h2>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full pulse"></div>
          <span className="text-sm text-gray-600">
            {habits.filter(h => completedHabitIds.includes(h.id)).length} / {habits.length} completed
          </span>
        </div>
      </div>
      
      {habits.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No habits yet!
          </h3>
          <p className="text-gray-600 mb-6">
            Start your journey by creating your first habit. Small steps lead to big changes! 🚀
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              💪 Build consistency
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              ⭐ Earn XP points
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              🔥 Track progress
            </span>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
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
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📊</div>
              <div>
                <p className="font-semibold text-gray-700">Daily Progress</p>
                <p className="text-sm text-gray-600">
                  Keep going! You're doing great today.
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gradient">
                {Math.round((habits.filter(h => completedHabitIds.includes(h.id)).length / habits.length) * 100)}%
              </div>
              <p className="text-xs text-gray-600">Complete</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HabitList;
