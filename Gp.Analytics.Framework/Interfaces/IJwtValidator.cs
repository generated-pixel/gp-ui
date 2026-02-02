using System.Security.Claims;

namespace Gp.Analytics.Framework.Interfaces
{
    public interface IJwtValidator
    {
        /// <summary>
        /// Perform application-specific validation of a validated JWT principal.
        /// Return true if the token/principal is acceptable; false to reject the token.
        /// </summary>
        Task<bool> ValidatePrincipalAsync(ClaimsPrincipal principal);
    }
}