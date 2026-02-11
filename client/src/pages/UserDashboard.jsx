import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import {
    FaShieldAlt,
    FaUserFriends,
    FaHospital,
    FaUser,
    FaHistory,
    FaMapMarkerAlt,
    FaPhone,
    FaPlus,
    FaEdit,
    FaTrash,
    FaExclamationTriangle,
    FaClock,
    FaEnvelope,
    FaHome
} from 'react-icons/fa';

const UserDashboard = () => {
    const location = useLocation();
    const currentPath = location.pathname.split('/')[2] || 'home';

    return (
        <div style={{ paddingTop: '80px', minHeight: '100vh', paddingBottom: '2rem' }}>
            <div className="container">
                {/* Navigation Tabs */}
                <div className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <NavTab to="/dashboard" icon={<FaHome />} label="Home" active={currentPath === 'home' || !currentPath} />
                    <NavTab to="/dashboard/contacts" icon={<FaUserFriends />} label="Contacts" active={currentPath === 'contacts'} />
                    <NavTab to="/dashboard/help-centers" icon={<FaHospital />} label="Help Centers" active={currentPath === 'help-centers'} />
                    <NavTab to="/dashboard/history" icon={<FaHistory />} label="History" active={currentPath === 'history'} />
                    <NavTab to="/dashboard/profile" icon={<FaUser />} label="Profile" active={currentPath === 'profile'} />
                </div>

                {/* Routes */}
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<SOSHome />} />
                        <Route path="/contacts" element={<EmergencyContacts />} />
                        <Route path="/help-centers" element={<HelpCenters />} />
                        <Route path="/history" element={<AlertHistory />} />
                        <Route path="/profile" element={<Profile />} />
                    </Routes>
                </AnimatePresence>
            </div>
        </div>
    );
};

// Navigation Tab Component
const NavTab = ({ to, icon, label, active }) => (
    <Link
        to={to}
        className={`btn ${active ? 'btn-primary' : 'btn-glass'}`}
        style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem' }}
    >
        {icon}
        <span>{label}</span>
    </Link>
);

