function HabitForm({ formData, setFormData, onSubmit, onCancel, isEditing }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient mb-2">
          {isEditing ? '✏️ Edit Habit' : '🌟 Create New Habit'}
        </h2>
        <p className="text-gray-600">
          {isEditing ? 'Update your habit details' : 'Start building a better you'}
        </p>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="form-group">
          <label className="form-label">
            💪 Habit Name
          </label>
          <input
            type="text"
            className="form-input"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Morning Workout, Read 30 mins, Meditate"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="form-label">
              📅 Frequency
            </label>
            <select
              className="form-input"
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            >
              <option value="daily">🌞 Daily</option>
              <option value="weekly">📆 Weekly</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">
              ⭐ Difficulty
            </label>
            <select
              className="form-input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="easy">😊 Easy (10 XP)</option>
              <option value="medium">💪 Medium (20 XP)</option>
              <option value="hard">🔥 Hard (30 XP)</option>
            </select>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            type="submit" 
            className="btn-primary flex-1 shadow-soft-hover"
          >
            {isEditing ? '💾 Update Habit' : '🚀 Create Habit'}
          </button>
          <button 
            type="button" 
            className="btn-secondary flex-1 shadow-soft-hover" 
            onClick={onCancel}
          >
            ❌ Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default HabitForm;
