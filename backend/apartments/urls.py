from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from profiles import urls as profiles_urls
from rest_framework.routers import DefaultRouter
from .views import ApartmentViewSet, BookingViewSet, ReviewViewSet, ApartmentReviewListCreate, ApartmentBusyDatesView
from auth_app.views import CustomTokenObtainPairView

router = DefaultRouter()
router.register(r'apartments', ApartmentViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', include('profiles.urls')),
    path('apartments/<int:apartment_id>/reviews/', ApartmentReviewListCreate.as_view(), name='apartment-reviews'),
    path('apartments/<int:apartment_id>/busy_dates/', ApartmentBusyDatesView.as_view(), name='apartment-busy-dates'),
    path('', include(router.urls)),
] 