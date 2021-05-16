import time
import yfinance as yf


def get_stock_data(ticker, start_date, end_date):
    i = 1
    try:
        stock_data = yf.download(tickers=ticker, start=start_date, end=end_date)
    except ValueError:
        print("ValueError, trying again")
        i += 1
        if i < 5:
            time.sleep(10)
            get_stock_data(ticker, start_date, end_date)
        else:
            print("Tried 5 times, Yahoo error. Trying after 2 minutes")
            time.sleep(120)
            get_stock_data(ticker, start_date, end_date)
    stock_data.to_csv("stock_prices.csv")


if __name__ == "__main__":
    get_stock_data("^AXJO", "2000-01-01", "2021-04-01")
