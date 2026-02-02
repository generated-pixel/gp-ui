using Gp.Analytics.Translations;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;

namespace Gp.Analytics.Framework.Services
{
    public sealed class TranslationStartupService : IHostedService
    {
        private readonly TranslationLoader _loader;
        private readonly TranslationStore _store;
        private readonly ILogger<TranslationStartupService> _logger;

        public TranslationStartupService(
            TranslationLoader loader,
            ITranslationStore store,
            ILogger<TranslationStartupService> logger)
        {
            _loader = loader;
            _store = (TranslationStore)store;
            _logger = logger;
        }

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            Dictionary<string, Dictionary<string, string>> data =
                await _loader.LoadAsync(cancellationToken);

            _store.Load(data);
        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
