using System.Text.Json.Serialization;

namespace Gp.Analytics.Framework.Models.Responses
{
    public class ApiError
    {
        [JsonPropertyName("code")]
        public string? Code { get; set; }

        [JsonPropertyName("message")]
        public string? Message { get; set; }

        [JsonPropertyName("errorData")]
        public List<ApiErrorData>? ErrorData { get; set; }

        public static bool ShouldSerializeErrorData(ApiError error)
        {
            return error.ErrorData is null || (error.ErrorData is not null && error.ErrorData.Count > 0);
        }
    }
}
