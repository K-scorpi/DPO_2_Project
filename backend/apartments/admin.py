from django.contrib import admin
from .models import Apartment, Booking, Review

@admin.register(Apartment)
class ApartmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'host', 'location', 'price', 'created_at')
    list_filter = ('host', 'location')
    search_fields = ('title', 'description', 'location')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('apartment', 'guest', 'start_date', 'end_date', 'guests', 'status')
    list_filter = ('status', 'start_date', 'end_date')
    search_fields = ('apartment__title', 'guest__email')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('apartment', 'guest', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('apartment__title', 'guest__email', 'comment')
