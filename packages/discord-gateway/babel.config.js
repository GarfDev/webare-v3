module.exports = {
  "plugins": [
    ["module-resolver", {
      "root": ["./src"],
      "extensions": [
        '.js',
        '.jsx',
        '.ts',
        '.tsx',
        '.android.js',
        '.android.tsx',
        '.ios.js',
        '.ios.tsx'
      ],
      "alias": {
        "*": ["./*"],
        "core/*": "./core/*",
      }
    }]
  ],
  "presets": [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        "targets": {
          "esmodules": true,
        },
      },
    ],
  ]
}
