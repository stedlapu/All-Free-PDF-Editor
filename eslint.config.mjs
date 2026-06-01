[
  {
    "files": ["*.ts", "*.tsx"],
    "plugins": ["@typescript-eslint"],
    "extends": ["next/core-web-vitals", "next/typescript"],
    "rules": {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "react/no-danger": "error",
      "react/no-danger-with-children": "error"
    }
  }
]
