import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CRow,
  CCol,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle } from '@coreui/icons'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import AppButton from '../../components/common/AppButton'
import { getInvoiceList } from '../../redux/slice/invoiceSlice'
import ValidationError from '../../components/common/ValidationError'

const PaymentAddEditModel = ({ visible, setVisible, form, handleSave }) => {
  const dispatch = useDispatch()

  const invoiceList = useSelector((state) => state.invoices?.dropdownList) || []

  const inputStyle = {
    borderColor: '#b0bec5',
    boxShadow: 'none',
    borderRadius: '6px',
    height: '40px',
  }

  const validationSchema = Yup.object().shape({
    Amount: Yup.number()
      .typeError('Amount must be a numeric value')
      .positive('Amount must be greater than 0')
      .required('Payment amount is required'),
    Mode: Yup.string().trim().required('Payment mode method is required'),
    InvoiceId: Yup.string().required('Invoice reference mapping is required'),
    Status: Yup.string().trim().required('Payment clearance status is required'),
    Date: Yup.date().required('Transaction processing date is required'),
  })

  const initialValues = useMemo(() => {
    return {
      id: form?.id ?? form?.ID ?? 0,
      Amount: form?.Amount ?? form?.amount ?? '',
      Mode: form?.Mode ?? form?.mode ?? '',
      InvoiceId: form?.InvoiceId ?? form?.invoiceId ?? '',
      Status: form?.Status ?? form?.status ?? 'Pending',
      Date:
        form?.Date || form?.date
          ? new Date(form.Date || form.date).toISOString().substr(0, 10)
          : '',
    }
  }, [form, visible])

  useEffect(() => {
    if (visible) {
      dispatch(getInvoiceList())
    }
  }, [dispatch, visible])

  const handleSubmitForm = (values, { setSubmitting }) => {
    const formattedValues = {
      ...values,
      id: Number(values.id),
      Amount: Number(values.Amount),
      InvoiceId: Number(values.InvoiceId),
    }
    handleSave(formattedValues)
    setSubmitting(false)
  }

  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      size="md"
      backdrop="static"
      alignment="center"
    >
      <style>
        {`
          .custom-input:focus { border-color: #802060 !important; box-shadow: 0 0 0 2px rgba(128, 32, 96, 0.15) !important; }
          .custom-input:hover { border-color: #802060 !important; }
        `}
      </style>

      <CModalHeader className="bg-light border-bottom-0 py-3">
        <CModalTitle className="fw-bold text-dark h5 mb-0">
          {initialValues.id > 0 ? 'Review & Edit Receipt' : 'Register New Payment'}
        </CModalTitle>
      </CModalHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitForm}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue }) => (
          <Form autoComplete="off" onSubmit={handleSubmit}>
            <CModalBody className="px-4 py-3">
              <CRow className="g-3">
                <CCol md={12}>
                  <label className="form-label small fw-bold text-secondary">
                    Invoice Reference
                  </label>
                  <CFormSelect
                    name="InvoiceId"
                    style={inputStyle}
                    className="custom-input text-muted"
                    value={values.InvoiceId}
                    onChange={(e) => {
                      const selectedId = e.target.value
                      handleChange(e) // Formik ka default change handler taakay state update ho

                      if (selectedId) {
                        // Dropdown list mein se selected invoice dhoondhein
                        const selectedInvoice = invoiceList.find(
                          (inv) => String(inv.id || inv.ID) === String(selectedId),
                        )

                        if (selectedInvoice) {
                          const autoAmount =
                            selectedInvoice.TotalAmount || selectedInvoice.totalAmount || 0
                          setFieldValue('Amount', autoAmount)
                        }
                      } else {
                        setFieldValue('Amount', '')
                      }
                    }}
                    onBlur={handleBlur}
                    invalid={!!(touched.InvoiceId && errors.InvoiceId)}
                  >
                    <option value="">Select Target Invoice Link</option>
                    {invoiceList.map((inv) => {
                      const invDate =
                        inv.date || inv.Date
                          ? new Date(inv.date || inv.Date).toLocaleDateString()
                          : 'N/A'
                      const invAmount = Number(
                        inv.totalAmount || inv.TotalAmount || 0,
                      ).toLocaleString(undefined, { minimumFractionDigits: 2 })

                      return (
                        <option key={inv.id || inv.ID} value={String(inv.id || inv.ID)}>
                          Invoice #{inv.id || inv.ID} — (Date: {invDate}) — Total: AED {invAmount}
                        </option>
                      )
                    })}
                  </CFormSelect>
                  {touched.InvoiceId && errors.InvoiceId && (
                    <ValidationError message={errors.InvoiceId} />
                  )}
                </CCol>

                <CCol md={6}>
                  <label className="form-label small fw-bold text-secondary">
                    Transaction Amount (AED)
                  </label>
                  <CFormInput
                    type="number"
                    name="Amount"
                    style={inputStyle}
                    className="custom-input fw-bold"
                    placeholder="0.00"
                    value={values.Amount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!(touched.Amount && errors.Amount)}
                  />
                  {touched.Amount && errors.Amount && <ValidationError message={errors.Amount} />}
                </CCol>

                <CCol md={6} fm>
                  <label className="form-label small fw-bold text-secondary">Processing Date</label>
                  <CFormInput
                    type="date"
                    name="Date"
                    style={inputStyle}
                    className="custom-input text-muted"
                    value={values.Date}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!(touched.Date && errors.Date)}
                  />
                  {touched.Date && errors.Date && <ValidationError message={errors.Date} />}
                </CCol>

                <CCol md={6}>
                  <label className="form-label small fw-bold text-secondary">
                    Payment Method / Mode
                  </label>
                  <CFormSelect
                    name="Mode"
                    style={inputStyle}
                    className="custom-input"
                    value={values.Mode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!(touched.Mode && errors.Mode)}
                  >
                    <option value="">Select Method</option>
                    <option value="Cash">Cash Handover</option>
                    <option value="Bank Transfer">Corporate Bank Transfer</option>
                    <option value="Cheque">Cheque Settlement</option>
                    <option value="Online">Credit/Debit Gateway</option>
                  </CFormSelect>
                  {touched.Mode && errors.Mode && <ValidationError message={errors.Mode} />}
                </CCol>

                <CCol md={6}>
                  <label className="form-label small fw-bold text-secondary">
                    Settlement Status
                  </label>
                  <CFormSelect
                    name="Status"
                    style={inputStyle}
                    className="custom-input"
                    value={values.Status}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!(touched.Status && errors.Status)}
                  >
                    <option value="Pending">Pending Clearance</option>
                    <option value="Paid">Cleared Paid</option>
                    <option value="Failed">Declined Failed</option>
                  </CFormSelect>
                  {touched.Status && errors.Status && <ValidationError message={errors.Status} />}
                </CCol>
              </CRow>
            </CModalBody>

            <CModalFooter className="border-top-0 bg-light p-3 d-flex justify-content-end gap-2">
              <AppButton
                variant="outline"
                color="secondary"
                className="px-4 d-inline-flex align-items-center gap-2"
                style={{ borderRadius: '6px', height: '38px' }}
                type="button"
                onClick={() => setVisible(false)}
              >
                <CIcon icon={cilXCircle} size="sm" />
                <span>Cancel</span>
              </AppButton>
              <AppButton
                type="submit"
                className="px-4 text-white shadow-sm d-inline-flex align-items-center gap-2"
                style={{
                  backgroundColor: '#802060',
                  border: 'none',
                  borderRadius: '6px',
                  height: '38px',
                }}
              >
                <CIcon icon={cilCheckCircle} size="sm" />
                <span>{values.id > 0 ? 'Update Receipt' : 'Authorize Payment'}</span>
              </AppButton>
            </CModalFooter>
          </Form>
        )}
      </Formik>
    </CModal>
  )
}

export default PaymentAddEditModel
