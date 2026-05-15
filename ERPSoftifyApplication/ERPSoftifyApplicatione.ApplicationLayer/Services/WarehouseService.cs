using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.ProductDto;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.WarehouseDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class WarehouseService:IWareHouseService
    {
        private readonly IWarehouseInterface _warehouseInterface;
        private readonly ICurrentUserService _currentUserService;
        public WarehouseService(IWarehouseInterface warehouseInterface, ICurrentUserService currentUserService)
        {
            _warehouseInterface = warehouseInterface;
            _currentUserService = currentUserService;
        }

        public async Task<ResponseDataModel<WarehouseCreateDto>> CreateWarehouseAsync(WarehouseCreateDto dto, CancellationToken cancellationToken)
        {
            var product = new Warehouse
            {
                Name = dto.Name,
                ContactPerson = dto.ContactPerson,
                Phone = dto.Phone,
                IsActive = dto.IsActive,
                IsDefault = dto.IsDefault,
                Location = dto.Location,
               BranchId=_currentUserService.BranchId,
                TenantId = _currentUserService.TenantId,
            };

            var result = await _warehouseInterface.CreateWarehouse(product, cancellationToken);
            return ResponseDataModel<WarehouseCreateDto>.SuccessResponse(dto, "Warehouse created successfully");
        }

        public async Task<ResponseDataModel<PagedResponse<WarehouseUpdateDto>>> GetAllWarehouseAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            var query = await _warehouseInterface.GetAll(cancellationToken);

            var totalCount = query.Count();

            var Products = query.OrderByDescending(x => x.ID).Skip((pageNumber - 1) * pageSize).Take(pageSize)
                           .Select(dto => new WarehouseUpdateDto
                           {
                               ID = dto.ID,
                               Name = dto.Name,
                               Phone = dto.Phone,
                               Location = dto.Location,
                               ContactPerson = dto.ContactPerson,
                               IsActive = dto.IsActive,
                               IsDefault = dto.IsDefault,                               
                           }).ToList();

            var pagedData = new PagedResponse<WarehouseUpdateDto>
            {
                TotalCount = totalCount,
                Page = pageNumber,
                PageSize = pageSize,
                Items = Products
            };

            return ResponseDataModel<PagedResponse<WarehouseUpdateDto>>.SuccessResponse(pagedData);
        }

        public async Task<ResponseDataModel<List<WarehouseOutputDto>>> GetAllWarehouseListAsync(CancellationToken cancellationToken)
        {
            var query = await _warehouseInterface.GetAll(cancellationToken);

            var totalCount = query.Count();

            var Products = query.Select(b => new WarehouseOutputDto
            {
                ID = b.ID,
                Name = b.Name,
            }).ToList();


            return ResponseDataModel<List<WarehouseOutputDto>>.SuccessResponse(Products);

        }
        public async Task<ResponseDataModel<WarehouseOutputDto>> GetWarehouseByIdAsync(int id, CancellationToken cancellationToken)
        {
            var Product = await _warehouseInterface.GetById(id, cancellationToken);

            if (Product == null)
                return ResponseDataModel<WarehouseOutputDto>.FailureResponse("Product not found");

            var dto = new WarehouseOutputDto
            {
                ID = Product.ID,
                Name = Product.Name,
                Phone = Product.Phone,
                Location = Product.Location,
                IsActive = Product.IsActive,
                IsDefault = Product.IsDefault,
                ContactPerson = Product.ContactPerson,                
            };

            return ResponseDataModel<WarehouseOutputDto>.SuccessResponse(dto);
        }

        public async Task<ResponseDataModel<WarehouseOutputDto>> UpdateWarehouseAsync(int id, WarehouseOutputDto dto, CancellationToken cancellationToken)
        {
            var existing = await _warehouseInterface.GetById(id, cancellationToken);

            if (existing == null)
                return ResponseDataModel<WarehouseOutputDto>.FailureResponse("Warehouse not found");

            // Map updated values
            existing.Name = dto.Name;
            existing.Location = dto.Location;
            existing.IsDefault = dto.IsDefault;
            existing.IsActive = dto.IsActive;
            existing.ContactPerson = dto.ContactPerson;
            existing.Phone = dto.Phone;
           

            await _warehouseInterface.UpDateWarehouse(existing, cancellationToken);

            return ResponseDataModel<WarehouseOutputDto>.SuccessResponse(dto, "warehouse updated successfully");
        }


        public async Task<ResponseDataModel<bool>> DeleteWarehouseAsync(int id, CancellationToken cancellationToken)
        {
            var existing = await _warehouseInterface.GetById(id, cancellationToken);

            if (existing == null)
                return ResponseDataModel<bool>.FailureResponse("Product not found");

            await _warehouseInterface.DeleteWarehouse(existing.ID, cancellationToken);

            return ResponseDataModel<bool>.SuccessResponse(true, "Product deleted successfully");
        }
    }
}
