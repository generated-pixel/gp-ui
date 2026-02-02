using System.Text.Json.Serialization;

namespace Gp.Analytics.Framework.Models.Responses
{
    public class ApiDataField
    {
        [JsonPropertyName("value")]
        public object? Value { get; set; }

        [JsonPropertyName("displayValue")]
        public object? DisplayValue { get; set; }

        [JsonPropertyName("properties")]
        public Dictionary<string, object>? Properties { get; set; }

        public static bool ShouldSerializeProperties(ApiDataField dataField)
        {
            return dataField.Properties is null || (dataField.Properties is not null && dataField.Properties.Count > 0);
        }
    }
}
