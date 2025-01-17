# Third party
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("accounts/", include("django.contrib.auth.urls")),
    path("admin/", admin.site.urls),
    path("", include(("srcs_user.urls", "srcs_user"))),
    path("", include(("srcs_auth.urls", "srcs_auth"))),
    path("", include("srcs_home.urls", "srcs_home")),
    path("i18n/", include("django.conf.urls.i18n")),
    path("chat/", include("srcs_chat.urls")),
    path('game/', include('srcs_game.urls')),
    path('', include(('srcs_tournament.urls', 'srcs_tournament')))
]
