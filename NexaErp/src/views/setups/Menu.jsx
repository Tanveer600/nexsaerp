import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableRow,
  CBadge,
} from '@coreui/react'

import TableHeader from '../../components/common/TableHeader'
import MenuAddEditModal from './MenuAddEditModal'
import AppButton from '../../components/common/AppButton'

import {
  getAllMenus,
  createMenu,
  updateMenu,
  deleteMenu,
  setMenu,
} from '../../redux/slice/menuSlice'

function Menu() {
  const dispatch = useDispatch()
  const menusData = useSelector((state) => state.menues?.result)

  const menus = Array.isArray(menusData)
    ? menusData
    : Array.isArray(menusData?.data)
      ? menusData.data
      : []
  console.log('>>> Final Menus for Table:', menus)

  const [visible, setVisible] = useState(false)
  const [activeColumn, setActiveColumn] = useState('')
  // Initial state structure updated for MenuDto
  const [form, setForm] = useState({ id: 0, title: '', url: '', icon: '', parentId: null })

  useEffect(() => {
    dispatch(getAllMenus())
  }, [dispatch])

  const handleSave = () => {
    if (!form.title || !form.url) {
      alert('Please fill Title and URL')
      return
    }

    if (form.id === 0) {
      dispatch(createMenu(form))
    } else {
      dispatch(updateMenu(form))
    }

    setVisible(false)
    setForm({ id: 0, title: '', url: '', icon: '', parentId: null })
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard style={{ border: 'none' }}>
          <CCardBody>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h4 className="mb-1">Menus</h4>
                <AppButton variant="golden" data={menus} fileName="Menus_Report" size="sm">
                  Export to Excel
                </AppButton>
              </div>

              <AppButton
                onClick={() => {
                  setForm({ id: 0, title: '', url: '', icon: '', parentId: null })
                  setVisible(true)
                }}
              >
                Add Menu
              </AppButton>
            </div>

            {/* Single Table Implementation */}
            <CTable responsive hover align="middle">
              <CTableHead>
                <CTableRow>
                  <TableHeader
                    col="Title"
                    activeColumn={activeColumn}
                    setActiveColumn={setActiveColumn}
                  />
                  <TableHeader col="URL" />
                  <TableHeader col="Parent" />
                  <TableHeader col="Action" />
                </CTableRow>
              </CTableHead>

              <CTableBody>
                {menus?.map((m) => (
                  <CTableRow key={m.id}>
                    <CTableDataCell>
                      <i className={m.icon + ' me-2'}></i>
                      {m.title}
                    </CTableDataCell>
                    <CTableDataCell>{m.url}</CTableDataCell>
                    <CTableDataCell>
                      {m.parentTitle ? (
                        <CBadge color="info">{m.parentTitle}</CBadge>
                      ) : (
                        <span className="text-muted">Root</span>
                      )}
                    </CTableDataCell>

                    <CTableDataCell className="text-end">
                      <AppButton
                        size="sm"
                        onClick={() => {
                          setForm(m)
                          setVisible(true)
                        }}
                      >
                        Edit
                      </AppButton>

                      <AppButton
                        size="sm"
                        color="danger"
                        className="ms-1"
                        onClick={() => {
                          if (window.confirm('Delete this menu?')) {
                            dispatch(deleteMenu(m.id))
                          }
                        }}
                      >
                        Delete
                      </AppButton>

                      <AppButton size="sm" className="ms-1" onClick={() => dispatch(setMenu(m))}>
                        Select
                      </AppButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      <MenuAddEditModal
        visible={visible}
        setVisible={setVisible}
        form={form}
        setForm={setForm}
        handleSave={handleSave}
        parentMenus={menus.filter((x) => x.parentId === null)}
      />
    </CRow>
  )
}

export default Menu
