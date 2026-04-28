using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplicatione.ApplicationLayer.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface IBranchService
    {
        Task<ResponseDataModel<BranchDto>> CreateBranchAsync(BranchDto Branch, CancellationToken cancellationToken);

        Task<ResponseDataModel<List<BranchDto>>> GetAllBranchsAsync(CancellationToken cancellationToken);

        Task<ResponseDataModel<BranchDto>> GetBranchByIdAsync(int id, CancellationToken cancellationToken);

        Task<ResponseDataModel<BranchDto>> UpdateBranchAsync(int id, BranchDto Branch, CancellationToken cancellationToken);

        Task<ResponseDataModel<bool>> DeleteBranchAsync(int id, CancellationToken cancellationToken);
    }
}
