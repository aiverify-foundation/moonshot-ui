This is the Web UI for moonshot.

## Getting Started

### Prerequisites

- Node.js verion 20.11.1 LTS and above
- Python version 3.11 and above
- Moonshot Web API Python module - [projectmoonshot-imda version 0.2.2](https://pypi.org/project/projectmoonshot-imda/)

## Install and run Moonshot Web Api

- Follow the instructions in https://pypi.org/project/projectmoonshot-imda to install the module but do not run it.

> If a .env file is not created in the next step, the module will use these default values: HOST_ADDRESS=127.0.0.1, HOST_PORT=5000, MOONSHOT_UI_CALLBACK_URL=http://localhost:3000/api/v1/benchmarks/status 
- Before running the module, a `.env` file containing these variables can be created if the hostnames and ports need to be updated:

```
HOST_ADDRESS=127.0.0.1 # The interface the server will bind to
HOST_PORT=5000

# Below is the uri of the Web UI webhook.
# In the next section, if Web UI listens on a different port,
# update this uri accordingly and restart.

MOONSHOT_UI_CALLBACK_URL=http://localhost:3000/api/v1/benchmarks/status 
```
- Place the .env file in the directory where the following command will be executed from

`python -m moonshot web_api`

## Install Web UI

- git clone this project into the local machine.

`git clone git@github.com:moonshot-admin/moonshot-ui.git`

- In the cloned project root directly (/moonshot-ui), create `.env` file containing this variable:

```
# This should be the URL of the Moonshot Web Api module which was started in the previous section.
# Check the startup logs to determine the hostname and port number.

MOONSHOT_API_URL=http://127.0.0.1:5000
```
- Install dependencies - `npm install`


## Building

From the same project root folder, run `npm run build`

## Run

After the build step is completed, start the Web UI with this command

`npm start`

Access the Web UI from browser `http://localhost:3000`