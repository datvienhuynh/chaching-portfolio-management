import torch
import torch.nn as tnn
import torch.nn.functional as F
import torch.optim as toptim

# parameters
direction = 1  # whether to use a bi-directional LSTM
layer = 2  # number of layers of LSTM network
drop = 0.22  # dropout rate to avoid overfitting
hid = 100  # number of hidden nodes in LSTM
total_nets = 1  # number of nets to be used in ensemble
train_window = 20  # the number of previous days to look at when training


# uses ensemble of a number of LSTM networks, each with a dropout rate to avoid overfitting.
# The average result of these LSTM networks are taken and then passed to a linear layer.
class network(tnn.Module):
    def __init__(self, input_size=1, hidden_layer_size=hid, output_size=1):

        super().__init__()
        nets = []
        for i in range(total_nets):
            nets.append(
                tnn.LSTM(
                    input_size=input_size,
                    hidden_size=hid,
                    bidirectional=bool(direction),
                    dropout=drop,
                    num_layers=layer,
                )
            )

        self.nets = tnn.ModuleList(nets)
        self.linear = tnn.Linear(hidden_layer_size * (direction + 1), output_size)

    def forward(self, input):
        store = []
        for net in self.nets:
            output, self.hidden_cell = net(input.view(len(input), 1, -1))
            store.append(output)

        average = torch.stack(store, dim=-1)
        predictions = torch.mean(average, dim=3)

        predictions = self.linear(predictions.view(len(input), -1))

        return predictions[-1]


# simple mean squared error loss
class loss(tnn.Module):
    def __init__(self):
        super(loss, self).__init__()
        self.mse_loss = tnn.MSELoss()

    def forward(self, output, target):
        loss = self.mse_loss(output, target)
        return loss


# create list of training windows for the lstm network
def create_inout_sequences(input_data, tw):
    inout_seq = []
    for i in range(len(input_data) - tw):
        train_seq = input_data[i : i + tw]
        train_label = input_data[i + tw : i + tw + 1]
        inout_seq.append((train_seq, train_label))
    return inout_seq


# training options
net = network()
loss_function = loss()
