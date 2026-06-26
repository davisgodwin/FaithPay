// DonationTable.jsx
import React, { useState } from 'react';
import { Table, Form, InputGroup, Button, Badge } from 'react-bootstrap';
import './DonationTable.css'; 

function DonationTable({ donations, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDonations = donations.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    if (donations.length === 0) {
      alert("No data records available inside the current filter scope to export.");
      return;
    }

    // Explicitly separate currency code mapping out for accountant visibility
    const headers = ["Donor Name", "Donation Type", "Amount", "Currency", "Date Selected", "Paystack Reference"];
    
    const rows = donations.map(d => [
      `"${d.name.replace(/"/g, '""')}"`,
      `"${d.type}"`,
      d.amount,
      `"${d.currency || 'NGN'}"`,
      `"${d.date}"`,
      `"${d.reference || 'Manual'}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `FaithFinance_Filtered_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBadgeBg = (type) => {
    switch(type) {
      case 'Tithe': return 'primary';
      case 'Offering': return 'success';
      case 'Thanksgiving': return 'warning';
      case 'Building Fund': return 'info';
      case 'Welfare': return 'secondary';
      default: return 'dark';
    }
  };

  return (
    <div className="ff-table-container">
      <div className="ff-table-header-row">
        <h5 className="ff-table-title">Recent Donations</h5>
        
        <div className="d-flex gap-2 flex-wrap w-100 w-md-auto justify-content-end">
          <InputGroup className="ff-search-wrapper" style={{ maxWidth: '260px' }}>
            <Form.Control
              placeholder="Search donor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          
          <Button variant="outline-success" onClick={handleExportCSV}>
            Export Ledger
          </Button>
        </div>
      </div>

      {filteredDonations.length === 0 ? (
        <div className="ff-empty-state">No donations recorded.</div>
      ) : (
        <div className="table-responsive">
          <Table hover className="align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Donor Name</th>
                <th>Donation Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonations.map((donation) => (
                <tr key={donation.id}>
                  <td className="ff-donor-name">{donation.name}</td>
                  <td><Badge bg={getBadgeBg(donation.type)}>{donation.type}</Badge></td>
                  {/* Dynamic currency rendering using explicitly stored symbols */}
                  <td className="ff-amount-cell">
                    {donation.currencySymbol || '₦'}{Number(donation.amount).toLocaleString()} 
                    <span className="text-muted small ms-1">({donation.currency || 'NGN'})</span>
                  </td>
                  <td className="text-muted small">{donation.date}</td>
                  <td className="text-end">
                    <Button variant="outline-danger" size="sm" onClick={() => onDelete(donation.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default DonationTable;