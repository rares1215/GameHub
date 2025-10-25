from django.urls import reverse
from .models import CustomUser,Game
from rest_framework.test import APITestCase
from rest_framework import status


class GameAPITestCase(APITestCase):
    def setUp(self):
        self.admin_user = CustomUser.objects.create_superuser(username='admin', password= 'adminpass')
        self.normal_user = CustomUser.objects.create_user(username='user', password='userpass')
        self.game = Game.objects.create(
            title = "Game Testing",
            description = 'Test Description',
            release_date = '2020-11-18',
            genre = 'Test Genre',
            developer = 'Test Dev'
        )
        self.url_list = reverse('games-list')
        self.url_detail = reverse('games-detail', kwargs={'pk':self.game.id})


    def test_restrict_access_for_unauthenticated_users(self):
        ##### users who are not logged in cannot access the games-list end-point

        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_games_for_authenticated_users(self):
        ###### Authenticated users can see the list of games

        self.client.login(username='user', password='userpass')
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code,status.HTTP_200_OK)


    def test_get_game_detail_for_authenticated_user(self):
        ######## anonym users can't acces the game-detail#####

        response = self.client.get(self.url_detail)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        ###### logged in users can acces game detail ####

        self.client.login(username='user', password='userpass')
        response = self.client.get(self.url_detail)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.game.title)


    def test_only_admin_can_create_game(self):

        ###### normal users can t create games ######

        self.client.login(username='user', password='userpass')
        data = {
        'title': 'New Game',
        'description': 'New Desc',
        'release_date': '2024-01-01',
        'genre': 'Action',
        'developer': 'Dev Test'
        }
        response = self.client.post(self.url_list, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        ####### Admin users can create games ##########

        self.client.login(username='admin', password='adminpass')
        response = self.client.post(self.url_list, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_only_admins_can_delete_game(self):
        #### normal users can't delete a game ########

        self.client.login(username='user', password='userpass')
        response = self.client.delete(self.url_detail)
        self.assertEqual(response.status_code,status.HTTP_403_FORBIDDEN)
        self.assertTrue(Game.objects.filter(id=self.game.id).exists())

        ##### Admin users can delete game ######### 

        self.client.login(username='admin', password='adminpass')
        response = self.client.delete(self.url_detail)
        self.assertEqual(response.status_code,status.HTTP_204_NO_CONTENT)
        self.assertFalse(Game.objects.filter(id=self.game.id).exists())

    def test_only_admins_can_edit_game(self):
        ########### normal users can't edit a game ##### 

        self.client.login(username='user', password='userpass')
        data = {'title':'Game Testing Updated'}
        response = self.client.put(self.url_detail,data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        ######## admin users can edit a game #########

        self.client.login(username='admin', password='adminpass')
        response = self.client.patch(self.url_detail, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(data['title'], response.data['title'])

    def tearDown(self):
        Game.objects.all().delete()
        CustomUser.objects.all().delete()