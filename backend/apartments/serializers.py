from rest_framework import serializers
from .models import Apartment, ApartmentImage, Booking, Review
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class ApartmentImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApartmentImage
        fields = ['id', 'image', 'is_main']

class ApartmentSerializer(serializers.ModelSerializer):
    images = ApartmentImageSerializer(many=True, read_only=True)
    class Meta:
        model = Apartment
        fields = ['id', 'title', 'description', 'price', 'location', 'host', 
                 'created_at', 'updated_at', 'images']
        read_only_fields = ['host', 'created_at', 'updated_at']

class BookingSerializer(serializers.ModelSerializer):
    apartment = ApartmentSerializer(read_only=True)
    apartment_id = serializers.PrimaryKeyRelatedField(queryset=Apartment.objects.all(), source='apartment', write_only=True)
    class Meta:
        model = Booking
        fields = ['id', 'apartment', 'apartment_id', 'guest', 'start_date', 'end_date', 'guests', 'status', 'created_at', 'updated_at']
        read_only_fields = ['guest', 'created_at', 'updated_at']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'apartment', 'guest', 'rating', 'comment', 'created_at', 'updated_at']
        read_only_fields = ['apartment', 'guest', 'created_at', 'updated_at'] 