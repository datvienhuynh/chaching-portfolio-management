from django.contrib import admin

from competition.models import (
    Competition,
    CompetitionPortfolio,
    CompetitionPortfolioHolding,
)


class CompetitionPortfolioAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        """ Include logging of createdBy """
        if not obj.createdBy:
            obj.createdBy = request.user
        obj.save()


admin.site.register(Competition)
admin.site.register(CompetitionPortfolio, CompetitionPortfolioAdmin)
admin.site.register(CompetitionPortfolioHolding)
