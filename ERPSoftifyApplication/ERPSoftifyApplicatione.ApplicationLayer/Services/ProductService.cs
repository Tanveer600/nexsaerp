using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.ProductDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class ProductService: IProductService
    {
        private readonly IProductInterface _productInterface;
        private readonly ICurrentUserService _currentUserService;
        public ProductService(IProductInterface productInterface, ICurrentUserService currentUserService)
        {
            _productInterface = productInterface;
            _currentUserService = currentUserService;
        }

        public async Task<ResponseDataModel<CreateProductDto>> CreateProductAsync(CreateProductDto dto, CancellationToken cancellationToken)
        {
            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                UnitPrice = dto.UnitPrice,               
                TenantId = _currentUserService.TenantId,
            };

            var result = await _productInterface.CreateProduct(product, cancellationToken);
            return ResponseDataModel<CreateProductDto>.SuccessResponse(dto, "Product created successfully");
        }

        public async Task<ResponseDataModel<PagedResponse<ProductDto>>> GetAllProductAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            var query = await _productInterface.GetAll(cancellationToken);

            var totalCount = query.Count();

            var Products = query.OrderByDescending(x => x.ID).Skip((pageNumber - 1) * pageSize).Take(pageSize)
                           .Select(b => new ProductDto
                           {
                               ID = b.ID,
                               Name = b.Name,
                               Description = b.Description,
                               UnitPrice = b.UnitPrice,
                           }).ToList();

            var pagedData = new PagedResponse<ProductDto>
            {
                TotalCount = totalCount,
                Page = pageNumber,
                PageSize = pageSize,
                Items = Products
            };

            return ResponseDataModel<PagedResponse<ProductDto>>.SuccessResponse(pagedData);
        }

        public async Task<ResponseDataModel<List<ProductDto>>> GetAllProductListAsync(CancellationToken cancellationToken)
        {
            var query = await _productInterface.GetAll(cancellationToken);

            var totalCount = query.Count();

            var Products = query.Select(b => new ProductDto
                           {
                               ID = b.ID,
                               Name = b.Name,
                           }).ToList();


            return ResponseDataModel<List<ProductDto>>.SuccessResponse(Products);

        }
        public async Task<ResponseDataModel<ProductDto>> GetProductByIdAsync(int id, CancellationToken cancellationToken)
        {
            var Product = await _productInterface.GetById(id, cancellationToken);

            if (Product == null)
                return ResponseDataModel<ProductDto>.FailureResponse("Product not found");

            var dto = new ProductDto
            {
                ID = Product.ID,
                Name = Product.Name,
                UnitPrice = Product.UnitPrice,
                Description = Product.Description,
                // TenantId = Product.TenantId,

            };

            return ResponseDataModel<ProductDto>.SuccessResponse(dto);
        }

        public async Task<ResponseDataModel<UpdateProductDto>> UpdateProductAsync(int id, UpdateProductDto dto, CancellationToken cancellationToken)
        {
            var existing = await _productInterface.GetById(id, cancellationToken);

            if (existing == null)
                return ResponseDataModel<UpdateProductDto>.FailureResponse("Product not found");

            // Map updated values
            existing.Name = dto.Name;
            existing.UnitPrice = dto.UnitPrice;
            existing.Description = dto.Description;

            await _productInterface.UpDateProduct(existing, cancellationToken);

            return ResponseDataModel<UpdateProductDto>.SuccessResponse(dto, "Product updated successfully");
        }


        public async Task<ResponseDataModel<bool>> DeleteProductAsync(int id, CancellationToken cancellationToken)
        {
            var existing = await _productInterface.GetById(id, cancellationToken);

            if (existing == null)
                return ResponseDataModel<bool>.FailureResponse("Product not found");

            await _productInterface.DeleteProduct(existing.ID, cancellationToken);

            return ResponseDataModel<bool>.SuccessResponse(true, "Product deleted successfully");
        }
    }
}
