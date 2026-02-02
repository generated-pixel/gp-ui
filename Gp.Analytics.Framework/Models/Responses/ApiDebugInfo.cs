using System.Text.Json.Serialization;

namespace Gp.Analytics.Framework.Models.Responses
{
    public class ApiDebugInfo
    {
        [JsonPropertyName("debugData")]
        public List<ApiDebugField> DebugData { get; set; } = [];
    }
}
