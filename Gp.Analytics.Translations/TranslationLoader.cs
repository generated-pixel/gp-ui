using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;

namespace Gp.Analytics.Translations
{
    public sealed class TranslationLoader
    {
        private readonly TranslationsOptions _options;

        public TranslationLoader(IOptions<TranslationsOptions> options)
        {
            _options = options.Value;
        }

        public async Task<Dictionary<string, Dictionary<string, string>>> LoadAsync(
            CancellationToken cancellationToken)
        {
            if (string.IsNullOrWhiteSpace(_options.Source))
            {
                throw new InvalidOperationException("Translations:Source must be configured.");
            }

            if (!File.Exists(_options.Source))
            {                
                throw new FileNotFoundException($"Translation file not found '{_options.Source}' in '{Directory.GetCurrentDirectory()}'");
            }

            await using FileStream stream = File.OpenRead(_options.Source);

            Dictionary<string, Dictionary<string, string>>? data =
                await JsonSerializer.DeserializeAsync<Dictionary<string, Dictionary<string, string>>>(
                    stream,
                    new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true,
                        ReadCommentHandling = JsonCommentHandling.Skip
                    },
                    cancellationToken);

            if (data == null || data.Count == 0)
            {
                throw new InvalidOperationException("Translation JSON is empty or invalid.");
            }

            return NormalizeKeys(data);
        }

        private static Dictionary<string, Dictionary<string, string>> NormalizeKeys(Dictionary<string, Dictionary<string, string>> input)
        {
            Dictionary<string, Dictionary<string, string>> normalized = new(StringComparer.OrdinalIgnoreCase);

            foreach (KeyValuePair<string, Dictionary<string, string>> culture in input)
            {
                Dictionary<string, string> byKey = new(StringComparer.OrdinalIgnoreCase);

                foreach (KeyValuePair<string, string> entry in culture.Value)
                {
                    string upperKey = entry.Key.ToUpperInvariant();

                    if (byKey.ContainsKey(upperKey))
                    {
                        throw new InvalidOperationException($"Duplicate translation key after normalization: '{entry.Key}' → '{upperKey}' for culture '{culture.Key}'.");
                    }

                    byKey[upperKey] = entry.Value;
                }

                normalized[culture.Key] = byKey;
            }

            return normalized;
        }
    }
}
