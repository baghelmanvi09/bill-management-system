import React, { useState } from 'react';
import html2pdf from 'html2pdf.js'; 
import CustomerList from './CustomerList'; 

// Modal component for success message
const SuccessModal = ({ message, onClose, onDownload, onSave }) => {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <h3>{message}</h3>
        <button onClick={onDownload} style={styles.modalButton}>Download Invoice</button>
        <button onClick={onSave} style={styles.modalButton}>Save Bill</button>
        <button onClick={onClose} style={styles.modalButton}>Close</button>
      </div>
    </div>
  );
};

function AddBill() {
  const [customerDetails, setCustomerDetails] = useState({
    customerName: '',
    mobileNumber: '',
    address: '',
    billingDate: ''
  });

  const [products, setProducts] = useState([{
    productName: '',
    productQuantity: '',
    productPrice: '',
    totalPrice: 0
  }]);

  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [customers, setCustomers] = useState([]); // List of customers with their bills

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails({ ...customerDetails, [name]: value });
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const newProducts = [...products];
    newProducts[index][name] = value;

    if (name === 'productQuantity' || name === 'productPrice') {
      const productQuantity = newProducts[index].productQuantity;
      const productPrice = newProducts[index].productPrice;
      newProducts[index].totalPrice = (productQuantity * productPrice) || 0;
    }

    setProducts(newProducts);
  };

  const handleAddProduct = () => {
    setProducts([ ...products, { productName: '', productQuantity: '', productPrice: '', totalPrice: 0 } ]);
  };

  const calculateTotalBill = () => {
    return products.reduce((total, product) => total + parseFloat(product.totalPrice || 0), 0);
  };

  // Handle form submission and show success modal
  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all required product fields are filled
    const hasEmptyProductFields = products.some(product => !product.productName || !product.productQuantity || !product.productPrice);
    if (hasEmptyProductFields) {
      alert('Please fill all product details.');
      return;
    }

    console.log('Customer Details:', customerDetails);
    console.log('Products:', products);
    setShowModal(true); // Show success modal on form submission
  };

  const closeModal = () => {
    setShowModal(false); // Close modal when 'Close' button is clicked
  };

  // Generate PDF and download the invoice
  const handleDownloadInvoice = () => {
    const invoiceContent = document.getElementById('invoice');
    const options = {
      filename: `invoice_${customerDetails.customerName}_${new Date().getTime()}.pdf`,
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().from(invoiceContent).set(options).save();
  };

  // Save bill data to the customer's list
  const handleSaveBill = () => {
    // Check if products array is valid
    const validProducts = products.every(product => product.productName && product.productQuantity && product.productPrice);

    if (!validProducts) {
      alert('Please make sure all product details are filled.');
      return;
    }

    const newCustomer = {
      ...customerDetails,
      productQuantity: products.reduce((total, product) => total + parseInt(product.productQuantity || 0), 0),
      billingPrice: calculateTotalBill(),
      bills: [{
        products: products,
        totalAmount: calculateTotalBill(),
        billingDate: customerDetails.billingDate,
      }]
    };

    const existingCustomerIndex = customers.findIndex(customer => customer.customerName === customerDetails.customerName);
    if (existingCustomerIndex !== -1) {
      const updatedCustomers = [...customers];
      updatedCustomers[existingCustomerIndex].bills.push({
        products: products,
        totalAmount: calculateTotalBill(),
        billingDate: customerDetails.billingDate,
      });
      setCustomers(updatedCustomers);
    } else {
      setCustomers([...customers, newCustomer]);
    }

    setShowModal(false);
    resetForm(); // Optionally reset the form after saving
  };

  const resetForm = () => {
    setCustomerDetails({
      customerName: '',
      mobileNumber: '',
      address: '',
      billingDate: ''
    });
    setProducts([{ productName: '', productQuantity: '', productPrice: '', totalPrice: 0 }]);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h3>Bill Generator</h3>

        {/* Customer Details */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Customer Name</label>
          <input
            type="text"
            name="customerName"
            placeholder="Enter customer name"
            value={customerDetails.customerName}
            onChange={handleCustomerChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            placeholder="Enter customer mobile number"
            value={customerDetails.mobileNumber}
            onChange={handleCustomerChange}
            style={styles.input}
            required
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit mobile number"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Address</label>
          <input
            type="text"
            name="address"
            placeholder="Enter customer address"
            value={customerDetails.address}
            onChange={handleCustomerChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Billing Date</label>
          <input
            type="date"
            name="billingDate"
            value={customerDetails.billingDate}
            onChange={handleCustomerChange}
            style={styles.input}
            required
          />
        </div>

        {/* Product Details */}
        <div style={styles.inputGroup}>
          <h4>Product Details</h4>
          {products.map((product, index) => (
            <div key={index} style={styles.inputGroup}>
              <label style={styles.label}>Product {index + 1}</label>
              <input
                type="text"
                name="productName"
                value={product.productName}
                placeholder="Product Name"
                onChange={(e) => handleProductChange(index, e)}
                style={styles.input}
                required
              />
              <input
                type="number"
                name="productQuantity"
                value={product.productQuantity}
                placeholder="Quantity"
                onChange={(e) => handleProductChange(index, e)}
                style={styles.input}
                required
              />
              <input
                type="number"
                name="productPrice"
                value={product.productPrice}
                placeholder="Price per Product"
                onChange={(e) => handleProductChange(index, e)}
                style={styles.input}
                required
              />
            </div>
          ))}
          <button type="button" onClick={handleAddProduct} style={styles.addButton}>Add Product</button>
        </div>

        <div style={styles.totalBill}>
          <p>Total Bill: ${calculateTotalBill().toFixed(2)}</p>
        </div>

        <button type="submit" style={styles.submitButton}>Generate Bill</button>
      </form>

      {/* Customer List */}
      <CustomerList customers={customers} />

      {/* Success Modal */}
      {showModal && (
        <SuccessModal
          message="Bill Generated Successfully!"
          onClose={closeModal}
          onDownload={handleDownloadInvoice}
          onSave={handleSaveBill}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  input: {
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
  },
  addButton: {
    marginTop: '10px',
    padding: '8px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
  totalBill: {
    marginTop: '20px',
  },
  submitButton: {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '4px',
    textAlign: 'center',
  },
  modalButton: {
    margin: '10px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
};

export default AddBill;
