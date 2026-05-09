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
import ValidationError from '../../components/common/ValidationError'

const QuotationAddEditModel = ({ visible, setVisible, editData }) => {
  const dispatch = useDispatch()
  const { addToast } = useToast()
  const productlist = useSelector((state) => state.products.dropdownList) || []
  const customerList = useSelector((state) => state.customers.dropdownList) || []

  const getFieldStyle = (errors, touched, name) => {
    const hasError = touched[name] && errors[name]
    return {
      borderColor: hasError ? '#7c3aed' : '#dee2e6',
      boxShadow: hasError ? '0 0 0 0.2rem rgba(124, 58, 237, 0.15)' : 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      borderRadius: '6px',
      height: '38px',
    }
  }

  const validationSchema = Yup.object().shape({
    customerId: Yup.string().required('Required'),
    quotationDate: Yup.date().required('Required'),
    validUntil: Yup.date().required('Required'),
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
        quotationNumber: 'Auto-Generated',
        customerId: '',
        status: 'Pending',
        quotationDate: new Date().toISOString().split('T')[0],
        validUntil: '',
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
      quotationNumber: editData.quotationNumber || editData.QuotationNumber || 'N/A',
      customerId: editData.customerId || editData.CustomerId || '',
      quotationDate: formatDateForInput(editData.quotationDate || editData.QuotationDate),
      validUntil: formatDateForInput(editData.validUntil || editData.ValidUntil || ''),
      status: editData.status || editData.Status || 'Pending',
      items: (editData.items || editData.Items || []).map((item) => {
        const qty = item.quantity || item.Quantity || 0
        const price = item.unitPrice || item.UnitPrice || 0
        const discAmt = item.discountAmount || item.DiscountAmount || 0
        const taxAmt = item.taxAmount || item.TaxAmount || 0

        return {
          productId: item.productId || item.ProductId || '',
          quantity: qty,
          unitPrice: price,
          discP:
            item.discountPercentage ||
            item.DiscountPercentage ||
            (price > 0 ? (discAmt / (qty * price)) * 100 : 0),
          discountAmount: discAmt,
          taxP:
            item.taxPercentage ||
            item.TaxPercentage ||
            (price * qty - discAmt > 0 ? (taxAmt / (qty * price - discAmt)) * 100 : 0),
          taxAmount: taxAmt,
        }
      }),
    }
  }, [editData])

  const handleSubmit = (values) => {
    const mappedItems = values.items.map((item) => {
      const qty = Number(item.quantity)
      const price = Number(item.unitPrice)
      const dAmount = Number(item.discountAmount)
      const tAmount = Number(item.taxAmount)
      return {
        ProductId: Number(item.productId),
        Quantity: qty,
        UnitPrice: price,
        DiscountPercentage: Number(item.discP),
        TaxPercentage: Number(item.taxP),
        DiscountAmount: dAmount,
        TaxAmount: tAmount,
        LineTotal: qty * price - dAmount + tAmount,
      }
    })

    const subTotal = values.items.reduce(
      (sum, i) => sum + Number(i.quantity) * Number(i.unitPrice),
      0,
    )
    const totalDiscount = mappedItems.reduce((sum, i) => sum + i.DiscountAmount, 0)
    const totalTax = mappedItems.reduce((sum, i) => sum + i.TaxAmount, 0)
    const netAmount = subTotal - totalDiscount + totalTax

    const payload = {
      QuotationId: Number(values.id),
      CustomerId: Number(values.customerId),
      QuotationDate: values.quotationDate,
      ValidUntil: values.validUntil,
      QuotationNumber: values.quotationNumber === 'Auto-Generated' ? '' : values.quotationNumber,
      Status: values.status,
      SubTotal: subTotal,
      TotalDiscount: totalDiscount,
      TotalTax: totalTax,
      NetAmount: netAmount,
      Items: mappedItems,
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
          .custom-input:focus { border-color: #7c3aed !important; box-shadow: 0 0 0 0.2rem rgba(124, 58, 237, 0.15) !important; outline: 0 none !important; }
          .custom-input:hover { border-color: #b5b5b5; }
          .table td { vertical-align: middle !important; padding: 8px 4px !important; }
          .read-only-input { background-color: #f1f5f9 !important; font-weight: 600; color: #475569; }
        `}</style>

      <CModalHeader className="bg-light">
        <CModalTitle className="mb-0 fw-bold text-primary">
          {editData ? 'Edit' : 'Add'} Quotation
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
                  <CCol md={3}>
                    <label className="form-label fw-semibold text-muted">Quotation #</label>
                    <CFormInput
                      name="quotationNumber"
                      className="read-only-input"
                      style={{ borderRadius: '6px', height: '38px' }}
                      value={values.quotationNumber}
                      readOnly
                    />
                  </CCol>

                  <CCol md={3}>
                    <label className="form-label fw-semibold">Customer</label>
                    <CFormSelect
                      name="customerId"
                      className="custom-input"
                      style={getFieldStyle(errors, touched, 'customerId')}
                      value={values.customerId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Select Customer</option>
                      {customerList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </CFormSelect>
                    <ValidationError message={touched.customerId && errors.customerId} />
                  </CCol>

                  <CCol md={3}>
                    <label className="form-label fw-semibold">Date</label>
                    <CFormInput
                      name="quotationDate"
                      type="date"
                      className="custom-input"
                      style={getFieldStyle(errors, touched, 'quotationDate')}
                      value={values.quotationDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ValidationError message={touched.quotationDate && errors.quotationDate} />
                  </CCol>

                  <CCol md={3}>
                    <label className="form-label fw-semibold">Valid Until</label>
                    <CFormInput
                      name="validUntil"
                      type="date"
                      className="custom-input"
                      style={getFieldStyle(errors, touched, 'validUntil')}
                      value={values.validUntil}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ValidationError message={touched.validUntil && errors.validUntil} />
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
                          type="button"
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
                              <React.Fragment key={index}>
                                <CTableRow>
                                  <CTableDataCell>
                                    <CFormSelect
                                      name={`items.${index}.productId`}
                                      className="custom-input"
                                      style={getFieldStyle(
                                        errors,
                                        touched,
                                        `items.${index}.productId`,
                                      )}
                                      value={item.productId}
                                      onChange={handleChange}
                                      onBlur={handleBlur}
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
                                      className="custom-input"
                                      style={getFieldStyle(
                                        errors,
                                        touched,
                                        `items.${index}.quantity`,
                                      )}
                                      value={item.quantity}
                                      onChange={(e) => {
                                        handleChange(e)
                                        const newItems = [...values.items]
                                        newItems[index].quantity = e.target.value
                                        updateRowCalculations(index, newItems)
                                      }}
                                      onBlur={handleBlur}
                                      name={`items.${index}.quantity`}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      type="number"
                                      className="custom-input"
                                      style={getFieldStyle(
                                        errors,
                                        touched,
                                        `items.${index}.unitPrice`,
                                      )}
                                      value={item.unitPrice}
                                      onChange={(e) => {
                                        const val = Number(e.target.value)
                                        setFieldValue(`items.${index}.unitPrice`, val)
                                        const updatedItems = [...values.items]
                                        updatedItems[index].unitPrice = val
                                        updateRowCalculations(index, updatedItems)
                                      }}
                                      onBlur={handleBlur}
                                      name={`items.${index}.unitPrice`}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      type="number"
                                      className="custom-input"
                                      style={{ height: '38px' }}
                                      name={`items.${index}.discP`}
                                      value={item.discP}
                                      onChange={(e) => {
                                        const val = Number(e.target.value)
                                        setFieldValue(`items.${index}.discP`, val)
                                        const updatedItems = [...values.items]
                                        updatedItems[index].discP = val
                                        updateRowCalculations(index, updatedItems)
                                      }}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      className="read-only-input"
                                      style={{ height: '38px' }}
                                      value={item.discountAmount}
                                      readOnly
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      type="number"
                                      className="custom-input"
                                      style={{ height: '38px' }}
                                      name={`items.${index}.taxP`}
                                      value={item.taxP}
                                      onChange={(e) => {
                                        const val = Number(e.target.value)
                                        setFieldValue(`items.${index}.taxP`, val)
                                        const newItems = [...values.items]
                                        newItems[index].taxP = val
                                        updateRowCalculations(index, newItems)
                                      }}
                                    />
                                  </CTableDataCell>
                                  <CTableDataCell>
                                    <CFormInput
                                      className="read-only-input"
                                      style={{ height: '38px' }}
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
                                      onClick={() => values.items.length > 1 && remove(index)}
                                      style={{
                                        backgroundColor: '#fff1f1',
                                        borderRadius: '8px',
                                        width: '32px',
                                        height: '32px',
                                      }}
                                    >
                                      <CIcon
                                        icon={cilTrash}
                                        size="sm"
                                        style={{ color: '#e55353' }}
                                      />
                                    </CButton>
                                  </CTableDataCell>
                                </CTableRow>
                              </React.Fragment>
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
                        <span className="text-muted">Total Discount:</span>
                        <span className="fw-bold text-danger">
                          -{' '}
                          {values.items
                            .reduce((sum, i) => sum + Number(i.discountAmount), 0)
                            .toLocaleString()}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Total Tax:</span>
                        <span className="fw-bold text-success">
                          +{' '}
                          {values.items
                            .reduce((sum, i) => sum + Number(i.taxAmount), 0)
                            .toLocaleString()}
                        </span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="h6 mb-0 fw-bold">Grand Total (Net):</span>
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

              <CModalFooter className="border-0 px-4 pb-4">
                <CButton color="secondary" variant="ghost" onClick={() => setVisible(false)}>
                  Cancel
                </CButton>
                <AppButton type="submit">
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
