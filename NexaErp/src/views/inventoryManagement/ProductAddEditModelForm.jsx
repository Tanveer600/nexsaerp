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
  CFormSwitch,
} from '@coreui/react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import AppButton from '../../components/common/AppButton'
import { getCategorieList } from '../../redux/slice/categoriesSlice'
import ValidationError from '../../components/common/ValidationError'

const ProductAddEditModelForm = ({ visible, setVisible, form, handleSave }) => {
  const dispatch = useDispatch()
  const categoryList = useSelector((state) => state.categories?.dropdownList) || []

  const inputStyle = {
    borderColor: '#3b82f6',
    boxShadow: 'none',
    borderRadius: '6px',
    height: '38px',
  }

  const validationSchema = Yup.object().shape({
    Name: Yup.string().trim().required('Product Name is required'),
    SKU: Yup.string().trim().required('SKU is required'),
    categoryId: Yup.string().required('Category selection is required'),
    UnitPrice: Yup.number().typeError('Must be a number').min(0, 'Min 0').required('Required'),
    VatPercentage: Yup.number().typeError('Must be a number').min(0, 'Min 0').required('Required'),
    UOM: Yup.string().required('UOM selection is required'),
  })

  const initialValues = useMemo(() => {
    const incomingCatId = form?.CategoryId ?? form?.categoryId ?? form?.categoryID ?? ''

    return {
      id: form?.id ?? form?.ID ?? 0,
      Name: form?.Name ?? form?.name ?? '',
      SKU: form?.SKU ?? form?.sku ?? '',
      categoryId: incomingCatId !== 0 && incomingCatId !== '' ? String(incomingCatId) : '',
      Barcode: form?.Barcode ?? form?.barcode ?? '',
      UnitPrice: form?.UnitPrice ?? form?.unitPrice ?? 0,
      VatPercentage: form?.VatPercentage ?? form?.vatPercentage ?? 5,
      UOM: form?.UOM ?? form?.uom ?? '',
      ReorderLevel: form?.ReorderLevel ?? form?.reorderLevel ?? 0,
      ManageStock: form?.ManageStock ?? form?.manageStock ?? false,
      Description: form?.Description ?? form?.description ?? '',
    }
  }, [form, visible])

  useEffect(() => {
    if (visible) {
      dispatch(getCategorieList())
    }
  }, [dispatch, visible])

  const handleSubmitForm = (values, { setSubmitting }) => {
    const catNumber = values.categoryId ? Number(values.categoryId) : 0
    const formattedValues = {
      ...values,
      id: Number(values.id),
      categoryId: catNumber,
      CategoryId: catNumber,
      UnitPrice: Number(values.UnitPrice || 0),
      VatPercentage: Number(values.VatPercentage || 0),
      ReorderLevel: Number(values.ReorderLevel || 0),
    }
    handleSave(formattedValues)
    setSubmitting(false)
  }

  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      size="lg"
      backdrop="static"
      alignment="center"
    >
      <style>
        {`
          .custom-input:focus { border-color: #2563eb !important; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important; }
          .custom-input:hover { border-color: #3b82f6 !important; }
        `}
      </style>

      <CModalHeader className="bg-light">
        <CModalTitle className="mb-2 fw-bold text-primary">
          {initialValues.id > 0 ? 'Edit Product Details' : 'Create New Product'}
        </CModalTitle>
      </CModalHeader>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitForm}
        enableReinitialize
      >
        {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
          <Form autoComplete="off" onSubmit={handleSubmit}>
            <CModalBody className="p-4">
              <CRow className="g-3">
                {/* Product Name */}
                <CCol md={6}>
                  <label className="form-label fw-semibold">Product Name</label>
                  <CFormInput
                    name="Name"
                    style={inputStyle}
                    className="custom-input"
                    placeholder="Enter product name"
                    value={values.Name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!(touched.Name && errors.Name)}
                  />
                  {touched.Name && errors.Name && <ValidationError message={errors.Name} />}
                </CCol>

                {/* SKU */}
                <CCol md={6}>
                  <label className="form-label fw-semibold">SKU</label>
                  <CFormInput
                    name="SKU"
                    style={inputStyle}
                    className="custom-input"
                    placeholder="e.g. PROD-001"
                    value={values.SKU}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!(touched.SKU && errors.SKU)}
                  />
                  {touched.SKU && errors.SKU && <ValidationError message={errors.SKU} />}
                </CCol>

                {/* Category */}
                <CCol md={6}>
                  <label className="form-label fw-semibold">Category</label>
                  <CFormSelect
                    name="categoryId"
                    style={inputStyle}
                    className="custom-input"
                    value={values.categoryId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!(touched.categoryId && errors.categoryId)}
                  >
                    <option value="">Select Category</option>
                    {categoryList.map((v) => (
                      <option key={v.id} value={String(v.id)}>
                        {v.name}
                      </option>
                    ))}
                  </CFormSelect>
                  {touched.categoryId && errors.categoryId && (
                    <ValidationError message={errors.categoryId} />
                  )}
                </CCol>

                {/* Barcode */}
                <CCol md={6}>
                  <label className="form-label fw-semibold">Barcode</label>
                  <CFormInput
                    name="Barcode"
                    style={inputStyle}
                    className="custom-input"
                    placeholder="Scan or enter barcode"
                    value={values.Barcode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </CCol>

                {/* Unit Price */}
                <CCol md={6}>
                  <label className="form-label fw-semibold">Unit Price</label>
                  <CFormInput
                    type="number"
                    name="UnitPrice"
                    style={inputStyle}
                    className="custom-input"
                    value={values.UnitPrice}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!(touched.UnitPrice && errors.UnitPrice)}
                  />
                  {touched.UnitPrice && errors.UnitPrice && (
                    <ValidationError message={errors.UnitPrice} />
                  )}
                </CCol>

                {/* VAT (%) */}
                <CCol md={6}>
                  <label className="form-label fw-semibold">VAT (%)</label>
                  <CFormInput
                    type="number"
                    name="VatPercentage"
                    style={inputStyle}
                    className="custom-input"
                    value={values.VatPercentage}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!(touched.VatPercentage && errors.VatPercentage)}
                  />
                  {touched.VatPercentage && errors.VatPercentage && (
                    <ValidationError message={errors.VatPercentage} />
                  )}
                </CCol>

                {/* UOM */}
                <CCol md={4}>
                  <label className="form-label fw-semibold">UOM</label>
                  <CFormSelect
                    name="UOM"
                    style={inputStyle}
                    className="custom-input"
                    value={values.UOM}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!(touched.UOM && errors.UOM)}
                  >
                    <option value="">Select UOM</option>
                    <option value="PCS">PCS (Pieces)</option>
                    <option value="KG">KG (Kilograms)</option>
                    <option value="LTR">LTR (Liters)</option>
                    <option value="BOX">BOX (Boxes)</option>
                    <option value="PACK">PACK (Packages)</option>
                    <option value="MTR">MTR (Meters)</option>
                  </CFormSelect>
                  {touched.UOM && errors.UOM && <ValidationError message={errors.UOM} />}
                </CCol>

                {/* Reorder Level */}
                <CCol md={4}>
                  <label className="form-label fw-semibold">Reorder Level</label>
                  <CFormInput
                    type="number"
                    name="ReorderLevel"
                    style={inputStyle}
                    className="custom-input"
                    value={values.ReorderLevel}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </CCol>

                {/* Manage Stock */}
                <CCol md={4} className="d-flex align-items-end pb-2">
                  <CFormSwitch
                    label="Manage Stock"
                    name="ManageStock"
                    id="productManageStock"
                    checked={values.ManageStock}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </CCol>

                {/* Description */}
                <CCol md={12}>
                  <label className="form-label fw-semibold">Description</label>
                  <CFormInput
                    name="Description"
                    style={inputStyle}
                    className="custom-input"
                    placeholder="Enter item specs or description..."
                    value={values.Description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </CCol>
              </CRow>
            </CModalBody>

            <CModalFooter className="border-0 bg-light">
              <AppButton
                variant="ghost"
                color="secondary"
                className="px-4"
                type="button"
                onClick={() => setVisible(false)}
              >
                Cancel
              </AppButton>
              <AppButton type="submit" color="primary" className="px-4 shadow-sm">
                {values.id > 0 ? 'Update Product' : 'Save Product'}
              </AppButton>
            </CModalFooter>
          </Form>
        )}
      </Formik>
    </CModal>
  )
}

export default ProductAddEditModelForm
