from django.urls import path
from . import views

urlpatterns = [
    path("book/", views.BookListCreate.as_view(), name="get_book" ),
    path("book/delete/<int:pk>/", views.BookDelete.as_view(), name="delete_book")
]