FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["server/API/API.csproj", "server/API/"]
COPY ["server/Service/Service.csproj", "server/Service/"]
COPY ["server/Infra/Infra.csproj", "server/Infra/"]
RUN dotnet restore "server/API/API.csproj"
COPY . .
WORKDIR "/src/server/API"
RUN dotnet build "./API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
ENV DB="Data Source=/app/data/dev.db"
ENTRYPOINT ["dotnet", "API.dll"]

