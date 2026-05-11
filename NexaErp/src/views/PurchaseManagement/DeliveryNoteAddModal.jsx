import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useSelector, useDispatch } from 'react-redux'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CForm,
  CSpinner,
  CFormInput,
  CFormSelect,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { Package, Trash2 } from 'lucide-react'
import AppButton from '../../components/common/AppButton'
import ValidationError from '../../components/common/ValidationError'
import { useAppLanguage } from '../../components/common/LanguageContext'

// Actions
import { getProductList } from '../../redux/slice/productSlice'
import { getSaleList } from '../../redux/slice/saleSlice'

function DeliveryNoteAddModal({ visible, setVisible, handleSave }) {
  const { l } = useAppLanguage()
  const dispatch = useDispatch()

  const dropdownList = useSelector(
    (state) => state.sale?.dropdownList || state.sales?.dropdownList || [],
  )

  const productList = useSelector(
    (state) => state.product?.dropdownList || state.products?.dropdownList || [],
  )

  const formik = useFormik({
    initialValues: {
      id: 0,
      saleOrderId: '',
      deliveryDate: new Date().toISOString().split('T')[0],
      remarks: '',
      items: [],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      saleOrderId: Yup.string().required(l('so_required')),
      deliveryDate: Yup.date().required(l('date_required')),
      items: Yup.array().of(
        Yup.object({
          productId: Yup.string().required(l('product_required')),
          currentQty: Yup.number()
            .min(1, l('min_1'))
            .required(l('qty_required'))
            .test('max-check', 'Exceeds balance', function (value) {
              return value <= (this.parent.balanceQty || 0)
            }),
        }),
      ),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          ...values,
          id: Number(values.id),
          saleOrderId: Number(values.saleOrderId),
          items: values.items.map((item) => ({
            salesOrderItemId: Number(item.salesOrderItemId || 0),
            productId: Number(item.productId),
            currentQty: Number(item.currentQty),
          })),
        }
        await handleSave(payload)
        resetForm()
        setVisible(false)
      } catch (error) {
        console.error(error)
      } finally {
        setSubmitting(false)
      }
    },
  })

  useEffect(() => {
    if (visible) {
      dispatch(getSaleList())
      dispatch(getProductList())
    }
  }, [visible, dispatch])

  const handleSOChange = (e) => {
    const selectedSOId = e.target.value
    formik.setFieldValue('saleOrderId', selectedSOId)

    if (selectedSOId) {
      const selectedSO = dropdownList.find((s) => String(s.id) === String(selectedSOId))

      if (selectedSO && selectedSO.items) {
        const mappedItems = selectedSO.items
          .map((item) => {
            const total = Number(item.quantity || 0)
            const delivered = Number(item.deliveredQuantity || 0)
            const balance = total - delivered
            if (balance <= 0) return null

            return {
              salesOrderItemId: item.id,
              productId: item.productId,
              currentQty: balance,
              balanceQty: balance,
            }
          })
          .filter(Boolean)

        formik.setFieldValue('items', mappedItems)
      }
    } else {
      formik.setFieldValue('items', [])
    }
  }

  const handleClose = () => {
    formik.resetForm()
    setVisible(false)
  }

  return (
    <CModal visible={visible} onClose={handleClose} size="xl" backdrop="static" alignment="center">
      <CModalHeader className="border-0">
        <CModalTitle className="fw-bold fs-4" style={{ color: 'var(--cui-primary)' }}>
          <Package className="me-2" size={24} /> {l('Create Delivery Note')}
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="px-4">
        <CForm onSubmit={formik.handleSubmit}>
          <div
            className="p-3 mb-4 rounded-3 border-start border-4 shadow-sm bg-light"
            style={{ borderLeftColor: 'var(--cui-primary)' }}
          >
            <CRow className="g-3">
              <CCol md={4}>
                <label className="form-label small fw-bold text-muted">{l('sales_order')}</label>
                <CFormSelect
                  name="saleOrderId"
                  value={formik.values.saleOrderId}
                  onChange={handleSOChange}
                >
                  <option value="">{l('select_so_number')}</option>
                  {dropdownList.map((sale) => (
                    <option key={sale.id} value={sale.id}>
                      {sale.soNumber || `SO-${sale.id}`}
                    </option>
                  ))}
                </CFormSelect>
                <ValidationError
                  message={formik.touched.saleOrderId && formik.errors.saleOrderId}
                />
              </CCol>
              <CCol md={4}>
                <label className="form-label small fw-bold text-muted">{l('delivery_date')}</label>
                <CFormInput
                  type="date"
                  name="deliveryDate"
                  value={formik.values.deliveryDate}
                  onChange={formik.handleChange}
                />
              </CCol>
              <CCol md={4}>
                <label className="form-label small fw-bold text-muted">{l('remarks')}</label>
                <CFormInput
                  name="remarks"
                  value={formik.values.remarks}
                  onChange={formik.handleChange}
                />
              </CCol>
            </CRow>
          </div>

          <div className="rounded-3 border overflow-hidden shadow-sm">
            <CTable align="middle" className="mb-0" hover responsive>
              <CTableHead style={{ backgroundColor: 'var(--cui-light)' }}>
                <CTableRow>
                  <CTableHeaderCell className="py-3 px-4">{l('product_name')}</CTableHeaderCell>
                  <CTableHeaderCell className="py-3 text-center" style={{ width: '150px' }}>
                    {l('balance')}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-3" style={{ width: '180px' }}>
                    {l('qty_to_ship')}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-3 text-center" style={{ width: '80px' }}>
                    {l('action')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {formik.values.items.map((item, index) => {
                  const errorMsg = formik.errors.items?.[index]?.currentQty
                  const isTouched = formik.touched.items?.[index]?.currentQty

                  return (
                    <CTableRow key={index} className="border-bottom">
                      <CTableDataCell className="px-4">
                        <CFormSelect
                          name={`items[${index}].productId`}
                          value={item.productId}
                          disabled
                        >
                          <option value="">{l('select_product')}</option>
                          {productList.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </CFormSelect>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <span className="badge rounded-pill bg-info text-dark px-3">
                          {item.balanceQty || 0}
                        </span>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormInput
                          type="number"
                          name={`items[${index}].currentQty`}
                          value={item.currentQty}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          invalid={!!(isTouched && errorMsg)}
                        />
                        {isTouched && errorMsg && (
                          <div className="text-danger small mt-1" style={{ fontSize: '11px' }}>
                            {errorMsg}
                          </div>
                        )}
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <button
                          type="button"
                          className="btn btn-link text-danger p-0"
                          onClick={() => {
                            const newItems = [...formik.values.items]
                            newItems.splice(index, 1)
                            formik.setFieldValue('items', newItems)
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </CTableDataCell>
                    </CTableRow>
                  )
                })}
              </CTableBody>
            </CTable>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-5">
            <AppButton variant="ghost" onClick={handleClose}>
              {l('cancel')}
            </AppButton>
            <AppButton
              type="submit"
              color="primary"
              className="text-white"
              disabled={formik.isSubmitting || formik.values.items.length === 0 || !formik.isValid}
            >
              {formik.isSubmitting ? (
                <>
                  <CSpinner size="sm" className="me-2" /> Processing...
                </>
              ) : (
                l('process_delivery')
              )}
            </AppButton>
          </div>
        </CForm>
      </CModalBody>
    </CModal>
  )
}

export default DeliveryNoteAddModal
