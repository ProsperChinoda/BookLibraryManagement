from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Member, Book, BookCopy, Loan, Fine

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ["id", "name", "email", "phone", "status"]
        extra_kwargs = {"date_joined": {"read_only": True}, "is_active": {"read_only": True}}

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["id", "isbn", "title",  "publisher", "pub_year", "genre"]
        extra_kwargs = {"author": {"read_only": True}}

class BookCopySerializer(serializers.ModelSerializer):
    class Meta:
        model = BookCopy
        fields = ["id", "copy_id", "status"]
        extra_kwargs = {"book": {"read_only": True}}

class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = ["id", "due_date", "returned_date"]
        extra_kwargs = {"book_copy": {"read_only": True}, "member": {"read_only": True}, "checkout_date": {"read_only": True}}

class FineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fine
        fields = ["id", "amount", "due_date", "paid","status"]
        extra_kwargs = {"loan": {"read_only": True}}

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user