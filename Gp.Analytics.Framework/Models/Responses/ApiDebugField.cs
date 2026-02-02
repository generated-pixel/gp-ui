using System.Text.Json.Serialization;

namespace Gp.Analytics.Framework.Models.Responses
{
    public class ApiDebugField
    {
        [JsonPropertyName("dateTime")]
        public DateTime? DateTime { get; set; }

        [JsonPropertyName("class")]
        public string? Class { get; set; }

        [JsonPropertyName("method")]
        public string? Method { get; set; }

        [JsonPropertyName("data")]
        public object? Data { get; set; }
    }
}
