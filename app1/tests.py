from django.contrib.auth.models import User, Group
from django.utils.six import BytesIO
from app1.models import Expenses
from app1.serializers import ExpensesSerializer

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
        action = self.client.post(self.exp, {"cost": "23", "text": "fgdgdfgdfgd", "owner":self.admin_user.id})
        self.assertEqual(action.status_code, status.HTTP_201_CREATED)

    def test_native_user_expenses_permission_create(self):
        self.client.force_login(self.native_user)
        action = self.client.post(self.exp, {"cost": "23", "text": "fgdgdfgdfgd", "owner":self.native_user.id})
        self.assertEqual(action.status_code, status.HTTP_201_CREATED)

    def test_admin_native_users_expenses_permission_invalid_data_create(self):
        for i in [self.admin_user, self.native_user]:
            self.client.force_login(i)
            action = self.client.post(self.exp, {"cost": "fgdlkgdfd", "text": "sgdfgdfg"})
            self.assertEqual(action.status_code, status.HTTP_400_BAD_REQUEST)

    def test_permission_to_create_for_manager(self):
        self.client.force_login(self.admin_user)
        action = self.client.post(self.exp, {"cost":"14.11", "text":"qwe", "owner": self.manager_user.id})
        self.assertEqual(action.status_code, status.HTTP_406_NOT_ACCEPTABLE)

    def test_admin_permission_to_create_expenses_for_others(self):
        self.client.force_login(self.admin_user)
        action = self.client.post(self.exp, {"cost":"14.11", "text":"qwe", "owner": self.native_user.id})
        self.assertEqual(action.status_code, status.HTTP_201_CREATED)

    def test_attempt_to_create_expenses_for_others_by_native_user(self):
        self.client.force_login(self.native_user)
        action = self.client.post(self.exp, {"cost":"14.11", "text":"qwe", "owner": self.other_native_user.id})
        self.assertEqual(action.status_code, status.HTTP_206_PARTIAL_CONTENT)


