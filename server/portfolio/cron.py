from .models import EmailSubscription
from system.utils import sendEmail


def sendStockPriceChangedEmailNotification():
    subscriptions = EmailSubscription.objects.all()
    unique_stock_id = []
    stock_id_with_email = []

    # loop over subscriptions
    for i in subscriptions:
        try:
            # check if we already have this stock in stock_id_with_email, if yes then this will throw an error
            unique_stock_id.index(i.stock.id)
            # loop over stock_id_with_email and find the stock in stock_id_with_email
            for index, value in enumerate(stock_id_with_email):
                # if id is equal in both i and value
                if value["id"] == i.stock.id:
                    stock_id_with_email[index]["email"].append(i.user.username)
        except Exception as e:
            print(e)
            unique_stock_id.append(i.stock.id)
            stock_id_with_email.append(
                {
                    "id": i.stock.id,
                    "name": i.stock.name,
                    "price": i.stock.latestPrice,
                    "email": [i.user.username],
                }
            )

    for stockWithUser in stock_id_with_email:
        subject = "Stock \t" + stockWithUser["name"] + "\tvalue changed"
        content = "Latest Price\t" + str(stockWithUser["price"])
        sendEmail(subject, content, stockWithUser["email"])
