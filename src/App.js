import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import AddBill from './components/AddBill';
import Reports from './components/Reports';
import CustomerList from './components/CustomerList';
import Login from './components/Login';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <Router>
      <div style={styles.container}>
        {!isLoggedIn ? (
          <Login onLogin={handleLogin} />
        ) : (
          <>
            <div style={{ ...styles.sideNav, width: isSidebarOpen ? '250px' : '60px' }}>
              <button onClick={toggleSidebar} style={styles.toggleButton}>
                {isSidebarOpen ? (
                  <i className="fas fa-angle-left" aria-hidden="true"></i>
                ) : (
                  <i className="fas fa-angle-right" aria-hidden="true"></i>
                )}
              </button>
              {isSidebarOpen && (
                <ul style={styles.navList}>
                  <li style={styles.navItem}>
                    <Link to="/add-bill" style={styles.link}>Add Bill</Link>
                  </li>
                  <li style={styles.navItem}>
                    <Link to="/customer-list" style={styles.link}>Customer List</Link>
                  </li>
                  <li style={styles.navItem}>
                    <Link to="/reports" style={styles.link}>Reports</Link>
                  </li>
                  <li style={styles.navItem}>
                    <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
                  </li>
                </ul>
              )}
            </div>

            <div style={{ ...styles.content, marginLeft: isSidebarOpen ? '270px' : '90px' }}>
              <Routes>
                <Route path="/add-bill" element={<AddBill />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/customer-list" element={<CustomerList />} />
                <Route path="/" element={<Navigate to="/add-bill" />} /> {/* Default route */}
              </Routes>
            </div>
          </>
        )}
      </div>
    </Router>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
  },
  sideNav: {
    backgroundColor: '#1f1f1f',
    padding: '20px',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    color: '#fff',
    boxShadow: '2px 0 10px rgba(0, 0, 0, 0.2)',
    transition: 'width 0.3s',
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
    marginBottom: '20px',
    padding: '10px',
  },
  navList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  navItem: {
    marginBottom: '20px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    padding: '10px 15px',
  },
  logoutButton: {
    background: 'none',
    border: 'none',
    color: '#ffcc00',
    fontSize: '18px',
    cursor: 'pointer',
  },
  content: {
    padding: '30px',
    flexGrow: 1,
    backgroundColor: '#f4f4f4',
    transition: 'margin-left 0.3s',
  },
};

export default App;
