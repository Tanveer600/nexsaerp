using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplication.DomainLayer.Interface;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.CategoryDto;
using ERPSoftifyApplicatione.ApplicationLayer.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryInterface _CategoryInterface;
        private readonly ICurrentUserService _currentUserService;
        public CategoryService(ICategoryInterface CategoryInterface, ICurrentUserService currentUserService)
        {
            _CategoryInterface = CategoryInterface;
            _currentUserService = currentUserService;
        }

        public async Task<ResponseDataModel<CreateCategoryDto>> CreateCategoryAsync(CreateCategoryDto dto, CancellationToken cancellationToken)
        {
            var Category = new Category
            {
                Name = dto.Name,
               Code = dto.Code,
               IsActive = dto.IsActive,
                TenantId = _currentUserService.TenantId,

               
            };

            var result = await _CategoryInterface.Create(Category, cancellationToken);
            return ResponseDataModel<CreateCategoryDto>.SuccessResponse(dto, "Category created successfully");
        }
        public async Task<ResponseDataModel<List<CategoryDto>>> GetAllCategoryListAsync(CancellationToken cancellationToken)
        {
            var query = await _CategoryInterface.GetAll(cancellationToken);

            var totalCount = query.Count();

            var Products = query.Select(b => new CategoryDto
            {
                ID = b.ID,
                Name = b.Name,
            }).ToList();


            return ResponseDataModel<List<CategoryDto>>.SuccessResponse(Products);

        }
        public async Task<ResponseDataModel<PagedResponse<CategoryDto>>> GetAllCategoryAsync(int pageNumber, int pageSize, CancellationToken cancellationToken)
        {
            var query = await _CategoryInterface.GetAll(cancellationToken);

            var totalCount = query.Count();

            var Categorys = query.OrderByDescending(x => x.ID).Skip((pageNumber - 1) * pageSize).Take(pageSize)
                           .Select(b => new CategoryDto
                           {
                               ID = b.ID,
                               Name = b.Name,
                              Code = b.Code,
                              IsActive = b.IsActive,
                           }).ToList();

            var pagedData = new PagedResponse<CategoryDto>
            {
                TotalCount = totalCount,
                Page = pageNumber,
                PageSize = pageSize,
                Items = Categorys
            };

            return ResponseDataModel<PagedResponse<CategoryDto>>.SuccessResponse(pagedData);
        }

        public async Task<ResponseDataModel<CategoryDto>> GetCategoryByIdAsync(int id, CancellationToken cancellationToken)
        {
            var Category = await _CategoryInterface.GetById(id, cancellationToken);

            if (Category == null)
                return ResponseDataModel<CategoryDto>.FailureResponse("Category not found");

            var dto = new CategoryDto
            {
                ID = Category.ID,
             Name= Category.Name,
             Code = Category.Code,
             IsActive = Category.IsActive,

            };

            return ResponseDataModel<CategoryDto>.SuccessResponse(dto);
        }

        public async Task<ResponseDataModel<UpdateCategoryDto>> UpdateCategoryAsync(int id, UpdateCategoryDto dto, CancellationToken cancellationToken)
        {
            var existing = await _CategoryInterface.GetById(id, cancellationToken);

            if (existing == null)
                return ResponseDataModel<UpdateCategoryDto>.FailureResponse("Category not found");

            // Map updated values
            existing.Name = dto.Name;
            existing.Code= dto.Code;
            existing.IsActive = dto.IsActive;
          
            await _CategoryInterface.UpDateCategory(existing, cancellationToken);

            return ResponseDataModel<UpdateCategoryDto>.SuccessResponse(dto, "Category updated successfully");
        }


        public async Task<ResponseDataModel<bool>> DeleteCategoryAsync(int id, CancellationToken cancellationToken)
        {
            var existing = await _CategoryInterface.GetById(id, cancellationToken);

            if (existing == null)
                return ResponseDataModel<bool>.FailureResponse("Category not found");



            await _CategoryInterface.DeleteCategory(existing.ID, cancellationToken);

            return ResponseDataModel<bool>.SuccessResponse(true, "Category deleted successfully");
        }
    }
}
  