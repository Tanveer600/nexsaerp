import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash, cilOptions, cilCloudDownload, cilPlus } from '@coreui/icons'
import { useToast } from '../../components/common/ToastContext'
import TableHeader from '../../components/common/TableHeader'
import AppButton from '../../components/common/AppButton'
import AppPagination from '../../components/common/AppPagination'
import CategoryAddEditModel from './CategoryAddEditModel'

import '../../scss/permissingSetting.scss'
import '../../scss/pagination.scss'

import {
  getAllCategories,
  updateCategorie,
  deleteCategorie,
  createCategorie,
} from '../../redux/slice/categoriesSlice'

function Category() {
  const dispatch = useDispatch()
  const { addToast } = useToast()

  const categoriesData = useSelector((state) => state.categories?.result) || []
  const totalCount = useSelector((state) => state.categories?.totalCount) || 0
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [visible, setVisible] = useState(false)

  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' })

  const [form, setForm] = useState({
    id: 0,
    Name: '',
    Code: '',
    IsActive: true,
  })

  const gridLayout = {
    display: 'grid',
    gridTemplateColumns: '2fr 1.5fr 1fr 0.5fr',
    alignItems: 'center',
    gap: '20px',
  }

  useEffect(() => {
    dispatch(getAllCategories({ page: currentPage, size: pageSize }))
  }, [dispatch, currentPage, pageSize])

  const totalPages = Math.ceil(totalCount / pageSize)

  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const sortedCategories = [...categoriesData].sort((a, b) => {
    const valA = (a[sortConfig.key] || '').toString().toLowerCase()
    const valB = (b[sortConfig.key] || '').toString().toLowerCase()

    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const handleSave = () => {
    if (!form.Name) {
      addToast('Error', 'Category Name is required', 'danger')
      return
    }
    if (!form.Code) {
      addToast('Error', 'Category Code is required', 'danger')
      return
    }

    if (form.id === 0) {
      dispatch(createCategorie(form))
      addToast('Success', 'Category Created Successfully', 'success')
    } else {
      dispatch(updateCategorie(form))
      addToast('Success', 'Category Updated Successfully', 'success')
    }
    setVisible(false)
    resetForm()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      dispatch(deleteCategorie(id))
      addToast('Deleted', 'Category Deleted Successfully', 'error')
    }
  }

  const resetForm = () =>
    setForm({
      id: 0,
      Name: '',
      Code: '',
      IsActive: true,
    })

  return (
    <div className="product-page-container px-3 py-2">
      <div className="d-flex justify-content-between align-items-end mb-4 bg-white p-3 rounded shadow-sm border-top border-primary border-4">
        <div>
          <h4 className="mb-1 text-primary fw-bold" style={{ letterSpacing: '-0.5px' }}>
            Category Management
          </h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small mb-2">
              <li className="breadcrumb-item text-muted">Home</li>
              <li className="breadcrumb-item active text-primary fw-semibold">Categories</li>
            </ol>
          </nav>
          <AppButton
            variant="outline-dark"
            data={sortedCategories}
            fileName="Category_Report"
            size="sm"
            className="me-2 shadow-sm d-flex align-items-center gap-1"
          >
            <CIcon icon={cilCloudDownload} size="sm" />
            <span className="small">Download XLS</span>
          </AppButton>
        </div>
        <AppButton
          className="shadow-sm px-4 py-2 fw-bold btn-primary d-flex align-items-center gap-2"
          onClick={() => {
            resetForm()
            setVisible(true)
          }}
        >
          <CIcon icon={cilPlus} size="sm" className="text-white" />
          Add New
        </AppButton>
      </div>

      <div
        className="table-header px-4 py-3 d-none d-md-grid text-uppercase fw-bold text-secondary border-bottom mb-2 bg-light rounded shadow-sm"
        style={gridLayout}
      >
        <TableHeader
          col="Category Name"
          sortKey="name"
          onSort={handleSort}
          currentSort={sortConfig}
        />
        <TableHeader
          col="Category Code"
          sortKey="code"
          onSort={handleSort}
          currentSort={sortConfig}
        />
        <div className="fw-bold text-dark" style={{ fontSize: '0.85rem', userSelect: 'none' }}>
          Status
        </div>
        <div
          className="fw-bold text-dark text-end"
          style={{ fontSize: '0.85rem', userSelect: 'none', paddingRight: '10px' }}
        >
          Action
        </div>
      </div>

      <div className="product-list">
        {sortedCategories.length > 0 ? (
          sortedCategories.map((c) => (
            <div
              key={c.id}
              className="product-row px-4 py-3 mb-2 bg-white border rounded shadow-sm align-items-center"
              style={{ ...gridLayout, transition: '0.2s ease-in-out' }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#fbfbfb')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
            >
              <div>
                <span
                  className="text-dark fw-bold d-block text-capitalize"
                  style={{ fontSize: '0.95rem' }}
                >
                  {c.name || c.Name}
                </span>
              </div>

              <div>
                <span
                  className="px-3 py-1.5 rounded text-secondary border fw-semibold d-inline-block bg-light"
                  style={{
                    fontSize: '0.85rem',
                    letterSpacing: '0.5px',
                    minWidth: '80px',
                    textAlign: 'center',
                  }}
                >
                  {c.code || c.Code || '---'}
                </span>
              </div>

              <div>
                <CBadge
                  color={
                    (c.isActive !== undefined ? c.isActive : c.IsActive) ? 'success' : 'danger'
                  }
                  className="px-3 py-2 fw-bold rounded-pill"
                  style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}
                >
                  {(c.isActive !== undefined ? c.isActive : c.IsActive) ? 'ACTIVE' : 'INACTIVE'}
                </CBadge>
              </div>

              <div className="text-end" style={{ paddingRight: '10px' }}>
                <CDropdown variant="btn-group">
                  <CDropdownToggle
                    color="light"
                    className="p-2 border rounded shadow-sm d-flex align-items-center justify-content-center"
                    caret={false}
                  >
                    <CIcon icon={cilOptions} size="sm" style={{ color: '#666' }} />
                  </CDropdownToggle>
                  <CDropdownMenu className="border-0 shadow-lg p-2 rounded-3">
                    <CDropdownItem
                      className="py-2 rounded px-3 d-flex align-items-center gap-2"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setForm({
                          id: c.id,
                          Name: c.name || c.Name,
                          Code: c.code || c.Code,
                          IsActive: c.isActive !== undefined ? c.isActive : c.IsActive,
                        })
                        setVisible(true)
                      }}
                    >
                      <CIcon icon={cilPencil} size="sm" />
                      Edit Category
                    </CDropdownItem>
                    <CDropdownItem
                      className="text-danger py-2 rounded px-3 border-top mt-1 d-flex align-items-center gap-2"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDelete(c.id)}
                    >
                      <CIcon icon={cilTrash} size="sm" className="text-danger" />
                      Delete Row
                    </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-5 bg-white border rounded shadow-sm">
            <h5 className="text-muted">No Records Found</h5>
          </div>
        )}
      </div>

      <div className="mt-3">
        <AppPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <CategoryAddEditModel
        visible={visible}
        setVisible={setVisible}
        form={form}
        setForm={setForm}
        handleSave={handleSave}
      />
    </div>
  )
}

export default Category
