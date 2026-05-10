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
import { Package, PlusCircle, Trash2 } from 'lucide-react'
import AppButton from '../../components/common/AppButton'
import ValidationError from '../../components/common/ValidationError'
import { useAppLanguage } from '../../components/common/LanguageContext'

// Actions
import { getProductList } from '../../redux/slice/productSlice'
import { getSaleList } from '../../redux/slice/saleSlice'

function DeliveryNoteAddModal({ visible, setVisible, handleSave, form }) {
  const { l } = useAppLanguage()
  const dispatch = useDispatch()

  const dropdownList = useSelector(
    (state) => state.sale?.dropdownList || state.sales?.dropdownList || [],
  )
  const productList = useSelector(
    (state) => state.product?.dropdownList || state.products?.dropdownList || [],
  )

  useEffect(() => {
    if (visible) {
      dispatch(getSaleList())
      dispatch(getProductList())
    }
  }, [visible, dispatch])

  const formik = useFormik({
    initialValues: {
      id: form?.id || 0,
      saleOrderId: form?.saleOrderId || '',
      deliveryDate: new Date().toISOString().split('T')[0],
      remarks: form?.remarks || '',
      items:
        form?.items?.length > 0
          ? form.items
          : [{ salesOrderItemId: 0, productId: '', currentQty: 1 }],
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      saleOrderId: Yup.string().required(l('so_required')),
      deliveryDate: Yup.date().required(l('date_required')),
      items: Yup.array().of(
        Yup.object({
          productId: Yup.string().required(l('product_required')),
          currentQty: Yup.number().min(1, l('min_1')).required(l('qty_required')),
        }),
      ),
    }),
    onSubmit: (values) => {
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
      handleSave(payload)
    },
  })
  console.info('paylaod data', payload)
  const handleSOChange = (e) => {
    const selectedSOId = e.target.value
    formik.setFieldValue('saleOrderId', selectedSOId)

    console.log('--- Debugging SO Change ---')
    console.log('Selected SO ID from Dropdown:', selectedSOId)

    if (selectedSOId) {
      const selectedSO = dropdownList.find((s) => String(s.id) === String(selectedSOId))
      console.log('Full SO Object Found:', selectedSO)

      if (selectedSO) {
        // Check 1: Items array backend se aa raha hai ya nahi
        if (selectedSO.items && selectedSO.items.length > 0) {
          console.log('Items found in SO:', selectedSO.items)

          const mappedItems = selectedSO.items.map((item) => {
            console.log(`Mapping Item - ProductID: ${item.productId}, SOItemID: ${item.id}`)
            return {
              salesOrderItemId: item.id,
              productId: item.productId, // Ensure this matches productList IDs
              currentQty: item.quantity || 1,
            }
          })
          formik.setFieldValue('items', mappedItems)
        }
        // Check 2: Agar items empty hain lekin direct productId bhej raha hai
        else if (selectedSO.productId) {
          console.log('No items array, but found direct ProductID:', selectedSO.productId)
          formik.setFieldValue('items', [
            {
              salesOrderItemId: 0,
              productId: selectedSO.productId,
              currentQty: 1,
            },
          ])
        } else {
          console.warn('Warning: Selected SO has NO items and NO productId in the object.')
          // Reset to one empty row so user can select manually
          formik.setFieldValue('items', [{ salesOrderItemId: 0, productId: '', currentQty: 1 }])
        }
      }
    }
  }

  const addItemRow = () => {
    formik.setFieldValue('items', [
      ...formik.values.items,
      { salesOrderItemId: 0, productId: '', currentQty: 1 },
    ])
  }

  const removeItemRow = (index) => {
    const newItems = [...formik.values.items]
    newItems.splice(index, 1)
    formik.setFieldValue('items', newItems)
  }

  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      size="xl"
      backdrop="static"
      alignment="center"
    >
      <CModalHeader className="border-0">
        <CModalTitle className="fw-bold fs-4" style={{ color: 'var(--cui-primary)' }}>
          <Package className="me-2" size={24} /> {l('Create Delivery Note')}
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="px-4">
        <CForm onSubmit={formik.handleSubmit}>
          <div
            className="p-3 mb-4 rounded-3 border-start border-4 shadow-sm"
            style={{ backgroundColor: 'var(--cui-light)', borderLeftColor: 'var(--cui-primary)' }}
          >
            <CRow className="g-3">
              <CCol md={4}>
                <label className="form-label small fw-bold text-muted">{l('sales_order')}</label>
                <CFormSelect
                  className="border-0 border-bottom rounded-0 shadow-none bg-transparent fw-bold text-dark"
                  name="saleOrderId"
                  value={formik.values.saleOrderId}
                  onChange={handleSOChange} // FIX: Use custom handler instead of formik.handleChange
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
                  className="border-0 border-bottom rounded-0 shadow-none bg-transparent"
                  name="deliveryDate"
                  value={formik.values.deliveryDate}
                  onChange={formik.handleChange}
                />
              </CCol>

              <CCol md={4}>
                <label className="form-label small fw-bold text-muted">{l('remarks')}</label>
                <CFormInput
                  className="border-0 border-bottom rounded-0 shadow-none bg-transparent"
                  name="remarks"
                  value={formik.values.remarks}
                  onChange={formik.handleChange}
                  placeholder={l('enter_remarks')}
                />
              </CCol>
            </CRow>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">{l('items_to_deliver')}</h5>
            <AppButton
              variant="ghost"
              size="sm"
              onClick={addItemRow}
              style={{ color: 'var(--cui-primary)' }}
            >
              <PlusCircle size={18} className="me-1" /> {l('add_item')}
            </AppButton>
          </div>

          <div className="rounded-3 border overflow-hidden shadow-sm">
            <CTable align="middle" className="mb-0" hover responsive>
              <CTableHead style={{ backgroundColor: 'var(--cui-light)' }}>
                <CTableRow>
                  <CTableHeaderCell className="py-3 border-0 px-4">
                    {l('product_name')}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-3 border-0" style={{ width: '180px' }}>
                    {l('qty')}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-3 border-0 text-center" style={{ width: '80px' }}>
                    {l('action')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {formik.values.items.map((item, index) => (
                  <CTableRow key={index} className="border-bottom">
                    <CTableDataCell className="px-4 border-0">
                      <CFormSelect
                        className="bg-transparent border-0 fw-medium p-0"
                        name={`items[${index}].productId`}
                        value={formik.values.items[index].productId}
                        onChange={formik.handleChange}
                      >
                        <option value="">{l('select_product')}</option>
                        {productList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CTableDataCell>
                    <CTableDataCell className="border-0">
                      <CFormInput
                        type="number"
                        className="bg-transparent border-0 fw-bold shadow-none p-0 fs-5"
                        style={{ color: 'var(--cui-primary)' }}
                        name={`items[${index}].currentQty`}
                        value={formik.values.items[index].currentQty}
                        onChange={formik.handleChange}
                      />
                    </CTableDataCell>
                    <CTableDataCell className="text-center border-0">
                      <button
                        type="button"
                        className="btn btn-link text-danger p-0 border-0"
                        onClick={() => removeItemRow(index)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </div>
          {/* Cancel/Submit Buttons */}
          <div className="d-flex justify-content-end gap-2 mt-5 mb-2">
            <AppButton variant="ghost" className="px-4" onClick={() => setVisible(false)}>
              {l('cancel')}
            </AppButton>
            <AppButton
              type="submit"
              color="primary"
              className="px-5 fw-bold shadow-sm rounded-2 text-white"
            >
              {l('process_delivery')}
            </AppButton>
          </div>
        </CForm>
      </CModalBody>
    </CModal>
  )
}

export default DeliveryNoteAddModal
