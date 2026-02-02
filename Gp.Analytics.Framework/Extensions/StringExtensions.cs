using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using Gp.Analytics.Framework.Enums;

namespace Gp.Analytics.Framework.Extensions
{
    public static class StringExtension
    {
        public static bool ContainsAny(this string input, IEnumerable<string> args, bool ignoreCase = false) =>
            ignoreCase ? args.Any(arg => input.Has(arg)) : args.Any(input.Contains);

        public static string Left(this string value, int maxLength)
        {
            if (value.IsNullEmptyOrWhitespace())
            {
                return string.Empty;
            }

            maxLength = Math.Abs(maxLength);
            return (value.Length <= maxLength) ? value : value[..maxLength];
        }

        public static string Right(this string value, int maxLength)
        {
            if (value.IsNullEmptyOrWhitespace())
            {
                return string.Empty;
            }

            maxLength = Math.Abs(maxLength);
            return (value.Length <= maxLength) ? value : value.Substring(value.Length - maxLength, maxLength);
        }

        public static bool Contains(this string value, string stringToFind, StringComparison comp)
        {
            if (stringToFind == null)
            {
                throw new ArgumentNullException(nameof(stringToFind), "stringToFind cannot be null.");
            }

            if (!Enum.IsDefined(typeof(StringComparison), comp))
            {
                throw new ArgumentException("comp is not a member of StringComparison", nameof(comp));
            }

            return value.IndexOf(stringToFind, comp) >= 0;
        }

        public static string ToSafeJavascript(this string value) => value.Replace("'", "\\'");

        public static bool IsGuid(this string value) => Guid.TryParse(value, out Guid _);

        public static bool IsInt(this string value) => int.TryParse(value, out int _);

        public static bool IsBool(this string value) => bool.TryParse(value, out bool _);

        public static string ReplaceEx(this string value, string stringToReplace, string replacement, params string[] alternativeStringsToReplace)
        {
            if (value.Has(stringToReplace))
            {
                return value.Replace(stringToReplace, replacement);
            }

            if (alternativeStringsToReplace.Length == 0)
            {
                return value;
            }

            foreach (string altStr in alternativeStringsToReplace.Where(value.Contains))
            {
                return value.Replace(altStr, replacement);
            }

            return value;
        }

        public static IDictionary<int, string> GetPunctuationCharacters(this string value)
        {
            IDictionary<int, string> punctuationChar = new Dictionary<int, string>();
            int count = 0;
            foreach (char c in value)
            {
                if (char.IsPunctuation(c))
                {
                    punctuationChar.Add(count, c.ToString());
                }

                count++;
            }

            return punctuationChar;
        }

        public static bool IsNullEmptyOrWhitespace([NotNullWhen(false)] this string? value) => string.IsNullOrWhiteSpace(value);

        public static bool IsNotNullEmptyOrWhitespace([NotNullWhen(true)] this string? value) => !string.IsNullOrWhiteSpace(value);


        public static string SpaceBeforeCapitals(this string value) => value.Where(char.IsUpper)
                                                                            .Distinct()
                                                                            .ToArray()
                                                                            .Aggregate(value, (current, c) => current.Replace(c.ToString(), $" {c.ToString()}"))
                                                                            .TrimStart();

        public static string ToTitleCase(string word)
        {
            string s = Regex.Replace(ToHumanCase(AddUnderscores(word)), @"\b([a-z])", match => match.Captures[0].Value.ToUpper());
            bool digit = false;
            string a = string.Empty;
            foreach (char c in s)
            {
                if (char.IsDigit(c))
                {
                    digit = true;
                    a = $"{a}{c}";
                }
                else
                {
                    if (digit && char.IsLower(c))
                    {
                        a = $"{a}{char.ToUpper(c)}";
                    }
                    else
                    {
                        a = $"{a}{c}";
                    }

                    digit = false;
                }
            }

            return a;
        }

        public static string Shuffle(this string value) => new string(value.ToCharArray().OrderBy(s => Guid.NewGuid()).ToArray());

        public static string ToHumanCase(string lowercaseAndUnderscoredWord) => MakeInitialCaps(Regex.Replace(lowercaseAndUnderscoredWord, "_", " "));

