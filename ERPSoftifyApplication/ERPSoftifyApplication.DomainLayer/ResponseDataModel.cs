using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERPSoftifyApplication.DomainLayer
{
    public class ResponseDataModel<T>
    {
       
            public bool Success { get; set; }
            public string? Message { get; set; }
            public T? Data { get; set; }//s

            public static ResponseDataModel<T> SuccessResponse(T data, string message = " Request Completed successfully")
            {

                return new ResponseDataModel<T>
                {
                    Success = true,
                    Data = data,
                    Message = message
                };
            }

            public static ResponseDataModel<T> FailureResponse(string message)
            {
                return new ResponseDataModel<T>
                {
                    Success = false,
                    Message = message,
                    Data = default

                };
            }


        }
    }

