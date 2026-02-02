using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace Gp.Analytics.Framework.Models.Responses
{
    public class ApiTranslationsResponse : ApiResponseBase
    {
        [JsonPropertyName("translations")]
        public Dictionary<string, string>? Translations { get; set; } = new();

        public static bool ShouldSerializeTranslations(ApiTranslationsResponse response)
        {
            bool isGood = response.Success && response.Translations is not null && response.Translations.Count > 0;
            if (!isGood)
            {
                response.Success = false;
            }

            return isGood;
        }
    }
}
