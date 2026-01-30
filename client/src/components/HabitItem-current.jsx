function HabitItem({ habit, onComplete, onUncomplete, onEdit, onDelete, isCompleted }) {
  const getDifficultyColor = (category) => {
    switch (category) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getDifficultyIcon = (category) => {
    switch (category) {
      case 'easy': return '😊';
      case 'medium': return '💪';
      case 'hard': return '🔥';
      default: return '📌';
    }
  };

  const getFrequencyIcon = (frequency) => {
    return frequency === 'daily' ? '🌞' : '📆';
  };

  return (
    <div className={`card p-6 transition-all duration-300 ${
      isCompleted 
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
        : 'hover:shadow-soft-hover'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left side - Habit info */}
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div className="text-2xl mt-1">
              {isCompleted ? '✅' : '⭕'}
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${
                isCompleted ? 'text-green-700 line-through' : 'text-gray-800'
              }`}>
                {habit.name}
              </h3>
              
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(habit.category)}`}>
                  {getDifficultyIcon(habit.category)} {habit.category}
                </span>
                
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {getFrequencyIcon(habit.frequency)} {habit.frequency}
                </span>
                
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                  ⭐ {habit.category === 'easy' ? '10' : habit.category === 'medium' ? '20' : '30'} XP
                </span>
              </div>
              
              <p className="text-sm text-gray-600">
                {isCompleted 
                  ? '🎉 Great job! You completed this habit today!' 
                  : '💪 Complete this habit to earn XP points!'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <button
              onClick={() => onUncomplete(habit.id)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium text-sm transition-colors shadow-soft-hover"
              title="Mark as incomplete"
            >
              ↩️ Undo
            </button>
          ) : (
            <button
              onClick={() => onComplete(habit.id)}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg font-medium text-sm transition-all shadow-soft-hover"
              title="Mark as complete"
            >
              ✅ Complete
            </button>
          )}
          
          <button
            onClick={() => onEdit(habit)}
            className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
            title="Edit habit"
          >
            ✏️
          </button>
          
          <button
            onClick={() => onDelete(habit.id)}
            className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
            title="Delete habit"
          >
            🗑️
          </button>
        </div>
      </div>
      
      {/* Progress indicator for completed habits */}
      {isCompleted && (
        <div className="mt-4 pt-4 border-t border-green-200">
          <div className="flex items-center gap-2 text-sm text-green-700">
            <div className="w-2 h-2 bg-green-500 rounded-full pulse"></div>
            <span className="font-medium">Completed today!</span>
            <span className="text-green-600">+{habit.category === 'easy' ? '10' : habit.category === 'medium' ? '20' : '30'} XP earned</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default HabitItem;
