import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CBadge } from '@coreui/react'
import { useToast } from '../../components/common/ToastContext'
import { useAppLanguage } from '../../components/common/LanguageContext'
import TableHeader from '../../components/common/TableHeader'
import AppButton from '../../components/common/AppButton'
import AppPagination from '../../components/common/AppPagination'
import ProductAddEditModelForm from './ProductAddEditModelForm'

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
  const { addToast } = useToast()
  const { l } = useAppLanguage()

  const productsData = useSelector((state) => state.products?.result) || []
  const totalCount = useSelector((state) => state.products?.totalCount) || 0

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [activeColumn, setActiveColumn] = useState(l('name'))
  const [visible, setVisible] = useState(false)

  const [form, setForm] = useState({
    id: 0,
    Name: '',
    UnitPrice: 0,
    Description: '',
    SKU: '',
    Barcode: '',
    VatPercentage: 5,
    ReorderLevel: 0,
    ManageStock: true,
    UOM: '',
    CategoryId: 0,
  })

  const gridLayout = {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr 1fr 0.8fr 0.8fr 0.5fr',
    alignItems: 'center',
    gap: '15px',
  }

  useEffect(() => {
    dispatch(getAllProducts({ page: currentPage, size: pageSize }))
  }, [dispatch, currentPage, pageSize])

  const totalPages = Math.ceil(totalCount / pageSize)

  const handleSave = () => {
    if (!form.Name) {
      addToast(l('error'), 'Product Name is required', 'danger')
      return
    }

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
    if (window.confirm(l('are you sure you want to delete?'))) {
      dispatch(deleteProduct(id))
      addToast(l('deleted'), l('product deleted'), 'error')
    }
  }

  const resetForm = () =>
    setForm({
      id: 0,
      Name: '',
      UnitPrice: 0,
      Description: '',
      SKU: '',
      Barcode: '',
      VatPercentage: 5,
      ReorderLevel: 0,
      ManageStock: true,
      UOM: '',
      CategoryId: 0,
    })

  return (
    <div className="product-page-container px-3 py-2">
      <div className="d-flex justify-content-between align-items-end mb-4 bg-white p-3 rounded shadow-sm border-top border-warning border-4">
        <div>
          <h4 className="mb-1 text-dark fw-bold" style={{ letterSpacing: '-0.5px' }}>
            {l('Product Management')}
          </h4>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb small mb-2">
              <li className="breadcrumb-item text-muted">{l('Home')}</li>
              <li className="breadcrumb-item active text-warning fw-semibold">{l('Products')}</li>
            </ol>
          </nav>
          <AppButton
            variant="outline-dark"
            data={productsData}
            fileName="Product_Report"
            size="sm"
            className="me-2 shadow-sm"
          >
            <span className="small">📊 {l('download_xls')}</span>
          </AppButton>
        </div>
        <AppButton
          className="shadow-sm px-4 py-2 fw-bold"
          style={{ backgroundColor: '#802060', border: 'none' }}
          onClick={() => {
            resetForm()
            setVisible(true)
          }}
        >
          + {l('add_new')}
        </AppButton>
      </div>

      <div
        className="table-header px-4 py-2 d-none d-md-grid text-uppercase fw-bold text-secondary border-bottom mb-2 bg-light rounded"
        style={gridLayout}
      >
        <TableHeader
          col={l('Product')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
        <TableHeader
          col={l('Price')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
        <TableHeader col={l('VAT')} activeColumn={activeColumn} setActiveColumn={setActiveColumn} />
        <TableHeader col={l('UOM')} activeColumn={activeColumn} setActiveColumn={setActiveColumn} />
        <TableHeader
          col={l('Stock')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
        />
        <TableHeader
          col={l('action')}
          activeColumn={activeColumn}
          setActiveColumn={setActiveColumn}
          className="text-end"
        />
      </div>

      <div className="product-list">
        {productsData.length > 0 ? (
          productsData.map((p) => (
            <div
              key={p.id}
              className="product-row px-4 py-3 mb-2 bg-white border rounded shadow-sm align-items-center"
              style={{ ...gridLayout, transition: '0.3s ease-in-out' }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
            >
              <div>
                <span className="text-dark fw-bold d-block">{p.name || p.Name}</span>
                <small className="text-muted" style={{ fontSize: '10px' }}>
                  SKU: {p.sku || p.SKU || p.id + 1000}
                </small>
              </div>

              <div>
                <CBadge
                  color="success-10"
                  className="text-success p-2 px-3 border border-success border-opacity-25"
                  style={{ backgroundColor: '#e8f5e9' }}
                >
                  ${Number(p.unitPrice || p.UnitPrice).toLocaleString()}
                </CBadge>
              </div>

              <div className="text-muted small">{p.vatPercentage || p.VatPercentage}%</div>
              <div className="text-muted small">{p.uom || p.UOM || '---'}</div>

              <div>
                <CBadge
                  color={p.manageStock || p.ManageStock ? 'info' : 'secondary'}
                  className="small"
                >
                  {p.manageStock || p.ManageStock ? 'TRACKED' : 'NO TRACK'}
                </CBadge>
              </div>

              <div className="text-end">
                <CDropdown variant="btn-group">
                  <CDropdownToggle color="light" className="p-1 border-0 shadow-none" caret={false}>
                    <div style={{ cursor: 'pointer', fontSize: '18px', color: '#999' }}>⋮</div>
                  </CDropdownToggle>
                  <CDropdownMenu className="border-0 shadow">
                    <CDropdownItem
                      className="py-2"
                      onClick={() => {
                        setForm({
                          ...p,
                          Name: p.name || p.Name,
                          UnitPrice: p.unitPrice || p.UnitPrice,
                          Description: p.description || p.Description,
                          SKU: p.sku || p.SKU,
                          VatPercentage: p.vatPercentage || p.VatPercentage,
                          ManageStock: p.manageStock || p.ManageStock,
                          UOM: p.uom || p.UOM,
                          CategoryId: p.categoryId || p.CategoryId,
                        })
                        setVisible(true)
                      }}
                    >
                      ✏️ {l('edit')}
                    </CDropdownItem>
                    <CDropdownItem
                      className="text-danger py-2 border-top"
                      onClick={() => handleDelete(p.id)}
                    >
                      🗑️ {l('delete')}
                    </CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-5 bg-white border rounded shadow-sm">
            <h5 className="text-muted">{l('no_records_found')}</h5>
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
