import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CCol,
  CRow,
  CContainer,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
} from '@coreui/react'
// Hierarchy ko hata kar yahan Network ya GitGraph use kar sakte hain agar zaroorat ho
import { Edit, Trash, CheckCircle, MapPin, Phone, Building2, Network } from 'lucide-react'
import AppButton from '../../components/common/AppButton'
import BranchAddEditForm from './BranchAddEditForm'
import { getAllBranches, deleteBranch, setBranch } from '../../redux/slice/branchSlice'
import { useAppLanguage } from '../../components/common/LanguageContext'

function Branch() {
  const dispatch = useDispatch()
  const { l } = useAppLanguage()

  const branchData = useSelector((state) => state.branches?.result)
  const branches = branchData || []

  const [visible, setVisible] = useState(false)
  const [form, setForm] = useState({
    id: 0,
    name: '',
    code: '',
    street: '',
    city: '',
    emirate: '',
    contactPerson: '',
    phone: '',
    address: '',
    employeeCount: 0,
    isActive: true,
  })

  useEffect(() => {
    dispatch(getAllBranches())
  }, [dispatch])

  const handleEdit = (item) => {
    setForm(item)
    setVisible(true)
  }

  const handleAddNew = () => {
    setForm({
      id: 0,
      name: '',
      code: '',
      street: '',
      city: '',
      emirate: '',
      contactPerson: '',
      phone: '',
      address: '',
      employeeCount: 0,
      isActive: true,
    })
    setVisible(true)
  }

  return (
    <CContainer fluid className="px-4 mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold text-dark mb-0">{l('branch_directory') || 'Branch Directory'}</h3>
          <p className="text-muted small">{l('manage_branches_subtitle')}</p>
        </div>
        <div className="d-flex gap-2">
          <AppButton variant="golden" data={branches} fileName="Branches_Report">
            {l('export_excel')}
          </AppButton>
          <AppButton onClick={handleAddNew}>
            <span className="me-1">+</span> {l('add_branch')}
          </AppButton>
        </div>
      </div>

      <div className="branch-table-wrapper">
        <CTable responsive className="custom-card-table border-0">
          <CTableHead>
            <CTableRow className="header-card-row shadow-sm">
              <CTableHeaderCell className="border-0 ps-4">{l('branch_identity')}</CTableHeaderCell>
              <CTableHeaderCell className="border-0 text-center">{l('code')}</CTableHeaderCell>
              <CTableHeaderCell className="border-0">{l('location_contact')}</CTableHeaderCell>
              <CTableHeaderCell className="border-0">{l('status')}</CTableHeaderCell>
              <CTableHeaderCell className="border-0 text-end pe-4">{l('actions')}</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            <tr style={{ height: '15px' }}></tr>
            {branches.length > 0 ? (
              branches.map((t) => (
                <React.Fragment key={t.id}>
                  <CTableRow className="data-card-row shadow-sm">
                    <CTableDataCell className="ps-4 py-3 first-cell">
                      <div className="d-flex align-items-center">
                        <div className="avatar-box me-3">
                          <Building2 size={20} />
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{t.name}</div>
                          <div className="d-flex align-items-center gap-2 mt-1">
                            {t.parentBranchName ? (
                              <CBadge
                                color="info"
                                className="extra-small fw-normal text-white bg-info opacity-75"
                              >
                                Sub of: {t.parentBranchName}
                              </CBadge>
                            ) : (
                              <CBadge
                                color="secondary"
                                className="extra-small fw-normal bg-secondary-subtle text-secondary"
                              >
                                Main Branch
                              </CBadge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CTableDataCell>

                    <CTableDataCell className="text-center">
                      <CBadge color="light" className="text-dark border px-3 py-2 fw-normal">
                        {t.code || '---'}
                      </CBadge>
                    </CTableDataCell>

                    <CTableDataCell>
                      <div className="d-flex flex-column gap-1">
                        <div
                          className="small d-flex align-items-center text-muted text-truncate"
                          style={{ maxWidth: '200px' }}
                        >
                          <MapPin size={14} className="me-1 text-primary" /> {t.city || l('na')}
                        </div>
                        <div className="small d-flex align-items-center text-muted">
                          <Phone size={14} className="me-1 text-success" /> {t.phone || l('na')}
                        </div>
                      </div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <CBadge
                        className={`px-3 py-2 rounded-pill ${t.isActive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}
                      >
                        {t.isActive ? `● ${l('active')}` : `● ${l('inactive')}`}
                      </CBadge>
                    </CTableDataCell>

                    <CTableDataCell className="text-end pe-4 last-cell">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          onClick={() => dispatch(setBranch(t))}
                          className="action-btn select"
                          title={l('select')}
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(t)}
                          className="action-btn edit"
                          title={l('edit')}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => dispatch(deleteBranch(t.id))}
                          className="action-btn delete"
                          title={l('delete')}
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                  <tr className="spacer-row" style={{ height: '10px' }}></tr>
                </React.Fragment>
              ))
            ) : (
              <CTableRow>
                <CTableDataCell colSpan="5" className="text-center py-5 text-muted">
                  {l('no_data_found')}
                </CTableDataCell>
              </CTableRow>
            )}
          </CTableBody>
        </CTable>
      </div>

      <BranchAddEditForm
        visible={visible}
        setVisible={setVisible}
        form={form}
        branches={branches}
      />

      <style>
        {`
          .custom-card-table { border-collapse: separate; border-spacing: 0; width: 100%; }
          .header-card-row th {
            background: #fff !important;
            padding: 18px 15px;
            color: #495057;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 700;
            border-bottom: 3px solid #7c3aed !important;
          }
          .data-card-row { background: white !important; transition: all 0.3s ease; }
          .data-card-row:hover { transform: scale(1.005); box-shadow: 0 8px 20px rgba(0,0,0,0.1) !important; z-index: 10; }
          .first-cell { border-top-left-radius: 15px; border-bottom-left-radius: 15px; border: 1px solid #f0f0f0; border-right: 0; }
          .last-cell { border-top-right-radius: 15px; border-bottom-right-radius: 15px; border: 1px solid #f0f0f0; border-left: 0; }
          .data-card-row td { border-top: 1px solid #f0f0f0; border-bottom: 1px solid #f0f0f0; background: white; vertical-align: middle; }
          .avatar-box { width: 42px; height: 42px; background: #f3f0ff; color: #7c3aed; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
          .action-btn { border: none; background: transparent; padding: 10px; border-radius: 10px; transition: all 0.2s; color: #adb5bd; }
          .action-btn.select:hover { color: #7c3aed; background: #f3f0ff; }
          .action-btn.edit:hover { color: #212529; background: #f8f9fa; }
          .action-btn.delete:hover { color: #dc3545; background: #fff5f5; }
          .bg-success-subtle { background-color: #d1fae5 !important; color: #065f46 !important; }
          .bg-danger-subtle { background-color: #fee2e2 !important; color: #991b1b !important; }
          .extra-small { font-size: 0.65rem; padding: 2px 8px; }
        `}
      </style>
    </CContainer>
  )
}

export default Branch
