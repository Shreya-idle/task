import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchTasks();
        }
    }, [user, navigate]);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data.data);
        } catch (err) {
            console.error('Error fetching tasks', err);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!title || !description) return setError('Title and description required');
        try {
            const res = await api.post('/tasks', { title, description });
            setTasks([res.data.data, ...tasks]);
            setTitle('');
            setDescription('');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating task');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (err) {
            alert('Error deleting task');
        }
    };

    const toggleStatus = async (task) => {
        const newStatus = task.status === 'pending' ? 'in-progress' : task.status === 'in-progress' ? 'completed' : 'pending';
        try {
            const res = await api.put(`/tasks/${task._id}`, { status: newStatus });
            setTasks(tasks.map(t => (t._id === task._id ? res.data.data : t)));
        } catch (err) {
            alert('Error updating status');
        }
    };

    if (!user) return null;

    return (
        <>
            <nav className="navbar flex-between">
                <h2 style={{ margin: 0, fontWeight: 700 }}>TaskPro API Client</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span>Welcome, {user.name} <b>({user.role})</b></span>
                    <button onClick={logout} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}>Logout</button>
                </div>
            </nav>

            <div className="container" style={{ marginTop: '2rem' }}>
                <div className="glass-panel" style={{ marginBottom: '2rem' }}>
                    <h3>Create New Task</h3>
                    {error && <div className="alert-error">{error}</div>}
                    <form onSubmit={handleCreateTask} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <input type="text" className="input-field" placeholder="Task Title (e.g. Design APIs)" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div style={{ flex: 2, minWidth: '300px' }}>
                            <input type="text" className="input-field" placeholder="Description..." value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>Add</button>
                    </form>
                </div>

                <h3>Your Task Entity Map</h3>
                <div className="task-grid">
                    {tasks.length === 0 ? <p>No tasks yet. Create one!</p> : tasks.map((task) => (
                        <div key={task._id} className="task-card">
                            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                <h3 style={{ textTransform: 'capitalize', fontSize: '1.2rem', margin: 0 }}>{task.title}</h3>
                                <span className={`badge badge-${task.status}`} style={{ cursor: 'pointer' }} onClick={() => toggleStatus(task)}>
                                    {task.status}
                                </span>
                            </div>
                            <p style={{ minHeight: '40px' }}>{task.description}</p>
                            <div className="flex-between" style={{ marginTop: '1rem', borderTop: '1px solid var(--surface-border)', paddingTop: '1rem' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                                <button onClick={() => handleDelete(task._id)} className="btn btn-danger" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
