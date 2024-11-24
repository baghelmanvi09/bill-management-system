import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveBill } from '../Slices/BillSlice';  // Import saveBill action from BillSlice
import { jsPDF } from 'jspdf';  // Import jsPDF for PDF generation
import './BillForm.css';  // Import your custom CSS for styling

const BillForm = () => {
  const dispatch = useDispatch();
  const [items, setItems] = useState([
    { id: 1, item: '', description: '', quantity: 1, price: 0, total: 0 },
  ]);
  const [formData, setFormData] = useState({
    clientName: '',
    mobileNumber: '',  // Changed address to mobileNumber
    address: '',  // Add address field
    year: '',
    status: '',
    billingDate: '',
    expireDate: '',
    note: '',
  });

  const [showModal, setShowModal] = useState(false);  // State to control modal visibility

  // Handle changes in item fields (item name, description, quantity, price)
  const handleItemChange = (id, field, value) => {
    const updatedItems = items.map((item) =>
      item.id === id
        ? { ...item, [field]: value, total: field === 'quantity' || field === 'price' ? item.quantity * item.price : item.total }
        : item
    );
    setItems(updatedItems);
  };

  // Add a new item row in the items list
  const handleAddItem = () => {
    setItems([
      ...items,
      { id: items.length + 1, item: '', description: '', quantity: 1, price: 0, total: 0 },
    ]);
  };

  // Remove an item row from the items list
  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Calculate the total, SGST, CGST, and grand total for the invoice
  const calculateTotal = () => {
    const subTotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const sgst = subTotal * 0.09; // 9% SGST
    const cgst = subTotal * 0.09; // 9% CGST
    const total = subTotal + sgst + cgst;
    return { subTotal, sgst, cgst, total };
  };

  const { subTotal, sgst, cgst, total } = calculateTotal();

  // Handle the saving of the invoice
  const handleSaveInvoice = () => {
    const invoiceData = {
      clientName: formData.clientName,
      mobileNumber: formData.mobileNumber, // Change to mobileNumber
      address: formData.address,  // Include address in the invoice
      year: formData.year,
      status: formData.status,
      billingDate: formData.billingDate,
      expireDate: formData.expireDate,
      note: formData.note,
      items,
    };

    dispatch(saveBill(invoiceData));  // Dispatch the saveBill action to Redux

    // Reset the form data and items after saving
    setFormData({
      clientName: '',
      mobileNumber: '', // Reset mobileNumber
      address: '',  // Reset address
      year: '',
      status: '',
      billingDate: '',
      expireDate: '',
      note: '',
    });
    setItems([{ id: 1, item: '', description: '', quantity: 1, price: 0, total: 0 }]);

    setShowModal(true);  // Show success modal
  };

  // Function to generate and download the invoice as a .txt file
  const handleDownloadInvoice = () => {
    const invoiceText = `
Invoice Details:
----------------
Client: ${formData.clientName}
Mobile Number: ${formData.mobileNumber}  // Show mobileNumber
Address: ${formData.address}  // Show address
Year: ${formData.year}
Status: ${formData.status}
Billing Date: ${formData.billingDate}
Expire Date: ${formData.expireDate}
Note: ${formData.note}

Items:
----------------
${items
      .map(
        (item) => `${item.item} - ${item.description} - Quantity: ${item.quantity} - Price: ${item.price} - Total: ${item.quantity * item.price}`
      )
      .join("\n")}

Subtotal: ${subTotal.toFixed(2)}
SGST (9%): ${sgst.toFixed(2)}
CGST (9%): ${cgst.toFixed(2)}
Total: ${total.toFixed(2)}
`;

    const blob = new Blob([invoiceText], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Invoice_${formData.mobileNumber}.txt`;  // Use mobileNumber in file name
    link.click();
  };

  // Function to generate and download the invoice as a PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Invoice Details", 20, 20);

    doc.setFontSize(12);
    doc.text(`Client: ${formData.clientName}`, 20, 30);
    doc.text(`Mobile Number: ${formData.mobileNumber}`, 20, 40); // Add mobileNumber
    doc.text(`Address: ${formData.address}`, 20, 50);  // Add address
    doc.text(`Year: ${formData.year}`, 20, 60);
    doc.text(`Status: ${formData.status}`, 20, 70);
    doc.text(`Billing Date: ${formData.billingDate}`, 20, 80);
    doc.text(`Expire Date: ${formData.expireDate}`, 20, 90);
    doc.text(`Note: ${formData.note}`, 20, 100);

    doc.text("Items:", 20, 110);
    items.forEach((item, index) => {
      doc.text(
        `${item.item} - ${item.description} - Quantity: ${item.quantity} - Price: ${item.price} - Total: ${item.quantity * item.price}`,
        20,
        120 + index * 10
      );
    });

    doc.text(`Subtotal: ${subTotal.toFixed(2)}`, 20, 130 + items.length * 10);
    doc.text(`SGST (9%): ${sgst.toFixed(2)}`, 20, 140 + items.length * 10);
    doc.text(`CGST (9%): ${cgst.toFixed(2)}`, 20, 150 + items.length * 10);
    doc.text(`Total: ${total.toFixed(2)}`, 20, 160 + items.length * 10);

    doc.save(`Invoice_${formData.mobileNumber}.pdf`);  // Use mobileNumber in file name
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container bill-form">
      <h3 className="mb-4">Invoice Form</h3>
      <form>
        {/* Client and Invoice Details */}
        <div className="row mb-3">
          <div className="col-md-3">
            <label>Client</label>
            <input
              type="text"
              className="form-control"
              placeholder="Client Name"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <label>Mobile Number</label>
            <input
              type="tel"
              className="form-control"
              placeholder="Mobile Number"
              value={formData.mobileNumber} // Changed from address to mobileNumber
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              pattern="^[0-9]{10}$"  // Assuming a 10-digit mobile number format
              required
            />
          </div>
          <div className="col-md-3">
            <label>Address</label> {/* Add Address label */}
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              value={formData.address}  // Bind address field
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="col-md-3">
            <label>Year</label>
            <input
              type="number"
              className="form-control"
              placeholder="Year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <label>Status</label>
            <select
              className="form-control"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
            >
              <option value="">Select Status</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
          <div className="col-md-3">
            <label>Billing Date</label>
            <input
              type="date"
              className="form-control"
              value={formData.billingDate}
              onChange={(e) => setFormData({ ...formData, billingDate: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <label>Expire Date</label>
            <input
              type="date"
              className="form-control"
              value={formData.expireDate}
              onChange={(e) => setFormData({ ...formData, expireDate: e.target.value })}
              required
            />
          </div>
          <div className="col-md-3">
            <label>Note</label>
            <textarea
              className="form-control"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="Any additional notes"
            />
          </div>
        </div>

        {/* Add Items Section */}
        <div className="items-table">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="text"
                      value={item.item}
                      onChange={(e) => handleItemChange(item.id, 'item', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                    />
                  </td>
                  <td>{item.total}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddItem}
          >
            Add Item
          </button>
        </div>
           {/* Invoice Summary */}
           <div className="row mb-3">
          <div className="col-md-3">
            <h5>Total</h5>
            <div>Subtotal: {subTotal.toFixed(2)}</div>
            <br/>
            <div>SGST (9%): {sgst.toFixed(2)}</div>
            <br/>
            <div>CGST (9%): {cgst.toFixed(2)}</div>
            <br/>
            <div><strong>Total: {total.toFixed(2)}</strong></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-success"
            onClick={handleSaveInvoice}
          >
            Save Invoice
          </button>
          <button
            type="button"
            className="btn btn-info"
            onClick={handleDownloadInvoice}
          >
            Download as .txt
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDownloadPDF}
          >
            Download as PDF
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showModal && (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={closeModal}>&times;</span>
      <h4>Success!</h4>
      <p>Invoice saved successfully!</p>
      <button onClick={closeModal} className="btn btn-primary">Close</button>
    </div>
  </div>
)}

    </div>
  );
};

export default BillForm;
