using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace Gp.Analytics.Framework.OperationFilters
{
    /// <summary>
    /// 
    /// </summary>
    public class BearerAuthOperationFilter : IOperationFilter
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="operation"></param>
        /// <param name="context"></param>
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            bool noAuthRequired = context.ApiDescription.CustomAttributes().Any(attr => attr.GetType() == typeof(AllowAnonymousAttribute));

            if (noAuthRequired)
            {
                return;
            }

            OpenApiSecurityRequirement requirement = new OpenApiSecurityRequirement();
            OpenApiSecuritySchemeReference schemaRef = new("BEARER", null, null);
            
            requirement[schemaRef] = [];

            operation.Security = [requirement];

            if (operation.Responses != null && !operation.Responses.ContainsKey("401"))
            {
                operation.Responses.Add("401", new OpenApiResponse { Description = "Unauthorized" });
            }

            if (operation.Responses != null && !operation.Responses.ContainsKey("403"))
            {
                operation.Responses.Add("403", new OpenApiResponse { Description = "Forbidden" });
            }
        }
    }
}
