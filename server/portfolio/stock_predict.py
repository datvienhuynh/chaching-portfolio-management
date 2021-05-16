from datetime import timedelta

import numpy as np
import torch
import yfinance as yf
from sklearn.preprocessing import MinMaxScaler

from portfolio.stock_model import network, train_window

holidays = [
    "2021-04-02",
    "2021-04-05",
    "2021-04-25",
    "2021-06-14",
    "2021-12-27",
    "2021-12-28",
]


def next_trading_day(today):
    tomorrow = today + timedelta(days=1)
    if tomorrow.weekday() < 5 and tomorrow.strftime("%Y-%m-%d") not in holidays:
        return tomorrow
    else:
        return next_trading_day(tomorrow)


def get_sc_range(r):
    """
    return a range for scaling based on the input
    input: scaled value of the latest price, should be in [0, 1]
    """
    if r > 0.95:
        r = 1
    elif r < 0.05:
        r = 0
    m = -r + 1.2
    return max(m - 0.5, 0), min(m + 0.5, 1)


def make_prediction(ticker, days):

    # load the trained model
    model = network()
    model.load_state_dict(torch.load("portfolio/savedModel.pth"))
    model.eval()

    # normalise the data before making predictions
    stock_data = yf.Ticker(ticker).history(
        start="2000-01-01", end="2021-12-31", interval="1d"
    )
    price = stock_data["Close"]
    today = price.index[-1].date()

    sc_range = get_sc_range(
        (np.array(price)[-1] - np.amin(price)) / (np.amax(price) - np.amin(price))
    )

    sc = MinMaxScaler(feature_range=sc_range)
    price = sc.fit_transform(np.array(price).reshape(-1, 1))

    predictions = torch.empty(days, 1)
    result = {}
    for i in range(days):
        if i == 0:
            seq = torch.FloatTensor(price[i - train_window :])
        else:
            seq = torch.cat(
                (
                    torch.FloatTensor(price[i - train_window :]),
                    torch.FloatTensor(predictions[: i - days]),
                ),
                0,
            )
        with torch.no_grad():
            predictions[i] = model(seq).item()
            today = next_trading_day(today)
            result[today.strftime("%Y-%m-%d")] = sc.inverse_transform(
                np.array(predictions[i]).reshape(-1, 1)
            )

    return result


if __name__ == "__main__":
    pass
