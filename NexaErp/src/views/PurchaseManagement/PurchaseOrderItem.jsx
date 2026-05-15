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
import PurchaseOrderModal from './PurchaseOrderModal'
import {
  getAllPurchaseOrderItems,
  deletePurchaseOrderItem,
} from '../../redux/slice/purchaseOrdertemSlice'
import { toNumber, formatDate, sortData } from '../../components/common/formatter'
import AppLoader from '../../components/common/AppLoader'

const EditIcon = () => <span style={{ marginRight: '5px' }}>✎</span>
const DeleteIcon = () => <span style={{ marginRight: '5px' }}>🗑</span>

function PurchaseOrderItem() {
  const dispatch = useDispatch()
  const { result: orders, isLoading } = useSelector((state) => state.purchaseOrderItems)
  const [visible, setVisible] = useState(false)
  const [editData, setEditData] = useState(null)
  const { addToast } = useToast()

  const [sortConfig, setSortConfig] = useState({ key: 'poNumber', direction: 'desc' })

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
        discount: acc.discount + Number(curr.totalDiscount || 0),
        tax: acc.tax + Number(curr.totalTax || 0),
        total: acc.total + Number(curr.totalAmount || 0),
      }),
      { discount: 0, tax: 0, total: 0 },
    )
  }, [orders])

  useEffect(() => {
    dispatch(getAllPurchaseOrderItems({ page: 1, size: 10 }))
  }, [dispatch])

  const handleDelete = (id) => {
    if (
      window.confirm(
        'Are you sure you want to delete this Purchase Order? Purchase will be reversed.',
      )
    ) {
      dispatch(deletePurchaseOrderItem(id)).then(() => {
        addToast('Success', 'Purchase Order deleted and status reversed', 'success')
        dispatch(getAllPurchaseOrderItems({ page: 1, size: 10 }))
      })
    }
  }

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase()
    if (s === 'ordered' || s === 'received') return 'success'
    if (s === 'pending' || s === 'partial') return 'warning'
    if (s === 'cancelled') return 'danger'
    return 'secondary'
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
          title="Total Discount"
          value={toNumber(stats.discount, 2)}
          progress={{ color: 'danger', value: 100 }}
        />
      </CCol>
      <CCol sm={6} lg={4}>
        <CWidgetStatsC
          className="mb-3 shadow-sm border-0 py-2"
          icon={<CIcon icon={cilBank} height={36} className="text-info" />}
          title="Total Tax"
          value={toNumber(stats.tax, 2)}
          progress={{ color: 'info', value: 100 }}
        />
      </CCol>

      <CCol xs={12}>
        <CCard className="shadow-sm border-0 mt-2">
          <CCardBody>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold" style={{ color: '#4c1d95' }}>
                Purchase Orders
              </h4>
              <AppButton
                variant="purple"
                onClick={() => {
                  setEditData(null)
                  setVisible(true)
                }}
              >
                + Create Order
              </AppButton>
            </div>

            {isLoading ? (
              <AppLoader message="Fetching Purchase Data..." />
            ) : (
              <CTable responsive hover align="middle" className="border-top mt-2">
                <CTableHead color="light">
                  <CTableRow>
                    <TableHeader
                      col="PO #"
                      sortKey="poNumber"
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
                      col="Product (Qty Status)"
                      sortKey="productName"
                      onSort={handleSort}
                      currentSort={sortConfig}
                    />
                    <TableHeader
                      col="Date"
                      sortKey="orderDate"
                      onSort={handleSort}
                      currentSort={sortConfig}
                    />
                    <TableHeader
                      col="Total Amount"
                      sortKey="totalAmount"
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
                    sortedOrders.map((order) => (
                      <CTableRow key={order.id || order.ID} className="align-middle">
                        <CTableDataCell>
                          <div className="fw-bold" style={{ color: '#d63384' }}>
                            {order.poNumber || order.PONumber}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="fw-semibold text-dark">
                            {order.vendorName || order.VendorName || 'N/A'}
                          </div>
                        </CTableDataCell>

                        <CTableDataCell style={{ minWidth: '200px' }}>
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item, idx) => {
                              const qty = Number(item.quantity || 0)
                              const received = Number(item.receivedQuantity || 0)
                              const pending = qty - received

                              return (
                                <div key={idx} className="mb-2 p-1 border-bottom border-light">
                                  <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>
                                    {item.productName || 'N/A'}
                                  </div>
                                  <div className="d-flex flex-wrap gap-1 mt-1">
                                    <small className="badge bg-light text-dark border">
                                      Total: {qty}
                                    </small>
                                    <small className="badge bg-success-light text-success border">
                                      Done: {received}
                                    </small>
                                    {pending > 0 ? (
                                      <small className="badge bg-warning-light text-warning border">
                                        Pending: {pending}
                                      </small>
                                    ) : (
                                      <small className="badge bg-info-light text-info border">
                                        Completed
                                      </small>
                                    )}
                                  </div>
                                </div>
                              )
                            })
                          ) : (
                            <span className="text-muted">No Items</span>
                          )}
                        </CTableDataCell>

                        <CTableDataCell>{formatDate(order.orderDate)}</CTableDataCell>
                        <CTableDataCell className="fw-bold text-dark">
                          {toNumber(order.totalAmount, 2)}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge
                            color={getStatusBadge(order.status)}
                            shape="rounded-pill"
                            className="px-3 py-2 shadow-sm"
                          >
                            {(order.status || 'Pending').toUpperCase()}
                          </CBadge>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex justify-content-center align-items-center gap-2">
                            <button
                              className="btn btn-sm"
                              style={{
                                background: '#fffbeb',
                                color: '#b45309',
                                border: '1px solid #f59e0b',
                                borderRadius: '6px',
                                padding: '4px 10px',
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
                              style={{
                                background: '#fef2f2',
                                color: '#dc2626',
                                border: '1px solid #ef4444',
                                borderRadius: '6px',
                                padding: '4px 10px',
                              }}
                              onClick={() => handleDelete(order.id || order.ID)}
                            >
                              <DeleteIcon /> Delete
                            </button>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan={7} className="text-center py-5">
                        No Purchase Orders Found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
      <PurchaseOrderModal visible={visible} setVisible={setVisible} editData={editData} />
    </CRow>
  )
}

export default PurchaseOrderItem
