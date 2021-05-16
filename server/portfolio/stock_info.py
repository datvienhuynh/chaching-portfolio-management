from datetime import date, timedelta

import numpy as np
import pandas as pd
import yfinance as yf
from requests_html import HTMLSession


def raw_get_daily_info(site):

    session = HTMLSession()
    resp = session.get(site)
    tables = pd.read_html(resp.html.raw_html)
    df = tables[0].copy()
    df.columns = tables[0].columns

    del df["52-week range"]

    df["% change"] = df["% change"].map(lambda x: float(x.strip("%+").replace(",", "")))

    fields_to_change = [
        x for x in df.columns.tolist() if "Vol" in x or x == "Market cap"
    ]

    for field in fields_to_change:

        if type(df[field][0]) == str:
            df[field] = df[field].map(convert_to_numeric)

    session.close()

    return df


def force_float(elt):
    try:
        return float(elt)
    except:
        return elt


def convert_to_numeric(s):
    if s != s:
        return float(0)
    if "M" in s:
        s = s.strip("M")
        return force_float(s) * 1_000_000

    if "B" in s:
        s = s.strip("B")
        return force_float(s) * 1_000_000_000

    return force_float(s)


def get_stock_sd(ticker):
    stock_data = yf.Ticker(ticker).history(
        start=date.today() - timedelta(days=365), end=date.today(), interval="1d"
    )
    price = stock_data["Close"]
    return np.array(price).std()


if __name__ == "__main__":
    pass