// SOS Home Component
const SOSHome = () => {
    const { user } = useAuth();
    const [location, setLocation] = useState(null);
    const [sending, setSending] = useState(false);
    const [activeAlerts, setActiveAlerts] = useState([]);

    useEffect(() => {
        // Get user's current location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        }

        fetchActiveAlerts();
    }, []);

    const fetchActiveAlerts = async () => {
        try {
            const res = await api.get('/sos/my-alerts?status=active');
            if (res.data.success) {
                setActiveAlerts(res.data.data);
            }
        } catch (error) {
            console.error('Error fetching alerts:', error);
        }
    };

    const handleSOSClick = async () => {
        if (!location) {
            toast.error('Unable to get your location. Please enable location services.');
            return;
        }

        setSending(true);
        try {
            const res = await api.post('/sos/trigger', {
                location: {
                    latitude: location.latitude,
                    longitude: location.longitude
                },
                priority: 'critical'
            });

            if (res.data.success) {
                toast.success('🚨 SOS Alert Sent! Help is on the way!');
                fetchActiveAlerts();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send SOS alert');
        } finally {
            setSending(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            {/* Welcome Section */}
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                    Welcome, {user?.name}!
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    You're protected by Guardian. Press the SOS button in case of emergency.
                </p>
            </div>

            {/* SOS Button Section */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
                <motion.button
                    className="btn-sos"
                    onClick={handleSOSClick}
                    disabled={sending}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <FaExclamationTriangle size={50} />
                    <span style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
                        {sending ? 'SENDING...' : 'SOS'}
                    </span>
                </motion.button>
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '500px' }}>
                    Press and hold the SOS button to send an emergency alert to your contacts, nearby help centers, and authorities.
                </p>
            </div>

            {/* Active Alerts */}
            {activeAlerts.length > 0 && (
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                        🚨 Active Alerts
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {activeAlerts.map((alert) => (
                            <div key={alert._id} className="glass-panel" style={{ padding: '1rem', border: '1px solid var(--primary)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontWeight: 600 }}>Alert #{alert._id.slice(-6)}</p>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                            <FaClock size={12} /> {new Date(alert.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <span style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '20px',
                                        background: 'var(--primary)',
                                        color: 'white',
                                        fontWeight: 600
                                    }}>
                                        ACTIVE
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
                <QuickStatCard icon={<FaMapMarkerAlt />} label="Location Status" value={location ? 'Active' : 'Disabled'} color={location ? 'var(--success)' : 'var(--error)'} />
                <QuickStatCard icon={<FaUserFriends />} label="Emergency Contacts" value="Manage" color="var(--secondary)" link="/dashboard/contacts" />
                <QuickStatCard icon={<FaHospital />} label="Help Centers" value="View Nearby" color="var(--accent)" link="/dashboard/help-centers" />
            </div>
        </motion.div>
    );
};

const QuickStatCard = ({ icon, label, value, color, link }) => {
    const content = (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: link ? 'pointer' : 'default' }}>
            <div style={{ color, fontSize: '2rem' }}>{icon}</div>
            <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{label}</p>
                <p style={{ fontSize: '1.2rem', fontWeight: 600, color }}>{value}</p>
            </div>
        </div>
    );

    return link ? <Link to={link}>{content}</Link> : content;
};

// Emergency Contacts Component
const EmergencyContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', relationship: 'family', priority: 1 });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await api.get('/contacts');
            if (res.data.success) {
                setContacts(res.data.data);
            }
        } catch (error) {
            toast.error('Failed to load contacts');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/contacts/${editingId}`, formData);
                toast.success('Contact updated successfully');
            } else {
                await api.post('/contacts', formData);
                toast.success('Contact added successfully');
            }
            setFormData({ name: '', phone: '', email: '', relationship: 'family', priority: 1 });
            setShowAddForm(false);
            setEditingId(null);
            fetchContacts();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save contact');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this contact?')) {
            try {
                await api.delete(`/contacts/${id}`);
                toast.success('Contact deleted successfully');
                fetchContacts();
            } catch (error) {
                toast.error('Failed to delete contact');
            }
        }
    };

    const handleEdit = (contact) => {
        setFormData({
            name: contact.name,
            phone: contact.phone,
            email: contact.email || '',
            relationship: contact.relationship,
            priority: contact.priority
        });
        setEditingId(contact._id);
        setShowAddForm(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem' }}>Emergency Contacts</h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setShowAddForm(!showAddForm);
                            setEditingId(null);
                            setFormData({ name: '', phone: '', email: '', relationship: 'family', priority: 1 });
                        }}
                    >
                        <FaPlus /> {showAddForm ? 'Cancel' : 'Add Contact'}
                    </button>
                </div>

                {/* Add/Edit Form */}
                {showAddForm && (
                    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div className="input-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Phone *</label>
                                <input
                                    type="tel"
                                    className="input-field"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="input-group">
                                <label>Relationship</label>
                                <select
                                    className="input-field"
                                    value={formData.relationship}
                                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                                >
                                    <option value="family">Family</option>
                                    <option value="friend">Friend</option>
                                    <option value="colleague">Colleague</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label>Priority (1-5)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    min="1"
                                    max="5"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            {editingId ? 'Update Contact' : 'Add Contact'}
                        </button>
                    </form>
                )}

                {/* Contacts List */}
                {contacts.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {contacts.map((contact) => (
                            <div key={contact._id} className="glass-panel" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <h3 style={{ fontSize: '1.2rem' }}>{contact.name}</h3>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn btn-glass" style={{ padding: '0.4rem 0.8rem' }} onClick={() => handleEdit(contact)}>
                                            <FaEdit size={14} />
                                        </button>
                                        <button className="btn btn-glass" style={{ padding: '0.4rem 0.8rem' }} onClick={() => handleDelete(contact._id)}>
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    <span><FaPhone size={12} /> {contact.phone}</span>
                                    {contact.email && <span><FaEnvelope size={12} /> {contact.email}</span>}
                                    <span style={{ textTransform: 'capitalize' }}>Relationship: {contact.relationship}</span>
                                    <span>Priority: {contact.priority}/5</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>
                        No emergency contacts added yet. Click "Add Contact" to get started.
                    </p>
                )}
            </div>
        </motion.div>
    );
};

// Help Centers Component
const HelpCenters = () => {
    const [helpCenters, setHelpCenters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHelpCenters();
    }, []);

    const fetchHelpCenters = async () => {
        try {
            const res = await api.get('/help-centers');
            if (res.data.success) {
                setHelpCenters(res.data.data);
            }
        } catch (error) {
            toast.error('Failed to load help centers');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Nearby Help Centers</h2>

                {loading ? (
                    <p style={{ textAlign: 'center', padding: '3rem' }}>Loading help centers...</p>
                ) : helpCenters.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {helpCenters.map((center) => (
                            <div key={center._id} className="glass-panel" style={{ padding: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{center.name}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    <span style={{ textTransform: 'capitalize' }}>Type: {center.type}</span>
                                    <span><FaPhone size={12} /> {center.phone}</span>
                                    {center.email && <span><FaEnvelope size={12} /> {center.email}</span>}
                                    {center.address && <span><FaMapMarkerAlt size={12} /> {center.address}</span>}
                                    <span style={{ color: center.isActive ? 'var(--success)' : 'var(--error)' }}>
                                        {center.isActive ? '✓ Active' : '✗ Inactive'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>
                        No help centers found in your area.
                    </p>
                )}
            </div>
        </motion.div>
    );
};

// Alert History Component
const AlertHistory = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAlerts();
    }, []);

    const fetchAlerts = async () => {
        try {
            const res = await api.get('/sos/my-alerts');
            if (res.data.success) {
                setAlerts(res.data.data);
            }
        } catch (error) {
            toast.error('Failed to load alert history');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'var(--primary)';
            case 'resolved': return 'var(--success)';
            case 'false-alarm': return 'var(--warning)';
            default: return 'var(--text-secondary)';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Alert History</h2>

                {loading ? (
                    <p style={{ textAlign: 'center', padding: '3rem' }}>Loading alerts...</p>
                ) : alerts.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {alerts.map((alert) => (
                            <div key={alert._id} className="glass-panel" style={{ padding: '1.5rem', border: `1px solid ${getStatusColor(alert.status)}30` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Alert #{alert._id.slice(-6)}</h3>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                            <FaClock size={12} /> {new Date(alert.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <span style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '20px',
                                        background: `${getStatusColor(alert.status)}30`,
                                        color: getStatusColor(alert.status),
                                        fontWeight: 600,
                                        textTransform: 'uppercase'
                                    }}>
                                        {alert.status}
                                    </span>
                                </div>
                                {alert.location && (
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                        <FaMapMarkerAlt size={12} /> {alert.location.address || `${alert.location.latitude?.toFixed(4)}, ${alert.location.longitude?.toFixed(4)}`}
                                    </p>
                                )}
                                {alert.notes && (
                                    <p style={{ marginTop: '1rem', padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.9rem' }}>
                                        {alert.notes}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '3rem' }}>
                        No alerts in your history.
                    </p>
                )}
            </div>
        </motion.div>
    );
};

// Profile Component
const Profile = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        bloodGroup: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                bloodGroup: user.bloodGroup || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put('/auth/update-profile', formData);
            if (res.data.success) {
                toast.success('Profile updated successfully');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>My Profile</h2>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            className="input-field"
                            value={user?.email || ''}
                            disabled
                            style={{ opacity: 0.6 }}
                        />
                        <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Email cannot be changed</small>
                    </div>

                    <div className="input-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            className="input-field"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Blood Group</label>
                        <select
                            className="input-field"
                            value={formData.bloodGroup}
                            onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Address</label>
                        <textarea
                            className="input-field"
                            rows="3"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default UserDashboard;
