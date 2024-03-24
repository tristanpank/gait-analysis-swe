# gait-analysis-swe

How to install project dependencies

Run the following commands to install the frontend dependencies

```shell
cd frontend
npm install
```

Then return to the parent directory

```shell
cd ..
```

Then enter the api directory and make a python virtual environment

```shell
cd api
py -3.11 -m venv .
```

Once all the virtual environment files are made and the command is finished running, activate the virtual environment and install python dependencies

```shell
./Scripts/activate
pip install -r requirements.txt
```

Then enter the app directory and run the live server

```shell
cd app
uvicorn app.main:app --reload
```

To run our API test cases enter the `tests/` directory and run pytest

```shell
cd tests/
pytest
```
