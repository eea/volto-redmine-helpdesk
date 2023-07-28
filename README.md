# volto-redmine-helpdesk

[![Releases](https://img.shields.io/github/v/release/eea/volto-redmine-helpdesk)](https://github.com/eea/volto-redmine-helpdesk/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-redmine-helpdesk%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-redmine-helpdesk/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-redmine-helpdesk-master&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-redmine-helpdesk-master)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-redmine-helpdesk-master&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-redmine-helpdesk-master)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-redmine-helpdesk-master&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-redmine-helpdesk-master)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-redmine-helpdesk-master&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-redmine-helpdesk-master)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-redmine-helpdesk%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-redmine-helpdesk/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-redmine-helpdesk-develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-redmine-helpdesk-develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-redmine-helpdesk-develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-redmine-helpdesk-develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-redmine-helpdesk-develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-redmine-helpdesk-develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-redmine-helpdesk-develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-redmine-helpdesk-develop)

[Volto](https://github.com/plone/volto) add-on

## Features

![Redmine Helpdesk](https://github.com/eea/volto-redmine-helpdesk/raw/develop/docs/volto-redmine-helpdesk.gif)

## Getting started

### Add volto-redmine-helpdesk to your Volto project

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

1. Start Volto frontend

- If you already have a volto project, just update `package.json`:

  ```JSON
  "addons": [
      "@eeacms/volto-redmine-helpdesk"
  ],

  "dependencies": {
      "@eeacms/volto-redmine-helpdesk": "*"
  }
  ```

- If not, create one:

  ```
  npm install -g yo @plone/generator-volto
  yo @plone/volto my-volto-project --canary --addon @eeacms/volto-redmine-helpdesk
  cd my-volto-project
  ```

1. Install new add-ons and restart Volto:

   ```
   yarn
   yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## Release

See [RELEASE.md](https://github.com/eea/volto-redmine-helpdesk/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-redmine-helpdesk/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-redmine-helpdesk/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
