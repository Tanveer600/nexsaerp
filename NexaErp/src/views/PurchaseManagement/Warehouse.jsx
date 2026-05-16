import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CBadge,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardHeader,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilHome,
  cilIndustry,
  cilCloudDownload,
  cilPlus,
  cilOptions,
  cilLocationPin,
  cilUser,
  cilPhone,
  cilCheckCircle,
  cilWarning,
} from '@coreui/icons'
import { useToast } from '../../components/common/ToastContext'
import { useAppLanguage } from '../../components/common/LanguageContext'
import AppButton from '../../components/common/AppButton'
import AppPagination from '../../components/common/AppPagination'
import WarehouseAddEditModel from './WarehouseAddEditModel'

import '../../scss/permissingSetting.scss'
import '../../scss/pagination.scss'

import {
  getAllWarehouses,
  updateWarehouse,
  deleteWarehouse,
  createWarehouse,
} from '../../redux/slice/warehouseSlice'

function Warehouse() {
  const dispatch = useDispatch()
  const { addToast } = useToast()
  const { l } = useAppLanguage()

  const warehousesData = useSelector((state) => state.warehouses?.result) || []
  const totalCount = useSelector((state) => state.warehouses?.totalCount) || 0

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [visible, setVisible] = useState(false)

  // Right side panel par detail dikhane ke liye dynamic state
  const [selectedWarehouse, setSelectedWarehouse] = useState(null)

  const [form, setForm] = useState({
    id: 0,
    Name: '',
    Location: '',
    ContactPerson: '',
    Phone: '',
    IsActive: true,
    IsDefault: false,
  })

  useEffect(() => {
    dispatch(getAllWarehouses({ page: currentPage, size: pageSize }))
  }, [dispatch, currentPage, pageSize])

  // Jab data first time load ho, toh automatic pehle record ko split panel me load kar do
  useEffect(() => {
    if (warehousesData.length > 0 && !selectedWarehouse) {
      setSelectedWarehouse(warehousesData[0])
    }
  }, [warehousesData, selectedWarehouse])

  const totalPages = Math.ceil(totalCount / pageSize)

  const handleSave = () => {
    if (!form.Name) {
      addToast(l('error'), 'Warehouse Name is required', 'danger')
      return
    }

    if (form.id === 0) {
      dispatch(createWarehouse(form))
      addToast(l('success'), l('warehouse_created'), 'success')
    } else {
      dispatch(updateWarehouse(form))
      addToast(l('success'), l('warehouse_updated'), 'success')
    }
    setVisible(false)
    resetForm()
  }

  const handleDelete = (id) => {
    if (window.confirm(l('are you sure you want to delete?'))) {
      dispatch(deleteWarehouse(id))
      addToast(l('deleted'), l('warehouse deleted'), 'error')
      if (selectedWarehouse?.id === id) {
        setSelectedWarehouse(null)
      }
    }
  }

  const resetForm = () =>
    setForm({
      id: 0,
      Name: '',
      Location: '',
      ContactPerson: '',
      Phone: '',
      IsActive: true,
      IsDefault: false,
    })

  return (
    <div className="warehouse-page-container px-3 py-2">
      {/* Top Professional Header Banner */}
      <div className="d-flex justify-content-between align-items-end mb-4 bg-white p-3 rounded shadow-sm border-top border-warning border-4">
        <div>
          <h4 className="mb-1 text-dark fw-bold" style={{ letterSpacing: '-0.5px' }}>
            {l('Warehouse Settings')}
          </h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small mb-2">
              <li className="breadcrumb-item text-muted">
                <CIcon icon={cilHome} size="sm" className="me-1" />
                {l('Home')}
              </li>
              <li className="breadcrumb-item text-muted">{l('Inventory')}</li>
              <li className="breadcrumb-item active text-warning fw-semibold">{l('Warehouses')}</li>
            </ol>
          </nav>
          <AppButton
            variant="outline-dark"
            data={warehousesData}
            fileName="Warehouse_Report"
            size="sm"
            className="me-2 shadow-sm d-inline-flex align-items-center gap-1"
          >
            <CIcon icon={cilCloudDownload} size="sm" />
            <span className="small">{l('Export Excel')}</span>
          </AppButton>
        </div>
        <AppButton
          className="shadow-sm px-4 py-2 fw-bold d-inline-flex align-items-center gap-2"
          style={{ backgroundColor: '#802060', border: 'none' }}
          onClick={() => {
            resetForm()
            setVisible(true)
          }}
        >
          <CIcon icon={cilPlus} size="sm" />
          {l('Create Warehouse')}
        </AppButton>
      </div>

      {/* Layout 3 Split Grid Structure */}
      <CRow className="g-3">
        {/* LEFT COLUMN: MASTER LIST TABLE (55% Width) */}
        <CCol lg={7} md={12}>
          <div className="bg-white rounded shadow-sm border overflow-hidden">
            <CTable align="middle" className="mb-0 small" hover responsive>
              <CTableHead className="bg-light text-uppercase fw-bold text-secondary">
                <CTableRow>
                  <CTableHeaderCell className="py-3 px-3" style={{ width: '60px' }}>
                    {l('ID')}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-3">{l('Warehouse Name')}</CTableHeaderCell>
                  <CTableHeaderCell className="py-3" style={{ width: '100px' }}>
                    {l('Status')}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-3 text-end px-3" style={{ width: '60px' }}>
                    {l('Actions')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {warehousesData.length > 0 ? (
                  warehousesData.map((w) => {
                    const isSelected = selectedWarehouse?.id === w.id
                    return (
                      <CTableRow
                        key={w.id}
                        className="align-middle"
                        style={{
                          cursor: 'pointer',
                          backgroundColor: isSelected ? '#fffdf5' : 'transparent',
                          borderLeft: isSelected ? '4px solid #f9b115' : '4px solid transparent',
                        }}
                        onClick={() => setSelectedWarehouse(w)}
                      >
                        {/* ID Column */}
                        <CTableDataCell className="px-3 fw-semibold text-secondary">
                          #{w.id}
                        </CTableDataCell>

                        {/* Name & Type Column */}
                        <CTableDataCell>
                          <span className="text-dark fw-bold d-block style-title">
                            {w.name || w.Name}
                          </span>
                          {w.isDefault || w.IsDefault ? (
                            <CBadge
                              color="warning"
                              className="text-dark px-2 py-0.5"
                              style={{ fontSize: '9px', fontWeight: '700' }}
                            >
                              DEFAULT HUB
                            </CBadge>
                          ) : (
                            <small className="text-muted" style={{ fontSize: '10px' }}>
                              Code: WH-00{w.id}
                            </small>
                          )}
                        </CTableDataCell>

                        {/* Status Badge Column */}
                        <CTableDataCell>
                          <CBadge
                            color={w.isActive || w.IsActive ? 'success' : 'danger'}
                            shape="rounded-pill"
                            className="px-2.5 py-1"
                            style={{ fontSize: '10px' }}
                          >
                            {w.isActive || w.IsActive ? 'ACTIVE' : 'INACTIVE'}
                          </CBadge>
                        </CTableDataCell>

                        {/* Dropdown Action Menu */}
                        <CTableDataCell
                          className="text-end px-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <CDropdown variant="btn-group">
                            <CDropdownToggle
                              color="light"
                              className="p-1 border-0 shadow-none"
                              caret={false}
                            >
                              <CIcon icon={cilOptions} className="text-muted" size="sm" />
                            </CDropdownToggle>
                            <CDropdownMenu className="border-0 shadow-sm dropdown-menu-end">
                              <CDropdownItem
                                className="py-2 d-flex align-items-center gap-2"
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                  setForm({
                                    id: w.id,
                                    Name: w.name || w.Name,
                                    Location: w.location || w.Location,
                                    ContactPerson: w.contactPerson || w.ContactPerson,
                                    Phone: w.phone || w.Phone,
                                    IsActive: w.isActive || w.IsActive,
                                    IsDefault: w.isDefault || w.IsDefault,
                                  })
                                  setVisible(true)
                                }}
                              >
                                <span>Modify Record</span>
                              </CDropdownItem>
                              <CDropdownItem
                                className="text-danger py-2 border-top d-flex align-items-center gap-2"
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleDelete(w.id)}
                              >
                                <span>Remove Record</span>
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </CTableDataCell>
                      </CTableRow>
                    )
                  })
                ) : (
                  <CTableRow>
                    <CTableDataCell colSpan="4" className="text-center p-5 text-muted bg-white">
                      <CIcon icon={cilWarning} size="xl" className="text-warning mb-2" />
                      <h5>{l('No Warehouse Records Found')}</h5>
                    </CTableDataCell>
                  </CTableRow>
                )}
              </CTableBody>
            </CTable>
          </div>

          {/* Pagination View */}
          <div className="mt-3">
            <AppPagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </CCol>

        {/* RIGHT COLUMN: DETAIL VIEW CONSOLE (45% Width) */}
        <CCol lg={5} md={12}>
          {selectedWarehouse ? (
            <CCard className="shadow-sm border border-light-300">
              <CCardHeader className="bg-light py-3 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <CIcon icon={cilIndustry} className="text-warning" size="lg" />
                  <span className="fw-bold text-dark m-0 h6">
                    {selectedWarehouse.name || selectedWarehouse.Name}
                  </span>
                </div>
                <CBadge
                  color={
                    selectedWarehouse.isActive || selectedWarehouse.IsActive ? 'success' : 'danger'
                  }
                >
                  {selectedWarehouse.isActive || selectedWarehouse.IsActive
                    ? 'LIVE OPERATIONAL'
                    : 'OFFLINE'}
                </CBadge>
              </CCardHeader>
              <CCardBody className="p-4 text-dark">
                {/* Meta Identifiers */}
                <div className="row g-2 mb-4 border-bottom pb-3">
                  <div className="col-6">
                    <span
                      className="text-muted d-block small text-uppercase fw-semibold"
                      style={{ fontSize: '10px' }}
                    >
                      System Entity ID
                    </span>
                    <span className="fw-bold text-secondary">#{selectedWarehouse.id}</span>
                  </div>
                  <div className="col-6">
                    <span
                      className="text-muted d-block small text-uppercase fw-semibold"
                      style={{ fontSize: '10px' }}
                    >
                      Allocation Status
                    </span>
                    {selectedWarehouse.isDefault || selectedWarehouse.IsDefault ? (
                      <span className="text-warning small fw-bold d-flex align-items-center gap-1">
                        <CIcon icon={cilCheckCircle} size="sm" /> Core Default Node
                      </span>
                    ) : (
                      <span className="text-muted small">Secondary Sub-Store</span>
                    )}
                  </div>
                </div>

                {/* Logistics Details */}
                <div className="mb-4 d-flex align-items-start gap-3">
                  <div className="bg-light p-2 rounded text-secondary">
                    <CIcon icon={cilLocationPin} size="md" />
                  </div>
                  <div>
                    <span
                      className="text-muted d-block small text-uppercase fw-bold"
                      style={{ fontSize: '10px' }}
                    >
                      Physical Geographic Address
                    </span>
                    <p
                      className="m-0 text-secondary small fw-semibold"
                      style={{ lineHeight: '1.5' }}
                    >
                      {selectedWarehouse.location ||
                        selectedWarehouse.Location ||
                        'No physical address specified in master records.'}
                    </p>
                  </div>
                </div>

                {/* Personnel Details */}
                <div className="mb-4 d-flex align-items-start gap-3">
                  <div className="bg-light p-2 rounded text-secondary">
                    <CIcon icon={cilUser} size="md" />
                  </div>
                  <div>
                    <span
                      className="text-muted d-block small text-uppercase fw-bold"
                      style={{ fontSize: '10px' }}
                    >
                      Assigned Warehouse Manager
                    </span>
                    <span className="d-block text-dark fw-bold small">
                      {selectedWarehouse.contactPerson ||
                        selectedWarehouse.ContactPerson ||
                        'Unassigned Personnel'}
                    </span>
                  </div>
                </div>

                {/* Communication Node */}
                <div className="mb-4 d-flex align-items-start gap-3">
                  <div className="bg-light p-2 rounded text-secondary">
                    <CIcon icon={cilPhone} size="md" />
                  </div>
                  <div>
                    <span
                      className="text-muted d-block small text-uppercase fw-bold"
                      style={{ fontSize: '10px' }}
                    >
                      Secure Direct Telecom Node
                    </span>
                    <span className="d-block text-secondary small fw-semibold">
                      {selectedWarehouse.phone ||
                        selectedWarehouse.Phone ||
                        'No active terminal number.'}
                    </span>
                  </div>
                </div>

                {/* Enterprise Footer Actions Inside Panel */}
                <div className="pt-3 border-top d-flex gap-2 justify-content-end">
                  <AppButton
                    variant="outline-dark"
                    size="sm"
                    className="px-3"
                    onClick={() => {
                      setForm({
                        id: selectedWarehouse.id,
                        Name: selectedWarehouse.name || selectedWarehouse.Name,
                        Location: selectedWarehouse.location || selectedWarehouse.Location,
                        ContactPerson:
                          selectedWarehouse.contactPerson || selectedWarehouse.ContactPerson,
                        Phone: selectedWarehouse.phone || selectedWarehouse.Phone,
                        IsActive: selectedWarehouse.isActive || selectedWarehouse.IsActive,
                        IsDefault: selectedWarehouse.isDefault || selectedWarehouse.IsDefault,
                      })
                      setVisible(true)
                    }}
                  >
                    Edit Node Profile
                  </AppButton>
                </div>
              </CCardBody>
            </CCard>
          ) : (
            <div className="text-center p-5 bg-light rounded border border-dashed text-muted">
              <CIcon icon={cilIndustry} size="xl" className="mb-2 text-secondary" />
              <h6>Select Node Profile</h6>
              <small>Table row par click karke details load karein.</small>
            </div>
          )}
        </CCol>
      </CRow>

      {/* Tabbed Modal Profile Component */}
      <WarehouseAddEditModel
        visible={visible}
        setVisible={setVisible}
        form={form}
        setForm={setForm}
        handleSave={handleSave}
      />
    </div>
  )
}

export default Warehouse
