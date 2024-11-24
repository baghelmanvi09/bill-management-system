import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const styles = {
  container: {
    padding: '40px',
    marginTop: '10px',
    marginLeft: '140px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(120deg, #f0f4f8, #cfd8e3)',
    position: 'relative',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  watermark: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    fontSize: '18px',
    color: '#aaa',
    fontStyle: 'italic',
    opacity: 0.8,
  },
  tableWrapper: {
   
    overflow: 'hidden',
    position:'sticky',
    width: '100%',
    maxWidth: '1600px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px 0',
    // background: '#fff',
    borderRadius: '3px',
    // boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    marginLeft:"370px",
    
  },
  th: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '15px',
    textAlign: 'left',
    cursor: 'pointer',
    height: '60px',
    fontSize: '18px',
    position: 'sticky',
    top: 0,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  td: {
    padding: '15px',
    border: '1px solid #ddd',
    textAlign: 'center',
    height: '60px',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  rowHover: {
    ':hover': {
      backgroundColor: '#f0f8ff',
    },
  },
  tableHeading: {
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '30px',
    fontWeight: '600',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  searchBar: {
    marginBottom: '20px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '15px',
    width: '100%',
  },
  searchInput: {
    padding: '12px',
    width: '100%',
    maxWidth: '400px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    outline: 'none',
    transition: 'border 0.3s ease',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '30px',
    flexWrap: 'wrap',
    gap: '10px',
  },
  paginationButton: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  paginationButtonDisabled: {
    padding: '10px 20px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'not-allowed',
    backgroundColor: '#ccc',
    color: 'white',
    fontSize: '16px',
  },
};



const CustomerList = () => {
  const location = useLocation(); // Get current route
  const customers = useSelector((state) => state.bill.customers);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredCustomers = customers.filter((customer) =>
    customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.billingPrice.toString().includes(searchTerm)
  );

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortOrder === 'asc') {
      return new Date(a.billingDate) - new Date(b.billingDate);
    } else {
      return new Date(b.billingDate) - new Date(a.billingDate);
    }
  });

  const indexOfLastCustomer = currentPage * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
  const currentCustomers = sortedCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div style={styles.container}>
      {/* Conditionally render watermark only on CustomerList page */}
      {location.pathname === '/customer-list' && (
        <div style={styles.watermark}>Bill Management System</div>
      )}

      {/* Optionally add logo watermark */}
      {/* <img src="path_to_logo.png" style={styles.logoWatermark} alt="logo watermark" /> */}

      <h3 style={styles.tableHeading}>Customer List</h3>

      <div style={styles.searchBar}>
        <input
          type="text"
          style={styles.searchInput}
          placeholder="Search by customer name or amount"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th} onClick={toggleSortOrder}>
                Customer Name {sortOrder === 'asc' ? '↑' : '↓'}
              </th>
              <th style={styles.th}>Mobile Number</th>
              <th style={styles.th}>Address</th>
              <th style={styles.th}>Total Bill</th>
              <th style={styles.th}>Billing Date</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.length === 0 ? (
              <tr>
                <td colSpan="5" style={styles.td}>
                  No customers found
                </td>
              </tr>
            ) : (
              currentCustomers.map((customer, index) => (
                <tr
                  key={index}
                  style={{
                    backgroundColor: index % 2 === 0 ? '#f4f4f4' : '#fff',
                    cursor: 'pointer',
                    ...styles.rowHover,
                  }}
                >
                  <td style={styles.td}>{customer.customerName}</td>
                  <td style={styles.td}>{customer.mobileNumber ?? 'N/A'}</td>
                  <td style={styles.td}>{customer.address}</td>
                  <td style={styles.td}>${customer.billingPrice.toFixed(2)}</td>
                  <td style={styles.td}>{new Date(customer.billingDate).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.pagination}>
        <button
          style={currentPage === 1 ? styles.paginationButtonDisabled : styles.paginationButton}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>{currentPage}</span>
        <button
          style={currentPage * itemsPerPage >= sortedCustomers.length ? styles.paginationButtonDisabled : styles.paginationButton}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage * itemsPerPage >= sortedCustomers.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomerList;
