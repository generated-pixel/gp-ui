using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Gp.Analytics.Framework.Models.Responses
{
    public class ApiErrorData
    {
        [JsonPropertyName("errorCode")]
        public required string ErrorCode { get; set; }

        [JsonPropertyName("fieldName")]
        public string? FieldName { get; set; }

        [JsonPropertyName("message")]
        public required string Message { get; set; }

        public static bool ShouldSerializeFieldName(ApiErrorData response)
        {
            return !string.IsNullOrEmpty(response.FieldName);
        }
    }
}
