import React from 'react'
import { CPagination, CPaginationItem } from '@coreui/react'
import PropTypes from 'prop-types'
import '../../scss/pagination.scss'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react'

const AppPagination = ({ totalPages, currentPage, onPageChange, pageSize, onPageSizeChange }) => {
  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }

  const visiblePages = pages.slice(
    Math.max(0, currentPage - 3),
    Math.min(totalPages, currentPage + 2),
  )
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

        {visiblePages.map((page) => (
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
      <CDropdown className="pagination-size-dropdown">
        <CDropdownToggle color="light" size="sm">
          {pageSize} ▾
        </CDropdownToggle>

        <CDropdownMenu>
          {[5, 10, 20, 50].map((size) => (
            <CDropdownItem key={size} onClick={() => onPageSizeChange(size)}>
              {size}
            </CDropdownItem>
          ))}
        </CDropdownMenu>
      </CDropdown>
    </div>
  )
}

AppPagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
}

export default AppPagination
