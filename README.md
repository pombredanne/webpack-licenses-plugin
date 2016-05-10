# WebpackLicensesPlugin

Adds a file to your webpack build with license information about all your dependencies.

## Usage

```
new WebpackLicensesPlugin(options)
```

Default options:

```
{
  acceptable: /Apache|BSD|MIT|ISC/,     // must match this regex if defined
  unacceptable: /unlicensed/i,          // must not match this regex if defined
  selected: {},                         // hardcode a selected license for a module name (useful for missing/invalid/multiple license options)
  filename: 'Licenses.txt',             // output file
  title: 'Licenses',                    // title at the top of the file
  format: 'text',                       // 'markdown' or 'text'
  failWithError: true                   // throw an error if a dependency has a missing or invalid license
}
```

## Output

```
# Licenses

[d3](http://d3js.org) licensed under BSD-3-Clause

[lodash](https://lodash.com/) licensed under MIT

```
