const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

let config = getDefaultConfig(__dirname);

// Enable modern package exports resolution
config.resolver.unstable_enablePackageExports = true;

// Custom resolver to map Storybook internal packages reliably in Metro
const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith("storybook/internal/")) {
    try {
      const resolvedPath = require.resolve(moduleName);
      return {
        filePath: resolvedPath,
        type: "sourceFile",
      };
    } catch {
      // Fallback to default resolver
    }
  }

  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
