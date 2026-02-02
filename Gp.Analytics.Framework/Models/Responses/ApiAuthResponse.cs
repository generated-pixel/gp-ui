using System.Text.Json.Serialization;

namespace Gp.Analytics.Framework.Models.Responses
{
    public class ApiAuthResponse : ApiResponseBase
    {
        #region Properties

        [JsonPropertyName("token")]
        public string? Token { get; set; }

        [JsonPropertyName("tokenExpires")]
        public DateTime? TokenExpires { get; set; }

        [JsonPropertyName("refreshToken")]
        public string? RefreshToken { get; set; }

        [JsonPropertyName("refreshTokenExpires")]
        public DateTime? RefreshTokenExpires { get; set; }

        #endregion

        public static bool ShouldSerializeToken(ApiAuthResponse authResponse)
        {
            return authResponse.Success;
        }

        public static bool ShouldSerializeTokenExpires(ApiAuthResponse authResponse)
        {
            return authResponse.Success;
        }

        public static bool ShouldSerializeRefreshToken(ApiAuthResponse authResponse)
        {
            return authResponse.Success;
        }

        public static bool ShouldSerializeRefreshTokenExpires(ApiAuthResponse authResponse)
        {
            return authResponse.Success;
        }
    }
}
