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
import { createInvoice, updateInvoice } from '../../redux/slice/invoiceSlice'
import { getProductList } from '../../redux/slice/productSlice'
import { getSaleList } from '../../redux/slice/saleSlice'

import { formatDateForInput } from '../../components/common/formatter'
import ValidationError from '../../components/common/ValidationError'

const InvoiceAddEditModel = ({ visible, setVisible, editData }) => {
  const dispatch = useDispatch()
  const { addToast } = useToast()
  const productlist = useSelector((state) => state.products.dropdownList) || []
  const salesOrderList = useSelector((state) => state.sales.dropdownList) || []

  const getFieldStyle = (errors, touched, name) => {
    const hasError = touched[name] && errors[name]
    return {
      borderColor: hasError ? '#e55353' : '#dee2e6',
      boxShadow: hasError ? '0 0 0 0.2rem rgba(229, 83, 83, 0.15)' : 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      borderRadius: '6px',
      height: '38px',
    }
  }

  const validationSchema = Yup.object().shape({
    salesOrderId: Yup.string().required('Sales Order is required'),
    date: Yup.date().required('Invoice Date is required'),
    paymentStatus: Yup.string().required('Payment Status is required'),
    items: Yup.array().of(
      Yup.object().shape({
        productId: Yup.string().required('Required'),
        quantity: Yup.number().integer('Must be integer').min(1, 'Min 1').required('Required'),
        unitPrice: Yup.number().min(0, 'Cannot be negative').required('Required'),
      }),
    ),
  })

  const initialValues = useMemo(() => {
    if (!editData) {
      return {
        id: 0,
        salesOrderId: '',
        date: new Date().toISOString().split('T')[0],
        paymentStatus: 'Pending',
        vat: 0,
        items: [
          {
            productId: '',
            quantity: 1,
            unitPrice: 0,
            lineTotal: 0,
          },
        ],
      }
    }
    return {
      id: editData.id || editData.ID || 0,
      salesOrderId: editData.salesOrderId || editData.SalesOrderId || '',
      date: formatDateForInput(editData.date || editData.Date),
      paymentStatus: editData.paymentStatus || editData.PaymentStatus || 'Pending',
      vat: editData.vat || editData.VAT || 0,
      items: (editData.items || editData.Items || []).map((item) => ({
        id: item.id || item.ID || 0,
        productId: item.productId || item.ProductId || '',
        quantity: item.quantity || item.Quantity || 0,
        unitPrice: item.unitPrice || item.UnitPrice || 0,
        lineTotal: (item.quantity || item.Quantity || 0) * (item.unitPrice || item.UnitPrice || 0),
      })),
    }
  }, [editData])

  const handleSalesOrderChange = (e, setFieldValue) => {
    const selectedSOId = e.target.value
    setFieldValue('salesOrderId', selectedSOId)

    if (!selectedSOId) return

    const matchedSO = salesOrderList.find((so) => String(so.id || so.ID) === String(selectedSOId))

    if (matchedSO) {
      const rawItems = matchedSO.items || matchedSO.Items || matchedSO.salesOrderItems || []

      if (rawItems.length > 0) {
        const structuralItems = rawItems.map((item) => ({
          id: 0,
          productId: item.productId || item.ProductId || '',
          quantity: item.quantity || item.Quantity || 1,
          unitPrice: item.unitPrice || item.UnitPrice || 0,
          lineTotal:
            (item.quantity || item.Quantity || 1) * (item.unitPrice || item.UnitPrice || 0),
        }))
        setFieldValue('items', structuralItems)
      }
    }
  }

  const handleSubmit = (values) => {
    const calculatedTotalAmount = values.items.reduce(
      (sum, i) => sum + Number(i.quantity) * Number(i.unitPrice),
      0,
    )

    const calculatedVat = calculatedTotalAmount * 0.05

    const mappedItems = values.items.map((item) => ({
      ID: Number(item.id) || 0,
      ProductId: Number(item.productId),
      Quantity: Number(item.quantity),
      UnitPrice: Number(item.unitPrice),
    }))

    const payload = {
      ID: Number(values.id),
      SalesOrderId: Number(values.salesOrderId),
      Date: values.date,
      TotalAmount: calculatedTotalAmount + calculatedVat,
      VAT: calculatedVat,
      PaymentStatus: values.paymentStatus,
      Items: mappedItems,
    }

    if (payload.ID > 0) {
      dispatch(updateInvoice(payload)).then(() => {
        addToast('Success', 'Invoice updated successfully', 'success')
      })
    } else {
      dispatch(createInvoice(payload)).then(() => {
        addToast('Success', 'Invoice created successfully', 'success')
      })
    }
    setVisible(false)
  }

  useEffect(() => {
    if (visible) {
      dispatch(getProductList())
      dispatch(getSaleList())
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
          {editData ? 'Edit' : 'Create'} Enterprise Invoice
        </CModalTitle>
      </CModalHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => {
          return (
            <Form>
              <CModalBody className="p-4">
                <CRow className="mb-4">
                  <CCol md={4}>
                    <label className="form-label fw-semibold">Select Sales Order</label>
                    <CFormSelect
                      name="salesOrderId"
                      className="custom-input"
                      style={getFieldStyle(errors, touched, 'salesOrderId')}
                      value={values.salesOrderId}
                      onChange={(e) => handleSalesOrderChange(e, setFieldValue)}
                      onBlur={handleBlur}
                    >
                      <option value="">Choose Reference SO</option>
                      {salesOrderList.map((so) => (
                        <option key={so.id || so.ID} value={so.id || so.ID}>
                          {so.orderNumber || so.OrderNumber || `SO-REF-${so.id || so.ID}`}
                        </option>
                      ))}
                    </CFormSelect>
                    <ValidationError message={touched.salesOrderId && errors.salesOrderId} />
                  </CCol>

                  <CCol md={4}>
                    <label className="form-label fw-semibold">Invoice Date</label>
                    <CFormInput
                      name="date"
                      type="date"
                      className="custom-input"
                      style={getFieldStyle(errors, touched, 'date')}
                      value={values.date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ValidationError message={touched.date && errors.date} />
                  </CCol>

                  <CCol md={4}>
                    <label className="form-label fw-semibold">Payment Status</label>
                    <CFormSelect
                      name="paymentStatus"
                      className="custom-input"
                      style={getFieldStyle(errors, touched, 'paymentStatus')}
                      value={values.paymentStatus}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Partially Paid">Partially Paid</option>
                      <option value="Cancelled">Cancelled</option>
                    </CFormSelect>
                    <ValidationError message={touched.paymentStatus && errors.paymentStatus} />
                  </CCol>
                </CRow>

                <FieldArray name="items">
                  {({ push, remove }) => (
                    <>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 fw-bold text-primary">Invoice Item Specifications</h6>
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
                              lineTotal: 0,
                            })
                          }
                        >
                          + Add New Line
                        </AppButton>
                      </div>
                      <div className="table-responsive">
                        <CTable borderless className="align-middle">
                          <CTableHead className="border-bottom bg-light">
                            <CTableRow>
                              <CTableHeaderCell>Product / Service Description</CTableHeaderCell>
                              <CTableHeaderCell style={{ width: '120px' }}>
                                Quantity
                              </CTableHeaderCell>
                              <CTableHeaderCell style={{ width: '180px' }}>
                                Unit Price (AED)
                              </CTableHeaderCell>
                              <CTableHeaderCell style={{ width: '180px' }}>
                                Line Total (AED)
                              </CTableHeaderCell>
                              <CTableHeaderCell style={{ width: '50px' }}></CTableHeaderCell>
                            </CTableRow>
                          </CTableHead>
                          <CTableBody>
                            {values.items.map((item, index) => (
                              <CTableRow key={index}>
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
                                      <option key={p.id || p.ID} value={p.id || p.ID}>
                                        {p.name || p.Name}
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
                                    onChange={handleChange}
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
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name={`items.${index}.unitPrice`}
                                  />
                                </CTableDataCell>
                                <CTableDataCell>
                                  <CFormInput
                                    className="read-only-input"
                                    style={{ height: '38px' }}
                                    value={(Number(item.quantity) * Number(item.unitPrice)).toFixed(
                                      2,
                                    )}
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
                        <span className="text-muted">Sub Total Amount:</span>
                        <span className="fw-bold">
                          {values.items
                            .reduce((sum, i) => sum + Number(i.quantity) * Number(i.unitPrice), 0)
                            .toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Dubai VAT (5%):</span>
                        <span className="fw-bold text-success">
                          +{' '}
                          {(
                            values.items.reduce(
                              (sum, i) => sum + Number(i.quantity) * Number(i.unitPrice),
                              0,
                            ) * 0.05
                          ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="h6 mb-0 fw-bold">Grand Total Amount (AED):</span>
                        <span className="h5 mb-0 fw-bold text-primary">
                          {(
                            values.items.reduce(
                              (sum, i) => sum + Number(i.quantity) * Number(i.unitPrice),
                              0,
                            ) * 1.05
                          ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </CCol>
                </CRow>
              </CModalBody>

              <CModalFooter className="border-0 px-4 pb-4">
                <CButton color="secondary" className="px-4" onClick={() => setVisible(false)}>
                  Cancel
                </CButton>
                <AppButton type="submit" className="px-4 shadow-sm">
                  {values.id > 0 ? 'Update Invoice' : 'Save Invoice'}
                </AppButton>
              </CModalFooter>
            </Form>
          )
        }}
      </Formik>
    </CModal>
  )
}

export default InvoiceAddEditModel
