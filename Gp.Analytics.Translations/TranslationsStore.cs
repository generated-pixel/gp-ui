using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Text;

namespace Gp.Analytics.Translations
{
    public sealed class TranslationStore : ITranslationStore
    {
        private readonly ConcurrentDictionary<string, ConcurrentDictionary<string, string>> _translations =
            new(StringComparer.OrdinalIgnoreCase);

        public void Load(Dictionary<string, Dictionary<string, string>> data)
        {
            _translations.Clear();

            foreach (KeyValuePair<string, Dictionary<string, string>> culture in data)
            {
                _translations[culture.Key] =
                    new ConcurrentDictionary<string, string>(culture.Value, StringComparer.OrdinalIgnoreCase);
            }
        }

        public Dictionary<string ,string> GetAll(string culture)
        {
            return _translations.TryGetValue(culture, out ConcurrentDictionary<string, string>? dict)
                ? new Dictionary<string, string>(dict)
                : [];
        }

        public string Get(string culture, string key)
        {
            return TryGet(culture, key, out string value) ? value : key;
        }

        public bool TryGet(string culture, string key, out string value)
        {
            key = key.ToUpperInvariant();
            value = key;

            if (!_translations.TryGetValue(culture, out ConcurrentDictionary<string, string>? dict) && culture != "en-US")
            {
                _translations.TryGetValue("en-US", out dict);
            }

            if (dict != null && dict.TryGetValue(key, out string? result))
            {
                value = result;
                return true;
            }

            return false;
        }
    }
}
