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
import {
  getAllVendorQuotations,
  deleteVendorQuotation,
  approveVendorQuotation,
} from '../../redux/slice/vendorQuotationSlice'
import { toNumber, formatDate, sortData } from '../../components/common/formatter'
import VendorQuotationAddEditModel from './VendorQuotationAddEditModel'
import AppLoader from '../../components/common/AppLoader'

const EditIcon = () => <span style={{ marginRight: '5px' }}>✎</span>
const DeleteIcon = () => <span style={{ marginRight: '5px' }}>🗑</span>
const ApproveIcon = () => <span style={{ marginRight: '5px' }}>✔</span>

function VendorQuotation() {
  const dispatch = useDispatch()
  const { result: orders, isLoading } = useSelector((state) => state.vendorQuotations)
  console.info('vendor quotation', orders)
  const [visible, setVisible] = useState(false)
  const [editData, setEditData] = useState(null)
  const { addToast } = useToast()

  const [sortConfig, setSortConfig] = useState({ key: 'vqNumber', direction: 'desc' })

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
    if (!orders || !Array.isArray(orders)) return { discount: 0, tax: 0, total: 0 }
    return orders.reduce(
      (acc, curr) => ({
        discount: acc.discount + (curr.totalDiscount || curr.TotalDiscount || 0),
        tax: acc.tax + (curr.totalTax || curr.TotalTax || 0),
        total:
          acc.total +
          (curr.netAmount || curr.NetAmount || curr.totalAmount || curr.TotalAmount || 0),
      }),
      { discount: 0, tax: 0, total: 0 },
    )
  }, [orders])

  useEffect(() => {
    dispatch(getAllVendorQuotations({ page: 1, size: 10 }))
  }, [dispatch])

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this vendor quotation?')) {
      dispatch(deleteVendorQuotation(id)).then(() => {
        addToast('Success', 'Order deleted successfully', 'success')
        dispatch(getAllVendorQuotations({ page: 1, size: 10 }))
      })
    }
  }

  const handleApprove = (id) => {
    console.log('Approving ID:', id)
    if (window.confirm(`Are you sure you want to approve Vendor Quotation #${id}?`)) {
      dispatch(approveVendorQuotation(id)).then(() => {
        addToast('Success', 'Vendor Quotation approved successfully', 'success')
        dispatch(getAllVendorQuotations({ page: 1, size: 10 }))
      })
    }
  }

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'ordered':
      case 'completed':
      case 'approved':
        return 'success'
      case 'pending':
        return 'warning'
      case 'cancelled':
        return 'danger'
      default:
        return 'secondary'
    }
  }

  return (
    <CRow>
      <CCol sm={6} lg={4}>
        <CWidgetStatsC
          className="mb-3 shadow-sm border-0 py-2"
          icon={<CIcon icon={cilDollar} height={36} className="text-primary" />}
          title="Total Net Amount"
          value={toNumber(stats.total, 2)}
          progress={{ color: 'primary', value: 100 }}
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsC
          className="mb-3 shadow-sm border-0 py-2"
          icon={<CIcon icon={cilTag} height={36} className="text-danger" />}
          title="Total Discount Received"
          value={toNumber(stats.discount, 2)}
          progress={{ color: 'danger', value: 100 }}
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsC
          className="mb-3 shadow-sm border-0 py-2"
          icon={<CIcon icon={cilBank} height={36} className="text-info" />}
          title="Total Tax Paid"
          value={toNumber(stats.tax, 2)}
          progress={{ color: 'info', value: 100 }}
        />
      </CCol>

      <CCol xs={12}>
        <CCard className="shadow-sm border-0 mt-2">
          <CCardBody>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold" style={{ color: '#4c1d95' }}>
                Vendor Quotation
              </h4>
              <AppButton
                variant="purple"
                onClick={() => {
                  setEditData(null)
                  setVisible(true)
                }}
              >
                + Create New VQ
              </AppButton>
            </div>

            {isLoading ? (
              <AppLoader message="Fetching Vendor Quotations..." />
            ) : (
              <CTable responsive hover align="middle" className="border-top mt-2">
                <CTableHead color="light">
                  <CTableRow>
                    <TableHeader
                      col="VQ #"
                      sortKey="vqNumber"
                      onSort={handleSort}
                      currentSort={sortConfig}
                    />
                    <TableHeader
                      col="Vendor"
                      sortKey="vendorName"
                      onSort={handleSort}
                      currentSort={sortConfig}
                    />
                    <TableHeader
                      col="Date"
                      sortKey="quotationDate"
                      onSort={handleSort}
                      currentSort={sortConfig}
                    />
                    <TableHeader
                      col="Currency"
                      sortKey="currencyCode"
                      onSort={handleSort}
                      currentSort={sortConfig}
                    />
                    <TableHeader
                      col="Grand Total"
                      sortKey="netAmount"
                      onSort={handleSort}
                      currentSort={sortConfig}
                    />
                    <TableHeader
                      col="Status"
                      sortKey="status"
                      onSort={handleSort}
                      currentSort={sortConfig}
                    />
                    <CTableDataCell
                      className="fw-bold text-center"
                      style={{ fontSize: '0.85rem', color: '#495057', backgroundColor: '#f8f9fa' }}
                    >
                      ACTION
                    </CTableDataCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {sortedOrders.length > 0 ? (
                    sortedOrders.map((order) => {
                      const id = order.id || order.vendorQuotationId
                      const vendor = order.vendorName || 'N/A'
                      const status = order.status || 'Pending'

                      return (
                        <CTableRow key={id} className="align-middle">
                          <CTableDataCell>
                            <div style={{ fontWeight: 'bold', color: '#d63384' }}>
                              {order.vqNumber || order.VQNumber}
                            </div>
                          </CTableDataCell>
                          <CTableDataCell className="fw-semibold text-dark">
                            {vendor}
                          </CTableDataCell>
                          <CTableDataCell>
                            {formatDate(order.quotationDate || order.QuotationDate)}
                          </CTableDataCell>
                          <CTableDataCell>
                            {order.currencyCode || 'PKR'} ({order.exchangeRate || 1})
                          </CTableDataCell>
                          <CTableDataCell className="fw-bold text-dark">
                            {toNumber(
                              order.netAmount || order.NetAmount || order.totalAmount || 0,
                              2,
                            )}
                          </CTableDataCell>
                          <CTableDataCell>
                            <CBadge
                              color={getStatusBadge(status)}
                              shape="rounded-pill"
                              className="px-3 py-2 shadow-sm"
                            >
                              {status.toUpperCase()}
                            </CBadge>
                          </CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex justify-content-center align-items-center gap-2">
                              {status.toLowerCase() === 'pending' && (
                                <button
                                  className="btn btn-sm"
                                  style={{
                                    background: '#ecfdf5',
                                    color: '#10b981',
                                    border: '1px solid #10b981',
                                    borderRadius: '6px',
                                    padding: '4px 10px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                  }}
                                  onClick={() => handleApprove(id)}
                                >
                                  <ApproveIcon /> Approve
                                </button>
                              )}
                              <button
                                className="btn btn-sm"
                                style={{
                                  background: '#fffbeb',
                                  color: '#b45309',
                                  border: '1px solid #f59e0b',
                                  borderRadius: '6px',
                                  padding: '4px 10px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                }}
                                onClick={() => {
                                  setEditData(order)
                                  setVisible(true)
                                }}
                              >
                                <EditIcon /> Edit
                              </button>
                              <button
                                className="btn btn-sm"
                                onClick={() => handleDelete(id)}
                                style={{
                                  background: '#fef2f2',
                                  color: '#dc2626',
                                  border: '1px solid #ef4444',
                                  borderRadius: '6px',
                                  padding: '4px 10px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                }}
                              >
                                <DeleteIcon /> Delete
                              </button>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      )
                    })
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={7} className="text-center py-5">
                        No Vendor Quotations Found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
      <VendorQuotationAddEditModel visible={visible} setVisible={setVisible} editData={editData} />
    </CRow>
  )
}

export default VendorQuotation
