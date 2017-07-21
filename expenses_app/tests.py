from django.contrib.auth.models import User, Group
from django.utils.six import BytesIO
from expenses_app.models import Expenses
from expenses_app.serializers import ExpensesSerializer

from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser


class ExpensesTestCase(APITestCase):
    exp = '/expenses/'
    exp_item = '/expenses/{}/'

    def setUp(self):
        Group.objects.create(name='Manager')
        Group.objects.create(name='Native User')
        Group.objects.create(name='Admin')
        self.native_user = User.objects.create_user(username='native_user_expenses',
                                                    email='lsdgkdgf@gmail.com',
                                                    password='fdlkg234')
        self.native_user.groups.add(Group.objects.get(name='Native User'))

        self.manager_user = User.objects.create_user(username='manager_user_expenses',
                                                     email='lsdgfdg@gmail.com',
                                                     password='rtyew14t')
        self.manager_user.groups.add(Group.objects.get(name='Manager'))

        self.admin_user = User.objects.create_superuser(username='admin_user_expenses',
                                                        email='idsafd@gmail.com',
                                                        password='ras21dgl4')
        self.admin_user.groups.add(Group.objects.get(name='Admin'))

        self.other_native_user = User.objects.create_user(username='native_user_expenses_2',
                                                          email='lsdgkfgrtrtrtewdgf@gmail.com',
                                                          password='fdlkg234')
        self.other_native_user.groups.add(Group.objects.get(name='Native User'))

    def test_native_user_expenses_permission_retrieve(self):
        self.client.force_login(self.native_user)
        Expenses.objects.create(owner=self.native_user, text="Spent for knowledge", cost=22.40)

        serializer_expenses = ExpensesSerializer(self.native_user.expenses.all(), many=True).data
        serializer_json = JSONParser().parse(BytesIO(JSONRenderer().render(serializer_expenses)))

        response = self.client.get(self.exp)

        self.assertEqual(response.json(), serializer_json)

    def test_admin_expenses_permission_retrieve(self):
        self.client.force_login(self.admin_user)
        Expenses.objects.create(owner=self.admin_user, text="Spent for something", cost=43)

        serializer_expenses = ExpensesSerializer(self.admin_user.expenses.all(), many=True).data
        serializer_json = JSONParser().parse(BytesIO(JSONRenderer().render(serializer_expenses)))

        response = self.client.get(self.exp)

        self.assertEqual(response.json(), serializer_json)

    def test_manager_expenses_permission_retrieve(self):
        self.client.force_login(self.manager_user)
        self.assertEqual(self.client.get(self.exp).status_code, status.HTTP_403_FORBIDDEN)

    def test_manager_expenses_permission_create(self):
        self.client.force_login(self.manager_user)
        action = self.client.post(self.exp, {"cost": "23", "text": "fgdgdfgdfgd"})
        self.assertEqual(action.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_expenses_permission_create(self):
        self.client.force_login(self.admin_user)
        action = self.client.post(self.exp, {"cost": "23", "text": "fgdgdfgdfgd", "owner": self.admin_user.id})
        self.assertEqual(action.status_code, status.HTTP_201_CREATED)

    def test_native_user_expenses_permission_create(self):
        self.client.force_login(self.native_user)
        action = self.client.post(self.exp, {"cost": "23", "text": "fgdgdfgdfgd", "owner": self.native_user.id})
        self.assertEqual(action.status_code, status.HTTP_201_CREATED)

    def test_admin_native_users_expenses_permission_invalid_data_create(self):
        for i in [self.admin_user, self.native_user]:
            self.client.force_login(i)
            action = self.client.post(self.exp, {"cost": "fgdlkgdfd", "text": "sgdfgdfg"})
            self.assertEqual(action.status_code, status.HTTP_400_BAD_REQUEST)

    def test_permission_to_create_for_manager(self):
        self.client.force_login(self.admin_user)
        action = self.client.post(self.exp, {"cost": "14.11", "text": "qwe", "owner": self.manager_user.id})
        self.assertEqual(action.status_code, status.HTTP_406_NOT_ACCEPTABLE)

    def test_admin_permission_to_create_expenses_for_others(self):
        self.client.force_login(self.admin_user)
        action = self.client.post(self.exp, {"cost": "14.11", "text": "qwe", "owner": self.native_user.id})
        self.assertEqual(action.status_code, status.HTTP_201_CREATED)

    def test_attempt_to_create_expenses_for_others_by_native_user(self):
        self.client.force_login(self.native_user)
        action = self.client.post(self.exp, {"cost": "14.11", "text": "qwe", "owner": self.other_native_user.id})
        self.assertEqual(action.status_code, status.HTTP_403_FORBIDDEN)

    def test_attempt_to_update_expenses_for_others_by_admin(self):
        self.client.force_login(self.admin_user)
        action1 = self.client.post(self.exp,
                                   {"cost": "14.11", "text": "qwe", "owner": self.other_native_user.id}).json()
        action2 = self.client.patch(self.exp_item.format(action1['id']), {"cost": "12.22", "text": "new text!"},
                                    format='json')
        self.assertEqual(action2.status_code, status.HTTP_200_OK)

    def test_attempt_to_update_expenses_for_others_by_native_user(self):
        self.client.force_login(self.admin_user)
        action1 = self.client.post(self.exp,
                                   {"cost": "14.11", "text": "qwe", "owner": self.other_native_user.id}).json()
        self.client.force_login(self.native_user)
        action2 = self.client.patch(self.exp_item.format(action1['id']), {"cost": "12.22", "text": "new text!"},
                                    format='json')
        self.assertEqual(action2.status_code, status.HTTP_404_NOT_FOUND)

    def test_remove_expenses_by_native_users_his_own_records(self):
        self.client.force_login(self.admin_user)
        action1 = self.client.post(self.exp,
                                   {"cost": "14.11", "text": "qwe", "owner": self.other_native_user.id}).json()
        self.client.force_login(self.other_native_user)
        action2 = self.client.delete(self.exp_item.format(action1['id']))
        self.assertEqual(action2.status_code, status.HTTP_204_NO_CONTENT)

    def test_remove_expenses_by_admin_user_for_others(self):
        self.client.force_login(self.admin_user)
        action1 = self.client.post(self.exp,
                                   {"cost": "14.11", "text": "qwe", "owner": self.other_native_user.id}).json()
        action2 = self.client.delete(self.exp_item.format(action1['id']))
        self.assertEqual(action2.status_code, status.HTTP_204_NO_CONTENT)


class UserTestCase(APITestCase):
    users = '/users/'
    users_item = '/users/{}/'

    def setUp(self):
        Group.objects.create(name='Manager')
        Group.objects.create(name='Native User')
        Group.objects.create(name='Admin')
        self.native_user = User.objects.create_user(username='native_user_expenses',
                                                    email='lsdgkdgf@gmail.com',
                                                    password='fdlkg234')
        self.native_user.groups.add(Group.objects.get(name='Native User'))

        self.manager_user = User.objects.create_user(username='manager_user_expenses',
                                                     email='lsdgfdg@gmail.com',
                                                     password='rtyew14t')
        self.manager_user.groups.add(Group.objects.get(name='Manager'))

        self.admin_user = User.objects.create_superuser(username='admin_user_expenses',
                                                        email='idsafd@gmail.com',
                                                        password='ras21dgl4')
        self.admin_user.groups.add(Group.objects.get(name='Admin'))

    def test_user_creating_by_anonymous_user(self):
        action = self.client.post(self.users, {"username": "oleg", "password": "1Oleg1", "email": "oleg1@gmail.com"},
                                  format='json')
        self.assertEqual(action.status_code, status.HTTP_201_CREATED)

    def test_user_RUD_by_anonymous_user(self):
        action1 = self.client.post(self.users, {"username": "oleg", "password": "1Oleg1", "email": "oleg1@gmail.com"},
                                   format='json')
        for query in [self.client.patch, self.client.delete, self.client.get]:
            action = query(self.users_item.format(action1.json()['id']))
            self.assertEqual(action.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_creating_by_existing_groups(self):
        i = 0
        for user in [self.native_user, self.admin_user, self.manager_user]:
            self.client.force_login(user)
            action = self.client.post(self.users, {"username": "oleg{0}".format(i),
                                                   "password": "1Oleg1",
                                                   "email": "oleg{0}@gmail.com".format(i)
                                                   }, format='json')
            i += 1
            self.assertEqual(action.status_code, status.HTTP_201_CREATED)

    def test_user_RUD_by_admin_and_manager(self):
        for user in [self.admin_user, self.manager_user]:
            item = self.client.post(self.users, {"username": "oleg", "password": "1Oleg1", "email": "oleg1@gmail.com"},
                                    format='json')
            self.client.force_login(user)
            getaction = self.client.get(self.users_item.format(item.json()['id']))
            patchaction = self.client.patch(self.users_item.format(item.json()['id']),
                                            {"username": "olegio", "password": "1Oleg1"})
            deleteaction = self.client.delete(self.users_item.format(item.json()['id']))
            self.assertEqual(getaction.status_code, status.HTTP_200_OK)
            self.assertEqual(patchaction.status_code, status.HTTP_200_OK)
            self.assertEqual(deleteaction.status_code, status.HTTP_204_NO_CONTENT)

    def test_user_RUD_by_native_user(self):
        other_native_user = self.client.post(self.users,
                                             {"username": "oleg", "password": "1Oleg1", "email": "oleg1@gmail.com"},
                                             format='json')
        self.client.force_login(self.native_user)
        getaction = self.client.get(self.users_item.format(other_native_user.json()['id']))
        patchaction = self.client.patch(self.users_item.format(other_native_user.json()['id']),
                                        {"password": "dsgfdgdfg"})
        deleteaction = self.client.delete(self.users_item.format(other_native_user.json()['id']))
        self.assertEqual(getaction.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(patchaction.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(deleteaction.status_code, status.HTTP_404_NOT_FOUND)

    def test_manager_attempt_to_manage_other_managers_if_they_are_not_native_users(self):
        self.client.force_login(self.admin_user)
        other_manager_user = self.client.post(self.users,
                                              {"username": "oleg", "password": "1Oleg1", "email": "oleg1@gmail.com"},
                                              format='json')
        other_manager_user = self.client.patch(self.users_item.format(other_manager_user.json()['id']),
                                               {"groups": [Group.objects.get(name='Manager').id]})
        self.client.force_login(self.manager_user)
        getaction = self.client.get(self.users_item.format(other_manager_user.json()['id']))
        patchaction = self.client.patch(self.users_item.format(other_manager_user.json()['id']))
        deleteaction = self.client.delete(self.users_item.format(other_manager_user.json()['id']))
        self.assertEqual(getaction.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(patchaction.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(deleteaction.status_code, status.HTTP_404_NOT_FOUND)

    def test_manager_attempt_to_make_someone_admin(self):
        self.client.force_login(self.manager_user)
        other_manager_user = self.client.post(self.users,
                                              {"username": "oleg", "password": "1Oleg1", "email": "oleg1@gmail.com"},
                                              format='json')
        patchaction = self.client.patch(self.users_item.format(other_manager_user.json()['id']),
                                        {"groups": [str(Group.objects.get(name='Admin').id)]})
        self.assertEqual(patchaction.status_code, status.HTTP_403_FORBIDDEN)

