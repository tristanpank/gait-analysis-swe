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
python -m venv .
```

Once all the virtual environment files are made and the command is finished running, activate the virtual environment and install python dependencies

```shell
./Scripts/activate
pip -r install requirements.txt
```

To run our API test cases enter the `tests/` directory and run pytest

```shell
cd tests/
pytest
```
