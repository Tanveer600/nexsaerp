import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
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
import { Formik, Form, FieldArray } from 'formik'
import * as Yup from 'yup' // Validation import
import AppButton from '../../components/common/AppButton'
import ValidationError from '../../components/common/ValidationError' // Ensure this exists
import { useToast } from '../../components/common/ToastContext'
import {
  createPurchaseOrderItem,
  updatePurchaseOrderItem,
} from '../../redux/slice/purchaseOrdertemSlice'
import { getProductList } from '../../redux/slice/productSlice'
import { getVendorList } from '../../redux/slice/vendorSlice'
import { formatDateForInput } from '../../components/common/formatter'

const PurchaseOrderModal = ({ visible, setVisible, editData }) => {
  const dispatch = useDispatch()
  const { addToast } = useToast()
  const productlist = useSelector((state) => state.products.dropdownList) || []
  const vendorList = useSelector((state) => state.vendors.dropdownList) || []

  const inputStyle = {
    borderColor: '#3b82f6',
    boxShadow: 'none',
    borderRadius: '6px',
    height: '38px',
  }

  // Validation Schema
  const validationSchema = Yup.object().shape({
    vendorId: Yup.string().required('Required'),
    orderDate: Yup.date().required('Required'),
    status: Yup.string().required('Required'),
    items: Yup.array().of(
      Yup.object().shape({
        productId: Yup.string().required('Required'),
        quantity: Yup.number().min(1, 'Min 1').required('Required'),
        unitPrice: Yup.number().min(0).required('Required'),
      }),
    ),
  })

  const initialValues = useMemo(() => {
    if (!editData) {
      return {
        id: 0,
        vendorId: '',
        status: 'Pending',
        orderDate: new Date().toISOString().split('T')[0],
        items: [{ productId: '', quantity: 1, unitPrice: 0, discount: 0, taxAmount: 0 }],
      }
    }
    return {
      id: editData.id || editData.ID || 0,
      vendorId: editData.vendorId || editData.VendorId || '',
      orderDate: formatDateForInput(editData.orderDate || editData.OrderDate),
      status: editData.status || editData.Status || 'Pending',
      items: (editData.items || editData.Items || []).map((item) => ({
        id: item.id || item.ID || 0,
        productId: item.productId || item.ProductId || '',
        quantity: item.quantity || item.Quantity || 1,
        unitPrice: item.unitPrice || item.UnitPrice || 0,
        discount: item.discount || item.Discount || 0,
        taxAmount: item.taxAmount || item.TaxAmount || 0,
      })),
    }
  }, [editData])

  const handleSubmit = (values) => {
    const payload = {
      ID: Number(values.id),
      VendorId: Number(values.vendorId),
      OrderDate: values.orderDate,
      Status: values.status,
      Items: values.items.map((item) => ({
        ID: Number(item.id || 0),
        ProductId: Number(item.productId),
        Quantity: Number(item.quantity),
        UnitPrice: Number(item.unitPrice),
        Discount: Number(item.discount),
        TaxAmount: Number(item.taxAmount),
      })),
    }

    if (payload.ID > 0) {
      dispatch(updatePurchaseOrderItem(payload))
      addToast('Success', 'Order updated successfully', 'success')
    } else {
      dispatch(createPurchaseOrderItem(payload))
      addToast('Success', 'Order created successfully', 'success')
    }
    setVisible(false)
  }

  useEffect(() => {
    if (visible) {
      dispatch(getProductList())
      dispatch(getVendorList())
    }
  }, [dispatch, visible])

  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      size="xl"
      backdrop="static"
      alignment="center"
    >
      <style>
        {`
          .custom-input:focus { border-color: #2563eb !important; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important; }
          .custom-input:hover { border-color: #3b82f6 !important; } /* Keeps it blue on hover */
          .table td { vertical-align: top !important; padding: 10px 5px !important; }
        `}
      </style>

      <CModalHeader className="bg-light">
        <CModalTitle className="mb-3 fw-bold text-primary">
          {initialValues.id > 0 ? 'Edit' : 'Add'} Purchase Order
        </CModalTitle>
      </CModalHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form>
            <CModalBody className="p-4">
              <CRow className="mb-4">
                <CCol md={4}>
                  <label className="form-label fw-semibold">Vendor</label>
                  <CFormSelect
                    name="vendorId"
                    style={inputStyle}
                    className="custom-input"
                    value={values.vendorId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select Vendor</option>
                    {vendorList.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </CFormSelect>
                  {touched.vendorId && errors.vendorId && (
                    <div className="text-danger small mt-1">{errors.vendorId}</div>
                  )}
                </CCol>
                <CCol md={4}>
                  <label className="form-label fw-semibold">Order Date</label>
                  <CFormInput
                    name="orderDate"
                    type="date"
                    style={inputStyle}
                    className="custom-input"
                    value={values.orderDate}
                    onChange={handleChange}
                  />
                </CCol>
                <CCol md={4}>
                  <label className="form-label fw-semibold">Status</label>
                  <CFormSelect
                    name="status"
                    style={inputStyle}
                    className="custom-input"
                    value={values.status}
                    onChange={handleChange}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Ordered">Ordered</option>
                    <option value="Received">Received</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              <h6 className="mb-3 fw-bold text-primary">Order Items</h6>
              <FieldArray name="items">
                {({ push, remove }) => (
                  <div className="table-responsive">
                    <CTable borderless className="align-middle">
                      <CTableHead className="border-bottom">
                        <CTableRow>
                          <CTableHeaderCell>Product</CTableHeaderCell>
                          <CTableHeaderCell style={{ width: '110px' }}>Qty</CTableHeaderCell>
                          <CTableHeaderCell style={{ width: '130px' }}>Price</CTableHeaderCell>
                          <CTableHeaderCell style={{ width: '110px' }}>Disc</CTableHeaderCell>
                          <CTableHeaderCell style={{ width: '110px' }}>Tax</CTableHeaderCell>
                          <CTableHeaderCell style={{ width: '50px' }}></CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {values.items.map((item, index) => (
                          <CTableRow key={index}>
                            <CTableDataCell>
                              <CFormSelect
                                name={`items.${index}.productId`}
                                style={inputStyle}
                                className="custom-input"
                                value={item.productId}
                                onChange={handleChange}
                              >
                                <option value="">Select Product</option>
                                {productlist.map((p) => (
                                  <option key={p.id} value={p.id}>
                                    {p.name}
                                  </option>
                                ))}
                              </CFormSelect>
                            </CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                name={`items.${index}.quantity`}
                                type="number"
                                style={inputStyle}
                                className="custom-input text-center"
                                value={item.quantity}
                                onChange={handleChange}
                              />
                            </CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                name={`items.${index}.unitPrice`}
                                type="number"
                                style={inputStyle}
                                className="custom-input"
                                value={item.unitPrice}
                                onChange={handleChange}
                              />
                            </CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                name={`items.${index}.discount`}
                                type="number"
                                style={inputStyle}
                                className="custom-input"
                                value={item.discount}
                                onChange={handleChange}
                              />
                            </CTableDataCell>
                            <CTableDataCell>
                              <CFormInput
                                name={`items.${index}.taxAmount`}
                                type="number"
                                style={inputStyle}
                                className="custom-input"
                                value={item.taxAmount}
                                onChange={handleChange}
                              />
                            </CTableDataCell>
                            <CTableDataCell>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm border-0"
                                onClick={() => values.items.length > 1 && remove(index)}
                                style={{ fontSize: '1.2rem', lineHeight: '1' }}
                              >
                                &times;
                              </button>
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                    <AppButton
                      size="sm"
                      variant="ghost"
                      color="primary"
                      className="fw-bold"
                      onClick={() =>
                        push({
                          productId: '',
                          quantity: 1,
                          unitPrice: 0,
                          discount: 0,
                          taxAmount: 0,
                        })
                      }
                    >
                      + Add Row
                    </AppButton>
                  </div>
                )}
              </FieldArray>
            </CModalBody>

            <CModalFooter className="border-0">
              <AppButton
                variant="ghost"
                color="secondary"
                className="px-4"
                onClick={() => setVisible(false)}
              >
                Cancel
              </AppButton>
              <AppButton type="submit" color="primary" className="px-4 shadow-sm">
                {values.id > 0 ? 'Update Order' : 'Save Order'}
              </AppButton>
            </CModalFooter>
          </Form>
        )}
      </Formik>
    </CModal>
  )
}

export default PurchaseOrderModal
