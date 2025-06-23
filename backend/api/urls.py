from django.urls import path
from . import views

urlpatterns = [
    path("book/", views.BookListCreate.as_view(), name="get_book" ),
    path("book/<int:pk>/", views.BookUpdate.as_view(), name="update_book" ),
    path("book/delete/<int:pk>/", views.BookDelete.as_view(), name="delete_book"),
    path("member/", views.MemberListCreate.as_view(), name="get_member"),
    path("member/<int:pk>/", views.MemberDetail.as_view(), name="rud_member"),
     path('checkout/', views.CheckoutView.as_view(), name='checkout'),
    path('fines/', views.FineCalculationView.as_view(), name='fine-calculation'),
    path('active_loans/', views.ActiveLoansView.as_view(), name='active-loans'),
    path('members/<int:pk>/history/', views.MemberHistoryView.as_view(), name='member-history'),
    path('bookcopies/', views.BookCopyListView.as_view(), name='book-copy-list'),
]