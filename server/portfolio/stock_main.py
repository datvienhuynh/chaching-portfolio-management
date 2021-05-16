import argparse
from datetime import date, timedelta

import numpy as np
import pandas as pd
import torch
import torch.nn as tnn
import yfinance as yf
from matplotlib import pyplot as plt
from sklearn.preprocessing import MinMaxScaler

import stock_model
from get_price import get_stock_data
from stock_model import create_inout_sequences, network

parser = argparse.ArgumentParser()
parser.add_argument(
    "--train_ratio",
    type=float,
    default=0.8,
    help="proportion of data to split into training set",
)
parser.add_argument("--lr", type=float, default=0.00025, help="learning rate")
parser.add_argument("--epochs", type=int, default=100, help="number of training epochs")
parser.add_argument(
    "--tw",
    type=int,
    default=20,
    help="length of time interval to be used for creating training sequences",
)
parser.add_argument(
    "--save", type=bool, default=False, help="whether to save the trained model"
)
parser.add_argument(
    "--plot_loss", type=bool, default=False, help="whether to plot train/val loss"
)
parser.add_argument(
    "--plot_val",
    type=bool,
    default=False,
    help="whether to plot predicted result on validation data",
)
args = parser.parse_args()


# parameters
train = args.train_ratio  # proportion to split training data
val = 1 - train
train_window = args.tw  # the number of previous days to look at when training
save = args.save  # whether to save the model locally after training
epoch_num = args.epochs  # number of epochs to be trained
learning_rate = args.lr

plot_loss = args.plot_loss
plot_validation = args.plot_val


def main():

    device = "cpu"  # Using LSTM now, no need to use GPU
    print("Using device: {}" "\n".format(str(device)))

    try:
        data = pd.read_csv("stock_prices.csv")
    except:
        get_stock_data("^AXJO", "2000-01-01", "2021-04-01")
        data = pd.read_csv("stock_prices.csv")

    data = data.dropna()

    # split into train and validation sets
    training_set = data.iloc[: int(len(data) * train), 4:5].values
    val_set = data.iloc[int(len(data) * train) :, 4:5].values

    # normalise the data to be in (0, 1)
    sc = MinMaxScaler(feature_range=(0, 1))
    training_set = sc.fit_transform(training_set)
    val_set = sc.fit_transform(val_set)

    # convert to tensors and then sequences of training windows
    training_set = torch.FloatTensor(training_set).view(-1)
    val_set = torch.FloatTensor(val_set).view(-1)
    train_inout_seq = create_inout_sequences(training_set, train_window)
    val_inout_seq = create_inout_sequences(val_set, train_window)

    net = stock_model.net.to(device)
    loss_function = stock_model.loss_function
    optimiser = torch.optim.Adam(net.parameters(), lr=learning_rate)

    train_loss_list = []
    val_loss_list = []
    for epoch in range(epoch_num):
        running_loss = 0

        # train
        for seq, labels in train_inout_seq:

            # set gradients to zero
            optimiser.zero_grad()

            # forward pass through network
            y_pred = net(seq)
            loss = loss_function(y_pred, labels)

            # calculate gradients
            loss.backward()

            # minimise the loss according to the gradient
            optimiser.step()

            running_loss += loss.item()

        # calculate loss on validation set
        with torch.no_grad():
            val_loss = 0
            for seq, labels in val_inout_seq:
                loss = loss_function(net(seq), labels)
                val_loss += loss.item()

        # keep track of training and validation losses
        train_loss_list.append(running_loss / len(train_inout_seq))
        val_loss_list.append(val_loss / len(val_inout_seq))

        print(
            f"Epoch: {epoch}, total training loss: {running_loss}, training loss: {running_loss / len(train_inout_seq)}, validation loss: {val_loss / len(val_inout_seq)}"
        )

    net.eval()

    # plot train vs validation loss
    if plot_loss:
        plt.plot(
            range(len(train_loss_list)),
            train_loss_list,
            color="red",
            label="training loss",
        )
        plt.plot(
            range(len(train_loss_list)),
            val_loss_list,
            color="blue",
            label="validation loss",
        )
        plt.title("training vs validation loss")
        plt.xlabel("epoch")
        plt.ylabel("loss")
        plt.legend()
        plt.show()

    # Save model.
    if save:
        torch.save(net.state_dict(), "savedModel.pth")
        print("\n" "Model saved to savedModel.pth")

    if plot_validation:
        # make predictions on the validation set
        predictions = []
        for i in range(len(val_set) - train_window):
            seq = torch.FloatTensor(val_set[i : i + train_window])
            with torch.no_grad():
                predictions.append(net(seq).item())
        predictions = sc.inverse_transform((np.array(predictions).reshape(-1, 1)))

        # plot result of predictions on validation set
        plt.plot(
            data.loc[int(len(data) * train) :, "Date"],
            data.iloc[int(len(data) * train) :, 4:5].values,
            color="red",
            label="Real Price",
        )
        plt.plot(
            data.loc[int(len(data) * train) + train_window :, "Date"],
            predictions,
            color="blue",
            label="Predicted Price",
        )
        plt.title("ASX index prediction")
        plt.xlabel("Time")
        plt.ylabel("ASX index")
        plt.legend()
        plt.show()


if __name__ == "__main__":
    main()  # train
