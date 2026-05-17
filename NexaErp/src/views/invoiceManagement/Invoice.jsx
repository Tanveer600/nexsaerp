import React, { useEffect, useState, useMemo } from 'react'
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
  CWidgetStatsC,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilDollar, cilTag, cilBank } from '@coreui/icons'
import TableHeader from '../../components/common/TableHeader'
import AppButton from '../../components/common/AppButton'
import { useToast } from '../../components/common/ToastContext'
import { getAllInvoices, deleteInvoice } from '../../redux/slice/invoiceSlice'
import { toNumber, formatDate, sortData } from '../../components/common/formatter'
import InvoiceAddEditModel from './InvoiceAddEditModel' // Renamed file reference import
import AppLoader from '../../components/common/AppLoader'

const EditIcon = () => <span style={{ marginRight: '5px' }}>✎</span>
const DeleteIcon = () => <span style={{ marginRight: '5px' }}>🗑</span>

function Invoice() {
  const dispatch = useDispatch()
  const { result: orders, isLoading } = useSelector((state) => state.invoices)
  const [visible, setVisible] = useState(false)
  const [editData, setEditData] = useState(null)
  const { addToast } = useToast()

  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' })

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return []
    return sortData(orders, sortConfig.key, sortConfig.direction)
  }, [orders, sortConfig])

  const stats = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return { vat: 0, totalAmount: 0 }
    return orders.reduce(
      (acc, curr) => ({
        vat: acc.vat + (curr.vat || curr.VAT || 0),
        totalAmount: acc.totalAmount + (curr.totalAmount || curr.TotalAmount || 0),
      }),
      { vat: 0, totalAmount: 0 },
    )
  }, [orders])

  useEffect(() => {
    dispatch(getAllInvoices({ page: 1, size: 10 }))
  }, [dispatch])

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      dispatch(deleteInvoice(id)).then(() => {
        addToast('Success', 'Invoice deleted successfully', 'success')
        dispatch(getAllInvoices({ page: 1, size: 10 }))
      })
    }
  }

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'success'
      case 'pending':
        return 'warning'
      case 'partially paid':
        return 'info'
      case 'cancelled':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  return (
    <CRow>
      <CCol sm={6} lg={6}>
        <CWidgetStatsC
          className="mb-3 shadow-sm border-0 py-2"
          icon={<CIcon icon={cilDollar} height={36} className="text-primary" />}
          title="Total Invoiced Gross Amount (AED)"
          value={toNumber(stats.totalAmount, 2)}
          progress={{ color: 'primary', value: 100 }}
        />
      </CCol>
      <CCol sm={6} lg={6}>
        <CWidgetStatsC
          className="mb-3 shadow-sm border-0 py-2"
          icon={<CIcon icon={cilBank} height={36} className="text-info" />}
          title="Total Tax / VAT Collected (5%)"
          value={toNumber(stats.vat, 2)}
          progress={{ color: 'info', value: 100 }}
        />
      </CCol>

      <CCol xs={12}>
        <CCard className="shadow-sm border-0 mt-2">
          <CCardBody>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold text-primary">Commercial Invoices</h4>
              <AppButton
                variant="purple"
                onClick={() => {
                  setEditData(null)
                  setVisible(true)
                }}
              >
                + Generate Invoice
              </AppButton>
            </div>

            {isLoading ? (
              <AppLoader message="Loading ERPSoftify Invoices..." />
            ) : (
              <CTable responsive hover align="middle" className="border-top mt-2">
                <CTableHead color="light">
                  <CTableRow>
                    <TableHeader
                      col="Invoice ID"
                      sortKey="id"
                      onSort={handleSort}
                      currentSort={sortConfig}
                    />
                    <TableHeader
                      col="Sales Order Ref"
                      sortKey="salesOrderId"
                      onSort={handleSort}
                      currentSort={sortConfig}
                    />
                    <TableHeader
                      col="Invoice Date"
                      sortKey="date"
                      onSort={handleSort}
                      currentSort={sortConfig}
                    />
                    <TableHeader
                      col="VAT (AED)"
                      sortKey="vat"
                      onSort={handleSort}
                      currentSort={sortConfig}
                    />
                    <TableHeader
                      col="Gross Total"
                      sortKey="totalAmount"
                      onSort={handleSort}
                      currentSort={sortConfig}
                    />
                    <TableHeader
                      col="Payment Status"
                      sortKey="paymentStatus"
                      onSort={handleSort}
                      currentSort={sortConfig}
                    />
                    <CTableDataCell
                      className="fw-bold text-center"
                      style={{ fontSize: '0.85rem', color: '#495057', backgroundColor: '#f8f9fa' }}
                    >
                      ACTIONS
                    </CTableDataCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {sortedOrders.length > 0 ? (
                    sortedOrders.map((inv) => (
                      <CTableRow key={inv.id || inv.ID}>
                        <CTableDataCell className="fw-semibold">
                          #INV-{inv.id || inv.ID}
                        </CTableDataCell>
                        <CTableDataCell>#SO-{inv.salesOrderId || inv.SalesOrderId}</CTableDataCell>
                        <CTableDataCell>{formatDate(inv.date || inv.Date)}</CTableDataCell>
                        <CTableDataCell className="text-info">
                          {toNumber(inv.vat || inv.VAT, 2)}
                        </CTableDataCell>
                        <CTableDataCell className="fw-bold text-primary">
                          {toNumber(inv.totalAmount || inv.TotalAmount, 2)}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getStatusBadge(inv.paymentStatus || inv.PaymentStatus)}>
                            {inv.paymentStatus || inv.PaymentStatus}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <AppButton
                            size="sm"
                            variant="ghost"
                            color="info"
                            className="me-2"
                            onClick={() => {
                              setEditData(inv)
                              setVisible(true)
                            }}
                          >
                            <EditIcon /> Edit
                          </AppButton>
                          <AppButton
                            size="sm"
                            variant="ghost"
                            color="danger"
                            onClick={() => handleDelete(inv.id || inv.ID)}
                          >
                            <DeleteIcon /> Delete
                          </AppButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={7} className="text-center text-muted py-4">
                        No Invoices Found.
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      <InvoiceAddEditModel visible={visible} setVisible={setVisible} editData={editData} />
    </CRow>
  )
}

export default Invoice
