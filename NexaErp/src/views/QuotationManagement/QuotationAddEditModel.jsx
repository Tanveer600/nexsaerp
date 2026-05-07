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
  CButton,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { Formik, Form, FieldArray } from 'formik'
import * as Yup from 'yup'
import AppButton from '../../components/common/AppButton'
import { useToast } from '../../components/common/ToastContext'
import { createQuotation, updateQuotation } from '../../redux/slice/quotationSlice'
import { getProductList } from '../../redux/slice/productSlice'
import { getCustomerList } from '../../redux/slice/customerSlice'
import { formatDateForInput } from '../../components/common/formatter'

const QuotationAddEditModel = ({ visible, setVisible, editData }) => {
  const dispatch = useDispatch()
  const { addToast } = useToast()
  const productlist = useSelector((state) => state.products.dropdownList) || []
  const customerList = useSelector((state) => state.customers.dropdownList) || []

  const inputStyle = {
    borderColor: '#3b82f6',
    boxShadow: 'none',
    borderRadius: '6px',
    height: '38px',
  }

  const validationSchema = Yup.object().shape({
    customerId: Yup.string().required('Required'),
    quotationDate: Yup.date().required('Required'),
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
        customerId: '',
        status: 'Pending',
        quotationDate: new Date().toISOString().split('T')[0],
        items: [
          {
            productId: '',
            quantity: 1,
            unitPrice: 0,
            discP: 0,
            discountAmount: 0,
            taxP: 0,
            taxAmount: 0,
          },
        ],
      }
    }
    return {
      id: editData.quotationId || editData.QuotationId || 0,
      customerId: editData.customerId || editData.CustomerId || '',
      quotationDate: formatDateForInput(editData.quotationDate || editData.QuotationDate),
      status: editData.status || editData.Status || 'Pending',
      items: (editData.items || editData.Items || []).map((item) => {
        const qty = item.quantity || item.Quantity || 0
        const price = item.unitPrice || item.UnitPrice || 0
        const discAmt = item.discountAmount || item.discountAmount || 0
        const taxAmt = item.taxAmount || item.TaxAmount || 0

        return {
          productId: item.productId || item.ProductId || '',
          quantity: qty,
          unitPrice: price,
          discP: price > 0 ? (discAmt / (qty * price)) * 100 : 0,
          discountAmount: discAmt,
          taxP: price * qty - discAmt > 0 ? (taxAmt / (qty * price - discAmt)) * 100 : 0,
          taxAmount: taxAmt,
        }
      }),
    }
  }, [editData])

  const handleSubmit = (values) => {
    const subTotal = values.items.reduce(
      (sum, i) => sum + Number(i.quantity) * Number(i.unitPrice),
      0,
    )
    const totalDiscount = values.items.reduce((sum, i) => sum + Number(i.discountAmount), 0)
    const totalTax = values.items.reduce((sum, i) => sum + Number(i.taxAmount), 0)

    const payload = {
      QuotationId: Number(values.id),
      CustomerId: Number(values.customerId),
      QuotationDate: values.quotationDate,
      Status: values.status,
      SubTotal: subTotal,
      TotalDiscount: totalDiscount,
      TotalTax: totalTax,
      NetAmount: subTotal - totalDiscount + totalTax,
      Items: values.items.map((item) => ({
        ProductId: Number(item.productId),
        Quantity: Number(item.quantity),
        DiscountPercentage: Number(item.discP),
        TaxPercentage: Number(item.taxP),
        UnitPrice: Number(item.unitPrice),
        DiscountAmount: Number(item.discountAmount),
        TaxAmount: Number(item.taxAmount),
        LineTotal:
          Number(item.quantity) * Number(item.unitPrice) -
          Number(item.discountAmount) +
          Number(item.taxAmount),
      })),
    }

    if (payload.QuotationId > 0) {
      dispatch(updateQuotation(payload))
      addToast('Success', 'Quotation updated successfully', 'success')
    } else {
      dispatch(createQuotation(payload))
      addToast('Success', 'Quotation created successfully', 'success')
    }
    setVisible(false)
  }

  useEffect(() => {
    if (visible) {
      dispatch(getProductList())
      dispatch(getCustomerList())
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
      <style>{`
          .custom-input:focus { border-color: #2563eb !important; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important; }
          .table td { vertical-align: middle !important; padding: 8px 4px !important; }
          .read-only-input { background-color: #f8f9fa !important; font-weight: 600; }
        `}</style>

      <CModalHeader className="bg-light">
        <CModalTitle className="mb-0 fw-bold text-primary">
          {initialValues.id > 0 ? 'Edit' : 'Add'} Quotation
        </CModalTitle>
      </CModalHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => {
          const updateRowCalculations = (index, updatedItems) => {
            const item = updatedItems[index]
            const qty = Number(item.quantity) || 0
            const price = Number(item.unitPrice) || 0
            const discP = Number(item.discP) || 0
            const taxP = Number(item.taxP) || 0
            const rowSubTotal = qty * price
            const discAmount = (rowSubTotal * discP) / 100
            const taxAmount = ((rowSubTotal - discAmount) * taxP) / 100

            setFieldValue(`items.${index}.discountAmount`, discAmount.toFixed(2))
            setFieldValue(`items.${index}.taxAmount`, taxAmount.toFixed(2))
          }

          return (
            <Form>
              <CModalBody className="p-4">
                <CRow className="mb-4">
                  <CCol md={4}>
                    <label className="form-label fw-semibold">Customer</label>
                    <CFormSelect
                      name="customerId"
                      style={inputStyle}
                      value={values.customerId}
                      onChange={handleChange}
                    >
                      <option value="">Select Customer</option>
                      {customerList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={4}>
                    <label className="form-label fw-semibold">Quotation Date</label>
                    <CFormInput
                      name="quotationDate"
                      type="date"
                      style={inputStyle}
                      value={values.quotationDate}
                      onChange={handleChange}
                    />
                  </CCol>
                  <CCol md={4}>
                    <label className="form-label fw-semibold">Status</label>
                    <CFormSelect
                      name="status"
                      style={inputStyle}
                      value={values.status}
                      onChange={handleChange}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Cancelled">Cancelled</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                <FieldArray name="items">
                  {({ push, remove }) => (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 fw-bold text-primary">Quotation Items</h6>
                        <AppButton
                          size="sm"
                          variant="ghost"
                          color="primary"
                          onClick={() =>
                            push({
                              productId: '',
                              quantity: 1,
                              unitPrice: 0,
                              discP: 0,
                              discountAmount: 0,
                              taxP: 0,
                              taxAmount: 0,
                            })
                          }
                        >
                          + Add Item
                        </AppButton>
                      </div>
                      <div className="table-responsive">
                        <CTable borderless className="align-middle">
                          <CTableHead className="border-bottom bg-light">
                            <CTableRow>
                              <CTableHeaderCell>Product</CTableHeaderCell>
                              <CTableHeaderCell style={{ width: '80px' }}>Qty</CTableHeaderCell>
                              <CTableHeaderCell style={{ width: '120px' }}>Price</CTableHeaderCell>
                              <CTableHeaderCell style={{ width: '90px' }}>Disc %</CTableHeaderCell>
                              <CTableHeaderCell style={{ width: '100px' }}>
                                Disc Amt
                              </CTableHeaderCell>
                              <CTableHeaderCell style={{ width: '90px' }}>Tax %</CTableHeaderCell>
                              <CTableHeaderCell style={{ width: '100px' }}>
                                Tax Amt
                              </CTableHeaderCell>
                              <CTableHeaderCell style={{ width: '40px' }}></CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {values.items.map((item, index) => (
                              <CTableRow key={index}>
                                <CTableDataCell>
                                  <CFormSelect
                                    name={`items.${index}.productId`}
                                    style={inputStyle}
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
                                    type="number"
                                    style={inputStyle}
                                    value={item.quantity}
                                    onChange={(e) => {
                                      handleChange(e)
                                      const newItems = [...values.items]
                                      newItems[index].quantity = e.target.value
                                      updateRowCalculations(index, newItems)
                                    }}
                                    name={`items.${index}.quantity`}
                                  />
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    type="number"
                                    style={inputStyle}
                                    value={item.unitPrice}
                                    onChange={(e) => {
                                      const val = Number(e.target.value)
                                      setFieldValue(`items.${index}.unitPrice`, val)
                                      const updatedItems = [...values.items]
                                      updatedItems[index] = {
                                        ...updatedItems[index],
                                        unitPrice: val,
                                      }
                                      updateRowCalculations(index, updatedItems)
                                    }}
                                    name={`items.${index}.unitPrice`}
                                  />
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    type="number"
                                    style={inputStyle}
                                    name={`items.${index}.discP`}
                                    value={item.discP}
                                    onChange={(e) => {
                                      const val = Number(e.target.value)
                                      setFieldValue(`items.${index}.discP`, val) // State update
                                      const updatedItems = [...values.items]
                                      updatedItems[index] = { ...updatedItems[index], discP: val }
                                      updateRowCalculations(index, updatedItems)
                                    }}
                                  />
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    className="read-only-input"
                                    style={inputStyle}
                                    value={item.discountAmount}
                                    readOnly
                                  />
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    type="number"
                                    style={inputStyle}
                                    placeholder="%"
                                    value={item.taxP}
                                    onChange={(e) => {
                                      handleChange(e)
                                      const newItems = [...values.items]
                                      newItems[index].taxP = e.target.value
                                      updateRowCalculations(index, newItems)
                                    }}
                                    name={`items.${index}.taxP`}
                                  />
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    className="read-only-input"
                                    style={inputStyle}
                                    value={item.taxAmount}
                                    readOnly
                                  />
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CButton
                                    type="button"
                                    color="danger"
                                    variant="ghost"
                                    size="sm"
                                    className="p-1 border-0 shadow-sm"
                                    onClick={() => values.items.length > 1 && remove(index)}
                                    style={{
                                      backgroundColor: '#fff1f1', // Halka sa red background
                                      borderRadius: '8px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: '32px',
                                      height: '32px',
                                    }}
                                  >
                                    <CIcon icon={cilTrash} size="sm" style={{ color: '#e55353' }} />
                                  </CButton>
                                </CTableDataCell>
                              </CTableRow>
                            ))}
                          </CTableBody>
                        </CTable>
                      </div>
                    </>
                  )}
                </FieldArray>

                <CRow className="mt-4 justify-content-end">
                  <CCol md={5}>
                    <div className="p-3 rounded border bg-light shadow-sm">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Sub Total:</span>
                        <span className="fw-bold">
                          {values.items
                            .reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
                            .toLocaleString()}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Discount Amount:</span>
                        <span className="fw-bold text-danger">
                          -
                          {values.items
                            .reduce((sum, i) => sum + Number(i.discountAmount), 0)
                            .toLocaleString()}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Tax:</span>
                        <span className="fw-bold text-success">
                          +
                          {values.items
                            .reduce((sum, i) => sum + Number(i.taxAmount), 0)
                            .toLocaleString()}
                        </span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="h6 mb-0 fw-bold">Grand Total:</span>
                        <span className="h5 mb-0 fw-bold text-primary">
                          {(
                            values.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0) -
                            values.items.reduce((sum, i) => sum + Number(i.discountAmount), 0) +
                            values.items.reduce((sum, i) => sum + Number(i.taxAmount), 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CCol>
                </CRow>
              </CModalBody>

              <CModalFooter variant="ghost" className="border-0 px-4">
                <AppButton color="secondary" onClick={() => setVisible(false)}>
                  Cancel
                </AppButton>
                <AppButton type="submit" size="sm" variant="ghost" color="primary">
                  {values.id > 0 ? 'Update Quotation' : 'Save Quotation'}
                </AppButton>
              </CModalFooter>
            </Form>
          )
        }}
      </Formik>
    </CModal>
  )
}

export default QuotationAddEditModel
