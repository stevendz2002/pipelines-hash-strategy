const fs = require("fs");
const { execSync } = require("child_process");

if (!process.env.CHROME_BIN) {
  try {
    execSync("which google-chrome || which google-chrome-stable || which chromium || which chromium-browser", { stdio: "ignore" });
  } catch {
    try {
      execSync("which firefox", { stdio: "ignore" });
      const wrapperPath = "/tmp/firefox-chrome-wrapper.sh";
      fs.writeFileSync(
        wrapperPath,
        '#!/bin/bash\nexport HOME=/tmp\nfor arg in "$@"; do if [[ "$arg" =~ ^http ]]; then url="$arg"; fi; done\nexec firefox --headless "$url"\n',
        { mode: 0o755 }
      );
      process.env.CHROME_BIN = wrapperPath;
    } catch {}
  }
}

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage"),
      require("@angular-devkit/build-angular/plugins/karma"),
    ],
    client: { jasmine: { random: true, seed: undefined } },
    reporters: ["progress", "kjhtml"],
    browsers: ["ChromeHeadless"],
    restartOnFileChange: true,
    coverageReporter: { dir: require("path").join(__dirname, "./coverage/hash-map-pokedex") },
  });
};
