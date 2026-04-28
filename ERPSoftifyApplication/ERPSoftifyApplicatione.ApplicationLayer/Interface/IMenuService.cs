using ERPSoftifyApplication.DomainLayer;
using ERPSoftifyApplication.DomainLayer.Entities;
using ERPSoftifyApplicatione.ApplicationLayer.DTO.MenuDtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplicatione.ApplicationLayer.Interface
{
    public interface IMenuService
    {
   
            Task<ResponseDataModel<MenuDto>> CreateMenuAsync(CreateMenuDto dto, CancellationToken cancellationToken);
            Task<ResponseDataModel<List<MenuDto>>> GetAllMenusAsync(CancellationToken cancellationToken);
            Task<ResponseDataModel<MenuDto>> GetMenuByIdAsync(int id, CancellationToken cancellationToken);
            Task<ResponseDataModel<UpdateMenuDto>> UpdateMenuAsync(UpdateMenuDto dto, CancellationToken cancellationToken);
            Task<ResponseDataModel<bool>> DeleteMenuAsync(int id, CancellationToken cancellationToken);
            Task<ResponseDataModel<List<MenuDto>>> GetMenusByRoleAsync(int roleId, CancellationToken cancellationToken);
        }
    }

