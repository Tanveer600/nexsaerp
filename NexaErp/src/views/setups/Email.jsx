import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInbox, syncInbox, sendEmail } from '../../redux/slice/emailSlice'
import AppButton from '../../components/common/AppButton'
import ValidationError from '../../components/common/ValidationError'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CNav,
  CNavItem,
  CNavLink,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilEnvelopeClosed,
  cilSend,
  cilCloudDownload,
  cilInbox,
  cilUser,
  cilArrowLeft,
  cilLockLocked,
  cilActionUndo,
} from '@coreui/icons'

const Email = () => {
  const dispatch = useDispatch()
  const { emails, isLoading } = useSelector((state) => state.emails)
  console.log('>>> Emails State:', emails, 'Loading:', isLoading) // Debugging log
  const [activeTab, setActiveTab] = useState('inbox')
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [syncEmail, setSyncEmail] = useState('ranatanveerranakabeer@gmail.com')
  const [appPassword, setAppPassword] = useState('yyphbpefsrqlndcr')

  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (activeTab === 'inbox') {
      dispatch(fetchInbox())
    }
  }, [activeTab, dispatch])

  const iconColors = ['#7c3aed', '#0ea5e9', '#f59e0b', '#10b981', '#ef4444']

  const handleRowClick = (email) => {
    setSelectedEmail(email)
  }

  const handleReply = () => {
    if (!selectedEmail) return

    const emailMatch = selectedEmail.fromEmail.match(/<([^>]+)>/)
    const replyTo = emailMatch ? emailMatch[1] : selectedEmail.fromEmail

    setTo(replyTo)

    const currentSubject = selectedEmail.subject || ''
    const newSubject = currentSubject.toLowerCase().startsWith('re:')
      ? currentSubject
      : `Re: ${currentSubject}`

    setSubject(newSubject)
    setBody('')

    setSelectedEmail(null)
    setActiveTab('compose')
  }

  const handleSync = () => {
    if (!syncEmail || !appPassword) return
    dispatch(syncInbox({ email: syncEmail, appPassword: appPassword }))
  }

  const handleSend = () => {
    let tempErrors = {}
    if (!to) tempErrors.to = 'Recipient email is required'
    if (!subject) tempErrors.subject = 'Subject cannot be empty'
    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors)
      return
    }
    dispatch(sendEmail({ to, subject, body }))
    setErrors({})
    setTo('')
    setSubject('')
    setBody('')
    setActiveTab('inbox')
  }

  return (
    <CRow>
      <CCol xs={12}>
        <div className="d-flex justify-content-between align-items-center mb-4 px-2">
          <div>
            <h3 style={{ fontWeight: '800', color: '#1a1a1a', margin: 0 }}>Communication</h3>
            <span className="text-muted small fw-bold" style={{ letterSpacing: '1px' }}>
              NEXAERP HUB / EMAIL SERVICE
            </span>
          </div>

          <div className="d-flex gap-3 align-items-center bg-white p-2 rounded-4 shadow-sm border">
            <input
              className="border-0 bg-transparent px-2"
              style={{ width: '200px', fontSize: '13px', fontWeight: '500', outline: 'none' }}
              value={syncEmail}
              onChange={(e) => setSyncEmail(e.target.value)}
            />
            <AppButton variant="purple" onClick={handleSync} disabled={isLoading}>
              <CIcon icon={cilCloudDownload} className="me-2" />
              {isLoading ? 'Syncing...' : 'Sync Inbox'}
            </AppButton>
          </div>
        </div>

        <CCard className="border-0 shadow-lg rounded-4 overflow-hidden bg-white">
          <CCardBody className="p-0">
            <CNav className="px-4 pt-3 border-bottom bg-light bg-opacity-50">
              <CNavItem>
                <CNavLink
                  active={activeTab === 'inbox'}
                  onClick={() => {
                    setActiveTab('inbox')
                    setSelectedEmail(null)
                  }}
                  style={{
                    cursor: 'pointer',
                    fontWeight: '700',
                    color: activeTab === 'inbox' ? '#7c3aed' : '#999',
                  }}
                >
                  <CIcon icon={cilInbox} className="me-2" /> Inbox
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 'compose'}
                  onClick={() => {
                    setActiveTab('compose')
                    setSelectedEmail(null)
                    setTo('')
                    setSubject('')
                    setBody('')
                    setErrors({})
                  }}
                  style={{
                    cursor: 'pointer',
                    fontWeight: '700',
                    color: activeTab === 'compose' ? '#7c3aed' : '#999',
                  }}
                >
                  <CIcon icon={cilEnvelopeClosed} className="me-2" /> Compose
                </CNavLink>
              </CNavItem>
            </CNav>

            <div className="p-4">
              {activeTab === 'inbox' ? (
                selectedEmail ? (
                  <div className="animate__animated animate__fadeIn">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <button
                        onClick={() => setSelectedEmail(null)}
                        className="btn btn-link text-decoration-none p-0 fw-bold"
                        style={{ color: '#7c3aed' }}
                      >
                        <CIcon icon={cilArrowLeft} className="me-2" /> Back to Inbox
                      </button>

                      {/* REPLY BUTTON ADDED HERE */}
                      <AppButton variant="purple" onClick={handleReply}>
                        <CIcon icon={cilActionUndo} className="me-2" /> Reply
                      </AppButton>
                    </div>

                    <div className="border-bottom pb-4 mb-4">
                      <h2 className="fw-bold mb-3">{selectedEmail.subject}</h2>
                      <div className="d-flex align-items-center">
                        <div
                          className="p-3 rounded-circle me-3"
                          style={{ backgroundColor: '#7c3aed', color: '#fff' }}
                        >
                          <CIcon icon={cilUser} size="xl" />
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{selectedEmail.fromEmail}</div>
                          <div className="text-muted small">
                            {new Date(selectedEmail.receivedDate).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="p-4 rounded-4 bg-light"
                      style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#444' }}
                      dangerouslySetInnerHTML={{ __html: selectedEmail.body }}
                    />
                  </div>
                ) : isLoading ? (
                  <div className="text-center py-5">
                    <CSpinner style={{ color: '#7c3aed' }} variant="grow" />
                    <p className="mt-3 text-muted fw-bold">Connecting to Nexa Secure Server...</p>
                  </div>
                ) : (
                  <CTable hover align="middle" responsive borderless className="mb-0">
                    <CTableHead className="bg-light">
                      <CTableRow>
                        <CTableHeaderCell className="text-muted small py-3 px-4">
                          SENDER
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-muted small py-3">
                          CONTENT
                        </CTableHeaderCell>
                        <CTableHeaderCell className="text-muted small py-3 text-center">
                          DATE
                        </CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {emails?.length > 0 ? (
                        emails.map((item, index) => (
                          <CTableRow
                            key={index}
                            onClick={() => handleRowClick(item)}
                            style={{ cursor: 'pointer', borderBottom: '1px solid #f2f2f2' }}
                          >
                            <CTableDataCell className="px-4">
                              <div className="d-flex align-items-center">
                                <div
                                  className="p-2 rounded-circle me-3 d-flex align-items-center justify-content-center"
                                  style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: `${iconColors[index % iconColors.length]}15`,
                                    color: iconColors[index % iconColors.length],
                                    border: `1px solid ${iconColors[index % iconColors.length]}30`,
                                  }}
                                >
                                  <CIcon icon={cilUser} />
                                </div>
                                <span className="fw-bold text-dark" style={{ fontSize: '14px' }}>
                                  {item.fromEmail?.split('<')[0].replace(/"/g, '')}
                                </span>
                              </div>
                            </CTableDataCell>
                            <CTableDataCell className="py-3">
                              <div className="fw-bold text-dark mb-1" style={{ fontSize: '15px' }}>
                                {item.subject || '(No Subject)'}
                              </div>
                              <div
                                className="text-muted small text-truncate"
                                style={{ maxWidth: '500px' }}
                              >
                                {item.body?.replace(/<[^>]*>?/gm, '')}
                              </div>
                            </CTableDataCell>
                            <CTableDataCell className="text-center">
                              <span
                                className="px-3 py-1 rounded-pill fw-bold text-muted"
                                style={{
                                  backgroundColor: '#f8f9fa',
                                  fontSize: '11px',
                                  border: '1px solid #eee',
                                }}
                              >
                                {new Date(item.receivedDate).toLocaleDateString()}
                              </span>
                            </CTableDataCell>
                          </CTableRow>
                        ))
                      ) : (
                        <CTableRow>
                          <CTableDataCell colSpan="3" className="text-center py-5">
                            <CIcon
                              icon={cilLockLocked}
                              size="3xl"
                              className="text-muted mb-3 opacity-25"
                            />
                            <p className="text-muted fw-bold">Inbox is empty</p>
                          </CTableDataCell>
                        </CTableRow>
                      )}
                    </CTableBody>
                  </CTable>
                )
              ) : (
                <div className="mx-auto py-3" style={{ maxWidth: '800px' }}>
                  <div className="mb-4" style={{ borderBottom: '1px solid #eee' }}>
                    <label className="small fw-bold text-muted text-uppercase">Recipient</label>
                    <input
                      className="w-100 border-0 py-2 outline-none"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                    />
                    <ValidationError message={errors.to} />
                  </div>
                  <div className="mb-4" style={{ borderBottom: '1px solid #eee' }}>
                    <label className="small fw-bold text-muted text-uppercase">Subject</label>
                    <input
                      className="w-100 border-0 py-2 outline-none"
                      style={{ fontWeight: '600' }}
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                    <ValidationError message={errors.subject} />
                  </div>
                  <textarea
                    className="w-100 border-0 bg-light p-3 rounded-4 mb-4"
                    rows={10}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    style={{ outline: 'none' }}
                  />
                  <div className="d-flex justify-content-end gap-3">
                    <AppButton variant="purple" onClick={handleSend} className="px-5 py-2">
                      <CIcon icon={cilSend} className="me-2" /> Send Email
                    </AppButton>
                  </div>
                </div>
              )}
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Email
