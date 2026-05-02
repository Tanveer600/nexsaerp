using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.VendorDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class VendorService: IVendorService
    {
        private readonly IVendorInterface _vendorInterface;
        private readonly ICurrentUserService _currentUserService;
        public VendorService(IVendorInterface vendorInterface, ICurrentUserService currentUserService)
        {
            _vendorInterface = vendorInterface;
            _currentUserService = currentUserService;
        }

        public async Task<ResponseDataModel<CreateVendorDto>> CreateVendorAsync(CreateVendorDto dto, CancellationToken cancellationToken)
        {
            var Vendor = new Vendor
            {
                Name = dto.Name,
                Address = dto.Address,
               Contact = dto.Contact,
                TenantId = _currentUserService.TenantId,

                //City = dto.City,
                //TenantId = dto.TenantId, 
                //CreatedAt = DateTime.UtcNow,
                //Status = RecordStatus.Active // Default Active
            };

            var result = await _vendorInterface.Create(Vendor, cancellationToken);
            return ResponseDataModel<CreateVendorDto>.SuccessResponse(dto, "Vendor created successfully");
        }

        public async Task<ResponseDataModel<PagedResponse<VendorDto>>> GetAllVendorAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            var query = await _vendorInterface.GetAll(cancellationToken);

            var totalCount = query.Count();

            var Vendors = query.OrderByDescending(x => x.ID).Skip((pageNumber - 1) * pageSize).Take(pageSize)
                           .Select(b => new VendorDto
                           {
                               ID = b.ID,
                               Name = b.Name,
                               Address = b.Address,
                               Contact = b.Contact,                        
                           }).ToList();

            var pagedData = new PagedResponse<VendorDto>
            {
                TotalCount = totalCount,
                Page = pageNumber,
                PageSize = pageSize,
                Items = Vendors
            };

            return ResponseDataModel<PagedResponse<VendorDto>>.SuccessResponse(pagedData);
        }
        public async Task<ResponseDataModel<List<VendorDto>>> GetAllVendorListAsync( CancellationToken cancellationToken)
        {
            var query = await _vendorInterface.GetAll(cancellationToken);


            var Vendors = query.Select(b => new VendorDto
                           {
                               ID = b.ID,
                               Name = b.Name,
                           }).ToList();

           

            return ResponseDataModel<List<VendorDto>>.SuccessResponse(Vendors);
        }
        public async Task<ResponseDataModel<VendorDto>> GetVendorByIdAsync(int id, CancellationToken cancellationToken)
        {
            var Vendor = await _vendorInterface.GetById(id, cancellationToken);

            if (Vendor == null)
                return ResponseDataModel<VendorDto>.FailureResponse("Vendor not found");

            var dto = new VendorDto
            {
                ID = Vendor.ID,
                Name = Vendor.Name,
                Address = Vendor.Address,
                Contact = Vendor.Contact,
                // TenantId = Vendor.TenantId,

            };

            return ResponseDataModel<VendorDto>.SuccessResponse(dto);
        }

        public async Task<ResponseDataModel<UpdateVendorDto>> UpdateVendorAsync(int id, UpdateVendorDto dto, CancellationToken cancellationToken)
        {
            var existing = await _vendorInterface.GetById(id, cancellationToken);

            if (existing == null)
                return ResponseDataModel<UpdateVendorDto>.FailureResponse("Vendor not found");

            // Map updated values
            existing.Name = dto.Name;
            existing.Address = dto.Address;
            existing.Contact = dto.Contact;

            // Yahan ensure karein ke aapka Repository internally _context.Update(existing) aur _context.SaveChangesAsync() kar raha hai
            await _vendorInterface.UpDateVendor(existing, cancellationToken);

            return ResponseDataModel<UpdateVendorDto>.SuccessResponse(dto, "Vendor updated successfully");
        }


        public async Task<ResponseDataModel<bool>> DeleteVendorAsync(int id, CancellationToken cancellationToken)
        {
            var existing = await _vendorInterface.GetById(id, cancellationToken);

            if (existing == null)
                return ResponseDataModel<bool>.FailureResponse("Vendor not found");



            await _vendorInterface.DeleteVendor(existing.ID, cancellationToken);

            return ResponseDataModel<bool>.SuccessResponse(true, "Vendor deleted successfully");
        }
    }
}
