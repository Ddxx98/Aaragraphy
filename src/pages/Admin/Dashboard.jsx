import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getFromDB, saveToDB, deleteFromDB, pushToDB, uploadFile } from '../../utils/fbApi';
import { uploadToWP, deleteFromWP } from '../../utils/wpApi';
import { Menu, X, LogOut, LayoutDashboard, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('services');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!user) {
            navigate('/admin/login');
        } else {
            loadData();
        }
    }, [user, navigate]);

    const loadData = async () => {
        setLoading(true);
        try {
            const result = await getFromDB('/');
            setData(result || {});
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (path, content) => {
        // Validation: Ensure no empty fields, but allow empty arrays if the whole list is deleted
        const validate = (obj) => {
            if (obj === null || obj === undefined) return false;
            if (typeof obj === 'string') return obj.trim() !== "";
            if (Array.isArray(obj)) {
                // Allow empty lists (so deletion can be saved)
                if (obj.length === 0) return true;
                return obj.every(item => validate(item));
            }
            if (typeof obj === 'object') {
                return Object.keys(obj).every(key => {
                    if (key.endsWith('_id')) return true;
                    return validate(obj[key]);
                });
            }
            return true;
        };

        if (!validate(content)) {
            alert("All fields are required! Please fill in all text boxes and upload all images before saving.");
            return;
        }

        setSaving(true);
        setMessage('');
        try {
            await saveToDB(path, content);
            setMessage('Changes saved successfully!');
            setData(prev => ({ ...prev, [path]: content }));
        } catch (error) {
            setMessage('Error saving changes.');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div style={styles.loading}>Loading Dashboard...</div>;

    const navItems = [
        { id: 'services', label: 'Service Packages' },
        { id: 'hero', label: 'Hero Content' },
        { id: 'about', label: 'About Us' },
        { id: 'gallery', label: 'Gallery' },
        { id: 'posts', label: 'Blog Posts' },
        { id: 'recent_work', label: 'Recent Captures' },
        { id: 'reviews', label: 'Reviews' }
    ];

    return (
        <div style={{ ...styles.container, flexDirection: isMobile ? 'column' : 'row' }}>
            {/* Mobile Header */}
            {isMobile && (
                <header style={styles.mobileHeader}>
                    <h1 style={styles.mobileLogo}>Aarography</h1>
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} style={styles.menuBtn}>
                        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </header>
            )}

            {/* Sidebar */}
            <aside style={{
                ...styles.sidebar,
                display: isMobile && !sidebarOpen ? 'none' : 'flex',
                position: isMobile ? 'fixed' : 'static',
                top: isMobile ? '60px' : '0',
                left: '0',
                width: isMobile ? '100%' : '260px',
                height: isMobile ? 'calc(100vh - 60px)' : '100vh',
                zIndex: 1000
            }}>
                <h1 style={isMobile ? { display: 'none' } : styles.logo}>Aarography CMS</h1>
                <nav style={styles.nav}>
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setActiveTab(item.id);
                                if (isMobile) setSidebarOpen(false);
                            }}
                            style={activeTab === item.id ? styles.activeNavLink : styles.navLink}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div style={styles.sidebarFooter}>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        <LogOut size={16} style={{ marginRight: '8px' }} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{
                ...styles.content,
                padding: isMobile ? '20px' : '40px',
                marginTop: isMobile ? '60px' : '0'
            }}>
                <header style={{ ...styles.header, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '10px' : '0' }}>
                    <h2 style={{ fontSize: isMobile ? '20px' : '24px' }}>{navItems.find(i => i.id === activeTab)?.label} Editor</h2>
                    <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                        <span style={{ fontSize: '13px', color: '#666' }}>Admin: {user?.email}</span>
                        {message && <div style={styles.statusMsg}>{message}</div>}
                    </div>
                </header>

                <div style={{ ...styles.editorArea, padding: isMobile ? '20px' : '30px' }}>
                    {activeTab === 'services' && (
                        <ServiceEditor
                            initialData={data?.services}
                            onSave={(val) => handleSave('services', val)}
                            isSaving={saving}
                        />
                    )}
                    {activeTab === 'hero' && (
                        <HeroEditor
                            initialData={data?.hero}
                            onSave={(val) => handleSave('hero', val)}
                            isSaving={saving}
                        />
                    )}
                    {activeTab === 'about' && (
                        <AboutEditor
                            initialData={data?.about}
                            onSave={(val) => handleSave('about', val)}
                            isSaving={saving}
                        />
                    )}
                    {(activeTab === 'gallery' || activeTab === 'recent_work' || activeTab === 'reviews' || activeTab === 'posts') && (
                        <ListEditor
                            label={activeTab}
                            initialData={data?.[activeTab] || []}
                            onSave={(val) => handleSave(activeTab, val)}
                            isSaving={saving}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

// --- Sub-Editors ---

const ImageUploader = ({ currentUrl, onUpload, label, onRemove }) => {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        const MAX_SIZE = 2 * 1024 * 1024; // 2MB
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

        if (!ALLOWED_TYPES.includes(file.type)) {
            alert('Invalid file type. Please upload a JPEG, PNG, or WEBP image.');
            e.target.value = '';
            return;
        }

        if (file.size > MAX_SIZE) {
            alert('File is too large! Please upload images smaller than 2MB.');
            e.target.value = '';
            return;
        }

        setUploading(true);
        try {
            const result = await uploadToWP(file);
            onUpload(result);
        } catch (error) {
            alert('Upload failed. Please try again.');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ marginBottom: '15px', padding: '15px', border: '1px dashed #ccc', borderRadius: '4px', backgroundColor: '#fcfcfc' }}>
            {currentUrl && (
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={currentUrl} alt="Preview" style={{ maxWidth: '100px', borderRadius: '4px', border: '1px solid #ddd' }} />
                    {onRemove && (
                        <button
                            onClick={onRemove}
                            style={{ padding: '5px 10px', fontSize: '12px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Remove Image
                        </button>
                    )}
                </div>
            )}
            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                style={{ fontSize: '12px' }}
            />
            {uploading && <span style={{ marginLeft: '10px', fontSize: '12px', color: '#397249' }}>Uploading...</span>}
        </div>
    );
};

const ListEditor = ({ label, initialData, onSave, isSaving }) => {
    const [items, setItems] = useState(Array.isArray(initialData) ? initialData : []);

    useEffect(() => {
        if (Array.isArray(initialData)) {
            setItems(initialData);
        }
    }, [initialData]);

    const addItem = () => {
        const newItem = label === 'reviews'
            ? { id: Date.now(), text: "", authorLine: "", groom: "", bride: "", date: "", image: "" }
            : label === 'posts'
                ? { id: Date.now(), title: "", groom: "", bride: "", location: "", intro: "", author: "", category: "", date: "", mainImage: "" }
                : label === 'recent_work'
                    ? { id: Date.now(), title: "", groom: "", bride: "", date: "", image: "" }
                    : { id: Date.now(), src: "", alt: "" };
        setItems(prev => [...prev, newItem]);
    };

    const updateItem = (index, field, value) => {
        setItems(prevItems => {
            const newItems = [...prevItems];
            newItems[index] = { ...newItems[index], [field]: value };
            return newItems;
        });
    };

    const removeItem = async (index) => {
        const item = items[index];
        const mediaIdsToDelete = Object.keys(item)
            .filter(key => key.endsWith('_id'))
            .map(key => item[key])
            .filter(id => id);

        // 1. Update local state immediately
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);

        // 2. Persist to Firebase immediately (meets "delete from both" requirement)
        try {
            await onSave(updatedItems);
        } catch (err) {
            console.error("Failed to persist deletion to Firebase:", err);
            // Optional: revert local state if save fails, but usually better to let user retry
        }

        // 3. Background WP cleanup
        if (mediaIdsToDelete.length > 0) {
            const confirmDelete = window.confirm("Permanently delete associated images from WordPress too?");
            if (confirmDelete) {
                (async () => {
                    for (const mId of mediaIdsToDelete) {
                        if (!mId || isNaN(Number(mId))) continue;
                        try {
                            await deleteFromWP(mId);
                        } catch (err) {
                            console.error(`Failed WP delete for ${mId}:`, err);
                        }
                    }
                })();
            }
        }
    };

    return (
        <div>
            {items.map((item, idx) => (
                <div key={idx} style={styles.itemCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <strong>Item #{idx + 1}</strong>
                        <button onClick={() => removeItem(idx)} style={styles.deleteBtn}>Delete</button>
                    </div>
                    {Object.keys(item).map(key => (
                        key !== 'id' && (
                            <div key={key} style={{ marginBottom: '10px' }}>
                                <label style={styles.label}>{key.charAt(0).toUpperCase() + key.slice(1)} <span style={{ color: '#dc2626' }}>*</span></label>
                                {(key.toLowerCase().includes('image') || key === 'src' || key === 'portrait') ? (
                                    <>
                                        <ImageUploader
                                            currentUrl={item[key]}
                                            label={label}
                                            onUpload={(res) => {
                                                updateItem(idx, key, res.url);
                                                updateItem(idx, `${key}_id`, res.id); // Store WP Media ID
                                            }}
                                            onRemove={() => {
                                                const mId = item[`${key}_id`];
                                                if (mId && !isNaN(Number(mId))) {
                                                    if (window.confirm("Permanently delete this image from WordPress?")) {
                                                        deleteFromWP(mId).catch(console.error);
                                                    }
                                                }
                                                updateItem(idx, key, "");
                                                updateItem(idx, `${key}_id`, "");
                                            }}
                                        />
                                        <input
                                            style={styles.adminInput}
                                            value={item[key]}
                                            onChange={(e) => updateItem(idx, key, e.target.value)}
                                            placeholder="URL will appear here after upload"
                                        />
                                    </>
                                ) : key === 'text' || key === 'intro' ? (
                                    <textarea
                                        style={styles.adminTextarea}
                                        value={item[key]}
                                        onChange={(e) => updateItem(idx, key, e.target.value)}
                                    />
                                ) : (
                                    <input
                                        style={styles.adminInput}
                                        value={item[key]}
                                        onChange={(e) => updateItem(idx, key, e.target.value)}
                                    />
                                )}
                            </div>
                        )
                    ))}
                </div>
            ))}
            <button onClick={addItem} style={styles.addBtn}>+ Add New Item</button>
            <div style={{ marginTop: '30px' }}>
                <button onClick={() => onSave(items)} disabled={isSaving} style={styles.saveBtn}>
                    {isSaving ? 'SAVING...' : `SAVE ${label.toUpperCase()} DATA`}
                </button>
            </div>
        </div>
    );
};

const ServiceEditor = ({ initialData, onSave, isSaving }) => {
    const [formData, setFormData] = useState(initialData || { packages: [], addons: [], notes: "" });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const addPackage = () => {
        const newPkg = { title: "", duration: "", ideal_for: "", image: "", deliverables: [] };
        setFormData(prev => ({ ...prev, packages: [...prev.packages, newPkg] }));
    };

    const removePackage = async (index) => {
        const pkg = formData.packages[index];
        const mId = pkg.image_id;

        // 1. Update state immediately
        const updatedPackages = formData.packages.filter((_, i) => i !== index);
        const updatedData = { ...formData, packages: updatedPackages };
        setFormData(updatedData);

        // 2. Persist to Firebase immediately
        try {
            await onSave(updatedData);
        } catch (err) {
            console.error("Failed to persist package removal:", err);
        }

        // 3. Background cleanup
        if (mId && !isNaN(Number(mId))) {
            const confirmDelete = window.confirm("Permanently delete package image from WordPress?");
            if (confirmDelete) {
                try {
                    await deleteFromWP(mId);
                } catch (err) {
                    console.error(`Failed to delete Package Media ${mId} from WP:`, err);
                }
            }
        }
    };

    const updatePackage = (index, field, value) => {
        setFormData(prev => {
            const newPkgs = [...prev.packages];
            newPkgs[index] = { ...newPkgs[index], [field]: value };
            return { ...prev, packages: newPkgs };
        });
    };

    const updateAddons = (val) => {
        const addons = val.split('\n').filter(line => line.trim() !== "");
        setFormData(prev => ({ ...prev, addons }));
    };

    return (
        <div>
            <h3 style={styles.sectionHeading}>Packages</h3>
            {formData.packages.map((pkg, idx) => (
                <div key={idx} style={styles.itemCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <strong>Package #{idx + 1}</strong>
                        <button onClick={() => removePackage(idx)} style={styles.deleteBtn}>Remove Package</button>
                    </div>

                    <label style={styles.label}>Title <span style={{ color: '#dc2626' }}>*</span></label>
                    <input style={styles.adminInput} value={pkg.title} onChange={(e) => updatePackage(idx, 'title', e.target.value)} placeholder="Title" />

                    <label style={styles.label}>Duration <span style={{ color: '#dc2626' }}>*</span></label>
                    <input style={styles.adminInput} value={pkg.duration} onChange={(e) => updatePackage(idx, 'duration', e.target.value)} placeholder="Duration" />

                    <label style={styles.label}>Package Image <span style={{ color: '#dc2626' }}>*</span></label>
                    <ImageUploader
                        currentUrl={pkg.image}
                        label="services"
                        onUpload={async (res) => {
                            if (pkg.image_id) {
                                try { await deleteFromWP(pkg.image_id); } catch (e) { }
                            }
                            updatePackage(idx, 'image', res.url);
                            updatePackage(idx, 'image_id', res.id);
                        }}
                    />
                    <input
                        style={styles.adminInput}
                        value={pkg.image}
                        onChange={(e) => updatePackage(idx, 'image', e.target.value)}
                        placeholder="Image URL"
                    />

                    <label style={styles.label}>Ideal For</label>
                    <textarea style={styles.adminTextarea} value={pkg.ideal_for} onChange={(e) => updatePackage(idx, 'ideal_for', e.target.value)} placeholder="Ideal for..." />

                    <label style={styles.label}>Deliverables (One per line)</label>
                    <textarea style={styles.adminTextarea} value={pkg.deliverables?.join('\n')} onChange={(e) => updatePackage(idx, 'deliverables', e.target.value.split('\n'))} placeholder="Deliverables (one per line)" />
                </div>
            ))}
            <button onClick={addPackage} style={{ ...styles.addBtn, marginBottom: '30px' }}>+ Add New Package</button>

            <h3 style={styles.sectionHeading}>Addons (One per line) <span style={{ color: '#dc2626' }}>*</span></h3>
            <textarea
                style={{ ...styles.adminTextarea, minHeight: '120px' }}
                value={formData.addons?.join('\n')}
                onChange={(e) => updateAddons(e.target.value)}
                placeholder="Addon 1&#10;Addon 2..."
            />

            <h3 style={styles.sectionHeading}>Note <span style={{ color: '#dc2626' }}>*</span></h3>
            <textarea style={styles.adminTextarea} value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} />

            <div style={{ marginTop: '30px' }}>
                <button onClick={() => onSave(formData)} disabled={isSaving} style={styles.saveBtn}>
                    {isSaving ? 'SAVING...' : 'SAVE ALL SERVICE DATA'}
                </button>
            </div>
        </div>
    );
};

const HeroEditor = ({ initialData, onSave, isSaving }) => {
    const [formData, setFormData] = useState(initialData || { image: "" });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);
    return (
        <div style={styles.itemCard}>
            <label style={styles.label}>Background Image <span style={{ color: '#dc2626' }}>*</span></label>
            <ImageUploader
                currentUrl={formData.image}
                label="hero"
                onUpload={async (res) => {
                    if (formData.image_id) {
                        try { await deleteFromWP(formData.image_id); } catch (e) { }
                    }
                    setFormData(prev => ({ ...prev, image: res.url, image_id: res.id }));
                }}
                onRemove={() => {
                    if (formData.image_id && !isNaN(Number(formData.image_id))) {
                        if (window.confirm("Permanently delete this image from WordPress?")) {
                            deleteFromWP(formData.image_id).catch(console.error);
                        }
                    }
                    setFormData(prev => ({ ...prev, image: "", image_id: "" }));
                }}
            />
            <input
                style={styles.adminInput}
                value={formData.image}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="Image URL"
            />
            <button onClick={() => onSave(formData)} disabled={isSaving} style={styles.saveBtn}>SAVE HERO</button>
        </div>
    );
};

const AboutEditor = ({ initialData, onSave, isSaving }) => {
    const [formData, setFormData] = useState(initialData || { portrait: "", myStory: "", whyPhotography: "", values: "" });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);
    return (
        <div style={styles.itemCard}>
            <label style={styles.label}>Portrait Image <span style={{ color: '#dc2626' }}>*</span></label>
            <ImageUploader
                currentUrl={formData.portrait}
                label="about"
                onUpload={async (res) => {
                    if (formData.portrait_id) {
                        try { await deleteFromWP(formData.portrait_id); } catch (e) { }
                    }
                    setFormData(prev => ({ ...prev, portrait: res.url, portrait_id: res.id }));
                }}
                onRemove={() => {
                    if (formData.portrait_id && !isNaN(Number(formData.portrait_id))) {
                        if (window.confirm("Permanently delete this image from WordPress?")) {
                            deleteFromWP(formData.portrait_id).catch(console.error);
                        }
                    }
                    setFormData(prev => ({ ...prev, portrait: "", portrait_id: "" }));
                }}
            />
            <input
                style={styles.adminInput}
                value={formData.portrait}
                onChange={(e) => setFormData(prev => ({ ...prev, portrait: e.target.value }))}
                placeholder="Portrait URL"
            />

            <label style={styles.label}>My Story <span style={{ color: '#dc2626' }}>*</span></label>
            <textarea style={styles.adminTextarea} value={formData.myStory} onChange={(e) => setFormData(prev => ({ ...prev, myStory: e.target.value }))} />
            <label style={styles.label}>Why Photography <span style={{ color: '#dc2626' }}>*</span></label>
            <textarea style={styles.adminTextarea} value={formData.whyPhotography} onChange={(e) => setFormData(prev => ({ ...prev, whyPhotography: e.target.value }))} />
            <label style={styles.label}>Values <span style={{ color: '#dc2626' }}>*</span></label>
            <textarea style={styles.adminTextarea} value={formData.values} onChange={(e) => setFormData(prev => ({ ...prev, values: e.target.value }))} />
            <button onClick={() => onSave(formData)} disabled={isSaving} style={styles.saveBtn}>SAVE ABOUT</button>
        </div>
    );
};

const styles = {
    container: { display: 'flex', height: '100vh', fontFamily: 'Instrument Sans, sans-serif' },
    sidebar: { width: '260px', backgroundColor: '#325735', color: 'white', padding: '30px', display: 'flex', flexDirection: 'column' },
    logo: { fontFamily: 'Instrument Serif, serif', fontSize: '24px', marginBottom: '40px' },
    nav: { flex: 1, overflowY: 'auto' },
    navLink: { display: 'block', width: '100%', padding: '10px 15px', textAlign: 'left', background: 'none', border: 'none', color: '#EAEAD4', fontSize: '14px', cursor: 'pointer', borderRadius: '6px', marginBottom: '5px' },
    activeNavLink: { display: 'block', width: '100%', padding: '10px 15px', textAlign: 'left', background: '#397249', border: 'none', color: 'white', fontSize: '14px', cursor: 'pointer', borderRadius: '6px', marginBottom: '5px', fontWeight: '600' },
    sidebarFooter: { paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' },
    logoutBtn: { width: '100%', padding: '10px', background: 'none', border: '1px solid #EAEAD4', color: '#EAEAD4', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
    content: { flex: 1, backgroundColor: '#F2F1E4', padding: '40px', overflowY: 'auto' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid #ddd', paddingBottom: '20px' },
    statusMsg: { fontSize: '12px', color: '#397249', fontWeight: '600', marginTop: '5px' },
    loading: { height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#325735' },
    editorArea: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', minHeight: '400px' },
    label: { display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '5px', color: '#666' },
    sectionHeading: { fontSize: '18px', color: '#556b53', marginBottom: '20px', marginTop: '30px' },
    itemCard: { padding: '20px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#fafafa' },
    adminInput: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '14px' },
    adminTextarea: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '60px', fontSize: '14px', fontFamily: 'inherit' },
    saveBtn: { padding: '12px 24px', backgroundColor: '#397249', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', width: '100%' },
    addBtn: { padding: '10px 20px', backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', width: '100%' },
    deleteBtn: { backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
    mobileHeader: {
        height: '60px',
        backgroundColor: '#325735',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100
    },
    mobileLogo: { fontFamily: 'Instrument Serif, serif', fontSize: '20px', color: 'white' },
    menuBtn: { background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '5px' }
};

export default Dashboard;
