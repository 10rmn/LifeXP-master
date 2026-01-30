import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../services/auth';
import { getUserHabits, createHabit, completeHabit, uncompleteHabit, deleteHabit, editHabit, getUserStats } from '../services/habits';
import Navbar from './Navbar';
import ProfileSection from './ProfileSection';
import MonthlyCalendar from './MonthlyCalendar';
import StatsButtons from './StatsButtons';
import ProgressBar from './ProgressBar';
import StreakDisplay from './StreakDisplay';
import HabitForm from './HabitForm';
import HabitList from './HabitList';
import TodoSection from './TodoSection';
import JournalSection from './JournalSection';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [completedHabitIds, setCompletedHabitIds] = useState([]);
  const [stats, setStats] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [activeTab, setActiveTab] = useState('habits');
  const [formData, setFormData] = useState({
    name: '',
    frequency: 'daily',
    category: 'easy'
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      loadData(currentUser.id);
    }
  }, [navigate]);

  const loadData = async (userId) => {
    try {
      console.log('Loading data for user:', userId);
      const habitsData = await getUserHabits(userId);
      console.log('Habits loaded:', habitsData);
      setHabits(habitsData.habits || []);
      
      try {
        const statsData = await getUserStats(userId);
        setStats(statsData);
      } catch (statsError) {
        console.warn('Stats loading failed:', statsError);
        // Continue without stats
      }
      
      // Get today's completed habit IDs
      const today = new Date().toISOString().split('T')[0];
      const completedIds = []; // Will be populated from habit logs
      setCompletedHabitIds(completedIds);
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage('Failed to load data');
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating habit for user:', user.id, 'with data:', formData);
      await createHabit(user.id, formData.name, formData.frequency, formData.category);
      setMessage('Habit created successfully! 🎉');
      setFormData({ name: '', frequency: 'daily', category: 'easy' });
      setShowCreateForm(false);
      
      // Reload data after successful creation
      setTimeout(() => {
        loadData(user.id);
      }, 100);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Create habit error:', error);
      setMessage('Failed to create habit');
    }
  };

  const handleEditHabit = async (e) => {
    e.preventDefault();
    try {
      await editHabit(editingHabit.id, formData.name, formData.frequency, formData.category, editingHabit.active);
      setMessage('Habit updated successfully! ✨');
      setEditingHabit(null);
      setFormData({ name: '', frequency: 'daily', category: 'easy' });
      loadData(user.id);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update habit');
    }
  };

  const handleCompleteHabit = async (habitId) => {
    // Check if already completed
    if (completedHabitIds.includes(habitId)) {
      setMessage('⚠️ This habit is already completed today!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    try {
      const result = await completeHabit(habitId, user.id);
      setMessage(`+${result.xpEarned} XP! 🌟`);
      
      // Update user and stats
      setUser(result.user);
      localStorage.setItem('user', JSON.stringify(result.user));
      setCompletedHabitIds([...completedHabitIds, habitId]);
      
      // Reload stats
      loadData(user.id);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to complete habit';
      setMessage(`⚠️ ${errorMsg}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleUncompleteHabit = async (habitId) => {
    try {
      const result = await uncompleteHabit(habitId, user.id);
      setMessage(`-${result.xpDeducted} XP`);
      
      // Update user and stats
      setUser(result.user);
      localStorage.setItem('user', JSON.stringify(result.user));
      setCompletedHabitIds(completedHabitIds.filter(id => id !== habitId));
      
      // Reload stats
      loadData(user.id);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to uncomplete habit';
      setMessage(errorMsg);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    if (window.confirm('Delete this habit?')) {
      try {
        await deleteHabit(habitId);
        setMessage('Habit deleted');
        loadData(user.id);
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Failed to delete habit');
      }
    }
  };

  const startEdit = (habit) => {
    setEditingHabit(habit);
    setFormData({
      name: habit.name,
      frequency: habit.frequency,
      category: habit.category
    });
    setShowCreateForm(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen dark-mode">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navbar */}
        <Navbar onLogout={handleLogout} />

        {/* Welcome Header */}
        <div className="mb-10 text-center fade-in">
          <div className="inline-block">
            <h1 className="text-5xl font-bold text-gradient mb-3 glow">
              Welcome back, {user.username}! ✨
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400 text-lg font-medium">
              Ready to conquer your goals today? 🚀
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab('habits')}
            className={`tab-button ${activeTab === 'habits' ? 'active' : ''}`}
          >
            🎯 Habits
          </button>
          <button
            onClick={() => setActiveTab('todos')}
            className={`tab-button ${activeTab === 'todos' ? 'active' : ''}`}
          >
            📋 Tasks
          </button>
          <button
            onClick={() => setActiveTab('journal')}
            className={`tab-button ${activeTab === 'journal' ? 'active' : ''}`}
          >
            📝 Journal
          </button>
        </div>

        {activeTab === 'habits' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT SIDEBAR */}
            <div className="lg:col-span-1 space-y-6">
              <ProfileSection user={user} stats={stats} />
              <MonthlyCalendar userId={user.id} />
              <StatsButtons />
            </div>

            {/* RIGHT SECTION */}
            <div className="lg:col-span-2 space-y-6">
              {message && (
                <div className={message.includes('XP') || message.includes('🎉') ? 'success-message' : 'error-message'}>
                  {message}
                </div>
              )}

              {stats && (
                <div className="space-y-6">
                  <ProgressBar 
                    currentXp={stats.xp} 
                    nextLevelXp={stats.nextLevelXp} 
                    level={stats.level} 
                  />
                  <StreakDisplay 
                    streak={stats.streak} 
                    allCompletedToday={stats.allCompletedToday} 
                  />
                </div>
              )}

              {(showCreateForm || editingHabit) && (
                <div className="card fade-in glow">
                  <HabitForm
                    formData={formData}
                    setFormData={setFormData}
                    onSubmit={editingHabit ? handleEditHabit : handleCreateHabit}
                    onCancel={() => {
                      setShowCreateForm(false);
                      setEditingHabit(null);
                      setFormData({ name: '', frequency: 'daily', category: 'easy' });
                    }}
                    isEditing={!!editingHabit}
                  />
                </div>
              )}

              {!showCreateForm && !editingHabit && (
                <button 
                  onClick={() => setShowCreateForm(true)} 
                  className="btn-primary w-full shadow-soft-hover"
                >
                  ✨ Create New Habit
                </button>
              )}

              <div className="card fade-in glass-effect">
                <HabitList
                  habits={habits}
                  completedHabitIds={completedHabitIds}
                  onComplete={handleCompleteHabit}
                  onUncomplete={handleUncompleteHabit}
                  onEdit={startEdit}
                  onDelete={handleDeleteHabit}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'todos' && (
          <div className="fade-in">
            <TodoSection />
          </div>
        )}

        {activeTab === 'journal' && (
          <div className="fade-in">
            <JournalSection />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
