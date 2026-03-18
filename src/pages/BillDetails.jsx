import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download, ArrowLeft } from "lucide-react";
import api from "../api";
import { useToast } from "../context/ToastContext";

const BillDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBill();
  }, [id]);

  const fetchBill = async () => {
    try {
      const res = await api.get(`/billing/${id}`);
      setBill(res.data.data || res.data);
    } catch (err) {
      showToast("Failed to load bill", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.print();
  };

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (!bill) return <div style={{ padding: 40 }}>Bill not found</div>;

  const totalAmount = parseFloat(bill.total_amount || 0);
  const passedAmount = parseFloat(bill.amount_passed || 0);
  const balanceAmount = totalAmount - passedAmount;

  const renderDetailItem = (label, value) => (
    <div className="detail-item">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value || "N/A"}</span>
    </div>
  );

  return (
    <div className="page-container" style={{ padding: "24px" }}>
      <button
        onClick={() => navigate(-1)}
        className="text-btn"
        style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}
      >
        <ArrowLeft size={18} />
        Back to List
      </button>

      <div className="claim-detail-card">
        <div className="invoice-header">
          <h1>MP Storage Management System</h1>
          <p>Claim Detail View</p>
        </div>

        <div className="invoice-divider"></div>

        <div className="detail-section">
          <div className="detail-row">
            {renderDetailItem("Claim ID", `#${bill.id}`)}
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className={`badge badge-${bill.status?.toLowerCase().replace("_", "-")}`} style={{ fontSize: "0.85rem", padding: "4px 12px" }}>
                {bill.status}
              </span>
            </div>
          </div>

          <div className="detail-row">
            {renderDetailItem("Warehouse Name", bill.warehouse_name)}
            {renderDetailItem("Warehouse No", bill.warehouse_number)}
          </div>

          <div className="detail-row">
            {renderDetailItem("Branch", bill.branch_name)}
            {renderDetailItem("District", bill.district_name)}
          </div>

          <div className="detail-row">
            {renderDetailItem("PAN Number", bill.pan_number)}
            {renderDetailItem("GST Number", bill.gst_number || bill.warehouse_gst)}
          </div>
        </div>

        <div className="section-divider"></div>

        <div className="detail-section">
          <div className="detail-row">
            {renderDetailItem("Depositor", bill.depositor_name)}
            {renderDetailItem("Depositor GST", bill.depositor_gst)}
          </div>
          <div className="detail-row">
            {renderDetailItem("Commodity", bill.commodity_name || bill.commodity)}
            {renderDetailItem("Bill No", bill.bill_no)}
          </div>
        </div>

        <div className="section-divider"></div>

        <div className="detail-section">
          <div className="detail-row">
            {renderDetailItem("Total Amount", `₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`)}
            {renderDetailItem("Passed Amount", `₹${passedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`)}
          </div>
          <div className="detail-row" style={{ borderBottom: "none" }}>
            {renderDetailItem("Balance Amount", `₹${balanceAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`)}
            <div></div>
          </div>
        </div>

        <div className="section-divider"></div>

        <div className="detail-section">
          <div className="detail-row">
            {renderDetailItem("Payment Mode", bill.payment_mode)}
            {renderDetailItem("Instrument No", bill.instrument_no)}
          </div>
          <div className="detail-row">
            {renderDetailItem("Payment Date", bill.payment_date ? new Date(bill.payment_date).toLocaleDateString() : null)}
            {renderDetailItem("Advice No", bill.advice_no)}
          </div>
          <div className="detail-row">
            {renderDetailItem("Advice Date", bill.advice_date ? new Date(bill.advice_date).toLocaleDateString() : null)}
            <div></div>
          </div>
        </div>

        <div style={{ marginTop: 40, display: "flex", justifyContent: "flex-end" }} className="no-print">
          <button
            onClick={handleDownload}
            className="btn btn-primary"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <Download size={18} />
            Download / Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillDetails;