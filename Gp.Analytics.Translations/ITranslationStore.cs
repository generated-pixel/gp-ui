using System;
using System.Collections.Generic;
using System.Text;

namespace Gp.Analytics.Translations
{
    public interface ITranslationStore
    {
        Dictionary<string, string> GetAll(string culture);
        string Get(string culture, string key);
        bool TryGet(string culture, string key, out string value);
    }
}
