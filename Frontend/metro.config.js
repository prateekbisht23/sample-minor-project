const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname);

// Enhanced error reporting
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.transformer.minifierConfig = {
  keep_fnames: true,
  mangle: {
    keep_fnames: true,
  },
};

// Better error reporting
config.reporter = {
  update: (event) => {
    if (event.type === 'bundle_build_failed') {
      console.error('Bundle build failed:', event.error);
    }
  },
};
 
module.exports = withNativeWind(config, { input: './global.css' })