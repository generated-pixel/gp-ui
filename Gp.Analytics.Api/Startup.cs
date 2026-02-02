using Gp.Analytics.Framework.ActionFilters;
using Gp.Analytics.Framework.Authentication;
using Gp.Analytics.Framework.Extensions;
using Gp.Analytics.Framework.Interfaces;
using Gp.Analytics.Framework.Services;
using Gp.Analytics.Framework.Settings;
using Gp.Analytics.Translations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System.Reflection;
using System.Text;
using System.Text.Json.Serialization.Metadata;

namespace Gp.Analytics.Api
{
    public class Startup
    {
        private string _corsOrigins = string.Empty;

        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            _corsOrigins = string.Concat(Configuration["Cors:CorsOrigins"] ?? string.Empty, ";https://localhost");

            services.AddCors(options =>
            {
                options.AddPolicy("CustomPolicy",
                    policy =>
                    {
                        policy
                            .SetIsOriginAllowedToAllowWildcardSubdomains()
                            .WithOrigins(_corsOrigins.Split(";", StringSplitOptions.RemoveEmptyEntries))
                            .AllowAnyMethod()
                            .SetPreflightMaxAge(new TimeSpan(1728000))
                            .AllowAnyHeader()
                            .AllowCredentials();
                    });
            });

            //Translation Stuff
            services.Configure<TranslationsOptions>(Configuration.GetSection("Translations"));
            services.AddSingleton<ITranslationStore, TranslationStore>();
            services.AddSingleton<TranslationLoader>();
            services.AddHostedService<TranslationStartupService>();

            // Register the response time filter with DI
            services.AddScoped<ResponseTimeFilter>();

            // Create a single resolver instance and attach the modifier so it's used consistently
            DefaultJsonTypeInfoResolver jsonTypeInfoResolver = new();
            jsonTypeInfoResolver.Modifiers.Add(ExcludePropertiesWeShouldNotSerialize);

            // Apply to MVC controllers' serializer options
            services.AddControllers(config =>
            {
                // Register filter by type so ASP.NET Core resolves it from DI (scoped) instead of creating a new instance
                config.Filters.Add<ResponseTimeFilter>();
            }).AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.TypeInfoResolver = jsonTypeInfoResolver;
            });

            // Also apply same resolver for other JSON endpoints (Minimal APIs, Results.Json, etc.)
            services.Configure<JsonOptions>(options =>
            {
                options.SerializerOptions.TypeInfoResolver = jsonTypeInfoResolver;
            });

            // JWT: register validator and events in Gp.Template.Framework
            services.AddScoped<IJwtValidator, JwtValidator>();
            services.AddScoped<CustomJwtBearerEvents>();

            // configure ASP.NET Core authentication + JWT bearer
            string? jwtKey = Configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                throw new InvalidOperationException("Configuration value 'Jwt:Key' is required for JWT authentication.");
            }

            string? jwtIssuer = Configuration["Jwt:Issuer"];
            string? jwtAudience = Configuration["Jwt:Audience"];

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = true;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                        ValidateIssuer = !string.IsNullOrEmpty(jwtIssuer),
                        ValidIssuer = jwtIssuer,
                        ValidateAudience = !string.IsNullOrEmpty(jwtAudience),
                        ValidAudience = jwtAudience,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.FromSeconds(30)
                    };

                    // Use our DI-resolved events type so CustomJwtBearerEvents.TokenValidated runs each request.
                    options.EventsType = typeof(CustomJwtBearerEvents);
                });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            services.AddEndpointsApiExplorer();

            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Gp Template REST API",
                    Version = "v1",
                    Description = "The Gp Template REST API."
                });

                try
                {
                    string docPath = Path.Combine(AppContext.BaseDirectory, "Gp.Template.Api.xml");
                    options.IncludeXmlComments(docPath);
                }
                catch
                {
                    //noop - dont care if we cant find the doc file 
                }

                options.ResolveConflictingActions(apiDescription => apiDescription.First());
                options.IgnoreObsoleteActions();
                options.IgnoreObsoleteProperties();
            });

            services.AddHttpContextAccessor();
        }

        public virtual void Configure(IApplicationBuilder app, IWebHostEnvironment environment,
            IOptions<WebSettings> options)
        {
            // Configure the HTTP request pipeline.
            app.UseHttpsRedirection();

            // Serve default document (wwwroot/index.html) and static files from wwwroot.
            // Place these before routing so requests for "/" return index.html directly.
            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseHttpsRedirection()
                .UseRouting();

            app.UseCors("CustomPolicy");

            app.UseSwagger();
            app.UseSwaggerUI();

            // Authentication & Authorization middleware (authentication must be before endpoints)
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                if (environment.IsDevelopment())
                {
                    endpoints.MapOpenApi();
                }

                // Map API controllers (expected to use routes like "api/...")
                endpoints.MapControllers();

                // Fallback to index.html for any non-API route (useful for SPA client-side routing).
                endpoints.MapFallbackToFile("index.html");
            });
        }

        // Made static to ensure the method group can be added reliably to the resolver and executed
        private static void ExcludePropertiesWeShouldNotSerialize(JsonTypeInfo jsonTypeInfo)
        {
            if (jsonTypeInfo.Kind != JsonTypeInfoKind.Object)
            {
                return;
            }

            foreach (JsonPropertyInfo jsonPropertyInfo in jsonTypeInfo.Properties)
            {
                string? actualName = ((PropertyInfo?)jsonPropertyInfo.AttributeProvider)?.Name;
                if (string.IsNullOrWhiteSpace(actualName))
                {
                    continue;
                }

                string shouldSerializeName = $"ShouldSerialize{actualName}";

                MethodInfo? method = jsonTypeInfo.Type.GetMethods().FirstOrDefault(m => m.Name.Is(shouldSerializeName) && m.ReturnType == typeof(bool));
                if (method == null)
                {
                    Type type = jsonTypeInfo.Type;

                    while (type.BaseType is { } baseType && method == null)
                    {
                        method = baseType.GetMethods().FirstOrDefault(m => m.Name.Is(shouldSerializeName) && m.ReturnType == typeof(bool));
                        if (method != null)
                        {
                            break;
                        }
                        type = baseType;
                    }

                    if (method == null)
                    {
                        continue;
                    }
                }

                jsonPropertyInfo.ShouldSerialize = (obj, _) =>
                {
                    object? invoked = method.Invoke(null, [obj]);
                    return ((bool?)invoked).GetValueOrDefault(false);
                };
            }
        }
    }
}