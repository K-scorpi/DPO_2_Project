from django.shortcuts import render
from rest_framework import viewsets, permissions, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Apartment, ApartmentImage, Booking, Review
from .serializers import (
    ApartmentSerializer, BookingSerializer, ReviewSerializer,
    ApartmentImageSerializer
)
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

# Create your views here.

class ApartmentViewSet(viewsets.ModelViewSet):
    queryset = Apartment.objects.all().order_by('-created_at')
    serializer_class = ApartmentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        apartment = serializer.save(host=self.request.user)
        images = self.request.FILES.getlist('images')
        main_image_index = self.request.data.get('main_image_index')
        try:
            main_image_index = int(main_image_index)
        except (TypeError, ValueError):
            main_image_index = 0
        for idx, img in enumerate(images):
            ApartmentImage.objects.create(
                apartment=apartment,
                image=img,
                is_main=(idx == main_image_index)
            )

    @action(detail=True, methods=['post'])
    def book(self, request, pk=None):
        apartment = self.get_object()
        check_in = request.data.get('check_in')
        check_out = request.data.get('check_out')

        if not check_in or not check_out:
            return Response(
                {'error': 'Check-in and check-out dates are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if dates are valid
        try:
            check_in = timezone.datetime.strptime(check_in, '%Y-%m-%d').date()
            check_out = timezone.datetime.strptime(check_out, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if check_in >= check_out:
            return Response(
                {'error': 'Check-out date must be after check-in date'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if apartment is available for these dates
        overlapping_bookings = Booking.objects.filter(
            apartment=apartment,
            status='confirmed',
            start_date__lt=check_out,
            end_date__gt=check_in
        )
        if overlapping_bookings.exists():
            return Response(
                {'error': 'Apartment is not available for these dates'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate total price
        nights = (check_out - check_in).days
        total_price = apartment.price_per_night * nights

        booking = Booking.objects.create(
            apartment=apartment,
            guest=request.user,
            start_date=check_in,
            end_date=check_out,
            total_price=total_price
        )

        serializer = BookingSerializer(booking)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by('-created_at')
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(guest=self.request.user)

    def perform_create(self, serializer):
        serializer.save(guest=self.request.user, status='confirmed')

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status == 'confirmed':
            booking.status = 'cancelled'
            booking.save()
            return Response({'status': 'Booking cancelled'})
        return Response(
            {'error': 'Only confirmed bookings can be cancelled'},
            status=status.HTTP_400_BAD_REQUEST
        )

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Review.objects.filter(apartment__host=self.request.user)

    def perform_create(self, serializer):
        serializer.save(guest=self.request.user)

class ApartmentReviewListCreate(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        apartment_id = self.kwargs['apartment_id']
        return Review.objects.filter(apartment_id=apartment_id).order_by('-created_at')

    def perform_create(self, serializer):
        apartment_id = self.kwargs['apartment_id']
        serializer.save(guest=self.request.user, apartment_id=apartment_id)

class ApartmentBusyDatesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, apartment_id):
        bookings = Booking.objects.filter(apartment_id=apartment_id, status='confirmed')
        busy_dates = set()
        for booking in bookings:
            current = booking.start_date
            while current <= booking.end_date:
                busy_dates.add(current.isoformat())
                current += timedelta(days=1)
        return Response({'busy_dates': sorted(list(busy_dates))})
