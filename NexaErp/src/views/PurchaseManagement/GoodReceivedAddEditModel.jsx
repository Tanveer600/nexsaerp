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
import { getPurchaseList } from '../../redux/slice/purchaseOrdertemSlice'
import { getProductList } from '../../redux/slice/productSlice'
import { getWarehouseList } from '../../redux/slice/warehouseSlice' // <-- Warehouse slice import ki

function GoodReceivedAddEditModel({ visible, setVisible, handleSave, editData }) {
  const { l } = useAppLanguage()
  const dispatch = useDispatch()

  const purchaseDropdown = useSelector((state) => state.purchaseOrderItems?.dropdownList || [])
  const productList = useSelector(
    (state) => state.product?.dropdownList || state.products?.dropdownList || [],
  )
  // Warehouse data list state se nikaali
  const warehousesList = useSelector(
    (state) => state.warehouses?.dropdownList || state.warehouse?.dropdownList || [],
  )

  const formik = useFormik({
    initialValues: {
      id: 0,
      vendorQuotationId: 0,
      purchaseOrderId: '',
      warehouseId: '', // <-- Initial value add ki
      receivedDate: new Date().toISOString().split('T')[0],
      remarks: '',
      vendorChallanNumber: '',
      status: 'Pending',
      items: [],
      grnNumber: '',
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      purchaseOrderId: Yup.string().required(l('po_required')),
      warehouseId: Yup.string().required(l('warehouse_required')), // <-- Validation lagayi
      receivedDate: Yup.date().required(l('date_required')),
      vendorChallanNumber: Yup.string().required(l('challan_required')),
      items: Yup.array()
        .of(
          Yup.object({
            productId: Yup.string().required(l('product_required')),
            currentQty: Yup.number()
              .min(1, l('min_1'))
              .required(l('qty_required'))
              .test('max-check', 'Exceeds balance', function (value) {
                return value <= (this.parent.balanceQty || 0)
              }),
            batchNumber: Yup.string().required('Batch is required'),
            expiryDate: Yup.date().required('Expiry is required').nullable(),
          }),
        )
        .min(1, 'At least one item required'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = {
          POId: Number(values.purchaseOrderId),
          Date: values.receivedDate,
          GRNNumber:
            values.id > 0 ? values.grnNumber : `GRN-${Math.floor(1000 + Math.random() * 9000)}`,
          VendorChallanNumber: values.vendorChallanNumber,
          Remarks: values.remarks || '',
          Status: values.status,
          WarehouseId: Number(values.warehouseId), // <-- Hardcoded '1' hata kar dynamic dynamic selected value integer me bhej di
          Items: values.items.map((item) => ({
            ProductId: Number(item.productId),
            QuantityReceived: Number(item.currentQty),
            BatchNumber: item.batchNumber,
            ExpiryDate: item.expiryDate,
            PoItemId: Number(item.poItemId),
          })),
        }

        await handleSave(payload)
        resetForm()
        setVisible(false)
      } catch (error) {
        console.error('Submit Error:', error)
      } finally {
        setSubmitting(false)
      }
    },
  })

  useEffect(() => {
    if (visible) {
      dispatch(getPurchaseList())
      dispatch(getProductList())
      dispatch(getWarehouseList()) // <-- Data list load karne ke liye dispatch kiya
    }
  }, [visible, dispatch])

  useEffect(() => {
    if (visible && editData) {
      formik.setValues({
        id: editData.id,
        vendorQuotationId: editData.vendorQuotationId || 0,
        purchaseOrderId: editData.poId || editData.purchaseOrderId,
        warehouseId: editData.warehouseId || '', // <-- Edit mode ke liye sync kiya
        receivedDate: editData.date?.split('T')[0] || editData.receivedDate?.split('T')[0],
        remarks: editData.remarks || '',
        vendorChallanNumber: editData.vendorChallanNumber || '',
        grnNumber: editData.grnNumber || '',
        status: editData.status || 'Pending',
        items:
          editData.items?.map((item) => ({
            id: item.id,
            poItemId: item.poItemId || item.purchaseOrderItemId,
            productId: item.productId,
            currentQty: item.quantityReceived || item.currentQty,
            balanceQty: item.quantityReceived || item.balanceQty,
            batchNumber: item.batchNumber || '',
            expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '',
          })) || [],
      })
    }
  }, [visible, editData])

  const handlePOChange = (e) => {
    const selectedPOId = e.target.value
    formik.setFieldValue('purchaseOrderId', selectedPOId)

    if (selectedPOId) {
      const selectedPO = purchaseDropdown.find((p) => String(p.id) === String(selectedPOId))

      if (selectedPO) {
        const vqId = selectedPO.vendorQuotationId || selectedPO.VendorQuotationId || 0
        console.log('Selected VQ ID:', vqId)
        formik.setFieldValue('vendorQuotationId', vqId)

        if (selectedPO.orderDate) {
          formik.setFieldValue('receivedDate', selectedPO.orderDate.split('T')[0])
        }

        if (selectedPO.items) {
          const mappedItems = selectedPO.items
            .map((item) => {
              const balance = Number(item.quantity || 0) - Number(item.receivedQuantity || 0)
              if (balance <= 0) return null

              return {
                poItemId: item.id,
                productId: item.productId,
                currentQty: balance,
                balanceQty: balance,
                batchNumber: '',
                expiryDate: '',
              }
            })
            .filter(Boolean)

          formik.setFieldValue('items', mappedItems)
        }
      }
    } else {
      formik.setFieldValue('items', [])
      formik.setFieldValue('vendorQuotationId', 0)
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
          <Package className="me-2" size={24} />
          {formik.values.id > 0 ? l('edit_grn') : l('good_received_note')}
        </CModalTitle>
      </CModalHeader>
      <CModalBody className="px-4">
        <CForm onSubmit={formik.handleSubmit}>
          <div
            className="p-3 mb-4 rounded-3 border-start border-4 shadow-sm bg-light"
            style={{ borderLeftColor: 'var(--cui-primary)' }}
          >
            <CRow className="g-3">
              <CCol md={3}>
                <label className="form-label small fw-bold text-muted">{l('purchase_order')}</label>
                <CFormSelect
                  name="purchaseOrderId"
                  value={formik.values.purchaseOrderId}
                  onChange={handlePOChange}
                  disabled={formik.values.id > 0}
                >
                  <option value="">{l('select_po_number')}</option>
                  {purchaseDropdown.map((po) => (
                    <option key={po.id} value={po.id}>
                      {po.poNumber || `PO-${po.id}`}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              {/* <-- Humne UI me bas aapki purani lines ke flow me hi Warehouse select dropdown ko handle kiya hy --> */}
              <CCol md={3}>
                <label className="form-label small fw-bold text-muted">{l('warehouse')}</label>
                <CFormSelect
                  name="warehouseId"
                  value={formik.values.warehouseId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">{l('select_warehouse')}</option>
                  {warehousesList.map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name}
                    </option>
                  ))}
                </CFormSelect>
                <ValidationError
                  message={formik.touched.warehouseId && formik.errors.warehouseId}
                />
              </CCol>

              <CCol md={3}>
                <label className="form-label small fw-bold text-muted">{l('received_date')}</label>
                <CFormInput
                  type="date"
                  name="receivedDate"
                  value={formik.values.receivedDate}
                  onChange={formik.handleChange}
                />
              </CCol>
              <CCol md={3}>
                <label className="form-label small fw-bold text-muted">
                  {l('vendor_challan_number')}
                </label>
                <CFormInput
                  name="vendorChallanNumber"
                  value={formik.values.vendorChallanNumber}
                  onChange={formik.handleChange}
                />
              </CCol>
              <CCol md={3}>
                <label className="form-label small fw-bold text-muted">{l('remarks')}</label>
                <CFormInput
                  name="remarks"
                  value={formik.values.remarks}
                  onChange={formik.handleChange}
                />
              </CCol>
            </CRow>
          </div>

          {/* Items table section as-is same to same unchanged hy */}
          <div className="rounded-3 border overflow-hidden shadow-sm">
            <CTable align="middle" className="mb-0" hover responsive>
              <CTableHead style={{ backgroundColor: 'var(--cui-light)' }}>
                <CTableRow>
                  <CTableHeaderCell className="py-3 px-4">{l('product_name')}</CTableHeaderCell>
                  <CTableHeaderCell className="py-3">{l('batch_number')}</CTableHeaderCell>
                  <CTableHeaderCell className="py-3">{l('expiry_date')}</CTableHeaderCell>
                  <CTableHeaderCell className="py-3 text-center">{l('balance')}</CTableHeaderCell>
                  <CTableHeaderCell className="py-3" style={{ width: '120px' }}>
                    {l('qty_received')}
                  </CTableHeaderCell>
                  <CTableHeaderCell className="py-3 text-center" style={{ width: '60px' }}>
                    {l('action')}
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {formik.values.items.map((item, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell className="px-4">
                      <CFormSelect
                        value={item.productId}
                        disabled
                        className="bg-white border-0 shadow-none p-0"
                      >
                        {productList.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormInput
                        size="sm"
                        name={`items[${index}].batchNumber`}
                        value={item.batchNumber}
                        onChange={formik.handleChange}
                        placeholder="Batch#"
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormInput
                        size="sm"
                        type="date"
                        name={`items[${index}].expiryDate`}
                        value={item.expiryDate}
                        onChange={formik.handleChange}
                      />
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <span className="badge rounded-pill bg-info text-dark px-3">
                        {item.balanceQty}
                      </span>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormInput
                        size="sm"
                        type="number"
                        name={`items[${index}].currentQty`}
                        value={item.currentQty}
                        onChange={formik.handleChange}
                      />
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
                ))}
              </CTableBody>
            </CTable>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            <AppButton variant="ghost" onClick={handleClose}>
              {l('cancel')}
            </AppButton>
            <AppButton
              type="submit"
              color="primary"
              disabled={formik.isSubmitting || formik.values.items.length === 0}
            >
              {formik.isSubmitting ? <CSpinner size="sm" /> : l('save_changes')}
            </AppButton>
          </div>
        </CForm>
      </CModalBody>
    </CModal>
  )
}

export default GoodReceivedAddEditModel
