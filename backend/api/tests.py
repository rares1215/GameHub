from django.urls import reverse
from .models import CustomUser,Game,Review
from rest_framework.test import APITestCase
from rest_framework import status


########################### Test Cases for The Games End-Point #######################3

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


################################ Test cases for the Reviews End-Point #############

class ReviewAPIsTest(APITestCase):
    def setUp(self):
        self.admin_user = CustomUser.objects.create_superuser(username='admin', password= 'adminpass')
        self.normal_user = CustomUser.objects.create_user(username='user', password='userpass')
        self.other_user = CustomUser.objects.create_user(username='other', password='otherpass')

        self.game = Game.objects.create(
            title="Test Game",
            description="Desc",
            release_date="2023-01-01",
            genre="Action",
            developer="Dev Studio",
        )

        self.url_list = reverse('game-reviews', kwargs = {'game_id':self.game.id})
        self.url_detail = None

        self.review = Review.objects.create(
            user=self.other_user,
            game=self.game,
            rating=4,
            comments="Good game!"
        )

        self.url_detail = reverse('game-review-detail', 
        kwargs = {'game_id':self.game.id, 'review_id':self.review.id})




    def test_only_authenticated_users_can_access_reviews(self):
        #### Anonym users can't access the reviews list

        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        #### Logged in users can access the review list

        self.client.login(username='user',password='userpass')
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_auth_users_can_leave_only_one_review_per_game(self):

        ### The first one works!
        self.client.login(username='user',password='userpass')
        data = {'rating':5 , 'comments':'Verry good game'}
        response = self.client.post(self.url_list, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        ### The second review shouldn't work ##

        response = self.client.post(self.url_list,data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) 

    def test_auth_user_can_only_edit_their_own_reviews(self):
        #### the normal user can't edit the other user Review #####

        self.client.login(username='user',password='userpass')
        data = {'rating':4}
        response = self.client.patch(self.url_detail,data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        #### The other user can edit his own Review #######

        self.client.login(username='other', password = 'otherpass')
        response = self.client.patch(self.url_detail, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['rating'],data['rating'])


    def test_auth_user_can_only_delete_their_own_reviews(self):
        #### the normal user can't delete the other user Review #####

        self.client.login(username='user',password='userpass')
        response = self.client.delete(self.url_detail)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertTrue(Review.objects.filter(game_id=self.game.id,id=self.review.id).exists())

        #### The other user can delete his own Review #######

        self.client.login(username='other', password = 'otherpass')
        response = self.client.delete(self.url_detail)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Review.objects.filter(game_id=self.game.id,id=self.review.id).exists())

    def test_invalid_rating(self):
        self.client.login(username='other',password='otherpass')
        data = {'rating':10}
        response = self.client.patch(self.url_detail, data)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)



    def tearDown(self):
        Review.objects.all().delete()
        Game.objects.all().delete()
        CustomUser.objects.all().delete()