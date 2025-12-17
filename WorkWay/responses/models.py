from django.db import models
from django.conf import settings
from employer.models import Vacancy
class Otklik(models.Model):

    applicant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='otkliks',
        verbose_name="Соискатель"
    )


    vacancy = models.ForeignKey(
        'employer.Vacancy',   # если модель Vacancy в приложении vacancies
        on_delete=models.CASCADE,
        related_name='otkliks',
        verbose_name="Вакансия"
    )


    employer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_otkliks',
        verbose_name="Работодатель"
    )


    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата отклика")

    class Meta:
        verbose_name = "Отклик"
        verbose_name_plural = "Отклики"
        unique_together = ['applicant', 'vacancy']  # один соискатель не может откликнуться дважды

    def __str__(self):
        return f"{self.applicant.email} → {self.vacancy.title} ({self.employer.company_name or self.employer.email})"
