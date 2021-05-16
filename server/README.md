# Server

## Useful instructions

1. Get Python 3.8 (v3.8.5)
2. Set up and activate a virtual environment

```shell
pip install virtualenv
virtualenv venv --python=python3.8
source venv/bin/activate
```

3. Install required dependencies

```shell
pip install -r requirements.txt
```

4. Set up the database

```shell
python manage.py migrate
```

5. Load data fixtures into the database

```shell
python manage.py loaddata fixtures.json
```

6. Run the server

```shell
python manage.py runserver
```

7. Get admin access

```shell
python manage.py createsuperuser
```

Follow the prompts to create an account.

Login at <http://localhost:8000/admin/>

Try to add or change some data.

8. Back up data

```shell
python manage.py dumpdata > fixtures.json
```

9. Try the APIs

Try at <http://localhost:8000/api/>

10. Use pylint

Add an external tool, if you use PyCharm

OR

```shell
pylint {your_edited_file}
```

11. Use black

Add BlackConnect tool, if you use PyCharm

OR

```shell
black {your_edited_file}
```

12. Update required dependencies after dependencies have changed

```shell
pip freeze > requirements.txt
```

13. Switch between databases

Contact Yifan for configurations.py

Add different run configurations, if you use PyCharm.

```bash
Environment variable: PYTHONUNBUFFERED=1;DJANGO_SETTINGS_MODULE=server.settings
```

```bash
Environment variable: PYTHONUNBUFFERED=1;DJANGO_SETTINGS_MODULE=server.production_settings
```

OR

```bash
python manage.py runserver --settings=server.settings
```

```bash
python manage.py runserver --settings=server.production_settings
```

OR

Switch line 10 of `manage.py` between settings.py and production_settings.py \
Please do not commit `manage.py` for such changes.

14. Sync data between databases

Use point 8, point 13, then point 5.

OR

Write a script to automate things.

## Training the model for prediction

There is a pre-trained model already, but one may re-run the file for training.

```shell
cd portfolio
python stock_main.py
```

This uses a set of pre-defined parameters. One may also change them by using command line arguments. Details can be found with

```shell
python stock_main.py -h
```

## Useful API endpoints

1. Authentication

signup:

```
POST /api/v1/auth/signup/
```

login:

```
POST /api/v1/auth/login/
```

logout:

```
POST /api/v1/auth/logout/
```

2. Portfolio Management:

search for stock(s):

```
GET /api/v1/stocks/?search=z
GET /api/v1/stocks/?search=visa
```

stock retrieval:

```
GET /api/v1/stocks/1/
```

create a portfolio:

```
POST /api/v1/portfolios/
```

update a portfolio:

```
PATCH /api/v1/portfolios/1
```

delete a portfolio:

```
DELETE /api/v1/portfolios/1/
```

add stock to portfolio:

```
GET /api/v1/holdings/?stock=1&portfolio=1
if (count === 0):
	POST /api/v1/holdings/
POST /api/v1/transactions/
```

view stocks in a portfolio:

```
GET api/v1/portfolios/1/
GET /api/v1/holdings/?portfolio=1 (an alternative way)
```

remove stock from portfolio

```
POST /api/v1/transactions/
```
