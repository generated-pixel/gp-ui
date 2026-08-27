#!/usr/bin/env node
import { runCli } from "../dist/bin/cli.js";

runCli(process.argv.slice(2)).catch((err) => {
  console.error("gp-css CLI error:", err);
  process.exit(1);
});
