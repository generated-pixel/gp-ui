using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Gp.Analytics.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        [HttpPost("login")]
        [AllowAnonymous]
        public Results<Ok, SignInHttpResult, BadRequest> Login()
        {
            return TypedResults.Ok();
        }

        [HttpPost("refresh")]
        [AllowAnonymous]
        public Results<Ok, BadRequest, UnauthorizedHttpResult> Refresh()
        {
            return TypedResults.Ok();
        }

        [HttpPost("logout")]
        public Results<SignOutHttpResult, BadRequest> Logout()
        {
            return TypedResults.SignOut();
        }
    }
}