        public static string AddUnderscores(string pascalCasedWord) => Regex.Replace(Regex.Replace(Regex.Replace(pascalCasedWord, "([A-Z]+)([A-Z][a-z])", "$1_$2"), @"([a-z\d])([A-Z])", "$1_$2"), @"[-\s]", "_").ToLower();

        public static string MakeInitialCaps(string word) => string.Concat(word[..1].ToUpper(), word[1..].ToLower());

        public static string MakeInitialLower(string word) => string.Concat(word[..1].ToLower(), word[1..]);

        public static string ToEnumName(string value)
        {
            if (value[0] == '_')
            {
                value = value[1..];
            }

            value = value.Replace("_", " ");
            value = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(value);
            value = value.Replace(" ", string.Empty);
            return value;
        }

        public static string ToJsonName(this string value) => MakeInitialLower(ToEnumName(value));

        public static string ToReadable(this long value)
        {
            if (value == 0)
            {
                return "Zero";
            }

            if (value < 0)
            {
                return $"Minus {ToReadable(-value)} ";
            }

            List<string> parts = new List<string>();

            if (value / 1000000000000000 > 0)
            {
                parts.Add($"{ToReadable(value / 1000000000000000)} Quadrillion ");
                value %= 1000000000000000;
            }

            if (value / 1000000000000 > 0)
            {
                parts.Add($"{ToReadable(value / 1000000000000)} Trillion ");
                value %= 1000000000000;
            }

            if (value / 1000000000 > 0)
            {
                parts.Add($"{ToReadable(value / 1000000000)} Billion ");
                value %= 1000000000;
            }

            if (value / 1000000 > 0)
            {
                parts.Add($"{ToReadable(value / 1000000)} Million ");
                value %= 1000000;
            }

            if (value / 1000 > 0)
            {
                parts.Add($"{ToReadable(value / 1000)} Thousand ");
                value %= 1000;
            }

            if (value / 100 > 0)
            {
                parts.Add($"{ToReadable(value / 100)} Hundred ");
                value %= 100;
            }

            if (value <= 0)
            {
                return string.Join(" ", parts.ToArray());
            }

            if (parts.Count != 0)
            {
                parts.Add("And ");
            }

            if (value < 20)
            {
                parts.Add(UnitsMap[value]);
            }
            else
            {
                string lastPart = TensMap[value / 10];
                if (value % 10 > 0)
                {
                    lastPart = $"{lastPart}{UnitsMap[value % 10]} ";
                }

                parts.Add(lastPart);
            }

            return string.Join(string.Empty, parts.ToArray());
        }

        public static string NumberToReadable(string value) => ToReadable(long.Parse(value));

        public static string CleanName(string name)
        {
            string newName = string.Empty;
            string num = string.Empty;

            foreach (char c in name.Where(char.IsLetterOrDigit))
            {
                if (char.IsDigit(c))
                {
                    num = $"{num}{c}";
                }
                else
                {
                    if (num != string.Empty)
                    {
                        newName = $"{newName}{CleanName(NumberToReadable(num))}";
                        num = string.Empty;
                    }

                    newName += c;
                }
            }

            if (num != string.Empty)
            {
                newName += CleanName(NumberToReadable(num));
            }

            return newName;
        }

        public static string Base64Encode(this string plainText) => Convert.ToBase64String(Encoding.UTF8.GetBytes(plainText));

        public static string Base64Decode(this string base64EncodedData) => Encoding.UTF8.GetString(Convert.FromBase64String(base64EncodedData));

        public static string Repeat(this string input, int count)
        {
            if (input.IsNullEmptyOrWhitespace())
            {
                return string.Empty;
            }

            StringBuilder builder = new StringBuilder(input.Length * Math.Abs(count));

            for (int i = 0; i < count; i++)
            {
                builder.Append(input);
            }

            return builder.ToString();
        }

        public static string SpliceText(this string value, int lineLength)
        {
            int charCount = 0;
            IEnumerable<string> lines = value.Split(new[] { " " }, StringSplitOptions.RemoveEmptyEntries).GroupBy(w => (charCount += w.Length + 1) / lineLength).Select(g => string.Join(" ", g));

            return string.Join("\n", lines.ToArray());
        }

        public static string SpliceTextIgnoreSpaces(this string value, int lineLength, string separator = "\n")
        {
            int charCount = 0;
            List<string> lines = new List<string>();

            while (charCount < value.Length && lineLength <= value.Length - charCount)
            {
                lines.Add(value.Substring(charCount, lineLength));
                charCount += lineLength;
            }

            return lines.Count > 0 ? string.Join(separator, lines.ToArray()) : value;
        }

