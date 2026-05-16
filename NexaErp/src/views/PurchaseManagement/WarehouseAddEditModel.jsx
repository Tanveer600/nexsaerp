import React, { useState, useEffect } from 'react'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CRow,
  CCol,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CFormCheck,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilNotes, cilLayers, cilMap, cilSave, cilIndustry, cilLibrary } from '@coreui/icons'
import AppButton from '../../components/common/AppButton'
import { useAppLanguage } from '../../components/common/LanguageContext'

function WarehouseAddEditModel({ visible, setVisible, form, setForm, handleSave }) {
  const { l } = useAppLanguage()
  const [activeTab, setActiveTab] = useState(1)

  useEffect(() => {
    if (visible) {
      setActiveTab(1)
    }
  }, [visible])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  // Hairline subtle light blue border active element styling rule
  const premiumInputStyle = {
    fontSize: '13px',
    borderRadius: '4px',
    border: '1px solid #ced4da',
    transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
  }

  // Injecting inline clean focus rules via node standard properties
  const handleFocus = (e) => {
    e.target.style.borderColor = '#92c2ff'
    e.target.style.boxShadow = '0 0 0 1px rgba(146, 194, 255, 0.3)'
  }

  const handleBlur = (e) => {
    e.target.style.borderColor = '#ced4da'
    e.target.style.boxShadow = 'none'
  }

  return (
    <CModal
      visible={visible}
      onClose={() => setVisible(false)}
      alignment="center"
      size="lg"
      backdrop="static"
      className="border-0 shadow"
    >
      {/* Modal Header */}
      <CModalHeader className="bg-light border-bottom py-3">
        <CModalTitle
          className="d-flex align-items-center gap-2 text-dark fw-bold"
          style={{ fontSize: '16px' }}
        >
          <CIcon icon={cilIndustry} className="text-secondary" size="md" />
          {form.id === 0 ? l('Add New Warehouse Node') : l('Modify Warehouse Entity')}
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="p-4">
        {/* Flat Corporate Navigation Bar (No heavy bootstrap pill/tabs block) */}
        <CNav variant="tabs" className="mb-4 border-bottom border-light">
          <CNavItem>
            <CNavLink
              active={activeTab === 1}
              onClick={() => setActiveTab(1)}
              style={{
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeTab === 1 ? '600' : '400',
                border: 'none',
                borderBottom: activeTab === 1 ? '2px solid #802060' : '2px solid transparent',
                borderRadius: '0',
              }}
              className={`d-flex align-items-center gap-2 pb-2 px-3 shadow-none ${activeTab === 1 ? 'text-dark' : 'text-secondary'}`}
            >
              <CIcon icon={cilNotes} size="sm" />
              {l('Basic Specifications')}
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 2}
              onClick={() => setActiveTab(2)}
              style={{
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeTab === 2 ? '600' : '400',
                border: 'none',
                borderBottom: activeTab === 2 ? '2px solid #802060' : '2px solid transparent',
                borderRadius: '0',
              }}
              className={`d-flex align-items-center gap-2 pb-2 px-3 shadow-none ${activeTab === 2 ? 'text-dark' : 'text-secondary'}`}
            >
              <CIcon icon={cilLayers} size="sm" />
              {l('Dynamic Allocation Grid')}
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              active={activeTab === 3}
              onClick={() => setActiveTab(3)}
              style={{
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeTab === 3 ? '600' : '400',
                border: 'none',
                borderBottom: activeTab === 3 ? '2px solid #802060' : '2px solid transparent',
                borderRadius: '0',
              }}
              className={`d-flex align-items-center gap-2 pb-2 px-3 shadow-none ${activeTab === 3 ? 'text-dark' : 'text-secondary'}`}
            >
              <CIcon icon={cilMap} size="sm" />
              {l('Spatial Zone Architecture')}
            </CNavLink>
          </CNavItem>
        </CNav>

        {/* Tab Layout Framework Modules */}
        <CTabContent>
          {/* TAB 1: MASTER INPUT PANEL */}
          <CTabPane role="tabpanel" visible={activeTab === 1}>
            <CRow className="g-3">
              <CCol md={6}>
                <CFormLabel
                  className="text-secondary small fw-semibold mb-1"
                  style={{ fontSize: '11px' }}
                >
                  {l('Warehouse Name Identification')}
                </CFormLabel>
                <CFormInput
                  type="text"
                  name="Name"
                  value={form.Name || ''}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={premiumInputStyle}
                  placeholder="e.g. Northern Logistic Core"
                  className="shadow-none"
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel
                  className="text-secondary small fw-semibold mb-1"
                  style={{ fontSize: '11px' }}
                >
                  {l('Appointed Custodian / Manager')}
                </CFormLabel>
                <CFormInput
                  type="text"
                  name="ContactPerson"
                  value={form.ContactPerson || ''}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={premiumInputStyle}
                  placeholder="e.g. Asif Khan"
                  className="shadow-none"
                />
              </CCol>

              <CCol md={6}>
                <CFormLabel
                  className="text-secondary small fw-semibold mb-1"
                  style={{ fontSize: '11px' }}
                >
                  {l('Primary Telecommunication Node')}
                </CFormLabel>
                <CFormInput
                  type="text"
                  name="Phone"
                  value={form.Phone || ''}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={premiumInputStyle}
                  placeholder="e.g. +922135001122"
                  className="shadow-none"
                />
              </CCol>

              <CCol md={12}>
                <CFormLabel
                  className="text-secondary small fw-semibold mb-1"
                  style={{ fontSize: '11px' }}
                >
                  {l('Geographic Site Address')}
                </CFormLabel>
                <CFormTextarea
                  name="Location"
                  rows={3}
                  value={form.Location || ''}
                  onChange={handleInputChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={premiumInputStyle}
                  placeholder="Input detailed physical coordinate references..."
                  className="shadow-none"
                />
              </CCol>

              {/* Status Operational Control Node */}
              <CCol xs={12} className="mt-4">
                <div className="bg-light p-3 rounded border border-light-300">
                  <CFormCheck
                    className="mb-2 text-dark small"
                    style={{ fontSize: '12px', cursor: 'pointer' }}
                    id="IsDefault"
                    name="IsDefault"
                    label={l('Designate as Central Baseline Hub for current branch transactions')}
                    checked={form.IsDefault || false}
                    onChange={handleInputChange}
                  />
                  <CFormCheck
                    className="text-dark small"
                    style={{ fontSize: '12px', cursor: 'pointer' }}
                    id="IsActive"
                    name="IsActive"
                    label={l('Authorize operational status (Permit real-time ledger entries)')}
                    checked={form.IsActive ?? true}
                    onChange={handleInputChange}
                  />
                </div>
              </CCol>
            </CRow>
          </CTabPane>

          {/* TAB 2: ANALYTICAL METRIC STACK */}
          <CTabPane role="tabpanel" visible={activeTab === 2}>
            <div
              className="text-center p-5 bg-light rounded border border-light"
              style={{ borderStyle: 'dashed' }}
            >
              <CIcon icon={cilLayers} size="xl" className="text-muted mb-3" />
              <h6 className="text-dark fw-bold m-0" style={{ fontSize: '14px' }}>
                {l('Live Volumetric Allocation Grid')}
              </h6>
              <p
                className="text-muted small px-5 mt-2 mb-0"
                style={{ fontSize: '12px', lineHeight: '1.6' }}
              >
                Enterprise inventory routing maps will render database objects automatically upon
                successful synchronization of backend transactional modules.
              </p>
            </div>
          </CTabPane>

          {/* TAB 3: SPATIAL SCHEDULER DATA */}
          <CTabPane role="tabpanel" visible={activeTab === 3}>
            <div
              className="text-center p-5 bg-light rounded border border-light"
              style={{ borderStyle: 'dashed' }}
            >
              <CIcon icon={cilLibrary} size="xl" className="text-muted mb-3" />
              <h6 className="text-dark fw-bold m-0" style={{ fontSize: '14px' }}>
                {l('Matrix Warehouse Spatial Topology')}
              </h6>
              <p
                className="text-muted small px-5 mt-2 mb-0"
                style={{ fontSize: '12px', lineHeight: '1.6' }}
              >
                Zone dividers, row sequence indicators, and high-density racking configurations are
                managed natively through terminal layout templates.
              </p>
            </div>
          </CTabPane>
        </CTabContent>

        {/* Global Footer Command Area */}
        <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top border-light">
          <AppButton
            className="px-4 small"
            variant="outline-dark"
            style={{ fontSize: '12px' }}
            onClick={() => setVisible(false)}
          >
            {l('Abort')}
          </AppButton>
          <AppButton
            className="px-4 fw-bold small d-inline-flex align-items-center gap-2 shadow-none"
            style={{ backgroundColor: '#802060', border: 'none', color: 'white', fontSize: '12px' }}
            onClick={handleSave}
          >
            <CIcon icon={cilSave} size="sm" />
            {l('Commit Changes')}
          </AppButton>
        </div>
      </CModalBody>
    </CModal>
  )
}

export default WarehouseAddEditModel
