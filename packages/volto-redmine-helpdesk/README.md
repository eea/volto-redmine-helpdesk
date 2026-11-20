# @eeacms/volto-redmine-helpdesk

[![Releases](https://img.shields.io/github/v/release/eea/volto-redmine-helpdesk)](https://github.com/eea/volto-redmine-helpdesk/releases)
[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-redmine-helpdesk%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-redmine-helpdesk/job/master/display/redirect)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-redmine-helpdesk&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-redmine-helpdesk)

[Volto](https://github.com/plone/volto) add-on

## Upgrade

### Upgrading to 3.x

> This version requires `Volto 18` or `Volto 19` and Node.js 22.

The sources are unchanged beyond the layout move: the block id, its schema fields and the widget are identical to 2.0.3. The published package now lives in `packages/volto-redmine-helpdesk`.

#### Breaking changes

- **Node.js 22 or newer is required** (`engines.node >= 22`).
- **React 18 is required.** The package declares `react` and `react-dom` as `^18.2.0` peers.

## Features

![Redmine Helpdesk](https://raw.githubusercontent.com/eea/volto-redmine-helpdesk/master/docs/volto-redmine-helpdesk.gif)

## Requirements

### Backend

- [Plone](https://plone.org/download)
- [plone.restapi](https://pypi.org/project/plone.restapi/)

### Frontend

- Node.js: `>=22.0.0`

## Installation

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

   ```Bash
   docker compose up backend
   ```

1. Start Volto frontend

* If you already have a volto project, just update `package.json`:

   ```JSON
   "dependencies": {
       "@eeacms/volto-redmine-helpdesk": "*"
   }
   ```

   and `volto.config.js`:

   ```JavaScript
   const addons = ['@eeacms/volto-redmine-helpdesk'];
   ```

* If not, create one with Cookieplone, as recommended by the official Plone documentation for Volto 18+:

   ```
   uvx cookieplone project
   cd project-title
   ```

1. Install or update dependencies, then start the project:

   ```
   make install
   ```

   For a Cookieplone project, start the backend and frontend in separate terminals:

   ```
   make backend-start
   make frontend-start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## License

See [LICENSE.md](LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
