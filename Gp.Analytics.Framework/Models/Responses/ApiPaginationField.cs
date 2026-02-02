using System.Text.Json.Serialization;

namespace Gp.Analytics.Framework.Models.Responses
{
    public class ApiPaginationField
    {
        [JsonPropertyName("prev")]
        public string? Previous { get; set; }

        [JsonPropertyName("next")]
        public string? Next { get; set; }

        [JsonPropertyName("recordStart")]
        public int? RecordStart { get; set; }

        [JsonPropertyName("recordEnd")]
        public int? RecordEnd { get; set; }
    }
}
