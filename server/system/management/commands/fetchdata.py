import json
import time
from datetime import datetime
from decimal import InvalidOperation

import pandas as pd
import requests
import yfinance as yf
from django.core.exceptions import ObjectDoesNotExist
from django.core.management.base import BaseCommand, CommandError
from portfolio.models import Stock, StockData
from portfolio.stock_predict import make_prediction
from requests.exceptions import ConnectionError


class Command(BaseCommand):
    help = "Fetches stock data on current stocks listed on the ASX from yfinance"
    ASX_SECURITIES_URL = "https://www.asxlistedcompanies.com/uploads/csv/20200501-asx-listed-companies.csv"
    ASX_200_SECURITIES_URL = (
        "https://www.asx200list.com/uploads/csv/20200601-asx200.csv"
    )
    ASX_SECURITIES_CSV_FILE = "asx_securities.csv"
    ASX_200_SECURITIES_CSV_FILE = "asx_200_securities.csv"

    def add_arguments(self, parser):
        parser.add_argument(
            "--history",
            action="store_true",
            default=False,
            help="Toggle to import all history data as well, otherwise it will just get updated stock info and EOD data.",
        )
        parser.add_argument(
            "--asx200",
            action="store_true",
            default=False,
            help="Only fetch data for ASX 200",
        )

    def handle(self, *args, **options):
        if options["asx200"]:
            sequrities = self.get_asx_200_sequrities()
        else:
            sequrities = self.get_asx_sequrities()

        print(f"{len(sequrities)} to process")
        for index, s in enumerate(sequrities):
            print(f"[{str(datetime.now())}] {index + 1}: {s}")
            yf_stock = yf.Ticker(s + ".AX")
            try:
                tries = 0
                while tries < 5:
                    try:
                        stock = self.update_stock_info(s, yf_stock)
                        if options["history"]:
                            self.update_stock_history(s, stock, yf_stock)
                        else:
                            self.update_stock_eod(s, stock, yf_stock)
                        break
                    except ConnectionError:
                        tries += 1
                        if tries == 5:
                            raise Exception("Failed for 5 retries")
                        print("...retrying")
                        time.sleep(12)
            except Exception as e:
                print(e)
                print(f"ERROR: failed to get stock data for {s}")

    def get_asx_sequrities(self):
        sequrities = []
        headers = {
            "user-agent": "mozilla/5.0 (windows nt 10.0; win64; x64; rv:87.0) gecko/20100101 firefox/87.0"
        }
        r = requests.get(self.ASX_SECURITIES_URL, headers=headers, allow_redirects=True)
        with open(self.ASX_SECURITIES_CSV_FILE, "wb") as f:
            f.write(r.content)
        with open(self.ASX_SECURITIES_CSV_FILE, "r") as f:
            for index, line in enumerate(f.readlines()):
                if index < 2:
                    continue
                sequrities.append(line.split(",")[0])
        return sequrities

    def get_asx_200_sequrities(self):
        sequrities = []
        headers = {
            "user-agent": "mozilla/5.0 (windows nt 10.0; win64; x64; rv:87.0) gecko/20100101 firefox/87.0"
        }
        r = requests.get(
            self.ASX_200_SECURITIES_URL, headers=headers, allow_redirects=True
        )
        with open(self.ASX_200_SECURITIES_CSV_FILE, "wb") as f:
            f.write(r.content)
        with open(self.ASX_200_SECURITIES_CSV_FILE, "r") as f:
            for index, line in enumerate(f.readlines()):
                if index < 2:
                    continue
                sequrities.append(line.split(",")[0])
        return sequrities

    def clean_text(self, text):
        if text == None:
            return None
        return text.encode("ascii", "ignore").decode("ascii")

    def update_stock_info(self, ticker, yf_stock):
        print("...updating stock info")
        info = yf_stock.info
        try:
            stock = Stock.objects.get(ticker=ticker)
        except ObjectDoesNotExist:
            stock = Stock.objects.create(ticker=ticker)
            print("......added new stock")
        stock.name = (
            self.clean_text(info["longName"]) if "longName" in info.keys() else None
        )
        stock.description = (
            self.clean_text(info["longBusinessSummary"])
            if "longBusinessSummary" in info.keys()
            else None
        )
        stock.ticker = ticker
        stock.sector = (
            self.clean_text(info["sector"]) if "sector" in info.keys() else None
        )
        stock.latestPrice = (
            info["regularMarketPrice"]
            if "regularMarketPrice" in info.keys() and info["regularMarketPrice"] != ""
            else None
        )

        stock.predictedNextDayPrice = float(
            [x for x in make_prediction(ticker + ".AX", 1).values()][0]
        )
        stock.save()
        return stock

    def update_stock_eod(self, ticker, stock, yf_stock):
        print("...updating stock EOD")

    def update_stock_history(self, ticker, stock, yf_stock):
        print("...updating_stock_history")
        hist = yf_stock.history(interval="1d", period="max")
        objs = [
            StockData(
                stock=stock,
                date=index,
                open=round(row["Open"], 4) if not pd.isnull(row["Open"]) else None,
                high=round(row["High"], 4) if not pd.isnull(row["High"]) else None,
                low=round(row["Low"], 4) if not pd.isnull(row["Low"]) else None,
                close=round(row["Close"], 4) if not pd.isnull(row["Close"]) else None,
                volume=int(row["Volume"]) if not pd.isnull(row["Volume"]) else None,
            )
            for index, row in hist.iterrows()
        ]
        StockData.objects.bulk_create(objs, ignore_conflicts=True)
        stock.latestPrice = hist.iloc[-1]["Close"]
        stock.save()
