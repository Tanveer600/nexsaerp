using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.CategoryDto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
  public interface ICategoryService
    {
        Task<ResponseDataModel<CreateCategoryDto>> CreateCategoryAsync(CreateCategoryDto Category, CancellationToken cancellationToken);
        Task<ResponseDataModel<List<CategoryDto>>> GetAllCategoryListAsync(CancellationToken cancellationToken);
        Task<ResponseDataModel<PagedResponse<CategoryDto>>> GetAllCategoryAsync(int pageNumber, int pageSize, CancellationToken cancellationToken);

        Task<ResponseDataModel<CategoryDto>> GetCategoryByIdAsync(int id, CancellationToken cancellationToken);

        Task<ResponseDataModel<UpdateCategoryDto>> UpdateCategoryAsync(int id, UpdateCategoryDto Category, CancellationToken cancellationToken);

        Task<ResponseDataModel<bool>> DeleteCategoryAsync(int id, CancellationToken cancellationToken);
    }
}
