import React from 'react'
import { CPagination, CPaginationItem } from '@coreui/react'
import PropTypes from 'prop-types'
import '../../scss/pagination.scss'

const AppPagination = ({ totalPages, currentPage, onPageChange }) => {
  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }

  return (
    <div className="d-flex align-items-center justify-content-between w-100 mt-3 px-3">
      {/* Page Info like image */}
      <span className="text-muted small">
        Page <span className="border rounded px-2 mx-1">{currentPage}</span> of {totalPages}
      </span>

      <CPagination className="custom-pagination mb-0">
        <CPaginationItem disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
          ‹
        </CPaginationItem>

        {pages.map((page) => (
          <CPaginationItem
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </CPaginationItem>
        ))}

        <CPaginationItem
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          ›
        </CPaginationItem>
      </CPagination>

      {/* Items per page like image */}
      <span className="text-muted small">
        Items <span className="border rounded-pill px-2 mx-1">10 ▾</span>
      </span>
    </div>
  )
}

AppPagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
}

export default AppPagination
