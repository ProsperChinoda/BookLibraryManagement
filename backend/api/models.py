from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

# Create your models here.
class Member(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, unique=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=(('Active', 'Active'), ('Inactive', 'Inactive')), default='Active')
    is_active = models.BooleanField(default=True)

    def delete(self, using=None, keep_parents=False):
        if Loan.objects.filter(member=self, returned_date__isnull=True).exists() or Fine.objects.filter(
                loan__member=self, paid=False).exists():
            raise ValueError("Cannot deactivate member with active loans or unpaid fines.")
        self.is_active = False
        self.save()

class Book(models.Model):
    isbn = models.CharField(max_length=11, unique=True)
    title = models.CharField(max_length=100)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    publisher = models.CharField(max_length=100)
    pub_year = models.IntegerField()
    genre = models.CharField(max_length=100)

    def delete(self, using=None, keep_parents=False):
        if BookCopy.objects.filter(book=self).exists():
            raise ValueError("Cannot delete book with existing copies.")
        super().delete(using, keep_parents)


class BookCopy(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    copy_id = models.CharField(max_length=11, unique=True)
    status = models.CharField(max_length=20, choices=(('Available', 'Available'), ('Lost', 'Lost'), ('Borrowed', 'Borrowed')) )

class Loan(models.Model):
    book_copy = models.ForeignKey(BookCopy, on_delete=models.CASCADE)
    member = models.ForeignKey(Member, on_delete=models.CASCADE)
    checkout_date = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField()
    returned_date = models.DateField(null=True, blank=True)

    def is_overdue(self):
        return self.returned_date is None and timezone.now() > self.due_date

class Fine(models.Model):
    loan = models.ForeignKey(Loan, on_delete=models.CASCADE)
    amount = models.DecimalField(decimal_places=2, max_digits=10)
    due_date = models.DateField(null=True, blank=True)
    paid = models.BooleanField(default=False)
    status = models.CharField(max_length=10, choices=(('Paid', 'Paid'), ('Unpaid', 'Unpaid')), default='Unpaid' )
    
