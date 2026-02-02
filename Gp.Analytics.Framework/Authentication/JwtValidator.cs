using System.Security.Claims;
using Gp.Analytics.Framework.Interfaces;
using Microsoft.Extensions.Logging;

namespace Gp.Analytics.Framework.Authentication
{
    public class JwtValidator : IJwtValidator
    {
        private readonly ILogger<JwtValidator> _logger;

        public JwtValidator(ILogger<JwtValidator> logger)
        {
            _logger = logger;
        }

        public Task<bool> ValidatePrincipalAsync(ClaimsPrincipal? principal)
        {
            if (principal?.Identity == null || !principal.Identity.IsAuthenticated)
            {
                _logger.LogWarning("JWT principal is not authenticated.");
                return Task.FromResult(false);
            }

            // Example custom checks:
            // - Check a "revoked" claim
            // - Check tenant or other application-specific claims
            string? revoked = principal.FindFirst("revoked")?.Value;
            if (string.IsNullOrEmpty(revoked) || !revoked.Equals("true", System.StringComparison.OrdinalIgnoreCase))
            {
                return Task.FromResult(true);
            }

            _logger.LogWarning("JWT token is marked revoked.");
            return Task.FromResult(false);

            // TODO: add real revocation / jti checks against a store if needed.

        }
    }
}