import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react'
import { useToast } from '../../components/common/ToastContext'
import { useAppLanguage } from '../../components/common/LanguageContext'
import TableHeader from '../../components/common/TableHeader'
import AppButton from '../../components/common/AppButton'
import AppPagination from '../../components/common/AppPagination'
import VendorAddEditModel from './VendorAddEditModel'
import '../../scss/permissingSetting.scss'
import '../../scss/pagination.scss'

import {
  getAllVendors,
  updateVendor,
  deleteVendor,
  createVendor,
} from '../../redux/slice/vendorSlice'

function Vendors() {
  const dispatch = useDispatch()
  const { addToast } = useToast()
  const { l } = useAppLanguage()

  const vendorsData = useSelector((state) => state.vendors?.result) || []
  const totalCount = useSelector((state) => state.vendors?.totalCount) || 0
  const currentVendors = vendorsData
  console.log('Vendors Data from Redux:', currentVendors)
  // States
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  console.log('Vendors Data from Redux:', vendorsData)
  // States

  const [activeColumn, setActiveColumn] = useState(l('name')) // Underline state
  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState({
    id: 0,
    name: '',
    contact: '',
    address: '',
  })

  const gridLayout = {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1.8fr 1fr 1.5fr 0.5fr',
    alignItems: 'center',
  }

  useEffect(() => {
    if (currentPage && pageSize) {
      dispatch(getAllVendors({ page: currentPage, size: pageSize }))
    }
  }, [dispatch, currentPage, pageSize])
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / pageSize) : 1

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  console.log('Final Vendors Data for Table:', vendorsData)

  const handleSave = () => {
    if (!form.name) return

    if (form.id === 0) {
      dispatch(createVendor(form))
      addToast(l('success'), l('vendor_created'), 'success')
    } else {
      dispatch(updateVendor(form))
      addToast(l('success'), l('vendor_updated'), 'success')
    }

    setVisible(false)
    resetForm()
  }

  const handleDelete = (id) => {
    if (window.confirm(l('are you sure you want to delete this vendor?'))) {
      dispatch(deleteVendor(id))
      addToast(l('deleted'), l('vendor deleted successfully'), 'error')
    }
  }

  const resetForm = () => {
    setForm({ id: 0, name: '', contact: '', address: '' })
  }

  return (
    <div className="user-container px-3">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
        <div>
          <h4 className="mb-0 text-dark fw-semibold">{l('Vendor Management')}</h4>
          <small className="text-muted">Home | {l('vendors')}</small>
          <div className="mt-1">
            <AppButton variant="golden" data={vendorsData} fileName="Vendor_Report" size="sm">
              {l('download_xls')}
            </AppButton>
          </div>
        </div>
        <AppButton
          onClick={() => {
            resetForm()
            setVisible(true)
          }}
        >
          {l('add_new')}
        </AppButton>
      </div>

      <div className="table-header px-4 d-none d-md-grid text-muted small mb-1" style={gridLayout}>
        <TableHeader
          col={l('name')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
        <TableHeader
          col={l('address')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
        <TableHeader
          col={l('contact')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
        <TableHeader
          col={l('action')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
      </div>

      <div className="vendor-list">
        {currentVendors.length > 0 ? (
          currentVendors.map((v) => (
            <div
              key={v.id}
              className="user-card px-4 py-2 mb-1 bg-white border rounded shadow-sm"
              style={gridLayout}
            >
              <span className="text-dark fw-bold">{v.name}</span>
              <span className="text-muted">{v.address || '---'}</span>
              <span className="fw-semibold" style={{ color: '#2c3e50' }}>
                {v.contact || v.Contact || '---'}
              </span>
              <span className="text-truncate small text-muted"></span>
              <div className="text-end">
                <CDropdown variant="btn-group">
                  <CDropdownToggle color="white" className="p-0 border-0 shadow-none" caret={false}>
                    <div style={{ cursor: 'pointer', fontSize: '20px', color: '#666' }}>⋮</div>
                  </CDropdownToggle>
                  <CDropdownMenu className="border-0 shadow-sm">
                    <CDropdownItem
                      onClick={() => {
                        setForm(v)
                        setVisible(true)
                      }}
                    >
                      {l('edit')}
                    </CDropdownItem>
                    <CDropdownItem className="text-danger" onClick={() => handleDelete(v.id)}>
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

      <div className="mt-1">
        <AppPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <VendorAddEditModel
        visible={visible}
        setVisible={setVisible}
        form={form}
        setForm={setForm}
        handleSave={handleSave}
      />
    </div>
  )
}

export default Vendors
