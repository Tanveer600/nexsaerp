import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableRow,
  CBadge,
} from '@coreui/react'
import TableHeader from '../../components/common/TableHeader'
import AppButton from '../../components/common/AppButton'
import { useToast } from '../../components/common/ToastContext'
import {
  getAllQuotations,
  deleteQuotation,
  approveQuotation,
} from '../../redux/slice/quotationSlice'
import { toNumber, formatDate } from '../../components/common/formatter'
import QuotationAddEditModel from './QuotationAddEditModel'

const EditIcon = () => <span style={{ marginRight: '5px' }}>✎</span>
const DeleteIcon = () => <span style={{ marginRight: '5px' }}>🗑</span>
const ApproveIcon = () => <span style={{ marginRight: '5px' }}>✔</span> // Naya icon
function Quotation() {
  const dispatch = useDispatch()
  const { result: orders } = useSelector((state) => state.quotations)
  const [visible, setVisible] = useState(false)
  const [editData, setEditData] = useState(null)
  const { addToast } = useToast()

  useEffect(() => {
    dispatch(getAllQuotations({ page: 1, size: 10 }))
  }, [dispatch])

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      dispatch(deleteQuotation(id)).then(() => {
        addToast('Success', 'Quotation deleted successfully', 'success')
        dispatch(getAllQuotations({ page: 1, size: 10 }))
      })
    }
  }
  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'ordered':
        return 'success'
      case 'pending':
        return 'warning'
      case 'cancelled':
        return 'danger'
      default:
        return 'secondary'
    }
  }
  const handleApprove = (id) => {
    if (
      window.confirm(`Are you sure you want to approve Quotation #${id} and convert it to a Sale?`)
    ) {
      dispatch(approveQuotation(id))
      addToast('Processing', 'Converting quotation to sale...', 'info')
    }
  }
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="shadow-sm border-0">
          <CCardBody>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold" style={{ color: '#4c1d95' }}>
                Quotations
              </h4>
              <AppButton
                variant="purple"
                onClick={() => {
                  setEditData(null)
                  setVisible(true)
                }}
              >
                + Create Quotation
              </AppButton>
            </div>

            <CTable responsive hover align="middle" className="border-top">
              <CTableHead color="light">
                <CTableRow>
                  <TableHeader col="ID" />
                  <TableHeader col="Customer" />
                  <TableHeader col="Date" />
                  <TableHeader col="Expiry Date" />
                  <TableHeader col="Grand Total" />
                  <TableHeader col="Status" />
                  <TableHeader col="Action" />
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {Array.isArray(orders) &&
                  orders.map((order) => {
                    const id = order.quotationId || order.QuotationId
                    const quotationNumber = order.quotationNumber || order.QuotationNumber
                    const customer = order.customerName || order.CustomerName || 'N/A'
                    const date = order.quotationDate || order.QuotationDate
                    const validUntil = order.validUntil || order.validUntil
                    const total = order.grandTotal || order.GrandTotal || 0
                    const status = order.status || order.Status || 'Pending'
                    return (
                      <CTableRow key={id} className="align-middle">
                        <CTableDataCell className="fw-bold text-muted">
                          #{toNumber(id, 0)}
                        </CTableDataCell>
                        <CTableDataCell className="fw-semibold">{customer}</CTableDataCell>
                        <CTableDataCell>{formatDate(date)}</CTableDataCell>
                        <CTableDataCell className="fw-bold text-dark">
                          {toNumber(total, 2)}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge
                            color={getStatusBadge(status)}
                            shape="rounded-pill"
                            className="px-3 py-2"
                          >
                            {status}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-2">
                            {status.toLowerCase() === 'pending' && (
                              <AppButton
                                size="sm"
                                variant="purple"
                                style={{ background: '#10b981', border: 'none' }}
                                onClick={() => handleApprove(id)}
                              >
                                <ApproveIcon /> Approve
                              </AppButton>
                            )}
                            <AppButton
                              size="sm"
                              variant="golden"
                              onClick={() => {
                                setEditData(order)
                                setVisible(true)
                              }}
                            >
                              <EditIcon /> Edit
                            </AppButton>

                            <button
                              onClick={() => handleDelete(id)}
                              style={{
                                background: 'rgba(220, 38, 38, 0.1)',
                                color: '#dc2626',
                                border: '1px solid #dc2626',
                                borderRadius: '8px',
                                padding: '4px 12px',
                                fontSize: '12px',
                                fontWeight: '600',
                                cursor: 'pointer',
                              }}
                            >
                              <DeleteIcon /> Delete
                            </button>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
      <QuotationAddEditModel visible={visible} setVisible={setVisible} editData={editData} />
    </CRow>
  )
}

export default Quotation
