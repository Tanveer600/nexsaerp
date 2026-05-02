import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react'
import { useToast } from '../../components/common/ToastContext'
import { useAppLanguage } from '../../components/common/LanguageContext'
import TableHeader from '../../components/common/TableHeader'
import AppButton from '../../components/common/AppButton'
import AppPagination from '../../components/common/AppPagination'
import ProductAddEditModelForm from './ProductAddEditModelForm'

// CSS imports
import '../../scss/permissingSetting.scss'
import '../../scss/pagination.scss'

import {
  getAllProducts,
  updateProduct,
  deleteProduct,
  createProduct,
} from '../../redux/slice/productSlice'

function Product() {
  const dispatch = useDispatch()
  const { addToast } = useToast() // Toast initialization
  const { l } = useAppLanguage() // Translation initialization

  const productsData = useSelector((state) => state.products?.result) || []
  const totalCount = useSelector((state) => state.products?.totalCount) || 0
  console.log('Products Data from Redux:', productsData)
  // States
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  console.log('Products Data from Redux:', productsData)
  // States

  const [activeColumn, setActiveColumn] = useState(l('name')) // Underline state
  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState({
    id: 0,
    name: '',
    unitPrice: '',
    description: '',
  })

  const gridLayout = {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1.8fr 1fr 1.5fr 0.5fr',
    alignItems: 'center',
  }

  useEffect(() => {
    dispatch(getAllProducts({ page: currentPage, size: pageSize }))
  }, [dispatch, currentPage, pageSize])
  const totalPages = Math.ceil(totalCount / pageSize)
  const currentProducts = productsData
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [totalPages])

  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch])

  const handleSave = () => {
    if (!form.name) return

    if (form.id === 0) {
      dispatch(createProduct(form))
      addToast(l('success'), l('product_created'), 'success')
    } else {
      dispatch(updateProduct(form))
      addToast(l('success'), l('product_updated'), 'success')
    }

    setVisible(false)
    resetForm()
  }

  const handleDelete = (id) => {
    if (window.confirm(l('are you sure you want to delete this product?'))) {
      dispatch(deleteProduct(id))
      addToast(l('deleted'), l('product deleted successfully'), 'error')
    }
  }

  const resetForm = () => {
    setForm({ id: 0, name: '', unitPrice: '', description: '' })
  }

  return (
    <div className="user-container px-3">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
        <div>
          <h4 className="mb-0 text-dark fw-semibold">{l('Product Management')}</h4>
          <small className="text-muted">Home | {l('products')}</small>
          <div className="mt-1">
            <AppButton variant="golden" data={productsData} fileName="Product_Report" size="sm">
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
          col={l('description')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
        <TableHeader
          col={l('unit_price')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
        <TableHeader
          col={l('action')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
      </div>

      {/* Product List */}
      <div className="customer-list">
        {currentProducts.length > 0 ? (
          currentProducts.map((p) => (
            <div
              key={p.id}
              className="user-card px-4 py-2 mb-1 bg-white border rounded shadow-sm"
              style={gridLayout}
            >
              <span className="text-dark fw-bold">{p.name}</span>
              <span>
                <a
                  href={`mailto:${p.unitPrice}`} // Assuming description is email for demo; replace with actual field if different
                  className="text-decoration-none"
                  style={{ color: '#3498db' }}
                >
                  {p.description || '---'}
                </a>
              </span>
              <span className="text-muted small">{p.description || '---'}</span>
              <div className="text-end">
                <CDropdown variant="btn-group">
                  <CDropdownToggle color="white" className="p-0 border-0 shadow-none" caret={false}>
                    <div style={{ cursor: 'pointer', fontSize: '20px', color: '#666' }}>⋮</div>
                  </CDropdownToggle>
                  <CDropdownMenu className="border-0 shadow-sm">
                    <CDropdownItem
                      onClick={() => {
                        setForm(p)
                        setVisible(true)
                      }}
                    >
                      {l('edit')}
                    </CDropdownItem>
                    <CDropdownItem className="text-danger" onClick={() => handleDelete(p.id)}>
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

      <ProductAddEditModelForm
        visible={visible}
        setVisible={setVisible}
        form={form}
        setForm={setForm}
        handleSave={handleSave}
      />
    </div>
  )
}

export default Product
