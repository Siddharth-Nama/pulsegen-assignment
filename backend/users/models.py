from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('viewer', 'Viewer'),
        ('editor', 'Editor'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='viewer')
    email = models.EmailField(unique=True)

    # Make email required and unique
    REQUIRED_FIELDS = ['email', 'role']
    # USERNAME_FIELD defaults to 'username'

    def __str__(self):
        return self.username
