import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react'
import { useToast } from '../../components/common/ToastContext'
import { useAppLanguage } from '../../components/common/LanguageContext'
import TableHeader from '../../components/common/TableHeader'
import AppButton from '../../components/common/AppButton'
import AppPagination from '../../components/common/AppPagination'
import AddEditEmployeeModal from './AddEditEmployeeModal'

// CSS imports
import '../../scss/permissingSetting.scss'
import '../../scss/pagination.scss'

import {
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
  createEmployee,
} from '../../redux/slice/employeeSlice'

function Employees() {
  const dispatch = useDispatch()
  const { addToast } = useToast() // Toast initialization
  const { l } = useAppLanguage() // Translation initialization

  const employeesData = useSelector((state) => state.employee?.result) || []
  const totalCount = useSelector((state) => state.employee?.totalCount) || 0
  console.log('Employees Data from Redux:', employeesData)
  // States
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  console.log('Employees Data from Redux:', employeesData)
  // States

  const [activeColumn, setActiveColumn] = useState(l('name')) // Underline state
  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState({
    id: 0,
    name: '',
    salary: '',
    documents: '',
  })

  const gridLayout = {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1.8fr 1fr 1.5fr 0.5fr',
    alignItems: 'center',
  }

  useEffect(() => {
    dispatch(getAllEmployees({ page: currentPage, size: pageSize }))
  }, [dispatch, currentPage, pageSize])
  const totalPages = Math.ceil(totalCount / pageSize)
  const currentEmployees = employeesData
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [totalPages])

  useEffect(() => {
    dispatch(getAllEmployees())
  }, [dispatch])

  const handleSave = () => {
    console.log("form by employee",form);
    if (!form.name) return

    if (form.id === 0) {
      dispatch(createEmployee(form))
      addToast(l('success'), l('employee_created'), 'success')
    } else {
      dispatch(updateEmployee(form))
      addToast(l('success'), l('employee_updated'), 'success')
    }

    setVisible(false)
    resetForm()
  }

  const handleDelete = (id) => {
    if (window.confirm(l('are you sure you want to delete this employee?'))) {
      dispatch(deleteEmployee(id))
      addToast(l('deleted'), l('employee deleted successfully'), 'error')
    }
  }

  const resetForm = () => {
    setForm({ id: 0, name: '', salary : '',  documents: '' })
  }

  return (
    <div className="user-container px-3">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
        <div>
          <h4 className="mb-0 text-dark fw-semibold">{l('employee_management')}</h4>
          <small className="text-muted">Home | {l('employees')}</small>
          <div className="mt-1">
            <AppButton variant="golden" data={employeesData} fileName="Employee_Report" size="sm">
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

      {/* Table Header with Underline Logic */}
      <div className="table-header px-4 d-none d-md-grid text-muted small mb-1" style={gridLayout}>
        <TableHeader
          col={l('name')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
        <TableHeader
          col={l('salary')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
        <TableHeader
          col={l('documents')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />       
        <TableHeader
          col={l('action')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
      </div>

      {/* Employee List */}
      <div className="employee-list">
        {currentEmployees.length > 0 ? (
          currentEmployees.map((c) => (
            <div
              key={c.id}
              className="user-card px-4 py-2 mb-1 bg-white border rounded shadow-sm"
              style={gridLayout}
            >
              <span className="text-dark fw-bold">{c.name}</span>
              <span>
                <a
                  href={`mailto:${c.salary}`}
                  className="text-decoration-none"
                  style={{ color: '#3498db' }}
                >
                  {c.salary || '---'}
                </a>
              </span>
              <span className="text-muted small text-truncate pe-2">{c.documents || '---'}</span>

              <div className="text-end">
                <CDropdown variant="btn-group">
                  <CDropdownToggle color="white" className="p-0 border-0 shadow-none" caret={false}>
                    <div style={{ cursor: 'pointer', fontSize: '20px', color: '#666' }}>⋮</div>
                  </CDropdownToggle>
                  <CDropdownMenu className="border-0 shadow-sm">
                    <CDropdownItem
                      onClick={() => {
                        setForm(c)
                        setVisible(true)
                      }}
                    >
                      {l('edit')}
                    </CDropdownItem>
                    <CDropdownItem className="text-danger" onClick={() => handleDelete(c.id)}>
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

      {/* Pagination */}
      <div className="mt-1">
        <AppPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <AddEditEmployeeModal
        visible={visible}
        setVisible={setVisible}
        form={form}
        setForm={setForm}
        handleSave={handleSave}
      />
    </div>
  )
}

export default Employees
