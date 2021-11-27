module.exports = {
  "plugins": [
    'transform-remove-console',
    ["module-resolver", {
      "root": ["./src"],
      "extensions": [
        '.js',
        '.ts',
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
