import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// useNavigate import karein redirect karne ke liye
import { useNavigate } from 'react-router-dom'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CBadge } from '@coreui/react'
import { useToast } from '../../components/common/ToastContext'
import { useAppLanguage } from '../../components/common/LanguageContext'
import TableHeader from '../../components/common/TableHeader'
import AppButton from '../../components/common/AppButton'
import AppPagination from '../../components/common/AppPagination'
import { formatDate, toNumber } from '../../components/common/formatter'

import '../../scss/permissingSetting.scss'
import '../../scss/pagination.scss'

import {
  getAllStockTransaction,
  deleteStockTransaction,
} from '../../redux/slice/stockTransactionSlice'

function StockTransaction() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { l } = useAppLanguage()

  const transactionData = useSelector((state) => state.stockTransactions?.result) || []
  const totalCount = useSelector((state) => state.stockTransactions?.result?.totalCount) || 0

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [activeColumn, setActiveColumn] = useState('Date')

  const gridLayout = {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1.5fr 1fr 0.8fr 1fr 1fr 0.5fr',
    alignItems: 'center',
    gap: '10px',
  }

  useEffect(() => {
    dispatch(getAllStockTransaction({ pageNumber: currentPage, pageSize: pageSize }))
  }, [dispatch, currentPage, pageSize])

  const totalPages = Math.ceil(totalCount / pageSize)
  const handleReferenceClick = (refId) => {
    if (refId) {
      navigate('/purchaseManagement/deliverynotes', { state: { searchRef: refId } })
    }
  }

  const handleDelete = (id) => {
    if (window.confirm(l('are you sure you want to delete this transaction?'))) {
      dispatch(deleteStockTransaction(id)).then(() => {
        addToast(l('deleted'), l('transaction deleted successfully'), 'error')
        dispatch(getAllStockTransaction({ pageNumber: currentPage, pageSize: pageSize }))
      })
    }
  }

  return (
    <div className="user-container px-3">
      <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
        <div>
          <h4 className="mb-0 text-dark fw-semibold">Inventory Movement Log</h4>
          <small className="text-muted">Home | {l('transactions')}</small>
        </div>
        <div className="mt-1">
          <AppButton
            variant="golden"
            data={transactionData}
            fileName="Stock_Transaction_Report"
            size="sm"
          >
            {l('download_xls')}
          </AppButton>
        </div>
      </div>

      <div
        className="table-header px-4 d-none d-md-grid text-muted small mb-1 bg-light py-2 rounded"
        style={gridLayout}
      >
        <TableHeader col="Date" activeColumn={activeColumn} setActiveColumn={setActiveColumn} />
        <TableHeader col="Product" activeColumn={activeColumn} setActiveColumn={setActiveColumn} />
        <TableHeader col="Type" activeColumn={activeColumn} setActiveColumn={setActiveColumn} />
        <TableHeader col="Qty" activeColumn={activeColumn} setActiveColumn={setActiveColumn} />
        <TableHeader col="Price" activeColumn={activeColumn} setActiveColumn={setActiveColumn} />
        <TableHeader col="Ref #" activeColumn={activeColumn} setActiveColumn={setActiveColumn} />
        <TableHeader col="Action" activeColumn={activeColumn} setActiveColumn={setActiveColumn} />
      </div>

      <div className="employee-list">
        {transactionData.length > 0 ? (
          transactionData.map((t) => (
            <div
              key={t.id}
              className="user-card px-4 py-2 mb-1 bg-white border rounded shadow-sm"
              style={gridLayout}
            >
              <span className="text-muted small">{formatDate(t.transactionDate)}</span>

              <span className="text-dark fw-bold text-truncate" title={t.productName}>
                {t.productName || 'N/A'}
              </span>

              <span>
                <CBadge
                  color={t.transactionType === 'Delivery' ? 'danger' : 'success'}
                  style={{
                    minWidth: '70px',
                    textAlign: 'center',
                    padding: '5px 10px',
                    fontSize: '11px',
                  }}
                >
                  {t.transactionType || 'Type'}
                </CBadge>
              </span>

              <span className={`fw-bold ${t.quantity < 0 ? 'text-danger' : 'text-success'}`}>
                {Math.abs(t.quantity)}
              </span>

              <span className="text-dark">{toNumber(t.unitPrice, 2)}</span>
              <span style={{ cursor: t.referenceId ? 'pointer' : 'default' }}>
                <CBadge
                  color="info"
                  variant="outline"
                  onClick={() => handleReferenceClick(t.referenceId)}
                  style={{
                    fontSize: '11px',
                    padding: '4px 6px',
                    whiteSpace: 'nowrap',
                    display: 'inline-block',
                    width: 'auto',
                    cursor: 'pointer',
                  }}
                >
                  {t.referenceId ? `DN-${t.referenceId}` : '---'}
                </CBadge>
              </span>

              <div className="text-end">
                <CDropdown variant="btn-group">
                  <CDropdownToggle color="white" className="p-0 border-0 shadow-none" caret={false}>
                    <div style={{ cursor: 'pointer', fontSize: '20px', color: '#666' }}>⋮</div>
                  </CDropdownToggle>
                  <CDropdownMenu className="border-0 shadow-sm">
                    <CDropdownItem className="text-danger" onClick={() => handleDelete(t.id)}>
                      {l('delete')}
                    </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-4 bg-white border rounded">
            <p className="text-muted mb-0">{l('no_records_found')}</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-3">
          <AppPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  )
}

export default StockTransaction
