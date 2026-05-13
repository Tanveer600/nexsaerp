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
import {
  createVendorQuotation,
  updateVendorQuotation,
} from '../../redux/slice/vendorQuotationSlice'
import { getProductList } from '../../redux/slice/productSlice'
import { getVendorList } from '../../redux/slice/vendorSlice'
import { formatDateForInput } from '../../components/common/formatter'
import ValidationError from '../../components/common/ValidationError'

const VendorQuotationAddEditModel = ({ visible, setVisible, editData }) => {
  const dispatch = useDispatch()
  const { addToast } = useToast()

  const productlist = useSelector((state) => state.products.dropdownList) || []
  const vendorList = useSelector((state) => state.vendors.dropdownList) || []

  const validationSchema = Yup.object().shape({
    vendorId: Yup.string().required('Vendor is required'),
    quotationDate: Yup.date().required('Date is required'),
    validUntil: Yup.date().required('Expiry date is required'),
    status: Yup.string().required('Status is required'),
    currencyCode: Yup.string().required('Required'),
    exchangeRate: Yup.number().min(0.00001, 'Invalid Rate').required('Required'),
    items: Yup.array()
      .of(
        Yup.object().shape({
          productId: Yup.string().required('Required'),
          quantity: Yup.number().min(1, 'Min 1').required('Required'),
          unitPrice: Yup.number().min(0, 'Min 0').required('Required'),
        }),
      )
      .min(1, 'At least one item is required'),
  })

  const initialValues = useMemo(() => {
    if (!editData) {
      return {
        id: 0,
        quotationNumber: 'Auto-Generated',
        vendorId: '',
        status: 'Pending',
        currencyCode: 'PKR',
        exchangeRate: 1,
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
      id: editData.vendorQuotationId || editData.id || 0,
      quotationNumber: editData.quotationNumber || 'N/A',
      vendorId: editData.vendorId || '',
      quotationDate: formatDateForInput(editData.quotationDate),
      validUntil: formatDateForInput(editData.validUntil || ''),
      status: editData.status || 'Pending',
      currencyCode: editData.currencyCode || 'PKR',
      exchangeRate: editData.exchangeRate || 1,
      items: (editData.items || []).map((item) => ({
        productId: item.productId || '',
        quantity: item.quantity || 0,
        unitPrice: item.unitPrice || 0,
        discP: item.discountPercentage || 0,
        discountAmount: item.discountAmount || 0,
        taxP: item.taxPercentage || 0,
        taxAmount: item.taxAmount || 0,
      })),
    }
  }, [editData])

  const handleSubmit = (values) => {
    const mappedItems = values.items.map((item) => {
      const qty = Number(item.quantity) || 0
      const price = Number(item.unitPrice) || 0
      const dAmount = Number(item.discountAmount) || 0
      const tAmount = Number(item.taxAmount) || 0

      return {
        ProductId: Number(item.productId),
        Quantity: qty,
        UnitPrice: price,
        DiscountPercentage: Number(item.discP) || 0,
        TaxPercentage: Number(item.taxP) || 0,
        DiscountAmount: dAmount,
        TaxAmount: tAmount,
        LineTotal: qty * price - dAmount + tAmount,
      }
    })

    const subTotal = values.items.reduce(
      (sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0),
      0,
    )
    const totalDiscount = mappedItems.reduce((sum, i) => sum + i.DiscountAmount, 0)
    const totalTax = mappedItems.reduce((sum, i) => sum + i.TaxAmount, 0)

    const payload = {
      VendorQuotationId: Number(values.id),
      VQNumber: values.quotationNumber === 'Auto-Generated' ? '' : values.quotationNumber, // Add this line
      VendorId: Number(values.vendorId),
      QuotationDate: values.quotationDate,
      ValidUntil: values.validUntil,
      Status: values.status,
      CurrencyCode: values.currencyCode,
      ExchangeRate: Number(values.exchangeRate),
      SubTotal: subTotal,
      TotalDiscount: totalDiscount,
      TotalTax: totalTax,
      NetAmount: subTotal - totalDiscount + totalTax,
      Items: mappedItems,
    }

    if (payload.VendorQuotationId > 0) {
      dispatch(updateVendorQuotation(payload))
      addToast('Success', 'Quotation updated successfully', 'success')
    } else {
      dispatch(createVendorQuotation(payload))
      addToast('Success', 'Quotation created successfully', 'success')
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
      <style>{`
        .custom-input:focus { border-color: #7c3aed !important; box-shadow: 0 0 0 0.2rem rgba(124, 58, 237, 0.15) !important; }
        .read-only-input { background-color: #f8fafc !important; font-weight: 600; color: #64748b; }
      `}</style>

      <CModalHeader className="bg-light">
        <CModalTitle className="fw-bold text-primary">
          {editData ? 'Edit' : 'Add'} Vendor Quotation
        </CModalTitle>
      </CModalHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => {
          const calculateRow = (index, updatedItems) => {
            const item = updatedItems[index]
            const rowSubTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
            const dAmt = (rowSubTotal * (Number(item.discP) || 0)) / 100
            const tAmt = ((rowSubTotal - dAmt) * (Number(item.taxP) || 0)) / 100
            setFieldValue(`items.${index}.discountAmount`, dAmt.toFixed(2))
            setFieldValue(`items.${index}.taxAmount`, tAmt.toFixed(2))
          }

          return (
            <Form>
              <CModalBody className="p-4">
                <CRow className="mb-3">
                  <CCol md={2}>
                    <label className="form-label fw-semibold small text-muted">Quotation #</label>
                    <CFormInput
                      className="read-only-input"
                      value={values.quotationNumber}
                      readOnly
                    />
                  </CCol>
                  <CCol md={4}>
                    <label className="form-label fw-semibold small">Vendor</label>
                    <CFormSelect
                      name="vendorId"
                      value={values.vendorId}
                      onChange={handleChange}
                      className="custom-input"
                    >
                      <option value="">Select Vendor</option>
                      {vendorList.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </CFormSelect>
                    <ValidationError message={touched.vendorId && errors.vendorId} />
                  </CCol>
                  <CCol md={3}>
                    <label className="form-label fw-semibold small">Date</label>
                    <CFormInput
                      type="date"
                      name="quotationDate"
                      value={values.quotationDate}
                      onChange={handleChange}
                      className="custom-input"
                    />
                  </CCol>
                  <CCol md={3}>
                    <label className="form-label fw-semibold small">Valid Until</label>
                    <CFormInput
                      type="date"
                      name="validUntil"
                      value={values.validUntil}
                      onChange={handleChange}
                      className="custom-input"
                    />
                  </CCol>
                </CRow>

                <CRow className="mb-4">
                  <CCol md={3}>
                    <label className="form-label fw-semibold small">Currency</label>
                    <CFormSelect
                      name="currencyCode"
                      value={values.currencyCode}
                      onChange={handleChange}
                      className="custom-input"
                    >
                      <option value="PKR">PKR (Pakistani Rupee)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="AED">AED (Dirham)</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <label className="form-label fw-semibold small">Exchange Rate</label>
                    <CFormInput
                      type="number"
                      name="exchangeRate"
                      value={values.exchangeRate}
                      onChange={handleChange}
                      className="custom-input"
                      step="0.01"
                    />
                  </CCol>
                  <CCol md={3}>
                    <label className="form-label fw-semibold small">Status</label>
                    <CFormSelect
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      className="custom-input"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Expired">Expired</option>
                    </CFormSelect>
                  </CCol>
                </CRow>

                <FieldArray name="items">
                  {({ push, remove }) => (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0 fw-bold text-dark">Items Details</h6>
                        <AppButton
                          size="sm"
                          variant="ghost"
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
                          + Add Row
                        </AppButton>
                      </div>
                      <div className="table-responsive border rounded bg-white">
                        <CTable align="middle" className="mb-0" hover>
                          <CTableHead color="light">
                            <CTableRow className="small">
                              <CTableHeaderCell>Product</CTableHeaderCell>
                              <CTableHeaderCell style={{ width: '90px' }}>Qty</CTableHeaderCell>
                              <CTableHeaderCell style={{ width: '120px' }}>Price</CTableHeaderCell>
                              <CTableHeaderCell style={{ width: '90px' }}>Disc%</CTableHeaderCell>
                              <CTableHeaderCell style={{ width: '110px' }}>
                                Disc Amt
                              </CTableHeaderCell>
                              <CTableHeaderCell style={{ width: '90px' }}>Tax%</CTableHeaderCell>
                              <CTableHeaderCell style={{ width: '110px' }}>
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
                                    value={item.productId}
                                    onChange={handleChange}
                                    size="sm"
                                  >
                                    <option value="">Select</option>
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
                                    name={`items.${index}.quantity`}
                                    value={item.quantity}
                                    onChange={(e) => {
                                      handleChange(e)
                                      const items = [...values.items]
                                      items[index].quantity = e.target.value
                                      calculateRow(index, items)
                                    }}
                                    size="sm"
                                  />
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    type="number"
                                    name={`items.${index}.unitPrice`}
                                    value={item.unitPrice}
                                    onChange={(e) => {
                                      handleChange(e)
                                      const items = [...values.items]
                                      items[index].unitPrice = e.target.value
                                      calculateRow(index, items)
                                    }}
                                    size="sm"
                                  />
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    type="number"
                                    name={`items.${index}.discP`}
                                    value={item.discP}
                                    onChange={(e) => {
                                      handleChange(e)
                                      const items = [...values.items]
                                      items[index].discP = e.target.value
                                      calculateRow(index, items)
                                    }}
                                    size="sm"
                                  />
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    className="read-only-input"
                                    value={item.discountAmount}
                                    readOnly
                                    size="sm"
                                  />
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    type="number"
                                    name={`items.${index}.taxP`}
                                    value={item.taxP}
                                    onChange={(e) => {
                                      handleChange(e)
                                      const items = [...values.items]
                                      items[index].taxP = e.target.value
                                      calculateRow(index, items)
                                    }}
                                    size="sm"
                                  />
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    className="read-only-input"
                                    value={item.taxAmount}
                                    readOnly
                                    size="sm"
                                  />
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CButton
                                    color="danger"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => values.items.length > 1 && remove(index)}
                                  >
                                    <CIcon icon={cilTrash} />
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
                  <CCol md={4} className="bg-light p-3 rounded border shadow-sm">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Sub Total ({values.currencyCode}):</span>
                      <span className="fw-bold">
                        {values.items
                          .reduce((s, i) => s + Number(i.quantity) * Number(i.unitPrice), 0)
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-1 text-danger small">
                      <span>Total Discount:</span>
                      <span className="fw-bold">
                        -{' '}
                        {values.items.reduce((s, i) => s + Number(i.discountAmount), 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-1 text-success small">
                      <span>Total Tax:</span>
                      <span className="fw-bold">
                        + {values.items.reduce((s, i) => s + Number(i.taxAmount), 0).toFixed(2)}
                      </span>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h6 mb-0 fw-bold text-dark">Net Amount:</span>
                      <span className="h5 mb-0 fw-bold text-primary">
                        {values.currencyCode}{' '}
                        {(
                          values.items.reduce(
                            (s, i) => s + Number(i.quantity) * Number(i.unitPrice),
                            0,
                          ) -
                          values.items.reduce((s, i) => s + Number(i.discountAmount), 0) +
                          values.items.reduce((s, i) => s + Number(i.taxAmount), 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </CCol>
                </CRow>
              </CModalBody>
              <CModalFooter className="bg-light border-top-0">
                <CButton color="secondary" variant="ghost" onClick={() => setVisible(false)}>
                  Cancel
                </CButton>
                <AppButton type="submit">{values.id > 0 ? 'Update' : 'Save'} Quotation</AppButton>
              </CModalFooter>
            </Form>
          )
        }}
      </Formik>
    </CModal>
  )
}

export default VendorQuotationAddEditModel
