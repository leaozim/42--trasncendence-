from .models import User
from django.http import Http404
import os
import requests

"""
find all

find one

update

delete one

computeVictory

computeLoss

computeExperience
"""

def find_one(id):
    try:
        return User.objects.get(id=id)
    except User.DoesNotExist:
        raise Http404(f"User with ID {id} does not exist.")

def find_all():
    return User.objects.all()

def update(user_id, new_user):
    try:
        user = User.objects.get(id=user_id)
        user = new_user
        user.save()
    except User.DoesNotExist:
        raise Http404("User does not exist")

def delete_one(id):
    try:
        user = User.objects.get(id=id)
        user.delete()
    except User.DoesNotExist:
        raise Http404(f"User with ID {id} does not exist.")

def compute_victory(user_id):
    try:
        user = User.objects.get(id=user_id)
        user.wins += 1
        user.save()
        print (user)
        return user
    except User.DoesNotExist:
        raise Http404(f"User with ID {user_id} does not exist.")

def compute_loss(user_id):
    try:
        user = User.objects.get(id=user_id)
        user.loss += 1
        user.save()
        return user
    except User.DoesNotExist:
        raise Http404(f"User with ID {id} does not exist.")

def compute_experience(user_id, exp):
    try:
        user = User.objects.get(id=user_id)
        user.expGame += exp
        user.save()
        return user
    except User.DoesNotExist:
        raise Http404(f"User with ID {user_id} does not exist.")

def exchange_code(code: str):
    data = {
        "client_id": os.environ.get('CLIENT_ID'),
        "client_secret": os.environ.get('CLIENT_SECRET'),
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": os.environ.get('REDIRECT_URI'),
        "scope": "identify"
    }
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    response = requests.post("https://api.intra.42.fr/oauth/token", data=data, headers=headers)
    credentials = response.json()
    access_token = credentials['access_token']
    response = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': 'Bearer %s' % access_token})
    user = response.json()
    return user