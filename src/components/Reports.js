import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './Reports.css';
import { CSVLink } from 'react-csv';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Reports() {
  const customers = useSelector(state => state.bill.customers);
  const [sortOrder, setSortOrder] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const itemsPerPage = 5;

  // Calculate total bills and total amount
  const totalBills = customers.length;
  const totalAmount = customers.reduce((total, customer) => total + customer.billingPrice, 0);

  // Filter customers based on search term and date range
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          customer.billingPrice.toString().includes(searchTerm);
    const withinDateRange = (!startDate || new Date(customer.billingDate) >= new Date(startDate)) &&
                            (!endDate || new Date(customer.billingDate) <= new Date(endDate));
    return matchesSearch && withinDateRange;
  });

  // Sort customers by billing date
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortOrder === 'asc') {
      return new Date(a.billingDate) - new Date(b.billingDate);
    } else {
      return new Date(b.billingDate) - new Date(a.billingDate);
    }
  });

  // Pagination logic
  const indexOfLastBill = currentPage * itemsPerPage;
  const indexOfFirstBill = indexOfLastBill - itemsPerPage;
  const currentBills = sortedCustomers.slice(indexOfFirstBill, indexOfLastBill);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get upcoming due dates
  const upcomingDueDates = customers
    .filter(customer => new Date(customer.billingDate) > new Date())
    .map(customer => ({
      name: customer.customerName,
      dueDate: customer.billingDate,
    }));

  // Export to CSV functionality
  const headers = [
    { label: 'Customer Name', key: 'customerName' },
    { label: 'Billing Amount', key: 'billingPrice' },
    { label: 'Billing Date', key: 'billingDate' },
  ];

  return (
    <div className="container mt-4 reports-container">
      <h1>Reports</h1>

      {/* Search bar */}
      <div className="search-bar mt-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by customer name or amount"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Date picker for filtering */}
      <div className="date-picker mt-3">
        <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          placeholderText="Start Date"
          className="form-control"
          dateFormat="yyyy-MM-dd"
        />
        <DatePicker
          selected={endDate}
          onChange={date => setEndDate(date)}
          placeholderText="End Date"
          className="form-control"
          dateFormat="yyyy-MM-dd"
        />
      </div>

      <div className="report-summary mt-3">
        <h4>Total Bills: {totalBills}</h4>
        <h4>Total Amount: ${totalAmount.toFixed(2)}</h4>
      </div>

      {/* Sorting buttons */}
      <div className="sorting mt-3">
        <button
          className="btn btn-primary"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          Sort by Due Date: {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        </button>
      </div>

      <h5 className="mt-4">Upcoming Due Dates:</h5>
      <ul className="list-group">
        {upcomingDueDates.length === 0 ? (
          <li className="list-group-item">No upcoming due dates</li>
        ) : (
          upcomingDueDates.map((bill, index) => (
            <li key={index} className="list-group-item">
              {bill.name} - Due on {new Date(bill.dueDate).toLocaleDateString()}
            </li>
          ))
        )}
      </ul>

      {/* Bills table */}
      <h5 className="mt-4">Bills</h5>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Billing Amount</th>
            <th>Billing Date</th>
          </tr>
        </thead>
        <tbody>
          {currentBills.length === 0 ? (
            <tr>
              <td colSpan="3">No bills found.</td>
            </tr>
          ) : (
            currentBills.map((bill, index) => (
              <tr key={index}>
                <td>{bill.customerName}</td>
                <td>${bill.billingPrice.toFixed(2)}</td>
                <td>{new Date(bill.billingDate).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination mt-4">
        <button
          className="btn btn-secondary"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="mx-3">Page {currentPage}</span>
        <button
          className="btn btn-secondary"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage * itemsPerPage >= sortedCustomers.length}
        >
          Next
        </button>
      </div>

      {/* Export to CSV */}
      <div className="export-csv mt-3">
        <CSVLink
          data={sortedCustomers}
          headers={headers}
          filename={`bills-report-${new Date().toLocaleDateString()}.csv`}
          className="btn btn-success"
        >
          Export to CSV
        </CSVLink>
      </div>
    </div>
  );
}

export default Reports;
