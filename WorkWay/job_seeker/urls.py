from django.contrib import admin
from django.urls import path, include
from job_seeker.views import JobSeekerView

urlpatterns = [
    path("job_seeker/", JobSeekerView.as_view(), name="job_seeker"),
    path("admin/", admin.site.urls),

]
