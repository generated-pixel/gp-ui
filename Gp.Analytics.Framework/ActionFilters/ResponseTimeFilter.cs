using System.Diagnostics;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Gp.Analytics.Framework.ActionFilters
{
    public class ResponseTimeFilter : IActionFilter
    {
        private Stopwatch _stopwatch = new();

        public void OnActionExecuting(ActionExecutingContext actionContext)
        {
            _stopwatch = Stopwatch.StartNew();
        }

        public void OnActionExecuted(ActionExecutedContext? context)
        {
            context?.HttpContext?.Response?.Headers?.TryAdd("X-Action-Response-Time", _stopwatch.ElapsedMilliseconds.ToString());
        }
    }
}
