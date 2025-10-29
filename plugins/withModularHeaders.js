const { withPodfile } = require("@expo/config-plugins");


// Ensures `use_modular_headers!` is present in the iOS Podfile so

module.exports = function withModularHeaders(config) {
  return withPodfile(config, (config) => {
    const podfile = config.modResults;
    const insertAfter = "  use_expo_modules!\n";
    const modularHeadersLine = "  use_modular_headers!\n";

    if (!podfile.contents.includes(modularHeadersLine.trim())) {
      if (podfile.contents.includes(insertAfter)) {
        podfile.contents = podfile.contents.replace(
          insertAfter,
          insertAfter + modularHeadersLine
        );
      } else {
        podfile.contents = podfile.contents.replace(
          /target\s+'[^']+'\s+do\n/,
          (match) => match + modularHeadersLine
        );
      }
    }

    return config;
  });
};
