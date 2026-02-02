using System.Net;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace Gp.Analytics.Framework.Authentication
{
    public class CustomJwtBearerEvents : JwtBearerEvents
    {
        //private readonly ISiteContext _siteContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CustomJwtBearerEvents(/*ISiteContext siteContext, */IHttpContextAccessor httpContextAccessor)
        {
            //_siteContext = siteContext;
            _httpContextAccessor = httpContextAccessor;
        }

        public override async Task MessageReceived(MessageReceivedContext context)
        {
            // INFO: bearer token can be submitted via url query, or in the http
            //       header. here we take a look at the http header to try to find
            //       a valid Authorization header.
            if (context.Request.Headers.TryGetValue("Authorization", out StringValues values))
            {
                // INFO: the Authorization header has to be of the format
                //       Authorization: Bearer xxxxxxxxx
                //       meaning that the header has to start with the literal 'Bearer',
                //       followed by a space, and the bearer token value after that.
                //if (!TryParseHttpAuthorizationHeaderForJwtToken(ref values))
                //{
                //    await base.MessageReceived(context);
                //    return;
                //}
            }
            else if (!context.Request.Query.TryGetValue("access_token", out values))
            {
                await base.MessageReceived(context);
                return;
            }

            string? token = values.First();

            if (string.IsNullOrWhiteSpace(token))
            {
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                context.Fail("The 'access_token' query string parameter was defined, but a value to represent the token was not included.");
            }
            else
            {
                /*
                (bool success, ClaimsPrincipal? userPrincipal, ApiAuthResponse authResponse) authenticatedJwtToken = AuthenticateJwtToken(token);

                if (!authenticatedJwtToken.success || authenticatedJwtToken.userPrincipal == null)
                {
                    context.Fail("Authentication failed");
                    return;
                }
                

                context.Principal = authenticatedJwtToken.userPrincipal;
                */
                context.Token = token;

                context.Success();
            }
        }

        /*
        private (bool success, ApiAuthResponse authResponse) ValidateToken(string? token, out IEnumerable<Claim> claims)
        {
            bool logJwtDebugData = _siteContext.GetSiteProp("LogJwtDebugData", false);
            ApiAuthResponse authResponse = new()
            {
                Success = false,
                SendDebug = logJwtDebugData
            };

            JwtSecurityTokenHandler jwtHandler = new();
            JwtSecurityToken jwt = jwtHandler.ReadJwtToken(token);

            bool logJwt = _siteContext.GetSiteProp("LogJwt", false);
            List<ApiDebugField> debugFields = [];

            try
            {
                debugFields.Add(ApiDebugField.Create(DateTime.UtcNow.TimeSinceEpoch(), "JwtAuthenticationAttribute", "ValidateToken", "Start"));
                HMACSHA256 hmac = JwtHelper.GetHmac(_siteContext);
                string[] issuers = [JwtHelper.GetIssuer(_siteContext)];
                string[] audiences = JwtHelper.GetAudiences(_siteContext);
                string[] teamsIssuers = JwtHelper.GetTeamsIssuers(_siteContext);
                bool isTeamsLogin = false;

                debugFields.Add(ApiDebugField.Create(DateTime.UtcNow.TimeSinceEpoch(), "JwtAuthenticationAttribute", "ValidateToken", $"tss.issuers = {string.Join(";", issuers)}"));
                debugFields.Add(ApiDebugField.Create(DateTime.UtcNow.TimeSinceEpoch(), "JwtAuthenticationAttribute", "ValidateToken", $"tss.audiences = {string.Join(";", audiences)}"));

                debugFields.Add(ApiDebugField.Create(DateTime.UtcNow.TimeSinceEpoch(), "JwtAuthenticationAttribute", "ValidateToken", $"jwt = {token}"));
                debugFields.Add(ApiDebugField.Create(DateTime.UtcNow.TimeSinceEpoch(), "JwtAuthenticationAttribute", "ValidateToken", $"jwt.issuer = {jwt.Issuer}"));
                debugFields.Add(ApiDebugField.Create(DateTime.UtcNow.TimeSinceEpoch(), "JwtAuthenticationAttribute", "ValidateToken", $"jwt.audience  = {string.Join(";", jwt.Audiences)}"));

                debugFields.Add(ApiDebugField.Create(DateTime.UtcNow.TimeSinceEpoch(), "JwtAuthenticationAttribute", "ValidateToken", $"found {teamsIssuers.Length} teamsIssuers"));

                TokenValidationParameters validationParameters = JwtHelper.GetValidationParameters(_siteContext, true, issuers, new SymmetricSecurityKey(hmac.Key), audiences);

                //if the issuer isn't the one defined in x_dbprops then we should check who the issuer is and if it is Azure Activity Directory then we have 
                //a JWT from a teams app
                if (!issuers.Contains(jwt.Issuer) && teamsIssuers.Any())
                {
                    List<string> teamsAppAudienceList = [_siteContext.GetSiteProp("TeamsAppId", string.Empty)];
                    teamsAppAudienceList.AddRange(_siteContext.GetSiteProp("AdditionalTeamsAppIds", string.Empty)
                        .Split([";"], StringSplitOptions.RemoveEmptyEntries));
                    string[] teamsAppAudiences = teamsAppAudienceList.ToArray();

                    debugFields.Add(ApiDebugField.Create(DateTime.UtcNow.TimeSinceEpoch(), "JwtAuthenticationAttribute", "ValidateToken", $"tss.teamsAppAudience = {string.Join(";", teamsAppAudiences)}"));
                    validationParameters = JwtHelper.GetValidationParameters(_siteContext, true, teamsIssuers, null, teamsAppAudiences);
                    isTeamsLogin = true;
                }

                ClaimsPrincipal claimsPrincipal = jwtHandler.ValidateToken(token, validationParameters, out _);

                claims = claimsPrincipal.Claims;

                return ValidateUserAndSetOidIfExists(authResponse, jwt, token, isTeamsLogin);
            }
            catch (SecurityTokenEncryptionKeyNotFoundException exception)
            {
                authResponse.SetError("JWT_ENCRYPTION_KEY_NOT_FOUND", "JWT encryption key not found.");
                authResponse.StackTrace = exception.StackTrace;
            }
            catch (SecurityTokenDecryptionFailedException exception)
            {
                authResponse.SetError("JWT_DECRYPTION_FAILED", "JWT decrpytion failed.");
                authResponse.StackTrace = exception.StackTrace;
            }
            catch (SecurityTokenExpiredException exception)
            {
                authResponse.SetError("JWT_EXPIRED", "The JWT has expired.");
                authResponse.Error?.Data?.Add("Expires", exception.Expires);
                authResponse.StackTrace = exception.StackTrace;
            }
            catch (SecurityTokenInvalidAudienceException exception)
            {
                authResponse.SetError("JWT_INVALID_AUDIENCE_EXCEPTION", "JWT has an invalid audience.");
                authResponse.Error?.Data?.Add("InvalidAudience", exception.InvalidAudience);
                authResponse.StackTrace = exception.StackTrace;
            }
            catch (SecurityTokenInvalidLifetimeException exception)
            {
                authResponse.SetError("JWT_INVALID_LIFETIME_EXCEPTION", "JWT has an invalid lifetime.");
                authResponse.Error?.Data?.Add("Expires", exception.Expires);
                authResponse.Error?.Data?.Add("NotBefore", exception.NotBefore);
                authResponse.StackTrace = exception.StackTrace;
            }
            catch (SecurityTokenInvalidSignatureException exception)
            {
                authResponse.SetError("JWT_NO_EXPIRATION_EXCEPTION", "JWT doesn't expire.");
                authResponse.StackTrace = exception.StackTrace;
            }
            catch (SecurityTokenNoExpirationException exception)
            {
                authResponse.SetError("JWT_NO_EXPIRATION_EXCEPTION", "JWT doesn't expire.");
                authResponse.StackTrace = exception.StackTrace;
            }
            catch (SecurityTokenNotYetValidException exception)
            {
                authResponse.SetError("JWT_NOT_YET_VALID_EXCEPTION", "JWT is not yet valid");
                authResponse.Error?.Data?.Add("NotBefore", exception.NotBefore);
                authResponse.StackTrace = exception.StackTrace;
            }
            catch (SecurityTokenException exception)
            {
                authResponse.SetError("JWT_SECURITY_EXCEPTION", exception.Message);
                authResponse.StackTrace = exception.StackTrace;
            }
            catch (Exception exception)
            {
                authResponse.SetError("JWT_EXCEPTION", exception.Message);
                authResponse.StackTrace = exception.StackTrace;
            }
            finally
            {
                if (logJwtDebugData)
                {
                    authResponse.Debug.DebugData = debugFields;
                }

                if (logJwt)
                {
                    new LogJwtEntity
                    {
                        PkId = Guid.NewGuid(),
                        Jwt = token,
                        DateLogged = DateTime.UtcNow,
                        DebugData = JsonSerializer.Serialize(authResponse)
                    }.Update(_siteContext.LogDatabase);
                }
            }

            claims = [];

            return (false, authResponse);
        }
        */

        /*
        private (bool success, ApiAuthResponse authResponse) ValidateUserAndSetOidIfExists(ApiAuthResponse authResponse, JwtSecurityToken jwt, string? token, bool isTeamsLogin)        
        {
            authResponse.Success = false;

            string userClaim = (jwt.Claims.FirstOrDefault(c => c.Type.Is("user_id")) ?? jwt.Claims.FirstOrDefault(c => c.Type.Is("preferred_username")))?.Value ?? string.Empty;
            string issuer = JwtHelper.GetIssuer(_siteContext);
            string oid = jwt.Claims.FirstOrDefault(c => c.Type is "oid" or "http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value ?? string.Empty;

            if (userClaim.IsNullEmptyOrWhitespace())
            {
                authResponse.SetError("MISSING_CLAIM", "Claim (user_id / preferred_username) is null or empty");

                return (false, authResponse);
            }

            string query = Guid.TryParse(userClaim, out Guid userId) ?
                @"SELECT user_id, aad_id, org_id, tenant_id FROM users WHERE user_id = @UserId AND status_id = @StatusID" :
                Guid.TryParse(oid, out _) ?
                    @"SELECT user_id, aad_id, org_id, tenant_id FROM users WHERE aad_id = @Oid AND (user_name = @UserName OR sso_username = @UserName) AND status_id = @StatusID" :
                    @"SELECT user_id, aad_id, org_id, tenant_id FROM users WHERE (user_name = @UserName OR sso_username = @UserName) AND status_id = @StatusID";

            if (isTeamsLogin)
            {
                query = @"SELECT user_id, aad_id, org_id, tenant_id FROM users WHERE aad_id = @Oid AND status_id = @StatusID";
            }

            MasterUserEntity? user = _siteContext.MasterDatabase.Query<MasterUserEntity>(query, new { UserName = userClaim, UserId = userId, StatusId = UserStatus.Active, Oid = oid }).FirstOrDefault();

            if (user == null)
            {
                authResponse.SetError("MISSING_USER", "User not found");
                return (false, authResponse);
            }

            string tid = jwt.Claims.FirstOrDefault(c => c.Type is "tid" or "http://schemas.microsoft.com/identity/claims/tenantid")?.Value ?? string.Empty;
            string jti = jwt.Id;

            if (jwt.Issuer.Is(issuer))
            {
                MasterUsersJwtEntity? userJwt = _siteContext.MasterDatabase.Query<MasterUsersJwtEntity>("SELECT * FROM users_jwt WHERE jwt = @Token", new { Token = token }).SingleOrDefault();

                if (userJwt == null)
                {
                    authResponse.SetError("JWT_NOT_FOUND", "JWT was not found");

                    return (false, authResponse);
                }

                if (!userJwt.IsValid)
                {
                    authResponse.SetError("JWT_NOT_VALID", "JWT is not valid");

                    return (false, authResponse);
                }

                if (userJwt.Jti.IsNot(jti))
                {
                    authResponse.SetError("JTI_DOES_NOT_MATCH", "JTI does not match");

                    return (false, authResponse);
                }

                authResponse.Success = true;
                return (true, authResponse);
            }

            if (oid.IsNullEmptyOrWhitespace())
            {
                authResponse.SetError("MISSING_OID", "oid claim not found");

                return (false, authResponse);
            }

            if (tid.IsNullEmptyOrWhitespace())
            {
                authResponse.SetError("MISSING_TID", "tid claim not found");

                return (false, authResponse);
            }

            if (!Guid.TryParse(oid, out Guid aadId))
            {
                authResponse.SetError("INVALID_OID", "oid is not valid");

                return (false, authResponse);
            }

            if (!Guid.TryParse(tid, out Guid tenantId))
            {
                authResponse.SetError("INVALID_TID", "tid is not valid");

                return (false, authResponse);
            }

            if (user.TenantId.HasValue && tenantId == user.TenantId)
            {
                authResponse.Success = true;
                return (true, authResponse);
            }
            else
            {
                MasterOrgEntity? org = _siteContext.MasterDatabase.Query<MasterOrgEntity>("SELECT TOP 1 t.org_id, t.tenant_id FROM (SELECT org_id, tenant_id FROM org WHERE tenant_id IS NOT NULL UNION SELECT org_id, tenant_id FROM org_tenant) t WHERE tenant_id = @TenantId", new { TenantId = tenantId })
                    .FirstOrDefault();
                if (org == null)
                {
                    authResponse.SetError("ORG_TID_NOT_FOUND", "tid not found by org");

                    return (false, authResponse);
                }
            }

            if (user.AadId != aadId)
            {
                user.AadId = aadId;
                user.Update(_siteContext.MasterDatabase);
            }

            authResponse.Success = true;

            return (true, authResponse);
        }
        */

        /*
        protected (bool success, ClaimsPrincipal? userPrincipal, ApiAuthResponse authResponse) AuthenticateJwtToken(string? token)
        {
            (bool success, ApiAuthResponse authResponse) = ValidateToken(token, out IEnumerable<Claim> claims);

            if (!success)
            {
                return (false, null, authResponse);
            }

            ClaimsIdentity identity = new(claims, "Jwt");
            ClaimsPrincipal user = new(identity);

            return (true, user, authResponse);
        }
        */

        /*
        private static bool TryParseHttpAuthorizationHeaderForJwtToken(ref StringValues authorizationValue)
        {
            // INFO: authorization header with jwt has to have the following format
            //       Bearer <JWT>
            if (authorizationValue.Count == 0)
            {
                return false;
            }

            string[] t = authorizationValue.ToString().Split(" ");
            if (t.Length != 2)
            {
                return false;
            }

            if (t[0] != "Bearer")
            {
                return false;
            }

            authorizationValue = t[1];

            return true;
        }
        */
    }
}
