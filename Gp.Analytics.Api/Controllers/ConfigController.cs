using Gp.Analytics.Translations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Gp.Analytics.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfigController : ControllerBase
    {
        [HttpGet("translations")]
        [AllowAnonymous]
        public Results<Ok<Dictionary<string, string>>, BadRequest> GetTranslations(ITranslationStore store, string langId = "en-US")
        {
            Dictionary<string, string> translations = store.GetAll(langId);
            if (translations == null)
            {
                return TypedResults.BadRequest();
            }

            return TypedResults.Ok(translations);
        }
    }
}