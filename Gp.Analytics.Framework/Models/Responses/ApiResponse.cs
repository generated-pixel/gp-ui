using System.Text.Json.Serialization;

namespace Gp.Analytics.Framework.Models.Responses
{
    public class ApiResponse : ApiResponseBase
    {
        [JsonPropertyName("recordCount"), JsonPropertyOrder(-8)]
        public int RecordCount { get; set; } = 0;

        [JsonPropertyName("totalRecordCount"), JsonPropertyOrder(-7)]
        public int TotalRecordCount { get; set; } = 0;

        [JsonPropertyName("data"), JsonPropertyOrder(-6)]
        public List<Dictionary<string, ApiDataField>> Data { get; set; } = [];

        [JsonPropertyName("pagination"), JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull), JsonPropertyOrder(-4)]
        public ApiPaginationField? Pagination { get; set; }

        public static bool ShouldSerializeData(ApiResponse response)
        {
            return response.Success;
        }

        public static bool ShouldSerializeRecordCount(ApiResponse response)
        {
            return response.Success;
        }

        public static bool ShouldSerializeTotalRecordCount(ApiResponse response)
        {
            return response.Success;
        }

        public static bool ShouldSerializePagination(ApiResponse response)
        {
            return response is { Success: true, Pagination: not null };
        }
    }
}