        public static string TruncateString(this string input, int truncateLength, string endWith = "")
        {
            if (endWith.IsNullEmptyOrWhitespace())
            {
                endWith = string.Empty;
            }

            if (input.IsNullEmptyOrWhitespace())
            {
                return string.Empty;
            }

            return (truncateLength > 0) && (input.Length > truncateLength) && (endWith.Length < truncateLength)
                       ? $"{input[..(truncateLength - endWith.Length)]}{endWith}"
                       : input;
        }

        public static string Replace(this string str, string oldValue, string newValue, StringComparison comparison)
        {
            StringBuilder sb = new StringBuilder();

            int previousIndex = 0;
            int index = str.IndexOf(oldValue, comparison);
            while (index != -1)
            {
                sb.Append(str.Substring(previousIndex, index - previousIndex));
                sb.Append(newValue);
                index += oldValue.Length;
                previousIndex = index;
                index = str.IndexOf(oldValue, index, comparison);
            }

            sb.Append(str[previousIndex..]);
            return sb.ToString();
        }

        public static string Mask(this string str, int amount, char maskingChar = '*')
        {
            if (amount == 0 || str.IsNullEmptyOrWhitespace())
            {
                return str;
            }

            int absAmount = Math.Abs(amount);
            if (str.Length <= absAmount)
            {
                return str;
            }

            int totalReq = str.Length - absAmount;

            return amount > 0
                ? $"{str[..absAmount]}{string.Empty.PadLeft(totalReq, maskingChar)}"
                : $"{string.Empty.PadLeft(totalReq, maskingChar)}{str[totalReq..]}";
        }

        /// <summary>
        /// Custom Extension: find "needle" in "haystack"
        /// </summary>
        /// <param name="haystack"></param>
        /// <param name="needle"></param>
        /// <param name="style">Exact, Contains, StartsWith, EndsWith</param>
        /// <returns></returns>
        public static bool Has(this string? haystack, string needle, HasStyle style = HasStyle.Contains)
        {
            if (haystack == null || haystack.IsNullEmptyOrWhitespace())
            {
                return false;
            }

            switch (style)
            {
                case HasStyle.StartsWith:
                    return haystack.StartsWith(needle, StringComparison.OrdinalIgnoreCase);

                case HasStyle.EndsWith:
                    return haystack.EndsWith(needle, StringComparison.OrdinalIgnoreCase);

                case HasStyle.Exact:
                    return haystack.Equals(needle, StringComparison.OrdinalIgnoreCase);

                case HasStyle.Contains:
                default:
                    return haystack.Contains(needle, StringComparison.OrdinalIgnoreCase);
            }
        }

        public static bool HasNot(this string haystack, string needle, HasStyle style = HasStyle.Contains) => !haystack.Has(needle, style);

        public static bool Is(this string haystack, string needle) => haystack.Has(needle, HasStyle.Exact);

        public static bool IsNot(this string haystack, string needle) => !haystack.Has(needle, HasStyle.Exact);
        
        public static string ReplaceIfEmpty(this string value, string replacementText)
        {
            return value.IsNullEmptyOrWhitespace() ? replacementText : value;
        }

        /// <summary>
        /// Split and trim a string into a List (includes semi-colon and comma as split options)
        /// </summary>
        /// <param name="stringToSplit"></param>
        /// <returns></returns>
        public static List<string> SplitAndTrim(this string stringToSplit) =>
            stringToSplit.Split(';', ',').Select(s => s.Trim()).ToList();

        public static string AddTrailingForwardSlash(this string value) => value.Has("/", HasStyle.EndsWith) ? value : $"{value}/";

        public static string AddTrailingBackSlash(this string value) => value.Has("\\", HasStyle.EndsWith) ? value : $@"{value}\";

        public static string AddLeadingForwardSlash(this string value) => value.Has("/", HasStyle.StartsWith) ? value : $"/{value}";

        public static string AddLeadingBackSlash(this string value) => value.Has("\\", HasStyle.StartsWith) ? value : $@"\{value}";
        
        private static readonly string[] UnitsMap =
        [
            "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
            "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
        ];

        private static readonly string[] TensMap =
        [
            "Zero", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
        ];
    }
}
