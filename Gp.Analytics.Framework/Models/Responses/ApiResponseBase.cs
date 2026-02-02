using System.Text.Json.Serialization;

namespace Gp.Analytics.Framework.Models.Responses
{
    public class ApiResponseBase
    {
        [JsonPropertyName("success"), JsonPropertyOrder(-20)]
        public bool Success { get; set; }

        [JsonPropertyName("dateTime"), JsonPropertyOrder(-19)]
        public DateTime DateTime => DateTime.UtcNow;

        [JsonPropertyName("stackTrace"), JsonPropertyOrder(-15)]
        public string? StackTrace { get; set; }

        [JsonIgnore]
        public bool SendDebug { get; set; }

        [JsonPropertyName("debug"), JsonPropertyOrder(-14)]
        public ApiDebugInfo Debug { get; set; } = new();

        [JsonPropertyName("error"), JsonPropertyOrder(-13)]
        public ApiError? Error { get; set; }

        public static bool ShouldSerializeError(ApiResponseBase response)
        {
            return !response.Success;
        }

        public static bool ShouldSerializeStackTrace(ApiResponseBase response)
        {
            return response is { Success: false, SendDebug: true };
        }

        public static bool ShouldSerializeDebug(ApiResponseBase response)
        {
            return response.SendDebug;
        }

        public void SetError(string code, string message)
        {
            Error = new ApiError
            {
                Code = code,
                Message = message
            };
        }
    }
}

