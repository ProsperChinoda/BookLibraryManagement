from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import UserSerializer, MemberSerializer, BookSerializer, BookCopySerializer, LoanSerializer, FineSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Member, Book, BookCopy, Loan, Fine
from django.utils import timezone
from datetime import timedelta

# Create your views here.
class CheckoutView(generics.CreateAPIView):
    serializer_class = LoanSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        book_copy = BookCopy.objects.get(id=self.request.data['book_copy_id'])
        member = Member.objects.get(id=self.request.data['member_id'])

        due_date = timezone.now().date() + timedelta(days=14) 

        loan = Loan.objects.create(book_copy=book_copy, member=member, due_date=due_date)
        book_copy.status = 'Borrowed'
        book_copy.save()

        return Response({"loan_id": loan.id}, status=status.HTTP_201_CREATED)
    
class FineCalculationView(generics.ListAPIView):
    serializer_class = FineSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        overdue_loans = Loan.objects.filter(returned_date__isnull=True, due_date__lt=timezone.now())
        fines = []
        for loan in overdue_loans:
            days_overdue = (timezone.now().date() - loan.due_date).days
            fine_amount = days_overdue * 1.00 
            fines.append({"loan_id": loan.id, "fine_amount": fine_amount})
        return fines

class ActiveLoansView(generics.ListAPIView):
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Loan.objects.filter(returned_date__isnull=True)

class MemberHistoryView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoanSerializer

    def get_queryset(self):
        member_id = self.kwargs['pk']
        return Loan.objects.filter(member_id=member_id)

class BookCopyListView(generics.ListAPIView):
    serializer_class = BookCopySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return BookCopy.objects.all()
        
class MemberListCreate(generics.ListCreateAPIView):
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Member.objects.all()

class MemberDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Member.objects.all()

    def perform_destroy(self, instance):
        instance.delete() 


class BookListCreate(generics.ListCreateAPIView):
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Book.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class BookDelete(generics.DestroyAPIView):
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Book.objects.filter(author=user)

class BookUpdate(generics.UpdateAPIView):
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Book.objects.filter(author=user)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]