from django.contrib import admin

from forum.models import *


class VerboseAdmin(admin.ModelAdmin):
    def get_readonly_fields(self, request, obj=None):
        return ["nLikes", "nDislikes"]


admin.site.register(Forum)
admin.site.register(Post, VerboseAdmin)
admin.site.register(Comment, VerboseAdmin)
admin.site.register(AttitudeToPost)
admin.site.register(AttitudeToComment)
