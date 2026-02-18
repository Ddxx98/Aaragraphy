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
            // Start inactivity timer when user is logged in
            resetInactivityTimer();
        }

        // Setup event listeners for user activity
        const activities = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
        activities.forEach(event => window.addEventListener(event, resetInactivityTimer));

        return () => {
            if (inactivityTimeout) clearTimeout(inactivityTimeout);
            activities.forEach(event => window.removeEventListener(event, resetInactivityTimer));
        };
    }, [user, navigate]);

    let inactivityTimeout;
    const resetInactivityTimer = () => {
        if (inactivityTimeout) clearTimeout(inactivityTimeout);

        // 30 minutes in milliseconds (30 * 60 * 1000)
        const TIMEOUT_DURATION = 30 * 60 * 1000;

        inactivityTimeout = setTimeout(() => {
            console.log("Inactivity timeout reached. Logging out...");
            handleLogout();
        }, TIMEOUT_DURATION);
    };

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

    const handleSave = async (path, content, bypassValidation = false) => {
        // Validation: Ensure no empty fields
        const validate = (obj) => {
            if (obj === null || obj === undefined) return false;
            if (typeof obj === 'string') return obj.trim() !== "";
            if (Array.isArray(obj)) {
                if (obj.length === 0) return true;
                return obj.every(item => validate(item));
            }
            if (typeof obj === 'object') {
                return Object.keys(obj).every(key => {
                    if (key.endsWith('_id')) return true;
                    // Make 'addons' and 'notes' optional for services
                    if (path === 'services' && (key === 'addons' || key === 'notes')) return true;
                    // Make specific blog post fields optional
                    if (path === 'posts' && (key === 'groom' || key === 'bride' || key === 'location' || key === 'section1' || key === 'section2')) return true;
                    return validate(obj[key]);
                });
            }
            return true;
        };

        if (!bypassValidation && !validate(content)) {
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
            // Clear cache/storage
            localStorage.clear();
            sessionStorage.clear();
            navigate('/');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    if (loading) return <div style={styles.loading}>Loading Dashboard...</div>;

    const navItems = [
        { id: 'services', label: 'Service Packages' },
        { id: 'serviceList', label: 'Service Items' },
        { id: 'hero', label: 'Hero Content' },
        { id: 'about', label: 'About Us' },
        { id: 'about_photographer', label: 'Photographer Bio' },
        { id: 'faq', label: 'FAQs' },
        { id: 'gallery', label: 'Gallery' },
        { id: 'posts', label: 'Blog Posts' },
        { id: 'reviews', label: 'Reviews' }
    ];

    return (
        <div style={{ ...styles.container, flexDirection: isMobile ? 'column' : 'row' }}>
            {/* Mobile Header */}
            {isMobile && (
                <header style={styles.mobileHeader}>
                    <h1 style={styles.mobileLogo}>Aaragraphy</h1>
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
                <h1 style={isMobile ? { display: 'none' } : styles.logo}>Aaragraphy CMS</h1>
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
                padding: isMobile ? '0 20px 20px' : '0 40px 40px',
                marginTop: isMobile ? '60px' : '0',
                paddingTop: isMobile ? '20px' : '0'
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
                            initialData={data?.services || {}}
                            onSave={(val, bypass) => handleSave('services', val, bypass)}
                            isSaving={saving}
                        />
                    )}
                    {activeTab === 'serviceList' && (
                        <ListEditor
                            label="serviceList"
                            initialData={data?.serviceList || []}
                            onSave={(val, bypass) => handleSave('serviceList', val, bypass)}
                            isSaving={saving}
                        />
                    )}
                    {activeTab === 'hero' && (
                        <HeroManager
                            initialHero={data?.hero}
                            initialCapturedHero={data?.captured_hero}
                            onSaveHero={(val, bypass) => handleSave('hero', val, bypass)}
                            onSaveCapturedHero={(val, bypass) => handleSave('captured_hero', val, bypass)}
                            isSaving={saving}
                        />
                    )}
                    {activeTab === 'about' && (
                        <AboutEditor
                            initialData={data?.about}
                            onSave={(val, bypass) => handleSave('about', val, bypass)}
                            isSaving={saving}
                        />
                    )}
                    {activeTab === 'about_photographer' && (
                        <PhotographerEditor
                            initialData={data?.about_photographer}
                            onSave={(val, bypass) => handleSave('about_photographer', val, bypass)}
                            isSaving={saving}
                        />
                    )}
                    {activeTab === 'faq' && (
                        <ListEditor
                            label="faq"
                            initialData={data?.faq || []}
                            onSave={(val, bypass) => handleSave('faq', val, bypass)}
                            isSaving={saving}
                        />
                    )}
                    {activeTab === 'posts' ? (
                        <BlogManager
                            initialData={data?.posts || []}
                            onSaveAll={(val) => handleSave('posts', val)}
                            isSaving={saving}
                        />
                    ) : (activeTab === 'gallery' || activeTab === 'reviews') && (
                        <ListEditor
                            label={activeTab}
                            initialData={data?.[activeTab] || []}
                            onSave={(val, bypass) => handleSave(activeTab, val, bypass)}
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
        if (initialData) {
            const normalized = Array.isArray(initialData)
                ? initialData
                : Object.entries(initialData).map(([id, val]) => ({ ...val, id: val.id || id }));
            setItems(normalized);
        }
    }, [initialData]);

    const addItem = () => {
        const newItem = label === 'reviews'
            ? { id: Date.now(), text: "", authorLine: "", groom: "", bride: "", date: "", image: "" }
            : label === 'posts'
                ? { id: Date.now(), title: "", groom: "", bride: "", location: "", intro: "", author: "", category: "", date: "", mainImage: "" }
                : label === 'serviceList'
                    ? { id: Date.now(), service_id: "", label: "", image: "", description: "" }
                    : label === 'faq'
                        ? { id: Date.now(), question: "", answer: "" }
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

        // 2. Persist to Firebase immediately
        try {
            await onSave(updatedItems, true); // Bypass validation for deletions
        } catch (err) {
            console.error("Failed to persist deletion to Firebase:", err);
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
            {label === 'gallery' && (
                <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#eef2ff',
                    border: '1px solid #c7d2fe',
                    borderRadius: '6px',
                    marginBottom: '20px',
                    color: '#3730a3',
                    fontSize: '13px',
                    fontWeight: '500'
                }}>
                    💡 <strong>Tip:</strong> For the best visual layout, please upload images in <strong>multiples of 3</strong> (e.g., 3, 6, 9, 12 images). This ensures the 3-column grid stays perfectly balanced.
                </div>
            )}
            {items?.map((item, idx) => (
                <div key={idx} style={styles.itemCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <strong>Item #{idx + 1}</strong>
                        <button onClick={() => removeItem(idx)} style={styles.deleteBtn}>Delete</button>
                    </div>
                    {Object.keys(item || {}).map(key => (
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
                                ) : (key === 'text' || key === 'intro' || key === 'answer' || key === 'description') ? (
                                    <textarea
                                        style={{ ...styles.adminTextarea, minHeight: key === 'answer' || key === 'description' ? '100px' : '60px' }}
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
        setFormData(prev => ({ ...prev, packages: [...(prev?.packages || []), newPkg] }));
    };

    const removePackage = async (index) => {
        const pkg = formData.packages[index];
        const mId = pkg.image_id;

        // 1. Update state immediately
        const updatedPackages = (formData?.packages || []).filter((_, i) => i !== index);
        const updatedData = { ...formData, packages: updatedPackages };
        setFormData(updatedData);

        // 2. Persist to Firebase immediately
        try {
            await onSave(updatedData, true); // Bypass validation for removals
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
        const addons = val.split('\n');
        setFormData(prev => ({ ...prev, addons }));
    };

    return (
        <div>
            <h3 style={styles.sectionHeading}>Packages</h3>
            {formData?.packages?.map((pkg, idx) => (
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

                    <label style={styles.label}>Ideal For <span style={{ color: '#dc2626' }}>*</span></label>
                    <textarea style={styles.adminTextarea} value={pkg.ideal_for} onChange={(e) => updatePackage(idx, 'ideal_for', e.target.value)} placeholder="Ideal for..." />

                    <label style={styles.label}>Deliverables (One per line) <span style={{ color: '#dc2626' }}>*</span></label>
                    <textarea style={styles.adminTextarea} value={pkg.deliverables?.join('\n')} onChange={(e) => updatePackage(idx, 'deliverables', e.target.value.split('\n'))} placeholder="Deliverables (one per line)" />
                </div>
            ))}
            <button onClick={addPackage} style={{ ...styles.addBtn, marginBottom: '30px' }}>+ Add New Package</button>

            <h3 style={styles.sectionHeading}>Addons (One per line)</h3>
            <textarea
                style={{ ...styles.adminTextarea, minHeight: '120px' }}
                value={formData.addons?.join('\n')}
                onChange={(e) => updateAddons(e.target.value)}
                placeholder="Addon 1&#10;Addon 2..."
            />

            <h3 style={styles.sectionHeading}>Note</h3>
            <textarea style={styles.adminTextarea} value={formData?.notes || ""} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} />

            <div style={{ marginTop: '30px' }}>
                <button onClick={() => onSave(formData)} disabled={isSaving} style={styles.saveBtn}>
                    {isSaving ? 'SAVING...' : 'SAVE ALL SERVICE DATA'}
                </button>
            </div>
        </div>
    );
};

const HeroManager = ({ initialHero, initialCapturedHero, onSaveHero, onSaveCapturedHero, isSaving }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={styles.itemCard}>
                <h3 style={styles.sectionHeading}>Homepage Hero</h3>
                <HeroSubEditor
                    initialData={initialHero}
                    onSave={onSaveHero}
                    isSaving={isSaving}
                    label="hero"
                />
            </div>
            <div style={styles.itemCard}>
                <h3 style={styles.sectionHeading}>Interior Pages Hero (Captured Title)</h3>
                <HeroSubEditor
                    initialData={initialCapturedHero}
                    onSave={onSaveCapturedHero}
                    isSaving={isSaving}
                    label="captured_hero"
                />
            </div>
        </div>
    );
};

const HeroSubEditor = ({ initialData, onSave, isSaving, label }) => {
    const [formData, setFormData] = useState(initialData || { image: "" });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    return (
        <div>
            <label style={styles.label}>Background Image <span style={{ color: '#dc2626' }}>*</span></label>
            <ImageUploader
                currentUrl={formData?.image}
                label={label}
                onUpload={async (res) => {
                    if (formData.image_id) {
                        try { await deleteFromWP(formData.image_id); } catch (e) { }
                    }
                    setFormData(prev => ({ ...prev, image: res.url, image_id: res.id }));
                }}
                onRemove={async () => {
                    if (formData.image_id && !isNaN(Number(formData.image_id))) {
                        if (window.confirm("Permanently delete this image from WordPress?")) {
                            deleteFromWP(formData.image_id).catch(console.error);
                        }
                    }
                    const updated = { ...formData, image: "", image_id: "" };
                    setFormData(updated);
                    try {
                        await onSave(updated, true); // Bypass validation for image removal
                    } catch (err) {
                        console.error(`${label} removal save failed:`, err);
                    }
                }}
            />
            <input
                style={styles.adminInput}
                value={formData?.image || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                placeholder="Image URL"
            />
            <button
                onClick={() => onSave(formData)}
                disabled={isSaving}
                style={{ ...styles.saveBtn, marginTop: '10px' }}
            >
                SAVE {label.toUpperCase().replace('_', ' ')}
            </button>
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
                currentUrl={formData?.portrait}
                label="about"
                onUpload={async (res) => {
                    if (formData.portrait_id) {
                        try { await deleteFromWP(formData.portrait_id); } catch (e) { }
                    }
                    setFormData(prev => ({ ...prev, portrait: res.url, portrait_id: res.id }));
                }}
                onRemove={async () => {
                    if (formData.portrait_id && !isNaN(Number(formData.portrait_id))) {
                        if (window.confirm("Permanently delete this image from WordPress?")) {
                            deleteFromWP(formData.portrait_id).catch(console.error);
                        }
                    }
                    const updated = { ...formData, portrait: "", portrait_id: "" };
                    setFormData(updated);
                    try {
                        await onSave(updated, true); // Bypass validation for portrait removal
                    } catch (err) {
                        console.error("About removal save failed:", err);
                    }
                }}
            />
            <input
                style={styles.adminInput}
                value={formData?.portrait || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, portrait: e.target.value }))}
                placeholder="Portrait URL"
            />

            <label style={styles.label}>My Story <span style={{ color: '#dc2626' }}>*</span></label>
            <textarea style={styles.adminTextarea} value={formData?.myStory || ""} onChange={(e) => setFormData(prev => ({ ...prev, myStory: e.target.value }))} />
            <label style={styles.label}>Why Photography <span style={{ color: '#dc2626' }}>*</span></label>
            <textarea style={styles.adminTextarea} value={formData?.whyPhotography || ""} onChange={(e) => setFormData(prev => ({ ...prev, whyPhotography: e.target.value }))} />
            <label style={styles.label}>Values <span style={{ color: '#dc2626' }}>*</span></label>
            <textarea style={styles.adminTextarea} value={formData?.values || ""} onChange={(e) => setFormData(prev => ({ ...prev, values: e.target.value }))} />
            <button onClick={() => onSave(formData, true)} disabled={isSaving} style={styles.saveBtn}>SAVE ABOUT</button>
        </div>
    );
};

const BlogManager = ({ initialData, onSaveAll, isSaving }) => {
    const [posts, setPosts] = useState(Array.isArray(initialData) ? initialData : []);
    const [editingPost, setEditingPost] = useState(null);

    useEffect(() => {
        if (initialData) {
            const normalized = Array.isArray(initialData)
                ? initialData
                : Object.entries(initialData).map(([id, val]) => ({ ...val, id: val.id || id }));
            setPosts(normalized);
        }
    }, [initialData]);

    const addPost = () => {
        const newPost = {
            id: Date.now(),
            title: "", author: "", category: "Wedding", date: new Date().toISOString().split('T')[0],
            location: "", groom: "", bride: "", mainImage: "", intro: "",
            section1: { title: "The Beginning", text: "", images: [] },
            section2: { title: "The Ceremony", text: "", images: [] },
            gallery: []
        };
        setPosts(prev => [...prev, newPost]);
        setEditingPost(newPost);
    };

    const deletePost = async (id) => {
        if (!window.confirm("Are you sure you want to delete this story?")) return;
        const updated = posts.filter(p => p.id !== id);
        setPosts(updated);
        await onSaveAll(updated, true);
    };

    const savePost = async (updatedPost) => {
        const updatedPosts = posts.map(p => p.id === updatedPost.id ? updatedPost : p);
        setPosts(updatedPosts);
        await onSaveAll(updatedPosts);
        setEditingPost(null);
    };

    if (editingPost) {
        return (
            <div>
                <button
                    onClick={() => setEditingPost(null)}
                    style={{ ...styles.addBtn, width: 'auto', marginBottom: '20px', backgroundColor: '#f3f4f6' }}
                >
                    ← Back to Stories
                </button>
                <BlogPostEditor
                    post={editingPost}
                    onSave={savePost}
                    isSaving={isSaving}
                />
            </div>
        );
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Stories ({posts?.length || 0})</h3>
                <button onClick={addPost} style={{ ...styles.addBtn, width: 'auto' }}>+ New Story</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                {posts?.map((post) => (
                    <div key={post.id} style={styles.itemCard}>
                        {post.mainImage && (
                            <img src={post.mainImage} alt={post.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }} />
                        )}
                        <h4 style={{ margin: '0 0 5px 0' }}>{post.title || "Untitled Story"}</h4>
                        <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>{post.date} • {post.category}</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => setEditingPost(post)} style={{ ...styles.saveBtn, padding: '5px 10px', fontSize: '12px' }}>Edit</button>
                            <button onClick={() => deletePost(post.id)} style={styles.deleteBtn}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const BlogPostEditor = ({ post, onSave, isSaving }) => {
    const [formData, setFormData] = useState({
        ...post,
        section1: post.section1 || { title: "The Beginning", text: "", images: [] },
        section2: post.section2 || { title: "The Ceremony", text: "", images: [] },
        gallery: post.gallery || []
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateSection = (sectionKey, field, value) => {
        setFormData(prev => ({
            ...prev,
            [sectionKey]: { ...prev[sectionKey], [field]: value }
        }));
    };

    const addImageToSection = (sectionKey, url, id) => {
        setFormData(prev => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                images: [...(prev[sectionKey].images || []), url],
                image_ids: [...(prev[sectionKey].image_ids || []), id]
            }
        }));
    };

    const removeImageFromSection = (sectionKey, index) => {
        setFormData(prev => {
            const images = [...prev[sectionKey].images];
            const ids = prev[sectionKey].image_ids ? [...prev[sectionKey].image_ids] : [];
            images.splice(index, 1);
            if (ids[index]) ids.splice(index, 1);
            return {
                ...prev,
                [sectionKey]: { ...prev[sectionKey], images, image_ids: ids }
            };
        });
    };

    return (
        <div>
            <div style={styles.itemCard}>
                <h3 style={{ marginTop: 0 }}>Basic Info</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={styles.label}>Post Title <span style={{ color: '#dc2626' }}>*</span></label>
                        <input style={styles.adminInput} value={formData.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="A Beautiful Wedding Story" />

                        <label style={styles.label}>Author Name <span style={{ color: '#dc2626' }}>*</span></label>
                        <input style={styles.adminInput} value={formData.author} onChange={(e) => handleChange('author', e.target.value)} placeholder="Aniketh Russel & Arunima David" />

                        <label style={styles.label}>Category <span style={{ color: '#dc2626' }}>*</span></label>
                        <select
                            style={styles.adminInput}
                            value={formData.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                        >
                            <option value="Wedding">Wedding</option>
                            <option value="Engagement">Engagement</option>
                            <option value="Event">Event</option>
                            <option value="Portrait">Portrait</option>
                            <option value="Branding">Branding</option>
                        </select>
                    </div>
                    <div>
                        <label style={styles.label}>Event Date <span style={{ color: '#dc2626' }}>*</span></label>
                        <input type="date" style={styles.adminInput} value={formData.date} onChange={(e) => handleChange('date', e.target.value)} />

                        <label style={styles.label}>Location <span style={{ color: '#dc2626' }}>*</span></label>
                        <input style={styles.adminInput} value={formData.location} onChange={(e) => handleChange('location', e.target.value)} placeholder="South India, Bangalore" />

                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={styles.label}>Groom Name</label>
                                <input style={styles.adminInput} value={formData.groom} onChange={(e) => handleChange('groom', e.target.value)} placeholder="Groom" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={styles.label}>Bride Name</label>
                                <input style={styles.adminInput} value={formData.bride} onChange={(e) => handleChange('bride', e.target.value)} placeholder="Bride" />
                            </div>
                        </div>
                    </div>
                </div>

                <label style={styles.label}>Hero Image <span style={{ color: '#dc2626' }}>*</span></label>
                <ImageUploader
                    currentUrl={formData.mainImage}
                    label="posts"
                    onUpload={(res) => {
                        handleChange('mainImage', res.url);
                        handleChange('mainImage_id', res.id);
                    }}
                    onRemove={() => {
                        handleChange('mainImage', "");
                        handleChange('mainImage_id', "");
                    }}
                />

                <label style={styles.label}>Introduction Text <span style={{ color: '#dc2626' }}>*</span></label>
                <textarea
                    style={{ ...styles.adminTextarea, minHeight: '100px' }}
                    value={formData.intro}
                    onChange={(e) => handleChange('intro', e.target.value)}
                    placeholder="Short intro about the story..."
                />

            </div>

            <div style={styles.itemCard}>
                <h3>Section 1: {formData.section1?.title || "Beginning"}</h3>
                <label style={styles.label}>Section Title</label>
                <input style={styles.adminInput} value={formData.section1?.title} onChange={(e) => updateSection('section1', 'title', e.target.value)} />

                <label style={styles.label}>Section Body Text</label>
                <textarea
                    style={{ ...styles.adminTextarea, minHeight: '120px' }}
                    value={formData.section1?.text}
                    onChange={(e) => updateSection('section1', 'text', e.target.value)}
                />

                <label style={styles.label}>Section Images (Recommended: 2)</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {formData.section1?.images?.map((url, i) => (
                        <div key={i} style={{ position: 'relative' }}>
                            <img src={url} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                            <button
                                onClick={() => removeImageFromSection('section1', i)}
                                style={{ position: 'absolute', top: -5, right: -5, width: 20, height: 20, borderRadius: '50%', border: 'none', backgroundColor: '#dc2626', color: 'white', cursor: 'pointer', fontSize: '10px' }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                <ImageUploader label="posts" onUpload={(res) => addImageToSection('section1', res.url, res.id)} />
            </div>

            <div style={styles.itemCard}>
                <h3>Section 2: {formData.section2?.title || "The Ceremony"}</h3>
                <label style={styles.label}>Section Title</label>
                <input style={styles.adminInput} value={formData.section2?.title} onChange={(e) => updateSection('section2', 'title', e.target.value)} />

                <label style={styles.label}>Section Body Text</label>
                <textarea
                    style={{ ...styles.adminTextarea, minHeight: '120px' }}
                    value={formData.section2?.text}
                    onChange={(e) => updateSection('section2', 'text', e.target.value)}
                />

                <label style={styles.label}>Section Images (Recommended: 3)</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    {formData.section2?.images?.map((url, i) => (
                        <div key={i} style={{ position: 'relative' }}>
                            <img src={url} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                            <button
                                onClick={() => removeImageFromSection('section2', i)}
                                style={{ position: 'absolute', top: -5, right: -5, width: 20, height: 20, borderRadius: '50%', border: 'none', backgroundColor: '#dc2626', color: 'white', cursor: 'pointer', fontSize: '10px' }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                <ImageUploader label="posts" onUpload={(res) => addImageToSection('section2', res.url, res.id)} />
            </div>

            <div style={styles.itemCard}>
                <h3>Story Gallery</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
                    {formData.gallery?.map((item, i) => (
                        <div key={i} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                            <img src={item.src} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '2px' }} />
                            <select
                                style={{ ...styles.adminInput, marginTop: '5px', padding: '5px', fontSize: '11px' }}
                                value={item.size}
                                onChange={(e) => {
                                    const newGallery = [...formData.gallery];
                                    newGallery[i] = { ...newGallery[i], size: e.target.value };
                                    handleChange('gallery', newGallery);
                                }}
                            >
                                <option value="small">Small (1/3)</option>
                                <option value="medium">Medium (1/2)</option>
                                <option value="large">Large (Full)</option>
                            </select>
                            <button
                                onClick={() => {
                                    const newGallery = formData.gallery.filter((_, idx) => idx !== i);
                                    handleChange('gallery', newGallery);
                                }}
                                style={{ ...styles.deleteBtn, width: '100%' }}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <div style={{ border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '160px', borderRadius: '4px' }}>
                        <ImageUploader
                            label="posts"
                            onUpload={(res) => {
                                const newImg = { src: res.url, src_id: res.id, size: "medium" };
                                handleChange('gallery', [...(formData.gallery || []), newImg]);
                            }}
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={() => onSave(formData)}
                disabled={isSaving}
                style={{ ...styles.saveBtn, position: 'sticky', bottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            >
                {isSaving ? 'UPLOADING AND SAVING...' : 'SAVE STORY'}
            </button>
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
    content: { flex: 1, backgroundColor: '#F2F1E4', padding: '0 40px 40px', overflowY: 'auto' },
    header: { position: 'sticky', top: 0, backgroundColor: '#F2F1E4', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '40px 0 20px', marginBottom: '40px', borderBottom: '1px solid #ddd' },
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

const PhotographerEditor = ({ initialData, onSave, isSaving }) => {
    const [formData, setFormData] = useState(initialData || {
        heroTitle: "",
        heroMobileTitle: "",
        testimonial1: "",
        testimonial2: "",
        testimonial3: ""
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    return (
        <div style={styles.itemCard}>
            <div style={{
                padding: '12px 16px',
                backgroundColor: '#fef3c7',
                border: '1px solid #fcd34d',
                borderRadius: '6px',
                marginBottom: '20px',
                color: '#92400e',
                fontSize: '13px'
            }}>
                💡 <strong>Tip:</strong> You can use <code>&lt;br&gt;</code> for line breaks and <code>&lt;span&gt;text&lt;/span&gt;</code> to highlight text in green/yellow.
            </div>

            <label style={styles.label}>Hero Title (Desktop) <span style={{ color: '#dc2626' }}>*</span></label>
            <textarea
                style={{ ...styles.adminTextarea, minHeight: '120px' }}
                value={formData?.heroTitle || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, heroTitle: e.target.value }))}
                placeholder="WE DON'T JUST<br><span>CAPTURE</span><br>MOMENTS..."
            />

            <label style={styles.label}>Hero Title (Mobile) <span style={{ color: '#dc2626' }}>*</span></label>
            <textarea
                style={{ ...styles.adminTextarea, minHeight: '80px' }}
                value={formData?.heroMobileTitle || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, heroMobileTitle: e.target.value }))}
                placeholder="WE DON'T JUST CAPTURE<br> MOMENTS..."
            />

            <label style={styles.label}>Testimonial 1 <span style={{ color: '#dc2626' }}>*</span></label>
            <textarea
                style={{ ...styles.adminTextarea, minHeight: '80px' }}
                value={formData?.testimonial1 || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, testimonial1: e.target.value }))}
            />

            <label style={styles.label}>Testimonial 2 <span style={{ color: '#dc2626' }}>*</span></label>
            <textarea
                style={{ ...styles.adminTextarea, minHeight: '80px' }}
                value={formData?.testimonial2 || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, testimonial2: e.target.value }))}
            />

            <label style={styles.label}>Testimonial 3 <span style={{ color: '#dc2626' }}>*</span></label>
            <textarea
                style={{ ...styles.adminTextarea, minHeight: '80px' }}
                value={formData?.testimonial3 || ""}
                onChange={(e) => setFormData(prev => ({ ...prev, testimonial3: e.target.value }))}
            />

            <button onClick={() => onSave(formData)} disabled={isSaving} style={styles.saveBtn}>
                {isSaving ? 'SAVING...' : 'SAVE PHOTOGRAPHER BIO'}
            </button>
        </div>
    );
};

export default Dashboard;
