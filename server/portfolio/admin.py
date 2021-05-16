from django.contrib import admin
from django.contrib.admin.models import LogEntry

from portfolio.models import Market, Stock, Portfolio, Holding, Transaction, StockData


class PortfolioAdmin(admin.ModelAdmin):
    readonly_fields = ("createdBy", "updatedBy")

    def save_model(self, request, obj, form, change):
        """ Include logging information """
        if not obj.createdBy:
            obj.createdBy = request.user
        obj.updatedBy = request.user
        obj.save()


class HoldingAdmin(admin.ModelAdmin):
    readonly_fields = ("quantity",)


class TransactionAdmin(admin.ModelAdmin):
    readonly_fields = ("price", "cost", "createdBy")

    def save_model(self, request, obj, form, change):
        """ Include logging information """
        if not obj.createdBy:
            obj.createdBy = request.user
        obj.save()


class StockAdmin(admin.ModelAdmin):
    search_fields = ("name", "ticker")


class StockDataAdmin(admin.ModelAdmin):
    search_fields = ("stock__ticker", "stock__name", "date")


admin.site.register(Market)
admin.site.register(Stock, StockAdmin)
admin.site.register(Portfolio, PortfolioAdmin)
admin.site.register(Holding, HoldingAdmin)
admin.site.register(Transaction, TransactionAdmin)
admin.site.register(StockData, StockDataAdmin)

admin.site.register(LogEntry)
